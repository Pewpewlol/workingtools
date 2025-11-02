import fs from "fs/promises";
import OpenAI from "openai";

export class ChatGPTService {
  private client: OpenAI;

  constructor() {
    if (!process.env["OPENAI_API_KEY"]) {
      throw new Error("❌ Bitte Umgebungsvariable OPENAI_API_KEY setzen");
    }
    this.client = new OpenAI({
      apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
      logLevel: "info",
    });
  }

  async callGPT5NanoModel(instructions: string, text: string): Promise<string> {
    const startTime = Date.now();

    console.log("🔄 OpenAI API-Aufruf gestartet...");

    const response = await this.client.responses.create({
      model: "gpt-5-nano",
      instructions: `${instructions}`,
      input: `${text}`,
    });

    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`⏱️ OpenAI API-Aufruf abgeschlossen in ${duration} ms`);

    return response.output_text;
  }

  // TODO : Überarbeiten und um einen Batch Prozess Mechanismuss zu erweitern
  async batchCallGPT5NanoModel(
    instructions: string,
    text: string
  ): Promise<string> {
    const client = new OpenAI({
      apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
      logLevel: "info",
    });
    console.log("🔄 OpenAI API-Aufruf gestartet...");

    const response = await client.responses.create({
      model: "gpt-5-nano",
      instructions: `${instructions}`,
      input: `${text}`,
    });

    return response.output_text;
  }
}
