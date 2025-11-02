import { ErstelleLeistungsNachweisCommand } from "../../../../application/commands/ErstelleLeistungsNachweisCommand";
import { LeistungsnachweisErstellenUseCase } from "../../../../application/Leistungsnachweis/LeistungsnachweisErstellenUseCase";

// Test ausführen falls direkt aufgerufen (CommonJS-kompatibel)
if (require.main === module) {
    const instructionsGPTInstructions = "Du bist ein analytischer Assistent, der Git-Commits nach Tagen gruppiert.";
    const inputGPT = "Bitte fasse diese Commits wie folgt zusammen Sortierung nach Datum zuerst (aufsteigend), dann Nachricht(Datum | Repository | Branch | Nachricht) und es soll doch bitte alles in UTF-8 sein und keine Merkwürdigen Symbole vorhanden mehr sein:";
    const filePath = "./ressources/monthly_commits.txt";
    const command = new ErstelleLeistungsNachweisCommand(filePath, instructionsGPTInstructions, inputGPT);
    LeistungsnachweisErstellenUseCase(command);
}

export { LeistungsnachweisErstellenUseCase };