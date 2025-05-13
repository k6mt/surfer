package com.k6m.surfer.config;

import com.k6m.surfer.apiscan.controller.ApiScanController;
import com.k6m.surfer.apiscan.core.SurferApiAnalyzer;
import com.k6m.surfer.apiscan.core.SurferApiScanner;
import com.k6m.surfer.error.controller.ErrorController;
import com.k6m.surfer.error.core.AIClient;
import com.k6m.surfer.error.core.AnthropicClient;
import com.k6m.surfer.error.core.AzureOpenAIClient;
import com.k6m.surfer.error.core.DefaultAIClient;
import com.k6m.surfer.error.core.ErrorAnalysisService;
import com.k6m.surfer.error.core.OpenAIClient;
import com.k6m.surfer.error.repository.ErrorRepository;
import com.k6m.surfer.error.repository.MemoryErrorRepository;
import com.k6m.surfer.loadtest.controller.LoadTestController;
import com.k6m.surfer.loadtest.core.LoadGenerator;
import com.k6m.surfer.methodtrace.SurferMethodInterceptor;
import com.k6m.surfer.methodtrace.Tracer;
import com.k6m.surfer.methodtrace.controller.TraceController;
import com.k6m.surfer.system.controller.SystemController;
import com.k6m.surfer.util.CsvConverter;
import com.k6m.surfer.error.core.ErrorSourceCapture;
import org.springframework.aop.Advisor;
import org.springframework.aop.aspectj.AspectJExpressionPointcut;
import org.springframework.aop.support.DefaultPointcutAdvisor;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@AutoConfiguration
@EnableConfigurationProperties(ConfigProperties.class)
public class SurferAutoConfiguration {

    @Bean
    LoadGenerator loadGenerator() {
        return new LoadGenerator();
    }

    @Bean
    public CsvConverter csvConverter() {
        return new CsvConverter();
    }

    @Bean
    public HomeConfig config(ConfigProperties configProperties) {
        return new HomeConfig(configProperties);
    }

    @Bean
    LoadTestController loadTestController(CsvConverter csvConverter, HomeConfig homeConfig) {
        return new LoadTestController(loadGenerator(), csvConverter, homeConfig);
    }

    @Bean
    SurferApiScanner surferApiScanner() {
        return new SurferApiScanner(detectMainPackage());
    }

    @Bean
    SurferApiAnalyzer surferApiAnalyzer(SurferApiScanner surferApiScanner) {
        return new SurferApiAnalyzer(surferApiScanner);
    }

    @Bean
    ApiScanController apiScanController(SurferApiScanner surferApiScanner,
                                        SurferApiAnalyzer surferApiAnalyzer) {
        return new ApiScanController(surferApiScanner, surferApiAnalyzer);
    }

    @Bean
    public ErrorController errorController(ErrorRepository errorRepository,ErrorAnalysisService service) {
        return new ErrorController(errorRepository, service);
    }

    @Bean
    public ErrorSourceCapture errorSourceReader() {
        String basePackage = detectMainPackage();
        return new ErrorSourceCapture(basePackage);
    }

    @Bean
    public ErrorRepository errorRepository() {
        return new MemoryErrorRepository();
    }
    @Bean
    public AIClient aiClient(ConfigProperties configProperties, RestTemplate restTemplate) {
        String provider = configProperties.getAi().getProvider().toLowerCase();

      return switch (provider) {
        case "openai" -> new OpenAIClient(restTemplate, configProperties);
        case "anthropic" -> new AnthropicClient(restTemplate, configProperties);
        case "azure" -> new AzureOpenAIClient(restTemplate, configProperties);
        default -> new DefaultAIClient();
      };
    }

    @Bean
    public Advisor traceAdvisor(Tracer tracer, ErrorSourceCapture errorSourceCapture, ErrorRepository errorRepository) {
        AspectJExpressionPointcut pointcut = new AspectJExpressionPointcut();
        String basePackage = detectMainPackage();

        String expression = basePackage.isBlank()
                ? "execution(public * *(..))"
                : String.format("execution(public * %s..*(..))", basePackage);

        pointcut.setExpression(expression);

        return new DefaultPointcutAdvisor(pointcut, new SurferMethodInterceptor(basePackage, tracer,
            errorSourceCapture,errorRepository));
    }

    @Bean
    public Tracer tracer() {
        return new Tracer();
    }

    private String detectMainPackage() {
        for (StackTraceElement element : Thread.currentThread().getStackTrace()) {
            if (element.getMethodName().equals("main")) {
                String className = element.getClassName();
                int lastDot = className.lastIndexOf('.');
                return lastDot > 0 ? className.substring(0, lastDot) : "";
            }
        }
        return "";
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }


    @Bean
    public ErrorAnalysisService errorAnalysisService(AIClient aiClient) {
        return new ErrorAnalysisService(aiClient);
    }

    @Bean
    public TraceController traceController(Tracer tracer, HomeConfig homeConfig,
                                           CsvConverter csvConverter) {
        return new TraceController(tracer, homeConfig, csvConverter);
    }

    @Bean
    public SystemController systemController() {
        return new SystemController();
    }
}
