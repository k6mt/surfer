package com.github.k6mt.surfer.logger;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Provide core logger which is always visible by LOGGER. Even verbose mode is off, LOG reported by
 * this Logger is always shown in log file.
 * <p>
 * This logger is subject to used to report the major execution steps of each perftest.
 */
public class CoreLogger {

  /**
   * Core logger
   */
  public static final Logger LOGGER = LoggerFactory.getLogger(CoreLogger.class);
}
