package com.github.k6mt.surfer.common;

/**
 * Configuration Exception
 */
public class ConfigurationException extends SurferRuntimeException {

  public ConfigurationException(String message, Throwable t) {
    super(message, t);
  }
}
