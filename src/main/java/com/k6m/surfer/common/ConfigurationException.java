package com.k6m.surfer.common;

/**
 * Configuration Exception
 */
public class ConfigurationException extends SurferRuntimeException{

  public ConfigurationException(String message, Throwable t) {
    super(message, t);
  }
}
