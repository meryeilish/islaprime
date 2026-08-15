"use client";

import { Suspense, useEffect, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import {
  Center,
  ContactShadows,
  Environment,
  Html,
  OrbitControls,
  Stars,
  useAnimations,
  useGLTF,
  useProgress,
} from "@react-three/drei";
import {
  ACESFilmicToneMapping,
  BackSide,
  Box3,
  CanvasTexture,
  Color,
  DataTexture,
  Euler,
  Mesh,
  MeshStandardMaterial,
  NoColorSpace,
  PMREMGenerator,
  Quaternion,
  RGBAFormat,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  Vector3,
  type Group,
  type Object3D,
  type Texture,
  type WebGLProgramParametersWithUniforms,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { clone as cloneSkinned } from "three/examples/jsm/utils/SkeletonUtils.js";

import type { SkinColors } from "@/app/components/skin/skinTypes";
import type { SkinUtilInfo, UtilChannel } from "@/app/components/skin/skinModels";
import {
  BACKGROUND_THEMES,
  type SkinBackgroundId,
  type SkyKind,
} from "@/app/components/skin/skinBackgrounds";

export type { SkinBackgroundId } from "@/app/components/skin/skinBackgrounds";

const TINT_VERSION = 4;
/** Roughness por defecto estilo studio (piel, no plástico mate). */
export const DEFAULT_SKIN_ROUGHNESS = 0.28;

interface TintUniforms {
  cBody: { value: Color };
  cMarkings: { value: Color };
  cFlank: { value: Color };
  cUnderbelly: { value: Color };
  cDetail: { value: Color };
  cDisplay: { value: Color };
  uFemale: { value: number };
  uTintMask: { value: Texture };
  uTintAmount: { value: number };
  cTeeth: { value: Color };
  cMouth: { value: Color };
  cClaws: { value: Color };
  uUtilMask: { value: Texture };
  uTeethChan: { value: Vector3 };
  uMouthChan: { value: Vector3 };
  uClawsChan: { value: Vector3 };
}

/** Textura negra 1x1: deja inerte el tinte de dientes/boca/garras cuando no hay máscara. */
const blackUtilTexture = new DataTexture(
  new Uint8Array([0, 0, 0, 255]),
  1,
  1,
  RGBAFormat,
);
blackUtilTexture.needsUpdate = true;

function channelVector(channel: UtilChannel): Vector3 {
  if (channel === "r") return new Vector3(1, 0, 0);
  if (channel === "g") return new Vector3(0, 1, 0);
  if (channel === "b") return new Vector3(0, 0, 1);
  return new Vector3(0, 0, 0);
}

/**
 * Shader de regiones (mismo esquema que usa el juego): la máscara codifica
 * cada región con un color RGB puro y el shader pinta cada una con su color,
 * usando la textura difusa solo como sombreado (luminancia).
 *   cian → cuerpo · magenta → marcas · azul → flanco · verde → vientre
 *   amarillo → detalle · rojo → marcaje de macho (en hembras se pinta como cuerpo)
 */
const FRAGMENT_HEAD =
  "uniform vec3 cBody,cMarkings,cFlank,cUnderbelly,cDetail,cDisplay;\n" +
  "uniform sampler2D uTintMask;\nuniform float uTintAmount;\nuniform float uFemale;\n" +
  "uniform vec3 cTeeth,cMouth,cClaws;\nuniform sampler2D uUtilMask;\n" +
  "uniform vec3 uTeethChan,uMouthChan,uClawsChan;\n";

const FRAGMENT_MAP = `#ifdef USE_MAP
  vec4 sampledDiffuseColor = texture2D(map, vMapUv);
  vec3 mskRGB = texture2D(uTintMask, vMapUv).rgb;
  float r = mskRGB.r, g = mskRGB.g, b = mskRGB.b;
  float wC = (1.-r)*g*b, wM = r*(1.-g)*b, wB = (1.-r)*(1.-g)*b;
  float wG = (1.-r)*g*(1.-b), wY = r*g*(1.-b), wR = r*(1.-g)*(1.-b);
  float wK = (1.-r)*(1.-g)*(1.-b);
  float wRf = wR * uFemale; wC += wRf; wR -= wRf;
  float wSum = max(wC+wM+wB+wG+wY+wR+wK, 0.0001);
  vec3 region = (cBody*wC + cMarkings*wM + cFlank*wB + cUnderbelly*wG + cDetail*wY + cDisplay*wR + cBody*wK) / wSum;
  float lum = dot(sampledDiffuseColor.rgb, vec3(0.299,0.587,0.114));
  vec3 shaded = region * (0.95 + 0.55 * lum);
  vec3 util = texture2D(uUtilMask, vMapUv).rgb;
  float wTe = clamp(dot(util, uTeethChan), 0.0, 1.0);
  float wMo = clamp(dot(util, uMouthChan), 0.0, 1.0);
  float wCl = clamp(dot(util, uClawsChan), 0.0, 1.0);
  shaded = mix(shaded, cTeeth * (0.95 + 0.55 * lum), wTe);
  shaded = mix(shaded, cMouth * (0.95 + 0.55 * lum), wMo);
  shaded = mix(shaded, cClaws * (0.95 + 0.55 * lum), wCl);
  sampledDiffuseColor.rgb = mix(sampledDiffuseColor.rgb, shaded, uTintAmount);
  diffuseColor *= sampledDiffuseColor;
#endif`;

/** Ilumina los materiales PBR con un entorno generado localmente (sin HDR externos). */
function SceneEnvironment({ enabled }: { enabled: boolean }) {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    if (!enabled) {
      scene.environment = null;
      return;
    }
    const pmrem = new PMREMGenerator(gl);
    const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envMap;
    return () => {
      scene.environment = null;
      envMap.dispose();
      pmrem.dispose();
    };
  }, [gl, scene, enabled]);

  return null;
}

function setupMaterials(scene: Group) {
  const tintUniforms: TintUniforms[] = [];
  const eyeMaterials: MeshStandardMaterial[] = [];
  const bodyMaterials: MeshStandardMaterial[] = [];

  scene.traverse((obj) => {
    const mesh = obj as Mesh;
    if (!mesh.isMesh) return;

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const raw of materials) {
      const material = raw as MeshStandardMaterial;

      if (material.name.toLowerCase().includes("eye")) {
        eyeMaterials.push(material);
        continue;
      }

      if (material.userData.skinTintVersion !== TINT_VERSION) {
        material.userData.skinTintVersion = TINT_VERSION;
        // Piel: sin metal. El canal B del mapa Exp del juego viene “metálico”
        // y hay que anularlo; el G sí es roughness usable, pero el slider del
        // studio controla un valor absoluto como en Islander.
        material.metalness = 0;
        material.metalnessMap = null;
        material.roughness = DEFAULT_SKIN_ROUGHNESS;
        material.roughnessMap = null;
        material.envMapIntensity = 0.72;
        if (material.normalMap) {
          material.normalScale = new Vector2(1, 1);
        }

        const uniforms: TintUniforms = {
          cBody: { value: new Color("#7a5238") },
          cMarkings: { value: new Color("#4a2e20") },
          cFlank: { value: new Color("#8a6242") },
          cUnderbelly: { value: new Color("#c9ab84") },
          cDetail: { value: new Color("#5c3f2e") },
          cDisplay: { value: new Color("#33231a") },
          uFemale: { value: 0 },
          uTintMask: { value: blackUtilTexture },
          uTintAmount: { value: 1 },
          cTeeth: { value: new Color("#efe6d4") },
          cMouth: { value: new Color("#6b3030") },
          cClaws: { value: new Color("#2a1a12") },
          uUtilMask: { value: blackUtilTexture },
          uTeethChan: { value: new Vector3() },
          uMouthChan: { value: new Vector3() },
          uClawsChan: { value: new Vector3() },
        };
        material.userData.skinUniforms = uniforms;

        material.onBeforeCompile = (shader: WebGLProgramParametersWithUniforms) => {
          Object.assign(shader.uniforms, material.userData.skinUniforms);
          shader.fragmentShader =
            FRAGMENT_HEAD +
            shader.fragmentShader.replace("#include <map_fragment>", FRAGMENT_MAP);
        };
        material.customProgramCacheKey = () => `islaprime-skin-tint-v${TINT_VERSION}`;
        material.needsUpdate = true;
      }

      bodyMaterials.push(material);
      tintUniforms.push(material.userData.skinUniforms as TintUniforms);
    }
  });

  return { tintUniforms, eyeMaterials, bodyMaterials };
}

const TARGET_SIZE = 3.5;

/** PNG 1×1 negro: mantiene fijo el nº de texturas del useLoader entre especies. */
const BLACK_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

interface ModelProps {
  url: string;
  maskUrl: string;
  utilUrl: string | null;
  util: SkinUtilInfo | null;
  colors: SkinColors;
  female: boolean;
  roughness?: number;
  /** Reproduce idle (clips del GLB si existen; si no, idle procedural). */
  animate?: boolean;
}

interface IdleDriver {
  bone: Object3D;
  rest: Quaternion;
  ampX: number;
  ampY: number;
  ampZ: number;
  speed: number;
  phase: number;
}

function buildIdleDrivers(root: Object3D): IdleDriver[] {
  const drivers: IdleDriver[] = [];
  const rules: { match: RegExp; ampX: number; ampY: number; ampZ: number; speed: number }[] = [
    { match: /^bip_spine_0$/i, ampX: 0.025, ampY: 0.01, ampZ: 0.02, speed: 1.05 },
    { match: /^bip_spine_1$/i, ampX: 0.035, ampY: 0.012, ampZ: 0.028, speed: 1.1 },
    { match: /^bip_neck_0$/i, ampX: 0.04, ampY: 0.03, ampZ: 0.02, speed: 0.95 },
    { match: /^bip_neck_1$/i, ampX: 0.05, ampY: 0.035, ampZ: 0.025, speed: 1.0 },
    { match: /^bip_neck_2$/i, ampX: 0.045, ampY: 0.04, ampZ: 0.03, speed: 1.05 },
    { match: /^bip_head$/i, ampX: 0.03, ampY: 0.05, ampZ: 0.02, speed: 0.85 },
    { match: /^bip_jaw$/i, ampX: 0.02, ampY: 0, ampZ: 0, speed: 0.7 },
    { match: /^bip_tail_0$/i, ampX: 0.02, ampY: 0.04, ampZ: 0.015, speed: 0.9 },
    { match: /^bip_tail_1$/i, ampX: 0.025, ampY: 0.055, ampZ: 0.02, speed: 0.95 },
    { match: /^bip_tail_2$/i, ampX: 0.03, ampY: 0.07, ampZ: 0.025, speed: 1.0 },
    { match: /^bip_tail_3$/i, ampX: 0.035, ampY: 0.08, ampZ: 0.03, speed: 1.05 },
    { match: /^bip_tail_4$/i, ampX: 0.04, ampY: 0.09, ampZ: 0.035, speed: 1.1 },
    { match: /^bip_tail_5$/i, ampX: 0.045, ampY: 0.1, ampZ: 0.04, speed: 1.15 },
    { match: /^bip_pelvis$/i, ampX: 0.012, ampY: 0.008, ampZ: 0.01, speed: 0.8 },
  ];

  root.traverse((obj) => {
    const rule = rules.find((entry) => entry.match.test(obj.name));
    if (!rule) return;
    drivers.push({
      bone: obj,
      rest: obj.quaternion.clone(),
      ampX: rule.ampX,
      ampY: rule.ampY,
      ampZ: rule.ampZ,
      speed: rule.speed,
      phase: Math.random() * Math.PI * 2,
    });
  });

  return drivers;
}

function Model({
  url,
  maskUrl,
  utilUrl,
  util,
  colors,
  female,
  roughness = DEFAULT_SKIN_ROUGHNESS,
  animate = false,
}: ModelProps) {
  const { scene: source, animations } = useGLTF(url);
  const scene = useMemo(
    () => cloneSkinned(source) as unknown as Group,
    [source],
  );
  const hasUtil = Boolean(utilUrl && util);
  const [maskTexture, utilLoaded] = useLoader(TextureLoader, [
    maskUrl,
    utilUrl ?? BLACK_PIXEL,
  ]);
  const utilTexture = hasUtil ? utilLoaded : null;
  const scratchEuler = useMemo(() => new Euler(), []);
  const scratchQuat = useMemo(() => new Quaternion(), []);
  const idleDrivers = useMemo(
    () => (animate ? buildIdleDrivers(scene) : []),
    [scene, animate],
  );
  const { actions, names } = useAnimations(animations, scene);
  const clipPlaying = names.length > 0;

  useMemo(() => {
    maskTexture.colorSpace = SRGBColorSpace;
    maskTexture.flipY = false;
    maskTexture.needsUpdate = true;
    if (utilTexture) {
      utilTexture.colorSpace = NoColorSpace;
      utilTexture.flipY = false;
      utilTexture.needsUpdate = true;
    }
  }, [maskTexture, utilTexture]);

  const { tintUniforms, eyeMaterials, bodyMaterials } = useMemo(
    () => setupMaterials(scene),
    [scene],
  );

  // Normaliza el tamaño: los GLB pueden venir en escalas muy distintas.
  const scale = useMemo(() => {
    scene.scale.setScalar(1);
    scene.updateMatrixWorld(true);
    const box = new Box3().setFromObject(scene);
    const size = box.getSize(new Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    return TARGET_SIZE / maxDim;
  }, [scene]);

  useEffect(() => {
    if (!clipPlaying) return;
    const preferred =
      actions.idle ||
      actions.Idle ||
      actions[names.find((name) => /idle|breath|stand/i.test(name)) ?? ""] ||
      actions[names[0]];
    if (!preferred) return;
    if (animate) {
      preferred.reset().fadeIn(0.35).play();
    } else {
      preferred.fadeOut(0.25);
    }
    return () => {
      preferred.fadeOut(0.15);
    };
  }, [actions, names, animate, clipPlaying]);

  useEffect(() => {
    for (const material of bodyMaterials) {
      material.roughness = roughness;
      material.metalness = 0;
      material.envMapIntensity = 0.72;
    }
  }, [bodyMaterials, roughness]);

  useEffect(() => {
    for (const u of tintUniforms) {
      u.cBody.value.set(colors.medio);
      u.cMarkings.value.set(colors.alto);
      u.cFlank.value.set(colors.bajo);
      u.cUnderbelly.value.set(colors.vientre);
      u.cDetail.value.set(colors.medio2);
      u.cDisplay.value.set(colors.marcaje);
      u.uFemale.value = female ? 1 : 0;
      u.uTintMask.value = maskTexture;
      u.cTeeth.value.set(colors.dientes);
      u.cMouth.value.set(colors.boca);
      u.cClaws.value.set(colors.garras);
      u.uUtilMask.value = utilTexture ?? blackUtilTexture;
      u.uTeethChan.value.copy(channelVector(util?.teeth ?? null));
      u.uMouthChan.value.copy(channelVector(util?.mouth ?? null));
      u.uClawsChan.value.copy(channelVector(util?.claws ?? null));
    }
    for (const material of eyeMaterials) {
      material.color.set(colors.ojos);
      material.emissive.set(colors.ojos);
      material.emissiveIntensity = 0.35;
      material.metalness = 0;
      material.roughness = 0.18;
    }
  }, [colors, female, maskTexture, utilTexture, util, tintUniforms, eyeMaterials]);

  useFrame(({ clock }) => {
    if (!animate || clipPlaying || idleDrivers.length === 0) return;
    const t = clock.elapsedTime;
    for (const driver of idleDrivers) {
      scratchEuler.set(
        Math.sin(t * driver.speed + driver.phase) * driver.ampX,
        Math.sin(t * driver.speed * 0.85 + driver.phase + 1.1) * driver.ampY,
        Math.cos(t * driver.speed * 0.7 + driver.phase + 0.4) * driver.ampZ,
        "XYZ",
      );
      scratchQuat.setFromEuler(scratchEuler);
      driver.bone.quaternion.copy(driver.rest).multiply(scratchQuat);
    }
  });

  return (
    <Center>
      <primitive object={scene} scale={scale} />
    </Center>
  );
}

function Loader() {
  const { progress } = useProgress();
  const pct = Number.isFinite(progress) ? Math.min(100, Math.round(progress)) : 0;

  return (
    <Html center>
      <div className="flex w-[180px] flex-col items-center gap-3 rounded-2xl border border-red-500/25 bg-[#06080d]/85 px-5 py-4 shadow-[0_0_40px_rgba(185,28,28,0.15)] backdrop-blur-md">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
        <p className="text-xs font-black uppercase tracking-[0.28em] text-zinc-200">
          Cargando
        </p>
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-red-600 transition-[width] duration-300"
            style={{ width: `${Math.max(pct, 4)}%` }}
          />
        </div>
      </div>
    </Html>
  );
}

function GridFloor({ major, minor }: { major: string; minor: string }) {
  return (
    <group position={[0, -1.75, 0]}>
      <gridHelper args={[40, 80, major, minor]} />
      <gridHelper args={[40, 20, major, "#0a1424"]} position={[0, 0.001, 0]} />
    </group>
  );
}

/** Halo azul suave detrás del dino — atmósfera Isla Prime */
function PrimeAtmosphere() {
  return (
    <group>
      <mesh position={[0, 1.2, -8]} scale={[22, 14, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#1e3a5a" transparent opacity={0.22} depthWrite={false} />
      </mesh>
      <pointLight position={[0, 3, -2]} intensity={0.55} color="#2a5080" distance={22} />
      <pointLight position={[0, 2.5, 1]} intensity={0.35} color="#dc2626" distance={14} />
    </group>
  );
}

function GroundDisc({ color }: { color: string }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.76, 0]} receiveShadow>
      <circleGeometry args={[14, 64]} />
      <meshStandardMaterial color={color} roughness={0.95} metalness={0} />
    </mesh>
  );
}

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ];
}

function paintSky(kind: SkyKind): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const stops: Record<SkyKind, [number, string][]> = {
    galaxy: [
      [0, "#000006"],
      [0.25, "#080418"],
      [0.45, "#14082e"],
      [0.55, "#2a1058"],
      [0.7, "#100820"],
      [1, "#000004"],
    ],
    nebula: [
      [0, "#1a0418"],
      [0.3, "#4a0a30"],
      [0.55, "#8a1848"],
      [0.78, "#2a0830"],
      [1, "#0a0412"],
    ],
    aurora: [
      [0, "#041820"],
      [0.28, "#0a3040"],
      [0.5, "#146858"],
      [0.7, "#208868"],
      [1, "#02080f"],
    ],
    sunset: [
      [0, "#1a2848"],
      [0.35, "#4a3868"],
      [0.55, "#c85838"],
      [0.72, "#f0a050"],
      [1, "#2a1410"],
    ],
    dawn: [
      [0, "#4a78b0"],
      [0.35, "#90b8d8"],
      [0.55, "#f0c8a0"],
      [0.75, "#e8a878"],
      [1, "#182430"],
    ],
    night: [
      [0, "#02040c"],
      [0.4, "#0a1428"],
      [0.65, "#142848"],
      [1, "#05070c"],
    ],
    forest: [
      [0, "#4a6848"],
      [0.35, "#6a8858"],
      [0.6, "#304828"],
      [1, "#101a12"],
    ],
  };

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  for (const [offset, color] of stops[kind]) gradient.addColorStop(offset, color);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const blotches: Record<SkyKind, Array<[number, number, number, string, number]>> = {
    galaxy: [
      [0.2, 0.42, 260, "#6b4dff", 0.28],
      [0.5, 0.5, 320, "#c44dff", 0.22],
      [0.78, 0.45, 240, "#3a7dff", 0.2],
      [0.4, 0.55, 180, "#ff4d9a", 0.14],
      [0.62, 0.38, 160, "#8a6bff", 0.16],
    ],
    nebula: [
      [0.3, 0.4, 200, "#ff4d8a", 0.2],
      [0.68, 0.35, 180, "#ff8a4d", 0.14],
      [0.5, 0.6, 150, "#a33dff", 0.12],
    ],
    aurora: [
      [0.2, 0.35, 140, "#3dffb0", 0.22],
      [0.45, 0.3, 160, "#4d9dff", 0.16],
      [0.7, 0.4, 150, "#7dff6a", 0.14],
    ],
    sunset: [
      [0.35, 0.55, 220, "#ff8040", 0.16],
      [0.65, 0.6, 180, "#ffd080", 0.12],
    ],
    dawn: [
      [0.4, 0.5, 200, "#ffe0b0", 0.14],
      [0.7, 0.55, 160, "#ffb090", 0.1],
    ],
    night: [
      [0.3, 0.35, 120, "#3a5a9a", 0.1],
      [0.7, 0.4, 140, "#2a4080", 0.08],
    ],
    forest: [
      [0.25, 0.55, 180, "#2a4828", 0.18],
      [0.7, 0.6, 200, "#1a3018", 0.16],
    ],
  };

  for (const [x, y, radius, color, alpha] of blotches[kind]) {
    const g = ctx.createRadialGradient(
      x * canvas.width,
      y * canvas.height,
      0,
      x * canvas.width,
      y * canvas.height,
      radius,
    );
    const [r, gch, b] = hexToRgb(color);
    g.addColorStop(0, `rgba(${r},${gch},${b},${alpha})`);
    g.addColorStop(1, `rgba(${r},${gch},${b},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Banda galáctica diagonal + estrellas pintadas (solo galaxia).
  if (kind === "galaxy") {
    ctx.save();
    ctx.translate(canvas.width * 0.5, canvas.height * 0.5);
    ctx.rotate(-0.35);
    const band = ctx.createLinearGradient(0, -70, 0, 70);
    band.addColorStop(0, "rgba(120,90,255,0)");
    band.addColorStop(0.35, "rgba(180,140,255,0.22)");
    band.addColorStop(0.5, "rgba(255,220,255,0.35)");
    band.addColorStop(0.65, "rgba(140,100,255,0.2)");
    band.addColorStop(1, "rgba(80,40,180,0)");
    ctx.fillStyle = band;
    ctx.fillRect(-canvas.width, -80, canvas.width * 2, 160);
    ctx.restore();

    for (let i = 0; i < 900; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() < 0.9 ? Math.random() * 1.4 : Math.random() * 2.4;
      const alpha = 0.35 + Math.random() * 0.65;
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fillRect(x, y, size, size);
    }
  }

  if (kind === "forest") {
    ctx.fillStyle = "rgba(10,20,10,0.55)";
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.72);
    for (let x = 0; x <= canvas.width; x += 40) {
      const h = 40 + ((x * 13) % 70);
      ctx.lineTo(x, canvas.height * 0.72 - h);
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.fill();
  }

  return canvas;
}

function ProceduralSky({ kind }: { kind: SkyKind }) {
  const texture = useMemo(() => {
    const map = new CanvasTexture(paintSky(kind));
    map.colorSpace = SRGBColorSpace;
    map.needsUpdate = true;
    return map;
  }, [kind]);

  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[40, 48, 32]} />
      <meshBasicMaterial map={texture} side={BackSide} depthWrite={false} />
    </mesh>
  );
}

const NEBULA_PALETTES = {
  violet: [
    { color: "#6b5cff", position: [-10, 3, -14] as const, scale: 12 },
    { color: "#c44dff", position: [12, 1, -16] as const, scale: 14 },
    { color: "#3a7dff", position: [1, 8, -20] as const, scale: 16 },
    { color: "#ff4d9a", position: [-5, -3, -18] as const, scale: 10 },
    { color: "#a78bff", position: [6, 5, -12] as const, scale: 9 },
  ],
  crimson: [
    { color: "#ff3d6e", position: [-7, 3, -12] as const, scale: 10 },
    { color: "#ff8a3d", position: [9, 1, -15] as const, scale: 9 },
    { color: "#a33dff", position: [1, 6, -17] as const, scale: 12 },
    { color: "#ff4db8", position: [-3, -1, -14] as const, scale: 7 },
  ],
  aurora: [
    { color: "#3dffb0", position: [-8, 5, -12] as const, scale: 10 },
    { color: "#4d9dff", position: [8, 3, -14] as const, scale: 11 },
    { color: "#7dff6a", position: [0, 7, -16] as const, scale: 9 },
    { color: "#c4ff6a", position: [4, 1, -13] as const, scale: 8 },
  ],
} as const;

function NebulaClouds({ tone }: { tone: keyof typeof NEBULA_PALETTES }) {
  return (
    <group>
      {NEBULA_PALETTES[tone].map((cloud, index) => (
        <mesh key={index} position={[...cloud.position]}>
          <sphereGeometry args={[cloud.scale, 32, 32]} />
          <meshBasicMaterial
            color={cloud.color}
            transparent
            opacity={tone === "violet" ? 0.14 : 0.1}
            depthWrite={false}
          />
        </mesh>
      ))}
      {tone === "violet" && (
        <>
          <pointLight position={[-4, 3, -6]} intensity={1.8} color="#7a6bff" distance={22} />
          <pointLight position={[5, 2, -8]} intensity={1.3} color="#c44dff" distance={20} />
        </>
      )}
      {tone === "crimson" && (
        <pointLight position={[3, 2, -5]} intensity={1.6} color="#ff5a8a" distance={18} />
      )}
      {tone === "aurora" && (
        <>
          <pointLight position={[-3, 4, -5]} intensity={1.2} color="#5dffc4" distance={16} />
          <pointLight position={[4, 2, -6]} intensity={1.1} color="#5aa8ff" distance={16} />
        </>
      )}
    </group>
  );
}

function LocalHdrSky({
  file,
  intensity,
  fallbackSky,
}: {
  file: string;
  intensity: number;
  fallbackSky?: SkyKind;
}) {
  return (
    <Suspense fallback={fallbackSky ? <ProceduralSky kind={fallbackSky} /> : null}>
      <Environment
        files={file}
        background
        environmentIntensity={intensity}
        backgroundIntensity={1}
      />
    </Suspense>
  );
}

function SceneBackdrop({ background }: { background: SkinBackgroundId }) {
  const theme = BACKGROUND_THEMES[background];
  const usingHdr = Boolean(theme.hdrFile);
  const isStudioGrid = background === "grid";

  return (
    <>
      <color attach="background" args={[theme.clear]} />
      {theme.fog ? (
        <fog attach="fog" args={[theme.fog, theme.fogNear, theme.fogFar]} />
      ) : null}
      <ambientLight intensity={theme.ambient} />
      <directionalLight position={[5, 8, 5]} intensity={theme.key} />
      <directionalLight position={[-5, 3, -5]} intensity={theme.fill} />
      {isStudioGrid && (
        <>
          <directionalLight position={[-3, 4, -6]} intensity={0.35} color="#6a8cbc" />
          <directionalLight position={[2, 2, 6]} intensity={0.25} color="#e8c8c0" />
          <pointLight position={[0, 5, 0]} intensity={0.55} color="#dc2626" distance={20} />
          <pointLight position={[-4, 2, 3]} intensity={0.45} color="#1e3a5a" distance={18} />
          <pointLight position={[4, 1.5, -2]} intensity={0.3} color="#243d5c" distance={14} />
          <PrimeAtmosphere />
        </>
      )}
      {theme.hemiSky && theme.hemiGround && (
        <hemisphereLight
          args={[theme.hemiSky, theme.hemiGround, isStudioGrid ? 0.7 : 0.45]}
          position={[0, 8, 0]}
        />
      )}
      {theme.hdrFile ? (
        <LocalHdrSky
          file={theme.hdrFile}
          intensity={theme.hdrIntensity ?? 0.9}
          fallbackSky={theme.sky}
        />
      ) : (
        theme.sky && <ProceduralSky kind={theme.sky} />
      )}
      {theme.grid && <GridFloor major={theme.grid.major} minor={theme.grid.minor} />}
      {theme.ground && <GroundDisc color={theme.ground} />}
      {theme.stars && !usingHdr && (
        <Stars
          radius={90}
          depth={60}
          count={theme.starCount ?? 2800}
          factor={background === "galaxy" ? 4.4 : 3}
          saturation={0.8}
          fade
          speed={0.25}
        />
      )}
      {theme.nebula && <NebulaClouds tone={theme.nebula} />}
    </>
  );
}

function ModelTurntable({
  enabled,
  children,
}: {
  enabled: boolean;
  children: ReactNode;
}) {
  const ref = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!enabled || !ref.current) return;
    ref.current.rotation.y += delta * 0.45;
  });

  return <group ref={ref}>{children}</group>;
}

export interface SkinModelViewerProps extends ModelProps {
  autoRotate?: boolean;
  background?: SkinBackgroundId;
}

export default function SkinModelViewer({
  autoRotate = false,
  background = "grid",
  roughness = DEFAULT_SKIN_ROUGHNESS,
  animate = false,
  ...modelProps
}: SkinModelViewerProps) {
  const theme = BACKGROUND_THEMES[background];

  useEffect(() => {
    if (modelProps.url) useGLTF.preload(modelProps.url);
  }, [modelProps.url]);

  return (
    <Canvas
      camera={{ position: [3.2, 1.35, 4.2], fov: 42 }}
      dpr={[1, 2]}
      className="touch-none"
      style={{ background: "#0a1528" }}
      gl={{
        antialias: true,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.12,
        alpha: false,
      }}
    >
      <SceneEnvironment enabled={theme.roomEnv !== false} />
      <SceneBackdrop background={background} />
      <Suspense fallback={<Loader />}>
        <ModelTurntable enabled={autoRotate}>
          <Model key={modelProps.url} {...modelProps} roughness={roughness} animate={animate} />
        </ModelTurntable>
      </Suspense>
      <ContactShadows
        position={[0, -1.74, 0]}
        opacity={background === "grid" ? 0.55 : 0.4}
        scale={14}
        blur={2.4}
        far={5}
        color="#000000"
      />
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={2}
        maxDistance={10}
        target={[0, 0.15, 0]}
      />
    </Canvas>
  );
}
