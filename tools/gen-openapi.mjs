// gen-openapi.mjs — writes openapi.json and openapi.yaml from src/lib/openapi.js.
// Base URL: PUID_BASE_URL env var, else the default (https://puid.dev).
// Run: node tools/gen-openapi.mjs
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { toYaml, specWithBase, DEFAULT_SITE } from "../src/lib/openapi.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const spec = specWithBase(process.env.PUID_BASE_URL || DEFAULT_SITE);
writeFileSync(join(ROOT, "openapi.json"), JSON.stringify(spec, null, 2));
writeFileSync(join(ROOT, "openapi.yaml"), "# Generated from src/lib/openapi.js — edit SPEC there, not here.\n" + toYaml(spec));
console.log(`wrote openapi.json and openapi.yaml (server ${spec.servers[0].url})`);
