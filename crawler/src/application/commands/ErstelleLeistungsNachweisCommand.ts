export class ErstelleLeistungsNachweisCommand {
  constructor(
    public readonly filePath: string,
    public readonly instructionsGPTInstructions: string,
    public readonly inputGPT: string
  ) {}
}