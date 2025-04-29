package com.k6m.surfer;

import static com.k6m.surfer.util.Preconditions.checkNotNull;

import com.k6m.surfer.common.ConfigurationException;
import java.io.File;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Home {

  private static final Logger LOGGER = (Logger) LoggerFactory.getLogger(Home.class);
  private static final String PATH_API_HISTORY = "api_history";
  private static final String PATH_LOAD_TEST_HISTORY = "load_test_history";
  private final File directory;

  /**
   * Constructor.
   *
   * @param directory home directory
   */
  public Home(File directory) {
    this(directory, true);
  }

  /**
   * Constructor.
   *
   * @param directory home directory ${SURFER_HOME}
   * @param create    create the directory if not exists
   */
  public Home(File directory, boolean create) {
    checkNotNull(directory, "directory should not be null");

    if (create) {
      if (directory.mkdir()) {
        LOGGER.info("{} is created", directory.getPath());
      }
    }

    if (directory.exists() && !directory.canWrite()) {
      throw new ConfigurationException(
          String.format("surfer request history directory %s is not writable", directory), null);
    }

    this.directory = directory;
  }

  public void init() {
    makeSubPath(PATH_API_HISTORY);
    makeSubPath(PATH_LOAD_TEST_HISTORY);
  }

  public void makeSubPath(String subPathName) {
    mkDir(new File(directory, subPathName));
  }

  private File mkDir(File file) {
    if (file.mkdirs()) {
      LOGGER.info("{} is created", file.getPath());
    }
    return file;
  }

  /**
   * Get the api_history directory.
   *
   * @return api_history directory.
   */
  public File getAPIHistoryDirectory() {
    return getSubFile(PATH_API_HISTORY);
  }

  /**
   * Get the load_test_history directory.
   *
   * @return load_test_history directory.
   */
  public File getLoadTestHistoryDirectory() {
    return getSubFile(PATH_LOAD_TEST_HISTORY);
  }


  /**
   * Get the sub {@link File} instance under the home directory.
   *
   * @param subPathName subpath name
   * @return {@link File}
   */
  public File getSubFile(String subPathName) {
    return new File(directory, subPathName);
  }

}
