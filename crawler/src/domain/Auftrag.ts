

export class Auftrag {
    auftragId: string;
    beschreibung: string;

    constructor(auftragId: string, beschreibung: string) {
        this.auftragId = auftragId;
        this.beschreibung = beschreibung;
    }
}