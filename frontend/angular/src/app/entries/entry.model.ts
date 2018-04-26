export class Entry {
  constructor(
    public word: string,
    public definition: string
  ) { }

  get slug(): string {
    return this.word.toLowerCase().replace(' ', '-')
  }
}
