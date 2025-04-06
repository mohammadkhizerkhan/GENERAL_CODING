I'll expand on the core concepts of Spring Boot with detailed explanations and code examples.



# Spring Boot Core Concepts

## 1. The @SpringBootApplication Annotation

The `@SpringBootApplication` annotation is the starting point of any Spring Boot application. It combines three annotations:

- `@Configuration`: Marks the class as a source of bean definitions
- `@EnableAutoConfiguration`: Tells Spring Boot to start adding beans based on classpath settings
- `@ComponentScan`: Tells Spring to look for components in the current package and sub-packages

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
```

## 2. Inversion of Control (IoC) Container

The IoC container is the core of Spring Framework. It manages the lifecycle of objects, called beans, and injects dependencies.

### How IoC Works:

1. Spring creates and maintains an "Application Context" (the IoC container)
2. The container creates objects, wires them together, configures them, and manages their complete lifecycle
3. You get objects from the container, fully initialized with their dependencies

```java
// Getting beans from IoC container
ApplicationContext context = SpringApplication.run(MyApplication.class, args);
MyService service = context.getBean(MyService.class);
```

## 3. Beans

Beans are the objects that form the backbone of your application and are managed by the Spring IoC container.

### Ways to Define Beans:

#### 1. Using @Component Annotation

```java
@Component
public class UserService {
    // This class is now a Spring bean
    public void processUser() {
        // ...
    }
}
```

#### 2. Using @Bean in Configuration Classes

```java
@Configuration
public class AppConfig {
    @Bean
    public PaymentService paymentService() {
        return new PaymentServiceImpl();
    }
}
```

### Bean Scopes

- `@Scope("singleton")`: Default scope, one instance per Spring container
- `@Scope("prototype")`: New instance each time it's requested
- `@Scope("request")`: New instance per HTTP request (web apps)
- `@Scope("session")`: New instance per HTTP session (web apps)

```java
@Component
@Scope("prototype")
public class PrototypeBean {
    // A new instance will be created each time this bean is requested
}
```

## 4. Dependency Injection (DI)

Dependency Injection is a pattern where objects receive other objects they depend on, rather than creating them internally.

### Types of Dependency Injection:

#### 1. Constructor Injection (Recommended)

```java
@Service
public class UserService {
    private final UserRepository userRepository;
    
    // Dependencies are injected through the constructor
    @Autowired // Optional in newer Spring versions
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
```

#### 2. Setter Injection

```java
@Service
public class OrderService {
    private PaymentService paymentService;
    
    @Autowired
    public void setPaymentService(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
}
```

#### 3. Field Injection (Not Recommended)

```java
@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository; // Direct field injection
}
```

### Using @Qualifier for Multiple Implementations

```java
@Service
public class NotificationService {
    private final MessageSender messageSender;
    
    @Autowired
    public NotificationService(@Qualifier("emailSender") MessageSender messageSender) {
        this.messageSender = messageSender;
    }
}

@Component("emailSender")
public class EmailSender implements MessageSender {
    // Implementation
}

@Component("smsSender")
public class SmsSender implements MessageSender {
    // Implementation
}
```

## 5. Stereotypes and Component Scanning

Spring provides specialized annotations for different types of components:

- `@Component`: Generic component
- `@Repository`: Data access components
- `@Service`: Business logic components
- `@Controller` & `@RestController`: Web components
- `@Configuration`: Configuration components

```java
@Repository
public class JpaUserRepository implements UserRepository {
    // Repository implementation
}

@Service
public class UserServiceImpl implements UserService {
    // Service implementation
}

@RestController
public class UserController {
    // REST controller implementation
}
```

## 6. Spring Boot Auto-Configuration

Auto-configuration automatically configures your Spring application based on the dependencies in your classpath.

### How to Customize Auto-Configuration:

#### Excluding Auto-Configuration Classes

```java
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class MyApplication {
    // ...
}
```

#### Using Properties

```properties
# application.properties
spring.datasource.url=jdbc:mysql://localhost/test
spring.datasource.username=dbuser
spring.datasource.password=dbpass
```

#### Custom Configuration Classes

```java
@Configuration
public class DatabaseConfig {
    @Bean
    @ConditionalOnMissingBean
    public DataSource dataSource() {
        // Custom DataSource configuration
        return new CustomDataSource();
    }
}
```

## 7. Profiles

Profiles allow you to define different sets of beans for different environments.

```java
@Configuration
@Profile("development")
public class DevConfig {
    @Bean
    public DataSource dataSource() {
        return new EmbeddedDatabaseBuilder()
            .setType(EmbeddedDatabaseType.H2)
            .build();
    }
}

@Configuration
@Profile("production")
public class ProdConfig {
    @Bean
    public DataSource dataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setUrl("jdbc:mysql://prod-server:3306/mydb");
        // Additional configuration
        return dataSource;
    }
}
```

Activating profiles:

```properties
# application.properties
spring.profiles.active=development
```

## 8. Properties and Configuration

Spring Boot offers multiple ways to externalize configuration:

### Using application.properties/application.yml

```properties
# application.properties
server.port=8080
app.name=My Spring Application
app.description=A sample Spring Boot application
```

```yaml
# application.yml
server:
  port: 8080
app:
  name: My Spring Application
  description: A sample Spring Boot application
```

### @Value Annotation

```java
@Service
public class WelcomeService {
    @Value("${app.name}")
    private String appName;
    
    public String getWelcomeMessage() {
        return "Welcome to " + appName;
    }
}
```

### @ConfigurationProperties

```java
@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private String name;
    private String description;
    
    // Getters and setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
}
```

## 9. Spring Boot Actuator

Actuator provides production-ready features for monitoring and managing your application.

### Common Actuator Endpoints:

- `/actuator/health`: Health information
- `/actuator/info`: Application information
- `/actuator/metrics`: Metrics information
- `/actuator/env`: Environment properties
- `/actuator/loggers`: Logger configuration
- `/actuator/mappings`: Request mapping information

### Configuration in application.properties:

```properties
# Enable all actuator endpoints
management.endpoints.web.exposure.include=*

# Customize health endpoint
management.endpoint.health.show-details=always

# Add custom info
info.app.name=@project.name@
info.app.description=@project.description@
info.app.version=@project.version@
```

### Creating Custom Actuator Endpoints:

```java
@Component
@Endpoint(id = "customInfo")
public class CustomInfoEndpoint {
    @ReadOperation
    public Map<String, Object> info() {
        Map<String, Object> info = new HashMap<>();
        info.put("serverTime", new Date());
        info.put("serverStatus", "UP");
        return info;
    }
}
```

## 10. Exception Handling

Spring Boot provides elegant ways to handle exceptions.

### @ControllerAdvice and @ExceptionHandler

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleResourceNotFoundException(ResourceNotFoundException ex) {
        return new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            LocalDateTime.now()
        );
    }
    
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleGenericException(Exception ex) {
        return new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "An unexpected error occurred",
            LocalDateTime.now()
        );
    }
}

// Error response class
public class ErrorResponse {
    private int status;
    private String message;
    private LocalDateTime timestamp;
    
    // Constructor, getters, setters
}
```

## 11. Spring Boot Data Access

Spring Boot simplifies data access with Spring Data JPA.

### Entity Class

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String username;
    
    @Column(nullable = false)
    private String email;
    
    // Getters and setters
}
```

### Repository Interface

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Spring Data JPA automatically implements these methods
    Optional<User> findByUsername(String username);
    List<User> findByEmailContaining(String emailPart);
    
    // Custom query using @Query
    @Query("SELECT u FROM User u WHERE u.email LIKE %:domain%")
    List<User> findByEmailDomain(@Param("domain") String domain);
}
```

### Service Layer

```java
@Service
@Transactional
public class UserService {
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public User createUser(User user) {
        // Business logic
        return userRepository.save(user);
    }
    
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }
    
    public User findById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
}
```

## 12. Spring Boot Testing

Spring Boot provides excellent support for testing.

### Unit Test Example

```java
@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private UserService userService;
    
    @Test
    public void testFindById_whenUserExists_thenReturnUser() {
        // Arrange
        Long userId = 1L;
        User expectedUser = new User();
        expectedUser.setId(userId);
        expectedUser.setUsername("testuser");
        
        when(userRepository.findById(userId)).thenReturn(Optional.of(expectedUser));
        
        // Act
        User result = userService.findById(userId);
        
        // Assert
        assertNotNull(result);
        assertEquals(userId, result.getId());
        assertEquals("testuser", result.getUsername());
        
        verify(userRepository).findById(userId);
    }
}
```

### Integration Test Example

```java
@SpringBootTest
public class UserControllerIntegrationTest {
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    public void testGetUserById_whenUserExists_thenStatus200() {
        // Act
        ResponseEntity<User> response = restTemplate.getForEntity("/api/users/1", User.class);
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
    }
}
```

## 13. Spring Boot Security

Spring Boot Security provides authentication and authorization features.

### Basic Security Configuration

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .permitAll()
            )
            .logout(logout -> logout
                .permitAll()
            );
        
        return http.build();
    }
    
    @Bean
    public UserDetailsService userDetailsService() {
        UserDetails user = User.withDefaultPasswordEncoder()
            .username("user")
            .password("password")
            .roles("USER")
            .build();
            
        UserDetails admin = User.withDefaultPasswordEncoder()
            .username("admin")
            .password("admin")
            .roles("ADMIN", "USER")
            .build();
            
        return new InMemoryUserDetailsManager(user, admin);
    }
}
```

## 14. Spring Boot Web MVC

Spring Boot MVC follows the Model-View-Controller pattern for web applications.

### Controller Example

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAllUsers();
    }
    
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.findById(id);
    }
    
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public User createUser(@RequestBody @Valid User user) {
        return userService.createUser(user);
    }
    
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody @Valid User user) {
        return userService.updateUser(id, user);
    }
    
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
```

## 15. Embedded Server and Deployment

Spring Boot comes with an embedded server (Tomcat by default) for easy deployment.

### Changing the Embedded Server

```xml
<!-- In pom.xml -->
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <exclusions>
            <exclusion>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-tomcat</artifactId>
            </exclusion>
        </exclusions>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-jetty</artifactId>
    </dependency>
</dependencies>
```

### Creating an Executable JAR

```bash
# Using Maven
mvn package

# Using Gradle
gradle build

# Run the JAR
java -jar target/myapplication-0.0.1-SNAPSHOT.jar
```

### Custom Server Configuration

```properties
# application.properties
server.port=8888
server.servlet.context-path=/myapp
server.compression.enabled=true
server.tomcat.max-threads=200
```

## 16. Spring Boot Caching

Spring Boot provides built-in support for caching.

```java
@Configuration
@EnableCaching
public class CacheConfig {
    @Bean
    public CacheManager cacheManager() {
        SimpleCacheManager cacheManager = new SimpleCacheManager();
        cacheManager.setCaches(Arrays.asList(
            new ConcurrentMapCache("users"),
            new ConcurrentMapCache("roles")
        ));
        return cacheManager;
    }
}

@Service
public class CachedUserService {
    private final UserRepository userRepository;
    
    public CachedUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @Cacheable("users")
    public User findById(Long id) {
        // This will be cached after first call
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
    
    @CacheEvict("users")
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
```


I've created a comprehensive guide covering the core concepts of Spring Boot with detailed explanations and code examples. Here's what's included:

1. **@SpringBootApplication Annotation**: The main entry point annotation and what it combines.

2. **Inversion of Control (IoC)**: How the IoC container works as the foundation of Spring.

3. **Beans**: Different ways to define beans, bean scopes, and lifecycle management.

4. **Dependency Injection**: The three types (constructor, setter, field) with examples, and using @Qualifier.

5. **Stereotypes and Component Scanning**: How @Component, @Service, @Repository, @Controller annotations work.

6. **Auto-Configuration**: How Spring Boot automatically configures your application and ways to customize it.

7. **Profiles**: Setting up different configurations for different environments.

8. **Properties and Configuration**: Using application.properties/yml, @Value, and @ConfigurationProperties.

9. **Actuator**: Monitoring and managing your application with built-in endpoints and creating custom ones.

10. **Exception Handling**: Global exception handling with @ControllerAdvice.

11. **Data Access**: Using Spring Data JPA for database operations.

12. **Testing**: Unit and integration testing in Spring Boot applications.

13. **Security**: Configuring authentication and authorization.

14. **Web MVC**: Building RESTful APIs with controllers.

15. **Embedded Server and Deployment**: Server configuration and application packaging.

16. **Caching**: Implementing caching in Spring Boot applications.

Each section includes relevant code examples to illustrate how these concepts are implemented in practice. Is there a specific area you'd like me to explore in more detail?