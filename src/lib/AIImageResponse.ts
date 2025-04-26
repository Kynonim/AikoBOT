import { GeminiAI } from "../..";
import { readFileSync } from "fs";

export async function AIResponseImageCreator(perintah: string, imageUrl: string) {
  const model = GeminiAI.getGenerativeModel({ model: "gemini-2.0-pro" });
  const imagePart = {
    inlineData: {
      data: Buffer.from(readFileSync(imageUrl)).toString("base64"),
      mimeType: "image/jpeg",
    }
  };
  const result = await model.generateContent([perintah, imagePart]);
  return result.response.text();
}