// puid.js — the entire intellectual content of this company.
//
// A PUID ("Probably Unique IDentifier", though it is in fact *certainly* unique)
// is the base62 encoding of a 128-bit value produced by running a monotonic
// counter through a bijective permutation.
//
// Why this is funnier than a UUID:
//   - UUIDv4 is RANDOM, so it is only PROBABLY unique (collision probability > 0).
//   - PUID is a COUNTER run through a bijection. A bijection maps distinct inputs
//     to distinct outputs by definition, so PUID is PROVABLY unique — zero
//     collisions, ever, guaranteed by the pigeonhole principle rather than by
//     crossing your fingers. We beat UUIDv4 at its only job using `i++`.
//   - The permutation is pseudo-random, so the output looks like noise. Nobody
//     can tell it was a counter... unless they ask /ordinal, which decrypts it
//     straight back to "oh. it was #3."
//
// The permutation is a 4-round balanced Feistel network over 128 bits. A Feistel
// network is a bijection for ANY round function (you invert it by running the
// rounds backwards), which is what lets us guarantee uniqueness while using a
// perfectly mediocre, non-cryptographic mixing function inside.

const M64 = (1n << 64n) - 1n;
const M128 = (1n << 128n) - 1n;

// Round keys. "Secret." It's a joke service; the secret is in the open-source
// repo. Change these in your own deployment if you enjoy the illusion of safety.
const ROUND_KEYS = [
  0x9e3779b97f4a7c15n,
  0xbf58476d1ce4e5b9n,
  0x94d049bb133111ebn,
  0xd6e8feb86659fd93n,
];

const rotl64 = (x, r) => ((x << r) | (x >> (64n - r))) & M64;

// Round function. Need NOT be invertible — the Feistel structure handles that.
// This is a SplitMix64-flavored avalanche mixer. It just has to look random.
function F(r, k) {
  let z = (r + k) & M64;
  z = ((z ^ (z >> 30n)) * 0xbf58476d1ce4e5b9n) & M64;
  z = ((z ^ (z >> 27n)) * 0x94d049bb133111ebn) & M64;
  z = z ^ (z >> 31n);
  return rotl64(z, 17n);
}

// Forward permutation: ordinal (counter value) -> 128-bit PUID value.
export function permute(ordinal) {
  let x = BigInt(ordinal) & M128;
  let L = x >> 64n;
  let R = x & M64;
  for (const k of ROUND_KEYS) {
    const nextL = R;
    const nextR = L ^ F(R, k);
    L = nextL;
    R = nextR;
  }
  return ((L << 64n) | R) & M128;
}

// Inverse permutation: 128-bit PUID value -> ordinal. This is the /ordinal
// endpoint's confession booth.
export function unpermute(value) {
  let v = BigInt(value) & M128;
  let L = v >> 64n;
  let R = v & M64;
  for (let i = ROUND_KEYS.length - 1; i >= 0; i--) {
    const prevR = L;
    const prevL = R ^ F(prevR, ROUND_KEYS[i]);
    L = prevL;
    R = prevR;
  }
  return ((L << 64n) | R) & M128;
}

// --- base62, URL-safe, no padding ---------------------------------------------
const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const BASE = 62n;
const INDEX = (() => {
  const m = {};
  for (let i = 0; i < ALPHABET.length; i++) m[ALPHABET[i]] = BigInt(i);
  return m;
})();

export function base62Encode(value) {
  let v = BigInt(value) & M128;
  if (v === 0n) return "0";
  let out = "";
  while (v > 0n) {
    out = ALPHABET[Number(v % BASE)] + out;
    v /= BASE;
  }
  return out;
}

export function base62Decode(str) {
  let v = 0n;
  for (const ch of str) {
    const d = INDEX[ch];
    if (d === undefined) throw new Error(`invalid base62 character: ${ch}`);
    v = v * BASE + d;
  }
  return v & M128;
}

// --- the two public operations -------------------------------------------------

// ordinal -> PUID string
export function encodePuid(ordinal) {
  return base62Encode(permute(ordinal));
}

// PUID string -> ordinal (the punchline endpoint)
export function decodePuid(puid) {
  return unpermute(base62Decode(puid));
}
