package com.github.k6mt.surfer.common;

/**
 * SurferRuntimeException. This is for translating a general exception to {@link RuntimeException}
 */
public class SurferRuntimeException extends RuntimeException {

  private boolean sanitized = false;

  /**
   * Constructor.
   *
   * @param message message
   */
  public SurferRuntimeException(String message) {
    super(message);
  }

  /**
   * Constructor.
   *
   * @param message message
   * @param t       root cause
   */
  public SurferRuntimeException(String message, Throwable t) {
    this(message, t, false);
  }

  /**
   * Constructor.
   *
   * @param message   message
   * @param t         root cause
   * @param sanitized sanitized
   */
  public SurferRuntimeException(String message, Throwable t, boolean sanitized) {
    super(message, t);
    this.sanitized = sanitized;
  }

  public boolean isSanitized() {
    return sanitized;
  }
}
