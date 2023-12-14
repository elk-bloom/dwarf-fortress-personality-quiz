import cors from "cors";
import express from "express";
import fs from "fs";

import {
  Belief,
  Facet,
  Goal,
  beliefsFromJson,
  facetsFromJson,
  goalsFromJson,
  groupBeliefsByTopic,
  groupFacetsByFacet,
} from "@shared";

async function populate<T>(
  fileName: string,
  cb: (jsonList: object[]) => T[],
): Promise<T[]> {
  return new Promise<T[]>((resolve, reject) => {
    fs.readFile(
      `./data/${fileName}.json`,
      "utf8",
      (error: NodeJS.ErrnoException | null, contents: string) => {
        if (error) {
          reject(new Error("Error reading file: " + error.message));
          return;
        }
        try {
          contents = contents.replace(/\\u2020/g, "");
          contents = contents.replace(/\\u2212/g, "-");
          const items: object[] = JSON.parse(contents);
          resolve(cb(items));
        } catch (e) {
          reject(new Error("Error parsing JSON: " + e));
        }
      },
    );
  });
}

const app = express();
const port = 3000;
app.use(cors());

app.get("/beliefs", async (req, res) => {
  try {
    const beliefs: Belief[] = await populate<Belief>(
      "Beliefs",
      beliefsFromJson,
    );
    const groupedBeliefs = groupBeliefsByTopic(beliefs);
    res.json(groupedBeliefs);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/facets", async (req, res) => {
  try {
    const facets: Facet[] = await populate<Facet>("Facets", facetsFromJson);
    const groupedFacets = groupFacetsByFacet(facets);
    res.json(groupedFacets);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/goals", async (req, res) => {
  try {
    const goals: Goal[] = await populate<Goal>("Goals", goalsFromJson);
    res.json(goals);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
