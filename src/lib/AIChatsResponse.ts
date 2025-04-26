import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { GeminiAI } from '../..';

const historyPath = join(process.env.HISTORY_PATH ?? './history.json');

interface ChatHistory {
  role: 'user' | 'model';
  parts: { text: string }[];
  timestamp: number;
}

function loadChatDb(): ChatHistory[] {
  try {
    if (!existsSync(historyPath)) {
      return [];
    }
    const data = readFileSync(historyPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Gagal memuat database chat:', error);
    return [];
  }
}

function saveChatDb(history: ChatHistory[]) {
  try {
    writeFileSync(historyPath, JSON.stringify(history, null, 2));
  } catch (error) {
    console.error('Gagal menyimpan database chat:', error);
  }
}

export async function AIChatsResponse(perintah: string) {
  const dbHistory = loadChatDb();
  const model = GeminiAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const geminiHistory = dbHistory.slice(-10); // 10 chats terakhir
  
  if (process.env.ROLE_SYSTEM) {
    geminiHistory.unshift({
      role: "user",
      parts: [{ text: process.env.ROLE_SYSTEM }],
      timestamp: Date.now()
    });
  }
  
  geminiHistory.push({
    role: "user",
    parts: [{ text: perintah }],
    timestamp: Date.now()
  });

  const chats = model.startChat({
    history: geminiHistory.map(item => ({
      role: item.role,
      parts: item.parts
    }))
  });

  const result = await chats.sendMessage(perintah);
  const respon = await result.response;
  const jawaban = respon.text();

  dbHistory.push({
      role: "user",
      parts: [{ text: perintah }],
      timestamp: Date.now()
    }, {
      role: "model",
      parts: [{ text: jawaban }],
      timestamp: Date.now()
  });
  
  saveChatDb(dbHistory.slice(-100)); // 100 chats terakhir
  return jawaban;
}