package dev.puid;

/**
 * Today's usage and remaining daily quota. {@code limit}/{@code remaining} are null when unlimited.
 */
public final class Quota {

  private final String plan;
  private final long used;
  private final Long limit;
  private final Long remaining;

  Quota(String plan, long used, Long limit, Long remaining) {
    this.plan = plan;
    this.used = used;
    this.limit = limit;
    this.remaining = remaining;
  }

  public String getPlan() {
    return plan;
  }

  public long getUsed() {
    return used;
  }

  public Long getLimit() {
    return limit;
  }

  public Long getRemaining() {
    return remaining;
  }
}
