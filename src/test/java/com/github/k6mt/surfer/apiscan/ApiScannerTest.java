package com.github.k6mt.surfer.apiscan;

import com.github.k6mt.surfer.apiscan.core.SurferApiScanner;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Method;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

public class ApiScannerTest {

  @DisplayName("Scan only classes annotated with @RestController")
  @Test
  public void shouldScanOnlyRestControllers() {
    //given
    String testPackage = "com.k6m.surfer.apiscan.mock";
    SurferApiScanner surferApiScanner = new SurferApiScanner(testPackage);

    //when
    Map<String, List<Map<String, String>>> apis = surferApiScanner.apiScan();
    Map<String, Method> mappingCache = surferApiScanner.getApiMappingCache();

    //then
    assertThat(apis).isNotEmpty();
    assertThat(apis.keySet()).containsExactlyInAnyOrder("SampleController", "Sample2Controller",
        "HttpMethodController", "PathMergeController");

    List<Map<String, String>> sampleApis = apis.get("SampleController");
    assertThat(sampleApis).extracting(m -> m.get("url") + ":" + m.get("method"))
        .contains("/test/hello:GET", "/test/submit:POST");
    List<Map<String, String>> sample2Apis = apis.get("Sample2Controller");
    assertThat(sample2Apis).extracting(m -> m.get("url") + ":" + m.get("method"))
        .contains("/test2/hello:GET", "/test2/submit:POST");

    /**
     *  All mapped methods must belong to SampleController
     */
    assertThat(mappingCache.values()).allSatisfy(method -> {
      Class<?> declaringClass = method.getDeclaringClass();
      assertThat(declaringClass.getSimpleName()).isIn("SampleController", "Sample2Controller",
          "HttpMethodController", "PathMergeController");
    });
  }

  @DisplayName("Detect HTTP method annotations correctly")
  @Test
  void shouldParseHttpMethodCorrectly() {
    // given
    String testPackage = "com.k6m.surfer.apiscan.mock";
    SurferApiScanner scanner = new SurferApiScanner(testPackage);

    // when
    Map<String, List<Map<String, String>>> apis = scanner.apiScan();

    // then
    assertThat(apis).isNotEmpty();

    List<Map<String, String>> allApis = apis.values().stream()
        .flatMap(List::stream)
        .toList();

    assertThat(allApis).anyMatch(api ->
        api.get("url").equals("/http/get") && api.get("method").equals("GET"));
    assertThat(allApis).anyMatch(api ->
        api.get("url").equals("/http/post") && api.get("method").equals("POST"));
    assertThat(allApis).anyMatch(api ->
        api.get("url").equals("/http/put") && api.get("method").equals("PUT"));
    assertThat(allApis).anyMatch(api ->
        api.get("url").equals("/http/delete") && api.get("method").equals("DELETE"));
    assertThat(allApis).anyMatch(api ->
        api.get("url").equals("/http/request") && api.get("method").equals("PATCH"));
  }

  @DisplayName("Merge class-level and method-level paths correctly")
  @Test
  void shouldMergePathsCorrectly() {
    // given
    String testPackage = "com.k6m.surfer.apiscan.mock";
    SurferApiScanner scanner = new SurferApiScanner(testPackage);

    // when
    Map<String, List<Map<String, String>>> apis = scanner.apiScan();

    // then
    assertThat(apis).isNotEmpty();

    List<Map<String, String>> allApis = apis.values().stream()
        .flatMap(List::stream)
        .toList();

    assertThat(allApis).anyMatch(api ->
        api.get("url").equals("/base/one") && api.get("method").equals("GET"));
    assertThat(allApis).anyMatch(api ->
        api.get("url").equals("/base/two") && api.get("method").equals("POST"));
  }

  @DisplayName("Build API mapping cache accurately")
  @Test
  public void shouldPopulateMappingCache() {
    // given
    String testPackage = "com.k6m.surfer.apiscan.mock";
    SurferApiScanner scanner = new SurferApiScanner(testPackage);

    // when
    scanner.apiScan();
    Map<String, Method> mappingCache = scanner.getApiMappingCache();

    // then
    assertThat(mappingCache).isNotEmpty();

    assertThat(mappingCache).containsKeys(
        "GET:/test/hello",
        "POST:/test/submit",
        "GET:/http/get",
        "PATCH:/http/request",
        "POST:/base/two"
    );

    Method helloMethod = mappingCache.get("GET:/test/hello");
    assertThat(helloMethod).isNotNull();
    assertThat(helloMethod.getName()).isEqualTo("hello");
    assertThat(helloMethod.getDeclaringClass().getSimpleName()).isEqualTo("SampleController");
  }

}
