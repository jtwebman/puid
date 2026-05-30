-- PUID client (Lua). luasocket + dkjson. Auth via PUID_API_KEY.
local http = require("socket.http")
local ltn12 = require("ltn12")
local json = require("dkjson")
local BASE = "https://puid.dev/api"
local M = {}
local function get(path)
  local chunks = {}
  local _, code = http.request{ url = BASE .. path,
    headers = { ["X-API-Key"] = os.getenv("PUID_API_KEY") or "" },
    sink = ltn12.sink.table(chunks) }
  if code == 429 then error("Rate limited. One per second.") end
  return json.decode(table.concat(chunks))
end
function M.generate(n) n = n or 1; assert(n >= 1 and n <= 10, "n must be 1..10"); return get("/v1/ids?n=" .. n).ids end
function M.ordinal(puid) return get("/v1/ordinal/" .. puid).ordinal end
return M
