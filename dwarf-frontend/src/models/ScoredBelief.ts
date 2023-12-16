import type { Dictionary } from "@shared";
import { Belief } from "@shared";

export class ScoredBelief {
  beliefs: Belief[];
  score: number;

  constructor(beliefs: Belief[], score: number) {
    this.beliefs = beliefs;
    this.score = score;
  }
}
