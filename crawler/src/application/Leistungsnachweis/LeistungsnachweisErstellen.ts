
import { callGPT5NanoModel } from "../../interfaces/out/chatgpt/chatgptService";
import { chatgptErrorMailOptions } from "../../interfaces/out/email/mailOptionsTemplate/chatgptCommitSummaryError";
import fs from "fs/promises";
import { chatgptCommitSummaryMailOptions } from "../../interfaces/out/email/mailOptionsTemplate/chatgptCommitSummaryTemplate";
import { FileChecker } from "../../interfaces/out/file/file";
import { EmailService } from "../../interfaces/out/email/emailService";

/**
 * Pure Node.js ChatGPT Test - komplett ohne Browser/Playwright
 */
export async function LeistungsnachweisErstellen() {
    const emailService = new EmailService();
    
    try {
        console.log("🚀 Starte ChatGPT Test (Pure Node.js)...");
        
        // Schritt 1: API-Schlüssel und Dateipfad vorbereiten
        const apiKey = process.env.OPENAI_API_KEY || '';
        if (!apiKey) {
            throw new Error("❌ Bitte Umgebungsvariable OPENAI_API_KEY setzen");
        }
        
        const filePath = "./ressources/monthly_commits.txt";
        if (!FileChecker.doesFileExist(filePath)) {
            throw new Error("❌ Datei nicht gefunden: " + filePath);
        }
        
        // Schritt 2: GPT-5 Nano Modell aufrufen
        console.log("🤖 Rufe GPT-5 Nano Modell auf...");
        const text = await fs.readFile(filePath, { encoding: "utf8" });

        const summary = await callGPT5NanoModel(
            "Du bist ein analytischer Assistent, der Git-Commits nach Tagen gruppiert.", 
            `Bitte fasse diese Commits wie folgt zusammen Sortierung nach Datum zuerst (aufsteigend), dann Nachricht(Datum | Repository | Branch | Nachricht) und es soll doch bitte alles in UTF-8 sein und keine Merkwürdigen Symbole vorhanden mehr sein:\n${text}`
        );
        
        if (!summary) {
            throw new Error("❌ GPT-5 Nano hat keine Antwort zurückgegeben");
        }

        // Schritt 3: Zusammenfassung in eine Datei schreiben
        console.log("💾 Speichere Zusammenfassung...");
        await fs.writeFile("./commit_summary.txt", summary, { encoding: "utf8" });
        console.log("✅ Zusammenfassung gespeichert in commit_summary.txt");
        
        // Schritt 4: Email versenden
        if (process.env.EMAIL_USER && process.env.RECIPIENT_EMAIL) {
            console.log("📧 Sende Email mit Zusammenfassung...");
            await emailService.sendEmail(
                "./commit_summary.txt",
                chatgptCommitSummaryMailOptions(
                    process.env.RECIPIENT_EMAIL, 
                    "./commit_summary.txt", 
                    "commit_summary.txt"
                )
            );
            console.log("✅ Email erfolgreich gesendet");
        } else {
            console.log("⚠️ Email-Konfiguration nicht vorhanden - überspringe Email-Versendung");
        }
        
        console.log("🎉 ChatGPT Test erfolgreich abgeschlossen!");
        process.exit(0);
        
    } catch (error) {
        console.error("💥 Fehler im ChatGPT Test:", error);
        
        // Fehler-Email senden
        if (process.env.EMAIL_USER && process.env.RECIPIENT_EMAIL) {
            try {
                console.log("📧 Sende Fehler-Email...");
                await emailService.sendFehlerEmail(
                    chatgptErrorMailOptions(
                        "Fehler im ChatGPT: " + (error instanceof Error ? error.message : String(error)), 
                        process.env.RECIPIENT_EMAIL
                    )
                );
                console.log("✅ Fehler-Email gesendet");
            } catch (emailError) {
                console.error("❌ Fehler beim Senden der Fehler-Email:", emailError);
            }
        }
        
        process.exit(1);
    }
}

