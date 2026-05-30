# PUID client (Elixir). Requires :req. Auth via PUID_API_KEY.
defmodule Puid do
  @base "https://puid.dev/api"
  defp hdr, do: [{"X-API-Key", System.get_env("PUID_API_KEY") || ""}]
  def generate(n \\ 1) when n in 1..10 do
    case Req.get!("#{@base}/v1/ids?n=#{n}", headers: hdr()) do
      %{status: 429} -> {:error, :rate_limited}
      %{body: %{"ids" => ids}} -> {:ok, ids}
    end
  end
  def ordinal(puid), do: Req.get!("#{@base}/v1/ordinal/#{puid}", headers: hdr()).body["ordinal"]
end
