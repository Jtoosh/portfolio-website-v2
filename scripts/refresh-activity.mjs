import { readFile, writeFile, rename } from "node:fs/promises";
import { parseArgs } from "node:util";
import {
  retrieveActivity,
  snapshotFromSearchResponses,
} from "../src/activity-adapter.mjs";

const { values } = parseArgs({
  options: {
    source: { type: "string" },
    output: { type: "string", default: "src/activity-snapshot.json" },
    "retrieved-at": { type: "string" },
  },
});
if (values.source && !values["retrieved-at"])
  throw new Error(
    "Replayed source requires --retrieved-at with its actual successful retrieval time.",
  );
const snapshot = values.source
  ? snapshotFromSearchResponses(
      [JSON.parse(await readFile(values.source, "utf8"))],
      values["retrieved-at"],
    )
  : await retrieveActivity({ signal: AbortSignal.timeout(15000) });
const temporary = `${values.output}.tmp`;
await writeFile(temporary, `${JSON.stringify(snapshot, null, 2)}\n`);
await rename(temporary, values.output);
console.log(
  `Saved ${snapshot.commits.length} genuine activity records retrieved at ${snapshot.retrievedAt}.`,
);
