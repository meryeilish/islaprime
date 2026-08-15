"use client";

import { useEffect, useRef, useState } from "react";
import {
  ConnectionState,
  Room,
  RoomEvent,
  Track,
  type RemoteParticipant,
} from "livekit-client";

import SectionHeader from "@/app/components/ui/SectionHeader";

type VoiceStatus = "idle" | "connecting" | "connected" | "error";

interface Peer {
  identity: string;
  name: string;
  speaking: boolean;
}

export default function Voice() {
  const [nickname, setNickname] = useState("notokk");
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [error, setError] = useState("");
  const [muted, setMuted] = useState(false);
  const [deafened, setDeafened] = useState(false);
  const [peers, setPeers] = useState<Peer[]>([]);
  const [roomName, setRoomName] = useState("islaprime");

  const roomRef = useRef<Room | null>(null);

  const refreshPeers = (room: Room) => {
    const list: Peer[] = [];
    room.remoteParticipants.forEach((participant: RemoteParticipant) => {
      list.push({
        identity: participant.identity,
        name: participant.name || participant.identity,
        speaking: participant.isSpeaking,
      });
    });
    list.sort((a, b) => a.name.localeCompare(b.name));
    setPeers(list);
  };

  const disconnect = async () => {
    const room = roomRef.current;
    roomRef.current = null;
    if (room) {
      room.removeAllListeners();
      await room.disconnect();
    }
    setPeers([]);
    setStatus("idle");
    setError("");
  };

  const connect = async () => {
    setError("");
    setStatus("connecting");

    try {
      await disconnect();

      const response = await fetch("/api/voice/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identity: nickname.trim() || "guest",
          name: nickname.trim() || "guest",
        }),
      });

      const data = (await response.json()) as {
        token?: string;
        url?: string;
        room?: string;
        error?: string;
      };

      if (!response.ok || !data.token || !data.url) {
        throw new Error(data.error || "No se pudo obtener el token de voz.");
      }

      setRoomName(data.room || "islaprime");

      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
      });
      roomRef.current = room;

      room.on(RoomEvent.ParticipantConnected, () => refreshPeers(room));
      room.on(RoomEvent.ParticipantDisconnected, () => refreshPeers(room));
      room.on(RoomEvent.ActiveSpeakersChanged, () => refreshPeers(room));
      room.on(RoomEvent.ConnectionStateChanged, (state) => {
        if (state === ConnectionState.Connected) setStatus("connected");
        if (state === ConnectionState.Disconnected) {
          setStatus("idle");
          setPeers([]);
        }
      });
      room.on(RoomEvent.TrackSubscribed, (track) => {
        if (track.kind === Track.Kind.Audio) {
          const element = track.attach();
          element.dataset.lkAudio = "1";
          document.body.appendChild(element);
        }
      });
      room.on(RoomEvent.TrackUnsubscribed, (track) => {
        track.detach().forEach((element) => element.remove());
      });

      await room.connect(data.url, data.token);
      await room.localParticipant.setMicrophoneEnabled(!muted);
      refreshPeers(room);
      setStatus("connected");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al conectar.";
      setError(message);
      setStatus("error");
      await disconnect();
      setStatus("error");
      setError(message);
    }
  };

  useEffect(() => {
    return () => {
      const room = roomRef.current;
      roomRef.current = null;
      if (room) {
        room.removeAllListeners();
        void room.disconnect();
      }
      document.querySelectorAll("[data-lk-audio]").forEach((node) => node.remove());
    };
  }, []);

  useEffect(() => {
    const room = roomRef.current;
    if (!room || status !== "connected") return;
    void room.localParticipant.setMicrophoneEnabled(!muted && !deafened);
  }, [muted, deafened, status]);

  useEffect(() => {
    const volume = deafened ? 0 : 1;
    document.querySelectorAll<HTMLMediaElement>("[data-lk-audio]").forEach((el) => {
      el.volume = volume;
      el.muted = deafened;
    });
  }, [deafened, peers]);

  const statusLabel =
    status === "connected"
      ? "Conectado"
      : status === "connecting"
        ? "Conectando…"
        : status === "error"
          ? "Error"
          : "Desconectado";

  return (
    <section id="voice" className="relative scroll-mt-24 overflow-hidden bg-[#050505] py-20 sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(185,28,28,0.12),transparent_50%)]" />

      <div className="relative mx-auto max-w-[1100px] px-4 sm:px-6">
        <SectionHeader
          label="Voz"
          title={
            <>
              Radio de <span className="text-red-500">proximidad</span>
            </>
          }
          description="Habla con otros jugadores desde el navegador. Ahora mismo es sala compartida; la atenuación por distancia llegará cuando conectemos las posiciones del servidor."
        />

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b]">
          <div className="flex flex-wrap items-center gap-2 border-b border-white/10 px-4 py-3">
            <span className="rounded-md bg-red-600/20 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-red-400">
              Voz
            </span>
            <span
              className={`text-[10px] font-bold uppercase tracking-[0.18em] ${
                status === "connected"
                  ? "text-green-400"
                  : status === "connecting"
                    ? "text-amber-400"
                    : status === "error"
                      ? "text-red-400"
                      : "text-zinc-600"
              }`}
            >
              ● {statusLabel}
            </span>
            <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-zinc-600">
              Sala · {roomName}
            </span>
          </div>

          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5 border-b border-white/10 p-5 sm:p-6 lg:border-b-0 lg:border-r">
              <label className="block">
                <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
                  Nombre en voz
                </span>
                <input
                  type="text"
                  value={nickname}
                  maxLength={32}
                  disabled={status === "connected" || status === "connecting"}
                  onChange={(event) => setNickname(event.target.value)}
                  placeholder="Tu nick…"
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm font-bold text-white outline-none focus:border-red-500/50 disabled:opacity-50"
                />
                <span className="mt-1.5 block text-[11px] text-zinc-600">
                  Temporal hasta conectar Steam. Puedes usar tu nick del juego.
                </span>
              </label>

              <div className="flex flex-wrap gap-2">
                {status !== "connected" ? (
                  <button
                    type="button"
                    onClick={() => void connect()}
                    disabled={status === "connecting" || !nickname.trim()}
                    className="rounded-lg bg-red-600 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {status === "connecting" ? "Conectando…" : "Conectar micrófono"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => void disconnect()}
                    className="rounded-lg border border-white/15 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-zinc-200 transition hover:border-red-500/40 hover:text-white"
                  >
                    Desconectar
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setMuted((value) => !value)}
                  disabled={status !== "connected"}
                  className={`rounded-lg border px-4 py-2.5 text-xs font-black uppercase tracking-wider transition disabled:opacity-40 ${
                    muted
                      ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                      : "border-white/10 text-zinc-300 hover:text-white"
                  }`}
                >
                  {muted ? "Mic apagado" : "Mic activo"}
                </button>

                <button
                  type="button"
                  onClick={() => setDeafened((value) => !value)}
                  disabled={status !== "connected"}
                  className={`rounded-lg border px-4 py-2.5 text-xs font-black uppercase tracking-wider transition disabled:opacity-40 ${
                    deafened
                      ? "border-red-500/40 bg-red-500/10 text-red-300"
                      : "border-white/10 text-zinc-300 hover:text-white"
                  }`}
                >
                  {deafened ? "Ensordecido" : "Escuchar"}
                </button>
              </div>

              {error && (
                <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                  {error}
                </p>
              )}

              <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
                  Cómo usarlo
                </p>
                <ol className="mt-2 space-y-1.5 text-xs leading-relaxed text-zinc-400">
                  <li>1. Pon tu nick y pulsa conectar (el navegador pedirá el micrófono).</li>
                  <li>2. Abre la misma página en otra pestaña/PC con otro nick para probar.</li>
                  <li>3. Luego enlazaremos Steam + posiciones del Isle para proximity real.</li>
                </ol>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
                  En la radio
                </p>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                  {status === "connected" ? peers.length + 1 : 0} conectados
                </span>
              </div>

              {status !== "connected" ? (
                <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/30 px-4 text-center">
                  <p className="text-xs text-zinc-600">
                    Conéctate para ver quién está en la sala.
                  </p>
                </div>
              ) : (
                <ul className="space-y-1.5">
                  <li className="flex items-center justify-between rounded-lg border border-red-500/20 bg-red-600/10 px-3 py-2.5">
                    <span className="text-sm font-bold text-white">
                      {nickname} <span className="text-zinc-500">(tú)</span>
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-red-400">
                      {muted || deafened ? "mudo" : "live"}
                    </span>
                  </li>
                  {peers.map((peer) => (
                    <li
                      key={peer.identity}
                      className="flex items-center justify-between rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2.5"
                    >
                      <span className="text-sm font-bold text-zinc-200">{peer.name}</span>
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider ${
                          peer.speaking ? "text-green-400" : "text-zinc-600"
                        }`}
                      >
                        {peer.speaking ? "habla" : "idle"}
                      </span>
                    </li>
                  ))}
                  {peers.length === 0 && (
                    <li className="rounded-lg border border-white/5 px-3 py-6 text-center text-xs text-zinc-600">
                      Solo estás tú. Abre otra sesión para probar la voz.
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
