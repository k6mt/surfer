package com.k6m.surfer.util;

import com.opencsv.bean.AbstractBeanField;
import com.opencsv.exceptions.CsvConstraintViolationException;
import com.opencsv.exceptions.CsvDataTypeMismatchException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class LocalDateTimeConverter extends AbstractBeanField {

  private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

  @Override
  protected LocalDateTime convert(String s)
      throws CsvDataTypeMismatchException, CsvConstraintViolationException {
    if (s == null || s.trim().isEmpty()) {
      return null;
    }
    try {
      return LocalDateTime.parse(s, FORMATTER);
    } catch (Exception e) {
      throw new CsvDataTypeMismatchException();
    }
  }
}
