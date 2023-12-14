export class Facet {
  facet: string;
  lower: number;
  upper: number;
  description: string;
  conflicts_with: string[] | null;

  constructor(
    facet: string,
    lower: number,
    upper: number,
    description: string,
    conflicts_with: string[] | null,
  ) {
    this.facet = facet;
    this.lower = lower;
    this.upper = upper;
    this.description = description;
    this.conflicts_with = conflicts_with;
  }
}
