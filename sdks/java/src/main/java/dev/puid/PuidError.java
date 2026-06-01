package dev.puid;

/**
 * Thrown for any non-2xx API response and for client-side validation.
 *
 * <p>{@link #status()} is the HTTP status, or {@code null} for client-side / transport errors.
 * {@link #code()} is the API's machine-readable error code (e.g. {@code "rate_limited"}, {@code
 * "quota_exceeded"}, {@code "network_error"}), or {@code null}.
 */
public final class PuidError extends RuntimeException {

  private final Integer status;
  private final String code;

  public PuidError(String message, Integer status, String code) {
    super(message);
    this.status = status;
    this.code = code;
  }

  public PuidError(String message) {
    this(message, null, null);
  }

  /** HTTP status, or {@code null} for client-side / transport errors. */
  public Integer status() {
    return status;
  }

  /** Machine-readable error code, or {@code null}. */
  public String code() {
    return code;
  }
}
