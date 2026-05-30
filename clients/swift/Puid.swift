// PUID client (Swift). Auth via PUID_API_KEY.
import Foundation

enum Puid {
    static let base = "https://puid.dev/api"
    static func get(_ path: String) async throws -> [String: Any] {
        var req = URLRequest(url: URL(string: base + path)!)
        req.setValue(ProcessInfo.processInfo.environment["PUID_API_KEY"] ?? "", forHTTPHeaderField: "X-API-Key")
        let (data, _) = try await URLSession.shared.data(for: req)
        return try JSONSerialization.jsonObject(with: data) as! [String: Any]
    }
    static func generate(_ n: Int = 1) async throws -> [String] {
        precondition((1...10).contains(n), "n must be 1...10")
        return try await get("/v1/ids?n=\(n)")["ids"] as! [String]
    }
    static func ordinal(_ puid: String) async throws -> String {
        try await get("/v1/ordinal/\(puid)")["ordinal"] as! String
    }
}
