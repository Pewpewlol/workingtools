import { callGPT5NanoModel } from "../src/chatgpt/chatgptService";
import { EmailService } from "../src/email/emailService";
import { chatgptErrorMailOptions } from "../src/email/mailOptionsTemplate/chatgptCommitSummaryError";
import fs from "fs/promises";
import { chatgptCommitSummaryMailOptions } from "../src/email/mailOptionsTemplate/chatgptCommitSummaryTemplate";
import test, { expect } from "@playwright/test";
import { FileChecker } from "../src/file/file";
import OpenAI from "openai";

// Playwright Test ohne Browser (nur API-Calls)
test("callGPT5NanoModel should return a summary", async () => {
    // Test-spezifisches Timeout auf 5 Minuten setzen
    test.setTimeout(5 * 60 * 1000); // 5 Minuten = 300.000ms
    const emailService = new EmailService();
    try {
        // Schritt 1: API-Schlüssel und Dateipfad vorbereiten
        console.log("Starte ChatGPT Test...");
        const apiKey = process.env.OPENAI_API_KEY || '';
        if (!apiKey) {
            throw new Error("Bitte Umgebungsvariable OPENAI_API_KEY setzen");
        }
        const filePath = "./ressources/monthly_commits.txt";
        if (!FileChecker.doesFileExist(filePath)) {
            throw new Error("Datei nicht gefunden: " + filePath);
        }
        // Schritt 2: GPT-5 Nano Modell aufrufen
        console.log("Rufe GPT-5 Nano Modell auf...");
        const text = await fs.readFile(filePath, { encoding: "utf8" });

        const summary = await callGPT5NanoModel("Du bist ein analytischer Assistent, der Git-Commits nach Tagen gruppiert.", 
            `Bitte fasse diese Commits wie folgt zusammen Sortierung nach Datum zuerst (aufsteigend), dann Nachricht(Datum | Repository | Branch | Nachricht):\n${text}`);
        expect(summary).toBeDefined();

        // Schritt 3: Zusammenfassung in eine Datei schreiben
        await fs.writeFile("./commit_summary.txt", summary, { encoding: "utf8" });
        console.log("✔ Zusammenfassung gespeichert in commit_summary.txt");
        emailService.sendEmail("./commit_summary.txt",chatgptCommitSummaryMailOptions(process.env.RECIPIENT_EMAIL || '', "./commit_summary.txt", "commit_summary.txt"));
    } catch (error: any) {
        // Fehlerbehandlung: Fehler-Email senden
        console.error("Fehler:", error);
        await emailService.sendFehlerEmail(chatgptErrorMailOptions("Fehler im ChatGPT: " + error.message, process.env.RECIPIENT_EMAIL || ''));
        throw error;
    }
})