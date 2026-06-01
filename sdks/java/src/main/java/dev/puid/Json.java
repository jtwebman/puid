package dev.puid;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * A tiny, dependency-free JSON parser — just enough to read the PUID API's responses. Objects
 * become {@code Map<String,Object>}, arrays {@code List<Object>}, numbers {@code Long}/{@code
 * Double}, plus {@code String}, {@code Boolean}, and {@code null}.
 */
final class Json {

  private final String s;
  private int i;

  private Json(String s) {
    this.s = s;
  }

  /** Parse {@code text}; returns an empty map if it isn't a JSON object we can read. */
  @SuppressWarnings("unchecked")
  static Map<String, Object> parseObject(String text) {
    try {
      Object v = parse(text);
      return v instanceof Map ? (Map<String, Object>) v : Map.of();
    } catch (RuntimeException e) {
      return Map.of();
    }
  }

  static Object parse(String text) {
    Json j = new Json(text);
    j.ws();
    Object v = j.value();
    j.ws();
    if (j.i != j.s.length()) {
      throw new IllegalArgumentException("trailing characters in JSON");
    }
    return v;
  }

  private Object value() {
    char c = peek();
    switch (c) {
      case '{':
        return object();
      case '[':
        return array();
      case '"':
        return string();
      case 't':
      case 'f':
        return bool();
      case 'n':
        expect("null");
        return null;
      default:
        return number();
    }
  }

  private Map<String, Object> object() {
    Map<String, Object> map = new LinkedHashMap<>();
    i++; // {
    ws();
    if (peek() == '}') {
      i++;
      return map;
    }
    while (true) {
      ws();
      String key = string();
      ws();
      if (next() != ':') {
        throw new IllegalArgumentException("expected ':'");
      }
      ws();
      map.put(key, value());
      ws();
      char c = next();
      if (c == '}') {
        return map;
      }
      if (c != ',') {
        throw new IllegalArgumentException("expected ',' or '}'");
      }
    }
  }

  private List<Object> array() {
    List<Object> list = new ArrayList<>();
    i++; // [
    ws();
    if (peek() == ']') {
      i++;
      return list;
    }
    while (true) {
      ws();
      list.add(value());
      ws();
      char c = next();
      if (c == ']') {
        return list;
      }
      if (c != ',') {
        throw new IllegalArgumentException("expected ',' or ']'");
      }
    }
  }

  private String string() {
    if (next() != '"') {
      throw new IllegalArgumentException("expected string");
    }
    StringBuilder sb = new StringBuilder();
    while (true) {
      char c = next();
      if (c == '"') {
        return sb.toString();
      }
      if (c == '\\') {
        char e = next();
        switch (e) {
          case '"':
            sb.append('"');
            break;
          case '\\':
            sb.append('\\');
            break;
          case '/':
            sb.append('/');
            break;
          case 'b':
            sb.append('\b');
            break;
          case 'f':
            sb.append('\f');
            break;
          case 'n':
            sb.append('\n');
            break;
          case 'r':
            sb.append('\r');
            break;
          case 't':
            sb.append('\t');
            break;
          case 'u':
            sb.append((char) Integer.parseInt(s.substring(i, i + 4), 16));
            i += 4;
            break;
          default:
            throw new IllegalArgumentException("bad escape: \\" + e);
        }
      } else {
        sb.append(c);
      }
    }
  }

  private Object number() {
    int start = i;
    while (i < s.length() && "+-0123456789.eE".indexOf(s.charAt(i)) >= 0) {
      i++;
    }
    String num = s.substring(start, i);
    if (num.isEmpty()) {
      throw new IllegalArgumentException("expected value");
    }
    if (num.indexOf('.') >= 0 || num.indexOf('e') >= 0 || num.indexOf('E') >= 0) {
      return Double.parseDouble(num);
    }
    return Long.parseLong(num);
  }

  private Boolean bool() {
    if (peek() == 't') {
      expect("true");
      return Boolean.TRUE;
    }
    expect("false");
    return Boolean.FALSE;
  }

  private void expect(String word) {
    if (!s.startsWith(word, i)) {
      throw new IllegalArgumentException("expected '" + word + "'");
    }
    i += word.length();
  }

  private void ws() {
    while (i < s.length() && Character.isWhitespace(s.charAt(i))) {
      i++;
    }
  }

  private char peek() {
    if (i >= s.length()) {
      throw new IllegalArgumentException("unexpected end of JSON");
    }
    return s.charAt(i);
  }

  private char next() {
    return s.charAt(i++);
  }
}
