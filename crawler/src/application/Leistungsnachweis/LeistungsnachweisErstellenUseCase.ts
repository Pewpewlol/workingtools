
import { chatgptErrorMailOptions } from "../../interfaces/out/email/mailOptionsTemplate/chatgptCommitSummaryError";
import fs from "fs/promises";
import { chatgptCommitSummaryMailOptions } from "../../interfaces/out/email/mailOptionsTemplate/chatgptCommitSummaryTemplate";
import { FileChecker } from "../../interfaces/out/file/file";
import { EmailService } from "../../interfaces/out/email/emailService";
import { LeistungsnachweisErstellenAggregate } from "../../domain/Aggregates/LeistungsnachweisErstellenAggregate";
import { ErstelleLeistungsNachweisCommand } from "../commands/ErstelleLeistungsNachweisCommand";
import { ChatGPTService } from "../../interfaces/out/chatgpt/chatgptService";

/**
 * Pure Node.js ChatGPT Test - komplett ohne Browser/Playwright
 */
export async function LeistungsnachweisErstellenUseCase(leistungsnachweisErstellenCommand: ErstelleLeistungsNachweisCommand) {
    console.log("🚀 Starte ChatGPT Test (Pure Node.js)...");
    const chatGptService = new ChatGPTService();
    const emailService = new EmailService();

    try {
        
        // Schritt 1: API-Schlüssel und Dateipfad vorbereiten
        const { filePath, instructionsGPTInstructions, inputGPT } = leistungsnachweisErstellenCommand;
        if (!FileChecker.doesFileExist(filePath)) {
            throw new Error("❌ Datei existiert nicht");
        }

        const leistungsnachweisAggregate = new LeistungsnachweisErstellenAggregate(filePath, instructionsGPTInstructions, inputGPT);

        // Schritt 2: GPT-5 Nano Modell aufrufen
        console.log("🤖 Rufe GPT-5 Nano Modell auf...");
        const text = await fs.readFile(filePath, { encoding: "utf8" });

        const summary = await chatGptService.callGPT5NanoModel(
            instructionsGPTInstructions, 
            `$${inputGPT}\n${text}`
        );
        leistungsnachweisAggregate.setSummary = summary;

        // Schritt 3: Zusammenfassung in eine Datei schreiben
        console.log("💾 Speichere Zusammenfassung...");
        await fs.writeFile("./commit_summary.txt", summary, { encoding: "utf8" });
        console.log("✅ Zusammenfassung gespeichert in commit_summary.txt");
        
        // Schritt 4: Email versenden
        if (process.env.RECIPIENT_EMAIL) {
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

