# Surfer

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green.svg)
![Java](https://img.shields.io/badge/Java-17+-orange.svg)

**Surfer**는 Spring Boot 애플리케이션용 경량 모니터링, 분석 및 디버깅 도구입니다. 별도의 에이전트 설치 없이 메서드 흐름, API 구조, 에러 분석, 부하 테스트를 수행할 수 있습니다.

## 주요 기능

- **메서드 흐름 분석**: 메서드 실행 경로, 호출 시간, 파라미터, 반환값을 추적하고 분석합니다.
- **AI 기반 코드 분석**: OpenAI, Anthropic, Azure OpenAI와 연동하여 코드와 에러에 대한 지능형 분석을 제공합니다.
- **API 스캐닝**: Spring 애플리케이션의 API 엔드포인트를 자동으로 스캔하고 문서화합니다.
- **부하 테스트**: 내장된 부하 테스트 도구로 API 성능을 평가합니다.
- **에러 분석**: 발생한 예외를 캡처하고 소스 코드와 함께 분석합니다.
- **웹 인터페이스**: 모든 기능을 웹 UI로 편리하게 사용할 수 있습니다.

## 시작하기

### 의존성 추가

Maven:

```xml
<dependency>
    <groupId>io.github.k6mt</groupId>
    <artifactId>surfer</artifactId>
    <version>1.0.2</version>
</dependency>
```

Gradle:

```groovy
implementation 'io.github.k6mt:surfer:1.0.2'
```

### 기본 설정

라이브러리를 의존성에 추가하면 기본적인 기능은 별도 설정 없이 바로 사용할 수 있습니다. 대부분의 설정은 기본값이 `true`로 되어 있어 생략 가능합니다.

AI 분석 기능을 사용하려면 `application.yml` 파일에 다음 설정을 추가하세요:

```yaml
surfer:
  config:
    ai:
      enabled: true # AI 기능 활성화
      provider: openai # openai, anthropic, azure 중 선택
      model-name: gpt-4
      api-endpoint: https://api.openai.com/v1/chat/completions
      api-key: your-api-key-here
      temperature: 0.7
      max-tokens: 1000
```

## 사용 방법

### 메서드 트레이싱

1. HTTP 요청 헤더에 `X-Surfer-Header: [고유ID]` 값을 추가합니다.
2. 해당 요청을 처리하는 메서드 실행 경로가 자동으로 추적됩니다.
3. 추적 데이터는 `/trace` 엔드포인트에서 확인할 수 있습니다.

```bash
curl -H "X-Surfer-Header: trace-123" http://localhost:8080/your-api-endpoint
curl -H "X-Surfer-Header: trace-123" http://localhost:8080/trace?url=/your-api-endpoint&method=GET
```

### API 스캐닝

애플리케이션의 모든 REST API 엔드포인트를 스캔하고 문서화합니다:

```bash
curl http://localhost:8080/scan/list
```

특정 API에 대한 자세한 정보 확인:

```bash
curl "http://localhost:8080/scan?methodType=GET&encodeUrl=your-encoded-api-path"
```

### 메서드 분석

추적된 메서드에 대한 AI 기반 분석:

```bash
curl -H "X-Surfer-Header: trace-123" http://localhost:8080/method-analysis
```

### 에러 분석

발생한 에러에 대한 정보 및 AI 분석:

```bash
curl -H "X-Surfer-Header: error-123" http://localhost:8080/errors
curl -H "X-Surfer-Header: error-123" http://localhost:8080/errors/analysis
```

### 부하 테스트

지정된 API에 대한 부하 테스트 실행:

```bash
curl -X POST "http://localhost:8080/load/start?testId=test-1&url=/your-api&method=GET&threadCount=10&requestPerSecond=50&durationSeconds=30"
```

테스트 중지:

```bash
curl -X POST "http://localhost:8080/load/stop?testId=test-1"
```

메트릭 확인:

```bash
curl "http://localhost:8080/load/metrics?testId=test-1"
```

## 웹 인터페이스

모든 기능은 웹 인터페이스에서도 사용할 수 있습니다:

```
http://localhost:8080/k6mt-surfer
```

## AI 제공자 설정

Surfer는 다양한 AI 제공자를 지원합니다:

### OpenAI

```yaml
surfer:
  config:
    ai:
      enabled: true
      provider: openai
      model-name: gpt-4
      api-endpoint: https://api.openai.com/v1/chat/completions
      api-key: your-openai-api-key
```

### Anthropic

```yaml
surfer:
  config:
    ai:
      enabled: true
      provider: anthropic
      model-name: claude-3-opus-20240229
      api-endpoint: https://api.anthropic.com/v1/complete
      api-key: your-anthropic-api-key
```

### Azure OpenAI

```yaml
surfer:
  config:
    ai:
      enabled: true
      provider: azure
      model-name: your-deployment-name
      api-endpoint: https://your-resource-name.openai.azure.com/openai/deployments/your-deployment-name/chat/completions?api-version=2023-05-15
      api-key: your-azure-api-key
```

## 디렉토리 구조

Surfer는 데이터를 다음 위치에 저장합니다:

```
~/.surfer/
  ├── api_history/       # API 호출 기록
  └── load_test_history/ # 부하 테스트 결과
```

기본 경로는 `surfer.config.home-path` 설정으로 변경할 수 있습니다.
