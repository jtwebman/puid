// Proof, not vibes. Run: node test/puid.test.mjs
import {
  encodePuid,
  decodePuid,
  permute,
  unpermute,
  base62Encode,
  base62Decode,
} from "../src/lib/puid.js";

let failures = 0;
const check = (cond, msg) => {
  if (!cond) {
    console.error("  FAIL:", msg);
    failures++;
  }
};

// 1. Permutation roundtrips for a spread of ordinals (incl. edges).
const samples = [
  0n,
  1n,
  2n,
  3n,
  61n,
  62n,
  63n,
  1000n,
  (1n << 64n) - 1n,
  1n << 64n,
  1n << 127n,
  (1n << 128n) - 1n,
];
for (const i of samples) {
  check(unpermute(permute(i)) === i, `permute roundtrip for ${i}`);
}

// 2. base62 roundtrips.
for (const i of samples) {
  check(base62Decode(base62Encode(i)) === i, `base62 roundtrip for ${i}`);
}

// 3. Full PUID roundtrip: ordinal -> string -> ordinal.
for (const i of samples) {
  check(decodePuid(encodePuid(i)) === i, `puid roundtrip for ${i}`);
}

// 4. THE BIG CLAIM: no collisions. Encode the first N ordinals, assert all unique.
const N = 2_000_000;
const seen = new Set();
let collisions = 0;
for (let i = 1; i <= N; i++) {
  const id = encodePuid(i);
  if (seen.has(id)) collisions++;
  seen.add(id);
}
check(collisions === 0, `expected 0 collisions over ${N} ids, got ${collisions}`);
console.log(
  `  checked ${N.toLocaleString()} sequential ids: ${collisions} collisions, ${seen.size.toLocaleString()} distinct`,
);

// 5. "Looks random": sequential ordinals should NOT produce sequential output.
const a = encodePuid(1),
  b = encodePuid(2),
  c = encodePuid(3);
check(a !== b && b !== c, "consecutive ids differ");
console.log(`  sample: #1=${a}  #2=${b}  #3=${c}`);
check(decodePuid(a) === 1n, "decode confession works (#1)");
console.log(`  /ordinal confession: ${a} -> #${decodePuid(a)}`);

// 6. Length sanity: full-width values should land near 22 base62 chars.
const big = encodePuid((1n << 128n) - 1n);
check(big.length >= 21 && big.length <= 22, `max-width id length ${big.length}`);
console.log(`  widest id: ${big} (${big.length} chars)`);

console.log(failures === 0 ? "\nALL PASS ✔" : `\n${failures} FAILURE(S) �’`);
process.exit(failures === 0 ? 0 : 1);
