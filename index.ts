import "dotenv/config";
import { Boom } from "@hapi/boom";
import pino from "pino";
import readline from "readline";
import RaflesiaBOT, { Browsers, delay, DisconnectReason, downloadMediaMessage, getContentType, proto, useMultiFileAuthState, fetchLatestBaileysVersion, type ConnectionState, type AnyMessageContent, makeCacheableSignalKeyStore } from "@whiskeysockets/baileys";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { RaflesiaResponse } from "./src/_";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { AIChatsResponse } from "./src/lib/AIChatsResponse";
import { AIResponseImageCreator } from "./src/lib/AIImageResponse";

const pairing = process.argv.includes("--pairing");
const baca = readline.createInterface({ input: process.stdin, output: process.stdout });
const quests = (teks: string) => new Promise<string>((resolve) => baca.question(teks, resolve));
const logger = pino({ timestamp: () => `,"time":"${new Date().toJSON()}"` }, pino.destination('./src/logs.txt'));
logger.level = "trace";

const GeminiAI = new GoogleGenerativeAI(process.env.GEMINI_APIKEY ?? "");

const sessionPath = process.env.SESSION_PATH ?? "./session";
const assetsPath = process.env.ASSETS_PATH ?? "./assets";

[sessionPath, assetsPath].forEach(dir => {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
});

async function KoneksiBOT() {
  const auth = await useMultiFileAuthState(sessionPath);
  const { version } = await fetchLatestBaileysVersion();

  const koneksi = RaflesiaBOT({
    browser: Browsers.macOS("RaflesiaBOT"),
    printQRInTerminal: !pairing,
    auth: {
      creds: auth.state.creds,
      keys: makeCacheableSignalKeyStore(auth.state.keys, logger)
    },
    logger,
    version,
    generateHighQualityLinkPreview: true,
    syncFullHistory: true,
  });

  if (pairing && !koneksi.authState.creds.registered) {
    const phone = await quests("Masukkan nomor telepon Anda: ");
    const code = await koneksi.requestPairingCode(phone);
    console.log(`Kode verifikasi: ${code}`);
  }

  koneksi.ev.on("creds.update", auth.saveCreds);
  koneksi.ev.on("connection.update", (update) => handleConnectionUpdate(update, koneksi));
  koneksi.ev.on("messages.upsert", (event) => handleMessages(event, koneksi));

  return koneksi;
}
function handleConnectionUpdate(update: Partial<ConnectionState>, koneksi: any) {
  if (update.connection === "close") {
    const reconnect = (update.lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
    console.log(`Server mengalami masalah di : \n${update.lastDisconnect?.error}\nMemulai ulang koneksi... ${reconnect}`);
    if (reconnect) KoneksiBOT();
  } else if (update.connection === "open") {
    console.log("Tersambung ke ", koneksi.user?.id);
  }
}

async function handleMessages(event: any, koneksi: any) {
  for (const chats of event.messages) {
    try {
      const tanya = getContentType(chats.message ?? undefined);
      const pengirim: string = chats.key.remoteJid ?? "";
      const jawab = extractMessageContent(chats.message, tanya ?? "");

      console.log(`(${pengirim}) > ${jawab}`);

      if (!chats.key.fromMe) {
        await handleUserMessage(koneksi, chats, pengirim, tanya ?? "", jawab);
      } else {
        await handleBotCommand(koneksi, chats, pengirim, jawab);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  }
}

function extractMessageContent(message: any, tanya: string): string {
  switch (tanya) {
    case "conversation": return message?.conversation ?? "";
    case "extendedTextMessage": return message?.extendedTextMessage?.text ?? "";
    case "imageMessage": return message?.imageMessage?.caption ?? "";
    case "videoMessage": return message?.videoMessage?.caption ?? "";
    default: return "";
  }
}

async function handleUserMessage(koneksi: any, chats: any, pengirim: string, tanya: string, jawab: string) {
  if (jawab?.includes("?") || chats.key.remoteJid === process.env.ADMIN_NUMBER) {
    const jawaban = await AIChatsResponse(jawab);
    await ketikPesan(pengirim, { text: jawaban }, chats, koneksi);
  }

  const pesan = await RaflesiaResponse(jawab ?? undefined);
  if (pesan.status) {
    await handleRaflesiaResponse(koneksi, pengirim, chats, pesan);
  }

  if (tanya === "imageMessage") {
    await handleImageMessage(koneksi, chats, pengirim, jawab);
  }
}

async function handleRaflesiaResponse(koneksi: any, pengirim: string, chats: any, pesan: any) {
  if (pesan.type === "image") {
    await ketikPesan(pengirim, { image: { url: pesan.data } }, chats, koneksi);
  } else if (pesan.type === "text") {
    await ketikPesan(pengirim, { text: pesan.data }, chats, koneksi);
  }
}

async function handleBotCommand(koneksi: any, chats: any, pengirim: string, jawab: string) {
  if (jawab?.startsWith(".riky")) {
    const ketikan = jawab.replace(".riky", "");
    const jawaban = await AIResponse(ketikan);
    await ketikPesan(pengirim, { text: jawaban }, chats, koneksi);
  } else if (jawab?.startsWith(".tanya")) {
    const ketikan = jawab.replace(".tanya", "");
    const imageUrl = chats.message?.imageMessage?.url;
    const jawaban = await AIResponseImageCreator(ketikan, imageUrl ?? "");
    await ketikPesan(pengirim, { text: jawaban }, chats, koneksi);
  }
}

async function handleImageMessage(koneksi: any, chats: any, pengirim: string, jawab: string) {
  const imagePath = join(assetsPath, "image.jpg");
  const stream = await downloadMediaMessage(
    chats,
    "stream",
    {},
    {
      logger: pino({ level: "silent" }),
      reuploadRequest: koneksi.updateMediaMessage,
    }
  );

  const tulis = createWriteStream(imagePath);
  stream.pipe(tulis);

  await new Promise<void>((resolve) => tulis.on("finish", resolve));  
  const jawaban = await AIResponseImageCreator(jawab || "Apa isi gambar ini?", imagePath);
  await ketikPesan(pengirim, { text: jawaban }, chats, koneksi);
}

async function AIResponse(perintah: string): Promise<string> {
  const model = GeminiAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContentStream([perintah]);
  let text = "";
  for await (const chunk of result.stream) {
    text += chunk.text();
  }
  return text;
}

const ketikPesan = async (jid: string, pesan: AnyMessageContent, chats: proto.IWebMessageInfo, koneksi: any) => {
  await koneksi.presenceSubscribe(jid);
  await delay(500);
  await koneksi.sendPresenceUpdate('composing', jid);
  await delay(1000);
  await koneksi.sendPresenceUpdate('paused', jid);
  await koneksi.sendMessage(jid, pesan, { quoted: chats });
}

KoneksiBOT().catch(console.error);

export { GeminiAI }