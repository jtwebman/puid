// PUID client (C#). Auth via PUID_API_KEY.
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

public static class Puid {
    public const string Base = "https://puid.dev/api";
    private static readonly HttpClient Http = NewClient();
    private static HttpClient NewClient() {
        var c = new HttpClient();
        c.DefaultRequestHeaders.Add("X-API-Key", Environment.GetEnvironmentVariable("PUID_API_KEY") ?? "");
        return c;
    }
    public static async Task<List<string>> Generate(int n = 1) {
        if (n < 1 || n > 10) throw new ArgumentException("n must be 1..10");
        var resp = await Http.GetAsync($"{Base}/v1/ids?n={n}");
        if ((int)resp.StatusCode == 429) throw new Exception("Rate limited. One per second.");
        var doc = JsonDocument.Parse(await resp.Content.ReadAsStringAsync());
        var ids = new List<string>();
        foreach (var e in doc.RootElement.GetProperty("ids").EnumerateArray()) ids.Add(e.GetString());
        return ids;
    }
    public static async Task<string> Ordinal(string puid) {
        var body = await Http.GetStringAsync($"{Base}/v1/ordinal/{Uri.EscapeDataString(puid)}");
        return JsonDocument.Parse(body).RootElement.GetProperty("ordinal").GetString();
    }
}
