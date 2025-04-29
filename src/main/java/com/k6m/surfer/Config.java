package com.k6m.surfer;


import com.k6m.surfer.logger.CoreLogger;
import jakarta.annotation.PostConstruct;
import java.io.File;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.apache.commons.lang3.StringUtils;

public class Config {

  private static final String SURFER_DEFAULT_FOLDER = ".surfer";
  private static final Logger LOG = LoggerFactory.getLogger(Config.class);
  private Home home;

  /**
   * Make it singleton
   */
  Config() {

  }

  /**
   * Initialize the {@link Config} object
   */
  @PostConstruct
  public void init() {
    Home home = resolveHome();
    home.init();
    this.home = home;
  }

  protected Home resolveHome() {
    File homeDirectory = new File(getUserHome());
    return new Home(homeDirectory);
  }

  public static String getUserHome() {
    String userHomeFromEnv = System.getenv("SURFER_HOME");
    String userHomeFromProperty = System.getProperty("surfer.home");

    if (!StringUtils.equals(userHomeFromEnv, userHomeFromProperty)) {
      CoreLogger.LOGGER.warn("The path to ngrinder-home is ambiguous:");
      CoreLogger.LOGGER.warn("    System Environment:  SURFER_HOME={}", userHomeFromEnv);
      CoreLogger.LOGGER.warn("    Java System Property:  surfer.home={}", userHomeFromProperty);
      CoreLogger.LOGGER.warn("    '{}' is accepted.", userHomeFromProperty);
    }

    String userHome = StringUtils.defaultIfEmpty(userHomeFromProperty, userHomeFromEnv);

    if (StringUtils.isEmpty(userHome)) {
      userHome = System.getProperty("user.home") + File.separator + SURFER_DEFAULT_FOLDER;
    } else if (StringUtils.startsWith(userHome, "~" + File.separator)) {
      userHome = System.getProperty("user.home") + File.separator + userHome.substring(2);
    } else if (StringUtils.startsWith(userHome, "." + File.separator)) {
      userHome = System.getProperty("user.dir") + File.separator + userHome.substring(2);
    }
    return FilenameUtils.normalize(userHome);
  }

  /**
   * Get the resolved home folder.
   *
   * @return home
   */
  public Home getHome() {
    return home;
  }

}
