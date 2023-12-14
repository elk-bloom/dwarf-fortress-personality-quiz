export class Belief {
  topic: string;
  lower: number;
  upper: number;
  description: string;

  constructor(
    topic: string,
    lower: number,
    upper: number,
    description: string,
  ) {
    this.topic = topic;
    this.lower = lower;
    this.upper = upper;
    this.description = description;
  }
}
