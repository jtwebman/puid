#!/usr/bin/env bash
# PUID client (bash + curl + jq). Auth via PUID_API_KEY.
set -euo pipefail
PUID_BASE="${PUID_BASE:-https://puid.dev/api}"
_get() { curl -fsS -H "X-API-Key: ${PUID_API_KEY:-}" "$PUID_BASE$1"; }
puid_generate() { _get "/v1/ids?n=${1:-1}" | jq -r '.ids[]'; }
puid_ordinal() { _get "/v1/ordinal/$1" | jq -r '.ordinal'; }
# usage: ./puid.sh puid_generate 3   |   ./puid.sh puid_ordinal <puid>
"${@:-puid_generate}"
