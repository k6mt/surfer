package com.github.k6mt.surfer.util;


import org.springframework.lang.Nullable;

/**
 * Simple static methods to be called at the start of your own methods to verify correct arguments
 * and state.
 */
public final class Preconditions {

  private Preconditions() {

  }

  /**
   * Ensures that an object reference passed as a parameter to the calling method is not null.
   *
   * @param <T>          type
   * @param reference    an object reference
   * @param errorMessage the exception message to use if the check fails; will be converted to a
   *                     string using {@link String#valueOf(Object)}
   * @return the non-null reference that was validated
   */
  public static <T> T checkNotNull(T reference, @Nullable Object errorMessage) {
    if (reference == null) {
      throw new IllegalArgumentException(String.valueOf(errorMessage));
    }
    return reference;
  }
}
