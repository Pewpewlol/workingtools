import { ErstelleLeistungsNachweisCommand } from "../../../../application/commands/ErstelleLeistungsNachweisCommand";
import { LeistungsnachweisErstellenUseCase } from "../../../../application/Leistungsnachweis/LeistungsnachweisErstellenUseCase";

// Test ausführen falls direkt aufgerufen (CommonJS-kompatibel)
if (require.main === module) {
    const instructionsGPTInstructions = "Du bist ein analytischer Assistent, der Git-Commits und JIRA Einträge nach Tagen gruppiert.";
    const inputGPT = `
    Bitte fasse diese Commits wie folgt zusammen Sortierung nach Datum zuerst (aufsteigend), 
    dann Nachricht(Datum | Repository | Branch | Nachricht) und 
    es soll doch bitte alles in UTF-8 sein und keine Merkwürdigen Symbole und alle Umlaute sollten richtig angepasst sein:

    Ich brauche ein Zusammenfassung von allem in dem Format:

    Datum: YYYY-MM-DD
    - Tätigkeit 1
    - Tätigkeit 2
    - Tätigkeit 3
    - Tätigkeit 4
    
    Nächstes
    
    Datum: YYYY-MM-DD
    - Tätigkeit 1
    - Tätigkeit 2
    - Tätigkeit 3
    - Tätigkeit 4

    und nehme die Informationen aus der Datei und schreibe es so um, sodass ein Fachbereich es annehmen würde, also auf Verständlich Deutsch
    Beispiel: Analyse des Darv-Test-K8s Repositories.

    Ich möchte jeden vollständigen Arbeitstag im Monat 
    Wichtig! ich brauche 4 Tätigkeiten. Falls keine 4 Tätigkeiten an dem Tag gemacht wurden, bitte erfinde etwas das sinnvoll zu dem Tag bzw. umliegend Tag ist.
    Beispiel: 
    2024-11-02
    - Code-Review im Darv-Test-K8s Repository
    - Bugfixing im Darv-Test-K8s Repository
    - Meeting mit dem Team zur Besprechung der nächsten Schritte
    - Dokumentation der letzten Änderungen im Darv-Test-K8s Repository

    2024-11-01
    - Analyse des Darv-Test-K8s Repositories
    - Implementierung neuer Features im Darv-Test-K8s Repository
    - x
    - x

    Für die x sollen entsprechende Tätigkeiten sinnvoll ergänzt werden. Heißt hier. Wieder Codereview, aber bitte kein CodeReview von einem Merge oder commit der hier nicht auftaucht in der Datei.
    Es dürfen keine 2 Einträge doppelt sein.
    
    Also:
    Tätigkeit 1: Testen des Docker Images im Kubernetes Cluster
    Tätigkeit 2: Fehlerbehebung des Docker Images im Kubernetes Cluster

    ist erlaubt!

    Ich brauche jeden Wochentag (Mo-Fr) im Monat abgedeckt.
    Auch wenn nichts drinnen steht für den Tag, bitte erfinde etwas sinnvolles, das zwischen den Tagen passieren hätte können wie Debugging Session oder fehlerbehebung.

    `;

    const filePath = "./ressources/monthly_commits.txt";
    const command = new ErstelleLeistungsNachweisCommand(filePath, instructionsGPTInstructions, inputGPT);
    LeistungsnachweisErstellenUseCase(command);
}

export { LeistungsnachweisErstellenUseCase };