// PUID client (Dart). Auth via PUID_API_KEY.
import 'dart:convert';
import 'dart:io' show Platform;
import 'package:http/http.dart' as http;

const base = "https://puid.dev/api";
Map<String, String> _hdr() => {"X-API-Key": Platform.environment["PUID_API_KEY"] ?? ""};

Future<List<String>> generate([int n = 1]) async {
  if (n < 1 || n > 10) throw ArgumentError("n must be 1..10");
  final r = await http.get(Uri.parse("$base/v1/ids?n=$n"), headers: _hdr());
  if (r.statusCode == 429) throw Exception("Rate limited. One per second.");
  return (jsonDecode(r.body)["ids"] as List).cast<String>();
}
Future<String> ordinal(String puid) async {
  final r = await http.get(Uri.parse("$base/v1/ordinal/$puid"), headers: _hdr());
  return jsonDecode(r.body)["ordinal"] as String;
}
