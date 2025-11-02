import { FileChecker } from "../../interfaces/out/file/file";

export class LeistungsnachweisErstellenAggregate {
    private filePath: string;
    private summary: string = '';
    private leistungsnachweisText: string = '';
    private gptInstructions: string = '';
    private gptText: string = '';
    private gptOutputText: string = '';

    constructor(filePath: string, instructionsGPTInstructions: string, inputGPT: string) {

        if (!filePath) {
            throw new Error("❌ Bitte Dateipfad angeben");
        }
        this.filePath = filePath;
        this.gptInstructions = instructionsGPTInstructions;
        this.gptText = inputGPT;
    }

    // Getter und Setter für filePath
    get getFilePath(): string {
        return this.filePath;
    }

    set setFilePath(value: string) {
        if (!value || value.trim() === '') {
            throw new Error("❌ Dateipfad darf nicht leer sein");
        }
        if (!FileChecker.doesFileExist(value)) {
            throw new Error("❌ Datei nicht gefunden: " + value);
        }
        this.filePath = value;
    }

    // Getter und Setter für summary
    get getSummary(): string {
        return this.summary;
    }

    set setSummary(value: string) {
        if (!value || value.trim() === '') {
            throw new Error("❌ ChatGPTZusammenfassung darf nicht leer sein");
        }
        this.summary = value;
    }

    // Getter und Setter für leistungsnachweisText
    get getLeistungsnachweisText(): string {
        return this.leistungsnachweisText;
    }

    set setLeistungsnachweisText(value: string) {
        if (!value || value.trim() === '') {
            throw new Error("❌ Leistungsnachweis-Text darf nicht leer sein");
        }
        this.leistungsnachweisText = value;
    }

    // Getter und Setter für gptInstructions
    get getGptInstructions(): string {
        return this.gptInstructions;
    }

    set setGptInstructions(value: string) {
        if (!value || value.trim() === '') {
            throw new Error("❌ GPT-Anweisungen dürfen nicht leer sein");
        }
        this.gptInstructions = value;
    }

    // Getter und Setter für gptText
    get getGptText(): string {
        return this.gptText;
    }

    set setGptText(value: string) {
        if (!value || value.trim() === '') {
            throw new Error("❌ GPT-Text darf nicht leer sein");
        }
        this.gptText = value;
    }

    // Getter und Setter für gptOutputText
    get getGptOutputText(): string {
        return this.gptOutputText;
    }

    set setGptOutputText(value: string) {
        if (!value || value.trim() === '') {
            throw new Error("❌ GPT-Output-Text darf nicht leer sein");
        }
        this.gptOutputText = value;
    }
}