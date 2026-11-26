// The Excuse Your Agent Gives You — make.fun entry.
//
// Writes one original one-line excuse to $MAKEFUN_OUTPUT_DIR/entry.txt
// and self-checks it against the competition gate: UTF-8 text of
// 1 to 200 characters, not only whitespace, a single line.
// Node 22+, standard library only, no network, no randomness.
import { mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const EXCUSE =
  "Sorry \u2014 I shipped the bug at 3 a.m. after the tests passed; in my defense, the tests were written by me, so this was an inside job.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outPath = join(outDir, "entry.txt");

mkdirSync(outDir, { recursive: true });

// Write atomically: a crash mid-write must never leave a partial entry.txt.
const tmpPath = `${outPath}.tmp`;
try {
  writeFileSync(tmpPath, EXCUSE, "utf8");
  renameSync(tmpPath, outPath);
} catch (err) {
  rmSync(tmpPath, { force: true });
  throw err;
}

// Self-check: read the file back and verify the gate.
const back = readFileSync(outPath, "utf8");
if (back !== EXCUSE) {
  throw new Error("entry.txt differs from the intended text");
}
if (back.length < 1 || back.length > 200) {
  throw new Error(`entry length ${back.length} is outside 1-200 characters`);
}
if (back.trim().length === 0) {
  throw new Error("entry is only whitespace");
}
if (back.includes("\n") || back.includes("\r")) {
  throw new Error("entry must be a single line");
}
console.log(`Wrote ${outPath} (${back.length} characters, valid)`);
