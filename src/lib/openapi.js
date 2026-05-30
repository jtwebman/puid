// openapi.js — THE single source of truth for the PUID API surface.
//
// A real OpenAPI 3.1 document as a pure JS object (no Node imports), so it can be:
//   - served live by the Worker at /api/openapi.json (servers[0].url is rewritten
//     to the runtime base URL — env PUID_BASE_URL, else the request origin — so
//     "Try it out" works locally AND in production)
//   - rendered as interactive docs at /docs (Swagger UI)
//   - turned into openapi.yaml / openapi.json files (tools/gen-openapi.mjs)
//   - used to generate all 20 SDKs (tools/gen-clients.mjs)
//
// Only the two real endpoints are documented: generate + ordinal.

export const DEFAULT_SITE = "https://puid.dev";

export const SPEC = {
  openapi: "3.1.0",
  info: {
    title: "PUID API",
    version: "1.0.0",
    summary: "Probably Unique IDentifier.",
    description:
      "Two endpoints: generate identifiers, and decode one back to its ordinal. Authenticate with an API key (X-API-Key). Rate limited to one request per second.",
    contact: { name: "PUID", url: DEFAULT_SITE },
    license: { name: "AGPL-3.0" },
  },
  servers: [{ url: DEFAULT_SITE + "/api", description: "API base (one request per second, per account)" }],
  security: [{ ApiKeyAuth: [] }],
  tags: [{ name: "ids", description: "Get and decode identifiers" }],
  paths: {
    "/v1/ids": {
      get: {
        tags: ["ids"],
        operationId: "generate",
        summary: "Generate 1 to 10 PUIDs",
        description: "Returns between 1 and 10 identifiers. Rate limited to one request per second. Subject to a daily quota.",
        parameters: [
          { name: "n", in: "query", required: false, description: "How many ids to generate (1-10).", schema: { type: "integer", minimum: 1, maximum: 10, default: 1 } },
        ],
        responses: {
          "200": { description: "A batch of fresh, guaranteed-unique ids.", content: { "application/json": { schema: { $ref: "#/components/schemas/IdsResponse" } } } },
          "401": { description: "Missing or invalid credentials.", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "402": { description: "Daily quota exceeded.", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "429": { description: "One request per second.", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/v1/ordinal/{puid}": {
      get: {
        tags: ["ids"],
        operationId: "ordinal",
        summary: "Decode a PUID back to its ordinal",
        description: "Decodes a PUID to reveal the counter value it encodes.",
        parameters: [{ name: "puid", in: "path", required: true, description: "A PUID returned by /v1/ids.", schema: { type: "string", pattern: "^[0-9A-Za-z]{1,22}$" } }],
        responses: {
          "200": { description: "The decoded ordinal.", content: { "application/json": { schema: { $ref: "#/components/schemas/OrdinalResponse" } } } },
          "400": { description: "Not a valid PUID.", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      ApiKeyAuth: { type: "apiKey", in: "header", name: "X-API-Key", description: "A team API key (puid_live_...). Mint one in the dashboard after signing in with Google or Microsoft." },
    },
    schemas: {
      IdsResponse: { type: "object", required: ["ids", "count"], properties: { ids: { type: "array", items: { type: "string" } }, count: { type: "integer" }, quota: { type: "object", properties: { used: { type: "integer" }, limit: { type: "integer" } } }, warning: { type: "string" } } },
      OrdinalResponse: { type: "object", required: ["puid", "ordinal"], properties: { puid: { type: "string" }, ordinal: { type: "string" }, truth: { type: "string" } } },
      Error: { type: "object", properties: { error: { type: "string" }, message: { type: "string" } } },
    },
  },
};

// Return the spec with servers[0].url rewritten to `${base}/api`.
export function specWithBase(base) {
  return { ...SPEC, servers: [{ url: base.replace(/\/$/, "") + "/api", description: SPEC.servers[0].description }] };
}

// Pure, always-valid YAML emitter (quotes every string + key). Shared by the
// Worker (serves /api/openapi.yaml) and tools/gen-openapi.mjs (writes the file).
function yScalar(v) {
  if (v === null) return "null";
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return '"' + String(v).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\t/g, "\\t") + '"';
}
const yObj = (v) => v !== null && typeof v === "object";
export function toYaml(obj, indent = 0) {
  const pad = "  ".repeat(indent);
  let out = "";
  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (yObj(item)) out += `${pad}-\n${toYaml(item, indent + 1)}`;
      else out += `${pad}- ${yScalar(item)}\n`;
    }
  } else {
    for (const [k, v] of Object.entries(obj)) {
      const key = yScalar(k);
      if (yObj(v) && (Array.isArray(v) ? v.length : Object.keys(v).length)) out += `${pad}${key}:\n${toYaml(v, indent + 1)}`;
      else if (yObj(v)) out += `${pad}${key}: ${Array.isArray(v) ? "[]" : "{}"}\n`;
      else out += `${pad}${key}: ${yScalar(v)}\n`;
    }
  }
  return out;
}
