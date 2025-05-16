package com.github.k6mt.surfer.util;

import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import com.opencsv.bean.StatefulBeanToCsv;
import com.opencsv.bean.StatefulBeanToCsvBuilder;
import com.opencsv.CSVWriter;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

/**
 * Utility class for converting between CSV files and Java objects (POJOs).
 * <p>
 * Provides methods to read CSV files into Java object lists and write Java object lists into CSV
 * files using OpenCSV.
 * </p>
 */
public class CsvConverter {

  /**
   * Reads a CSV file and converts it into a list of Java objects.
   *
   * @param path  the path to the CSV file
   * @param clazz the class type to map the CSV rows to
   * @param <T>   the type of the Java object
   * @return a list of mapped Java objects
   * @throws Exception if an error occurs while reading or parsing the file
   */
  public <T> List<T> readCsv(String path, Class<T> clazz) throws Exception {
    try (Reader reader = Files.newBufferedReader(Path.of(path))) {
      CsvToBean<T> csvToBean = new CsvToBeanBuilder<T>(reader)
          .withType(clazz)
          .build();
      return csvToBean.parse();
    }
  }

  /**
   * Writes a list of Java objects to a CSV file.
   *
   * @param path  the path where the CSV file will be written
   * @param beans the list of Java objects to write
   * @param <T>   the type of the Java object
   * @throws Exception if an error occurs while writing the file
   */
  public <T> void writeCsv(Path path, List<T> beans) throws Exception {
    try (Writer writer = new FileWriter(path.toString(), true)) {
      StatefulBeanToCsv<T> beanToCsv = new StatefulBeanToCsvBuilder<T>(writer)
          .withQuotechar(CSVWriter.NO_QUOTE_CHARACTER)
          .withSeparator(CSVWriter.DEFAULT_SEPARATOR)
          .build();
      beanToCsv.write(beans);
    }
  }
}

