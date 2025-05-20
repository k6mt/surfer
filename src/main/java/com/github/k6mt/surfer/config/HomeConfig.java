package com.github.k6mt.surfer.config;


import com.github.k6mt.surfer.logger.CoreLogger;
import com.github.k6mt.surfer.model.Home;
import jakarta.annotation.PostConstruct;
import java.io.File;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.apache.commons.lang3.StringUtils;

public class HomeConfig {

  private static final String SURFER_DEFAULT_FOLDER = ".surfer";
  private static final Logger LOG = LoggerFactory.getLogger(HomeConfig.class);
  private Home home;
  private final ConfigProperties configProperties;

  public HomeConfig(ConfigProperties configProperties) {
    this.configProperties = configProperties;
  }

  /**
   * Initialize the {@link HomeConfig} object
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

  public String getUserHome() {

    String userHomeFromConfig = configProperties.getHomePath();
    String userHomeFromEnv = System.getenv("SURFER_HOME");
    String userHomeFromProperty = System.getProperty("surfer.home");

    String userHome = StringUtils.firstNonBlank(
        userHomeFromConfig,
        userHomeFromProperty,
        userHomeFromEnv
    );

    if (StringUtils.isEmpty(userHome)) {
      userHome = System.getProperty("user.home") + File.separator + SURFER_DEFAULT_FOLDER;
    } else if (StringUtils.startsWith(userHome, "~" + File.separator)) {
      userHome = System.getProperty("user.home") + File.separator + userHome.substring(2);
    } else if (StringUtils.startsWith(userHome, "." + File.separator)) {
      userHome = System.getProperty("user.dir") + File.separator + userHome.substring(2);
    }

    if (StringUtils.isNoneBlank(userHomeFromConfig, userHomeFromProperty, userHomeFromEnv)) {
      CoreLogger.LOGGER.warn("Multiple home path sources detected:");
      CoreLogger.LOGGER.warn("    Config Property: surfer.config.home-path={}", userHomeFromConfig);
      CoreLogger.LOGGER.warn("    System Property: surfer.home={}", userHomeFromProperty);
      CoreLogger.LOGGER.warn("    Environment: SURFER_HOME={}", userHomeFromEnv);
      CoreLogger.LOGGER.warn("    Selected path: {}", userHome);
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
