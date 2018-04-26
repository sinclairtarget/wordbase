export class Entry {
  word: string;
  definition: string;
  location: string;

  constructor(obj) {
    this.word = obj.word;
    this.definition = obj.definition;
    this.location = obj.location;
  }

  get slug(): string {
    return this.word.toLowerCase().replace(' ', '-')
  }
}
