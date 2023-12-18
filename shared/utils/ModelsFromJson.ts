import { Belief } from "../models/Belief";
import { Facet } from "../models/Facet";
import { Goal } from "../models/Goal";
import { groupby } from "./GroupBy";
import type { Dictionary } from "../types/Dictionary";

export function beliefsFromJson(json: object[]): Belief[] {
  return json.map((json: any) => {
    const topic: string = json["Topic"];
    const value: string = json["Value"];
    const splitValue: string[] = value.split(" to ");
    const lower: number = parseInt(splitValue[0], 10);
    const upper: number = parseInt(splitValue[1], 10);
    const description: string = json["Description"];

    return new Belief(topic, lower, upper, description);
  });
}

export function facetsFromJson(json: object[]): Facet[] {
  return json.map((json: any) => {
    const token: string = json["Token"];
    const splitToken: string[] = token.split(" Conflicts with ");
    const facet: string = splitToken[0];
    let conflicts_with: string[] | null = null;
    if (splitToken.length > 1) {
      conflicts_with = splitToken[1].split(" and ");
    }
    const value: string = json["Value"];
    const splitValue: string[] = value.split("-");
    const lower: number = parseInt(splitValue[0], 10);
    const upper: number = parseInt(splitValue[1], 10);
    const description: string = json["Description"];

    return new Facet(facet, lower, upper, description, conflicts_with);
  });
}

export function goalsFromJson(json: object[]): Goal[] {
  return json.map((json: any) => {
    const goal: string = json["Token"];
    const description: string = json["Description"];

    return new Goal(goal, description);
  });
}

export function groupBeliefsByTopic(
  beliefs: Belief[],
): Dictionary<string, Belief[]> {
  const groupedBeliefs = groupby<Belief>(beliefs, (b) => b.topic);
  Object.keys(groupedBeliefs).forEach((key) => {
    groupedBeliefs[key].sort((a: Belief, b: Belief) => a.lower - b.lower);
  });
  return groupedBeliefs;
}

export function groupFacetsByFacet(
  facets: Facet[],
): Dictionary<string, Facet[]> {
  const groupedFacets = groupby<Facet>(facets, (f) => f.facet);
  Object.keys(groupedFacets).forEach((key) => {
    groupedFacets[key].sort((a: Facet, b: Facet) => a.lower - b.lower);
  });
  return groupedFacets;
}
