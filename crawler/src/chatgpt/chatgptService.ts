import fs from "fs/promises";
import OpenAI from "openai";

export async function callGPT5NanoModel(
  instructions: string,
  text: string
): Promise<string> {
  const startTime = Date.now();

  const client = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
    logLevel: "info",
  });
  console.log('🔄 OpenAI API-Aufruf gestartet...');

  const response = await client.responses.create({
    model: "gpt-5-nano",
    instructions: `${instructions}`,
    input: `${text}`,
  });


  const endTime = Date.now();
  const duration = endTime - startTime;
  console.log(`⏱️ OpenAI API-Aufruf abgeschlossen in ${duration} ms`);

  return response.output_text;
}

export async function batchCallGPT5NanoModel(
  instructions: string,
  text: string
): Promise<string> {

  const client = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
    logLevel: "info",
  });
  console.log('🔄 OpenAI API-Aufruf gestartet...');

  const response = await client.responses.create({
    model: "gpt-5-nano",
    instructions: `${instructions}`,
    input: `${text}`,
  });

  return response.output_text;
}

function messeZeitInMs(callback: () => void) {
  const startTime = Date.now();
  callback();
  const endTime = Date.now();
  const duration = endTime - startTime;
  console.log(`⏱️ Dauer: ${duration} ms`);
}