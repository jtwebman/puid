// gen-openapi.mjs — writes openapi.json and openapi.yaml from the single source of
// truth in src/openapi.js. Run: node tools/gen-openapi.mjs
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SPEC, toYaml } from "../src/openapi.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
writeFileSync(join(ROOT, "openapi.json"), JSON.stringify(SPEC, null, 2));
writeFileSync(join(ROOT, "openapi.yaml"), "# Generated from src/openapi.js — edit SPEC there, not here.\n" + toYaml(SPEC));
console.log("wrote openapi.json and openapi.yaml from src/openapi.js (single source of truth)");
