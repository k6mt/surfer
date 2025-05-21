## Gitlab 소스 클론 이후 빌드 및 배포할 수 있도록 정리한 문서

### 1-1 사용한 JVM, 웹서버, WAS 제품 등의 종류와 설정 값, 버전(IDE 버전 포함)


JVM: OpenJDK 17.0.6

Gradle 8.4

IntelliJ IDEA 2024.3.1.1

React 19

Spring Boot 3.4.4

### 1-2 빌드 시 사용되는 환경 변수 등의 내용 상세 기재

라이브러리를 의존성에 추가하면 기본적인 기능은 별도 설정 없이 바로 사용할 수 있습니다. 대부분의 설정은 기본값이 `true`로 되어 있어 생략 가능합니다.

Gradle:
```groovy
implementation 'com.github.k6mt:surfer:1.0.0'
```

AI 분석 기능을 사용하려면 `application.yml` 파일에 다음 설정을 추가하세요:

```yaml
surfer:
  config:
    ai:
      enabled: true  # AI 기능 활성화
      provider: openai  # openai, anthropic, azure 중 선택
      model-name: gpt-4
      api-endpoint: https://api.openai.com/v1/chat/completions
      api-key: your-api-key-here
      temperature: 0.7
      max-tokens: 1000
```

### 1-3 배포시 특이사항 
X
### 1-4 DB 접속 정보 등 프로젝트(ERD)에 활용되는 주요 계정 및 프로퍼티가 정의된 파일 목록
X
## 프로젝트에서 사용하는 외부 서비스 정보를 정리한 문서
X

##DB 덤프 파일 최신본
X
