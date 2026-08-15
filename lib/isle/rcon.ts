import net from "node:net";

/** Opcodes oficiales de The Isle Evrima RCON (protocolo propio, no Source). */
export const RCON_OPCODES = {
  announce: 0x10,
  directmessage: 0x11,
  serverdetails: 0x12,
  wipecorpses: 0x13,
  getplayables: 0x14,
  updateplayables: 0x15,
  togglemigrations: 0x19,
  ban: 0x20,
  togglegrowthmultiplier: 0x21,
  setgrowthmultiplier: 0x22,
  togglenetupdatedistancechecks: 0x23,
  kick: 0x30,
  playerlist: 0x40,
  save: 0x50,
  pause: 0x60,
  custom: 0x70,
  getplayerdata: 0x77,
  togglewhitelist: 0x81,
  addwhitelist: 0x82,
  removewhitelist: 0x83,
  toggleglobalchat: 0x84,
  togglehumans: 0x86,
  toggleai: 0x90,
  disableaiclasses: 0x91,
  aidensity: 0x92,
  getqueuestatus: 0x93,
  toggleailearning: 0x94,
} as const;

export type RconCommand = keyof typeof RCON_OPCODES;

export interface IsleRconConfig {
  host: string;
  port: number;
  password: string;
  timeoutMs?: number;
}

export class IsleRconError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "IsleRconError";
  }
}

function envConfig(): IsleRconConfig {
  const host = process.env.ISLE_RCON_HOST?.trim();
  const port = Number(process.env.ISLE_RCON_PORT ?? "8888");
  const password = process.env.ISLE_RCON_PASSWORD ?? "";

  if (!host || !password) {
    throw new IsleRconError(
      "Falta ISLE_RCON_HOST o ISLE_RCON_PASSWORD en .env.local",
    );
  }

  return {
    host,
    port,
    password,
    timeoutMs: Number(process.env.ISLE_RCON_TIMEOUT_MS ?? "5000"),
  };
}

function readUntil(
  socket: net.Socket,
  timeoutMs: number,
  idleMs = 250,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let settled = false;

    const finish = (err?: Error) => {
      if (settled) return;
      settled = true;
      cleanup();
      if (err) reject(err);
      else resolve(Buffer.concat(chunks));
    };

    const onData = (chunk: Buffer) => {
      chunks.push(chunk);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => finish(), idleMs);
    };

    const onError = (err: Error) => finish(err);
    const onClose = () => finish();

    let idleTimer = setTimeout(() => {
      if (chunks.length) finish();
    }, idleMs);
    const hardTimer = setTimeout(() => {
      finish(
        chunks.length
          ? undefined
          : new IsleRconError("Timeout esperando respuesta RCON"),
      );
    }, timeoutMs);

    const cleanup = () => {
      clearTimeout(idleTimer);
      clearTimeout(hardTimer);
      socket.off("data", onData);
      socket.off("error", onError);
      socket.off("close", onClose);
    };

    socket.on("data", onData);
    socket.on("error", onError);
    socket.on("close", onClose);
  });
}

/**
 * Cliente TCP para RCON de Evrima.
 * Auth: 0x01 + password + 0x00
 * Cmd:  0x02 + opcode + data + 0x00
 */
export class IsleRconClient {
  private socket: net.Socket | null = null;
  private authorized = false;

  constructor(private readonly config: IsleRconConfig) {}

  static fromEnv() {
    return new IsleRconClient(envConfig());
  }

  async connect(): Promise<void> {
    if (this.socket && this.authorized) return;

    const { host, port, password, timeoutMs = 5000 } = this.config;

    await new Promise<void>((resolve, reject) => {
      const socket = net.createConnection({ host, port }, () => resolve());
      socket.setTimeout(timeoutMs);
      socket.once("error", reject);
      socket.once("timeout", () => {
        socket.destroy();
        reject(new IsleRconError(`Timeout conectando a ${host}:${port}`));
      });
      this.socket = socket;
    });

    const socket = this.socket!;
    const authPacket = Buffer.concat([
      Buffer.from([0x01]),
      Buffer.from(password, "utf8"),
      Buffer.from([0x00]),
    ]);
    socket.write(authPacket);

    // Dar tiempo al server a contestar el auth (a veces tarda >200ms).
    const authResponse = await readUntil(socket, Math.max(timeoutMs, 8000), 400);
    const authText = authResponse.toString("utf8");
    const authHex = authResponse.toString("hex");

    if (!/password accepted/i.test(authText)) {
      this.close();
      throw new IsleRconError(
        `Auth RCON fallida: text="${authText.trim() || "(vacío)"}" hex=${authHex || "(vacío)"}`,
      );
    }

    this.authorized = true;
  }

  async command(name: RconCommand, data = ""): Promise<string> {
    await this.connect();
    const socket = this.socket;
    if (!socket) throw new IsleRconError("Socket RCON cerrado");

    const opcode = RCON_OPCODES[name];
    const packet = Buffer.concat([
      Buffer.from([0x02, opcode]),
      Buffer.from(data, "utf8"),
      Buffer.from([0x00]),
    ]);

    socket.write(packet);
    const response = await readUntil(socket, this.config.timeoutMs ?? 5000);
    return response.toString("utf8").replace(/\0/g, "").trim();
  }

  async playerList(): Promise<string> {
    return this.command("playerlist");
  }

  async serverDetails(): Promise<string> {
    return this.command("serverdetails");
  }

  async playerData(): Promise<string> {
    return this.command("getplayerdata");
  }

  close() {
    this.authorized = false;
    if (this.socket) {
      this.socket.destroy();
      this.socket = null;
    }
  }
}

/** Ejecuta un comando y cierra la conexión (one-shot). */
export async function runRcon(
  name: RconCommand,
  data = "",
): Promise<string> {
  const client = IsleRconClient.fromEnv();
  try {
    return await client.command(name, data);
  } finally {
    client.close();
  }
}
