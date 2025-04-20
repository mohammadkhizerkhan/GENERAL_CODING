# Spring Boot Profiles: A Deep Dive

## Understanding Spring Profiles

Spring Profiles provide a way to segregate parts of your application configuration and make it available only in specific environments. This is crucial for managing different settings across development, testing, staging, and production environments.

## Profile-Specific Configuration Files

Spring Boot automatically loads properties from `application-{profile}.properties` or `application-{profile}.yml` based on the active profiles.

### Basic Structure

A typical project might have:

```
src/
  main/
    resources/
      application.yml                 # Default properties for all environments
      application-dev.yml             # Development-specific properties
      application-test.yml            # Testing-specific properties
      application-staging.yml         # Staging-specific properties
      application-prod.yml            # Production-specific properties
```

### Example Configuration Files

#### application.yml (Default)
```yaml
spring:
  application:
    name: my-application

# Common settings for all environments
logging:
  level:
    root: INFO

# These properties can be overridden in profile-specific files
```

#### application-dev.yml
```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:h2:mem:testdb
    username: sa
    password: 
  jpa:
    show-sql: true

logging:
  level:
    com.myapp: DEBUG
```

#### application-prod.yml
```yaml
server:
  port: 80

spring:
  datasource:
    url: jdbc:mysql://production-db:3306/myapp
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  jpa:
    show-sql: false

logging:
  level:
    com.myapp: WARN
```

## Activating Profiles

There are multiple ways to activate a specific profile:

### 1. In application.yml/properties

You can set the default active profile in the default configuration file:

```yaml
# In application.yml
spring:
  profiles:
    active: dev
```

```properties
# In application.properties
spring.profiles.active=dev
```

### 2. Command Line Arguments

You can override the active profile when running the application:

```bash
# Running with Maven
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Running a JAR file
java -jar myapp.jar --spring.profiles.active=prod

# Multiple profiles
java -jar myapp.jar --spring.profiles.active=prod,metrics
```

### 3. Environment Variables

Set the profiles before running the application:

```bash
# Unix/Linux/macOS
export SPRING_PROFILES_ACTIVE=prod
java -jar myapp.jar

# Windows
set SPRING_PROFILES_ACTIVE=prod
java -jar myapp.jar

# Docker
docker run -e "SPRING_PROFILES_ACTIVE=prod" myapp
```

### 4. JVM System Properties

```bash
java -Dspring.profiles.active=prod -jar myapp.jar
```

### 5. Programmatically

```java
SpringApplication app = new SpringApplication(MyApplication.class);
app.setAdditionalProfiles("prod");
app.run(args);
```

## Building for Different Environments

### Using Maven

#### Profile-Based Build

Define profiles in your `pom.xml`:

```xml
<project>
    <!-- ... -->
    <profiles>
        <profile>
            <id>dev</id>
            <activation>
                <activeByDefault>true</activeByDefault>
            </activation>
            <properties>
                <spring.profiles.active>dev</spring.profiles.active>
            </properties>
        </profile>
        <profile>
            <id>prod</id>
            <properties>
                <spring.profiles.active>prod</spring.profiles.active>
            </properties>
        </profile>
    </profiles>

    <build>
        <resources>
            <resource>
                <directory>src/main/resources</directory>
                <filtering>true</filtering>
            </resource>
        </resources>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
    <!-- ... -->
</project>
```

Then, in your `application.yml`:

```yaml
spring:
  profiles:
    active: @spring.profiles.active@
```

Build with a specific profile:

```bash
mvn clean package -Pprod
```

This creates a JAR file with the production profile pre-configured. However, you can still override it at runtime.

### Using Gradle

Define profiles in your `build.gradle`:

```groovy
bootRun {
    systemProperty 'spring.profiles.active', System.getProperty('spring.profiles.active', 'dev')
}

processResources {
    filesMatching('application.yml') {
        filter {
            it.replace('@spring.profiles.active@', System.getProperty('spring.profiles.active', 'dev'))
        }
    }
}
```

Build with a specific profile:

```bash
./gradlew clean build -Dspring.profiles.active=prod
```

## Deployment Scenarios and Best Practices

### 1. Cloud Deployment (e.g., Kubernetes)

Use environment variables or config maps to set the active profile:

```yaml
# Kubernetes deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  template:
    spec:
      containers:
      - name: myapp
        image: myapp:latest
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "prod"
```

### 2. Server Deployment (e.g., Tomcat)

When deploying to an application server:

```bash
# Set environment variable before starting Tomcat
export SPRING_PROFILES_ACTIVE=prod
./catalina.sh start

# Or in setenv.sh (Tomcat)
echo 'export CATALINA_OPTS="$CATALINA_OPTS -Dspring.profiles.active=prod"' >> $CATALINA_HOME/bin/setenv.sh
```

### 3. Docker Deployment

```bash
# Build Docker image
docker build -t myapp .

# Run with specific profile
docker run -e "SPRING_PROFILES_ACTIVE=prod" myapp
```

### 4. Using Spring Cloud Config Server

For large deployments, consider using Spring Cloud Config Server to manage configurations:

```yaml
spring:
  application:
    name: myapp
  cloud:
    config:
      uri: http://config-server:8888
      label: master
  profiles:
    active: prod
```

Then you don't need to change the JAR file itself when switching environments.

## Profile-Specific Beans

You can also create beans that are only available in specific profiles:

```java
@Configuration
@Profile("dev")
public class DevelopmentConfig {
    @Bean
    public DataSource dataSource() {
        return new EmbeddedDatabaseBuilder()
            .setType(EmbeddedDatabaseType.H2)
            .build();
    }
}

@Configuration
@Profile("prod")
public class ProductionConfig {
    @Bean
    public DataSource dataSource() {
        // Production database configuration
        return new HikariDataSource(/* ... */);
    }
}
```

## Advanced Profile Techniques

### 1. Profile Groups

Spring Boot 2.4+ allows grouping profiles:

```yaml
spring:
  profiles:
    group:
      production: "prod,monitoring,email"
      development: "dev,local"
```

Then you can activate multiple profiles at once:

```bash
java -jar myapp.jar --spring.profiles.active=production
```

### 2. Profile-Specific Includes

Include additional profiles based on active profile:

```yaml
# application-prod.yml
spring:
  config:
    import: classpath:db-config.yml
```

### 3. Different External Configuration Locations

Use profile-specific external configurations:

```bash
java -jar myapp.jar --spring.config.location=file:/etc/myapp/application-prod.yml
```

## Common Profile Commands and Examples

### Running Spring Boot with Maven:

```bash
# Run with development profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Package with production configuration baked in
mvn clean package -Dspring.profiles.active=prod
```

### Running Spring Boot with Gradle:

```bash
# Run with development profile
./gradlew bootRun --args='--spring.profiles.active=dev'

# Build with production profile
./gradlew build -Dspring.profiles.active=prod
```

### Running Packaged Application:

```bash
# Running with a specific profile
java -jar target/myapp-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod

# Running with multiple profiles
java -jar target/myapp-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod,metrics,europe

# Override specific properties
java -jar target/myapp-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod --server.port=8080
```

## Testing with Profiles

```java
@SpringBootTest
@ActiveProfiles("test")
public class MyApplicationTests {
    // Tests will run with the "test" profile active
}
```

## Common Issues and Solutions

### Issue: Properties not being overridden as expected

**Solution**: Check the order of precedence. Command-line arguments override application properties.

### Issue: Profile not activating correctly

**Solution**: Verify spelling and ensure the profile file follows the naming convention `application-{profile}.yml`.

### Issue: Conflicting profiles

**Solution**: Be explicit about which profile should take precedence by listing it last.

```bash
java -jar myapp.jar --spring.profiles.active=base,prod
```

Here, values in `prod` profile will override `base` profile if there are conflicts.

## Security Considerations

1. **Never commit sensitive data**: Use environment variables or external configuration servers for passwords and secrets
2. **Use encrypted properties**: Spring Cloud Config allows property encryption
3. **Separate security configurations** from functional configurations
4. **Review profile-specific settings** carefully before deployment