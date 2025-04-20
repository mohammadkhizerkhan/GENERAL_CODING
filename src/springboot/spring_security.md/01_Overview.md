# Spring Security Deep Dive

## Introduction to Spring Security

Spring Security is a powerful and highly customizable authentication and access-control framework. It is the de-facto standard for securing Spring-based applications, providing comprehensive security services for Java EE-based enterprise software applications.

## Why Spring Security as a Separate Module?

Spring Security exists as a separate module for several key reasons:

1. **Separation of Concerns**: Keeping security logic separate from business logic promotes cleaner code architecture.

2. **Modularity**: Not all Spring applications need security features. By keeping it separate, developers can include it only when necessary.

3. **Specialized Focus**: Security is a complex domain requiring specialized expertise. A dedicated module allows for focused development and maintenance.

4. **Independent Versioning**: Security vulnerabilities often require immediate patches. A separate module allows for quick updates without affecting the core framework.

5. **Extensibility**: The modular design allows developers to extend or replace security components without modifying the core application.

## Getting Started with Spring Security

### Basic Setup

First, add the Spring Security dependency to your project:

**Maven**:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

**Gradle**:
```groovy
implementation 'org.springframework.boot:spring-boot-starter-security'
```

### Minimal Configuration

By default, Spring Security secures all endpoints with HTTP Basic authentication. Here's a minimal configuration class:

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authorize -> authorize
                .anyRequest().authenticated()
            )
            .httpBasic();
        
        return http.build();
    }
}
```

## Authentication in Spring Security

### Authentication Process

The authentication process in Spring Security typically follows these steps:

1. **Authentication Request**: User submits credentials
2. **Authentication Processing**: Spring Security validates credentials
3. **Success/Failure Handling**: Redirecting or sending appropriate responses
4. **Security Context**: Storing authentication details

### Authentication Manager

The `AuthenticationManager` is the core interface for authentication:

```java
@Configuration
public class SecurityConfig {
    
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}
```

### Custom Authentication Provider

To implement custom authentication logic:

```java
@Component
public class CustomAuthenticationProvider implements AuthenticationProvider {
    
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    
    public CustomAuthenticationProvider(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String username = authentication.getName();
        String password = authentication.getCredentials().toString();
        
        UserDetails user = userDetailsService.loadUserByUsername(username);
        
        if (passwordEncoder.matches(password, user.getPassword())) {
            return new UsernamePasswordAuthenticationToken(
                user, password, user.getAuthorities());
        } else {
            throw new BadCredentialsException("Invalid password");
        }
    }
    
    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
}
```

## Route and Endpoint Security

### Securing Specific Routes

You can secure specific routes using pattern matching:

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(authorize -> authorize
            .requestMatchers("/", "/home", "/public/**").permitAll()
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            .requestMatchers("/api/users/**").hasAnyRole("ADMIN", "USER")
            .requestMatchers(HttpMethod.POST, "/api/data").hasAuthority("WRITE_PRIVILEGE")
            .requestMatchers(HttpMethod.GET, "/api/data").hasAuthority("READ_PRIVILEGE")
            .anyRequest().authenticated()
        );
    
    return http.build();
}
```

### Method-Level Security

You can also secure methods using annotations:

```java
@Configuration
@EnableMethodSecurity
public class MethodSecurityConfig {
    // Configuration for method security
}

@Service
public class UserService {
    
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        // Only accessible to admins
        return userRepository.findAll();
    }
    
    @PreAuthorize("hasRole('ADMIN') or #username == authentication.principal.username")
    public User getUserByUsername(String username) {
        // Accessible to admins or the user themselves
        return userRepository.findByUsername(username);
    }
}
```

## Custom User Details Service

To authenticate against a database, implement the `UserDetailsService` interface:

```java
@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    private final UserRepository userRepository;
    
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        return org.springframework.security.core.userdetails.User
            .withUsername(user.getUsername())
            .password(user.getPassword())
            .roles(user.getRoles().stream().map(Role::getName).toArray(String[]::new))
            .build();
    }
}
```

## The Security Context

### Understanding SecurityContext

The `SecurityContext` holds the current authentication details, including the user's identity and authorities. It's stored in the `SecurityContextHolder`, which uses a thread-local storage mechanism by default.

```java
// Getting the current authenticated user
Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
String currentUsername = authentication.getName();
```

### SecurityContextHolder Strategies

Spring Security provides different strategies for storing the SecurityContext:

1. **MODE_THREADLOCAL** (default): Each thread has its own SecurityContext
2. **MODE_INHERITABLETHREADLOCAL**: Child threads inherit the SecurityContext from parent threads
3. **MODE_GLOBAL**: All threads share the same SecurityContext

```java
@Configuration
public class SecurityConfig {
    
    @PostConstruct
    public void configureSecurityContextHolder() {
        SecurityContextHolder.setStrategyName(SecurityContextHolder.MODE_INHERITABLETHREADLOCAL);
    }
}
```

### Request Handling and Threading

When multiple requests come to a Spring Boot application:

1. Each request is typically handled in a separate thread from a thread pool
2. Each thread gets its own SecurityContext
3. Requests are processed in parallel
4. The SecurityContext isolates authentication details between threads

This is why the default thread-local strategy works well for web applications. Each user's security details are isolated to their request thread.

### Storing Custom Objects in SecurityContext

While you can store custom details in the Authentication object, it's generally better to extend the standard `UserDetails` interface:

```java
public class CustomUserDetails implements UserDetails {
    
    private final User user; // Your domain user
    
    public CustomUserDetails(User user) {
        this.user = user;
    }
    
    // UserDetails implementation methods
    
    // Custom method to get your domain user
    public User getUser() {
        return user;
    }
}
```

Then in your service:

```java
@Service
public class UserService {
    
    public void doSomething() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
            User user = userDetails.getUser();
            // Now you have the full user object
        }
    }
}
```

### Avoiding Multiple Database Queries

To avoid fetching user data twice (once during authentication and once in your controller/service), you can:

1. Store the fully-loaded user object in your CustomUserDetails during authentication
2. Retrieve it from the SecurityContext later

```java
@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    private final UserRepository userRepository;
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Fetch user with eager loading of related data
        User user = userRepository.findByUsernameWithDetailsAndRoles(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        // Store the fully-loaded user in the CustomUserDetails
        return new CustomUserDetails(user);
    }
}
```

Now in your controllers or services:

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @GetMapping("/profile")
    public ResponseEntity<UserProfile> getUserProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        User user = userDetails.getUser();
        
        // No need for additional database query
        return ResponseEntity.ok(new UserProfile(user));
    }
}
```

## Authorization and Role Management

### Setting Up Roles and Authorities

Roles and authorities (permissions) in Spring Security:

- **Authority**: A fine-grained permission (e.g., "READ_USER", "WRITE_USER")
- **Role**: A coarse-grained permission, typically a collection of authorities (e.g., "ROLE_ADMIN")

```java
// Create a user with both roles and authorities
UserDetails user = User.withUsername("john")
    .password(passwordEncoder.encode("password"))
    .roles("USER") // Adds ROLE_USER authority
    .authorities("READ_PRIVILEGE", "WRITE_PRIVILEGE") // Specific permissions
    .build();
```

### Authorization at Different Levels

Spring Security offers authorization at multiple levels:

#### 1. Web Request Level (URL patterns)

```java
http
    .authorizeHttpRequests(authorize -> authorize
        .requestMatchers("/admin/**").hasRole("ADMIN")
        .requestMatchers("/user/**").hasAnyRole("USER", "ADMIN")
        .anyRequest().authenticated()
    );
```

#### 2. Method Level

```java
@PreAuthorize("hasRole('ADMIN')")
public void adminOnlyMethod() { }

@PreAuthorize("hasAuthority('READ_PRIVILEGE')")
public void readMethod() { }

@PostAuthorize("returnObject.username == authentication.principal.username")
public User getUser(Long id) { }
```

#### 3. Object Level (Domain Object Security)

```java
@PostFilter("filterObject.owner == authentication.principal.username")
public List<Document> getDocuments() { }

@PreAuthorize("hasPermission(#document, 'WRITE')")
public void updateDocument(Document document) { }
```

### Security Expression Methods

Common expressions used in `@PreAuthorize` and other annotations:

- `hasRole('ROLE_NAME')`: Checks if user has the specified role
- `hasAnyRole('ROLE1', 'ROLE2')`: Checks if user has any of the roles
- `hasAuthority('PERMISSION')`: Checks for a specific permission
- `hasAnyAuthority('PERM1', 'PERM2')`: Checks for any of the permissions
- `isAuthenticated()`: User is authenticated (not anonymous)
- `isAnonymous()`: User is anonymous
- `isRememberMe()`: User was authenticated via remember-me
- `isFullyAuthenticated()`: User is authenticated and not remember-me
- `permitAll()`: Always evaluates to true
- `denyAll()`: Always evaluates to false
- `authentication`: Refers to the Authentication object
- `principal`: Refers to the principal object in the Authentication
- `#paramName`: References a method parameter

### Custom Security Expressions

You can create custom security expressions:

```java
@Component
public class CustomSecurityExpressions {
    
    public boolean isOwner(Authentication authentication, Document document) {
        String username = authentication.getName();
        return document.getOwner().equals(username);
    }
}
```

And register it:

```java
@Configuration
public class MethodSecurityConfig extends GlobalMethodSecurityConfiguration {
    
    @Autowired
    private CustomSecurityExpressions customSecurityExpressions;
    
    @Override
    protected MethodSecurityExpressionHandler createExpressionHandler() {
        DefaultMethodSecurityExpressionHandler expressionHandler = 
            new DefaultMethodSecurityExpressionHandler();
        expressionHandler.setPermissionEvaluator(new CustomPermissionEvaluator());
        
        // Register custom security expressions
        expressionHandler.setRootObject(customSecurityExpressions);
        return expressionHandler;
    }
}
```

## JWT Authentication

JWT (JSON Web Token) is commonly used for stateless authentication in RESTful services:

### Setting Up a JWT Filter

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                   FilterChain filterChain) throws ServletException, IOException {
        
        final String authHeader = request.getHeader("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        String jwt = authHeader.substring(7);
        String username = jwtService.extractUsername(jwt);
        
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
            
            if (jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = 
                    new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                
                // Set details from request
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
```

### Configuring JWT Authentication

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

## OAuth2 / OpenID Connect Integration

For more complex authentication scenarios involving third-party identity providers:

```java
@Configuration
@EnableWebSecurity
public class OAuth2SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authorize -> authorize
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .loginPage("/oauth2/authorization/github")
                .defaultSuccessUrl("/home")
            )
            .oauth2ResourceServer(OAuth2ResourceServerConfigurer::jwt);
        
        return http.build();
    }
}
```

## Session Management

### Session Handling Options

```java
http
    .sessionManagement(session -> session
        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
        .invalidSessionUrl("/login")
        .maximumSessions(1)
        .maxSessionsPreventsLogin(true)
    );
```

Available policies:
- `ALWAYS`: Always create a session
- `NEVER`: Never create a session but use existing if available
- `IF_REQUIRED`: Create a session only as needed (default)
- `STATELESS`: No session will be created or used

### Concurrent Session Control

```java
@Bean
public SessionRegistry sessionRegistry() {
    return new SessionRegistryImpl();
}

@Bean
public HttpSessionEventPublisher httpSessionEventPublisher() {
    return new HttpSessionEventPublisher();
}
```

Then configure in your security config:

```java
http
    .sessionManagement(session -> session
        .maximumSessions(1)
        .sessionRegistry(sessionRegistry())
    );
```

## Testing Spring Security

### Unit Testing Secured Methods

```java
@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    
    @InjectMocks
    private UserService userService;
    
    @BeforeEach
    public void setup() {
        // Set up security context for testing
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        Authentication authentication = 
            new UsernamePasswordAuthenticationToken(
                "testuser", "password", 
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN")));
        securityContext.setAuthentication(authentication);
        SecurityContextHolder.setContext(securityContext);
    }
    
    @Test
    public void testSecuredMethod() {
        // Test that runs with ROLE_ADMIN authority
        assertDoesNotThrow(() -> userService.adminOnlyMethod());
    }
    
    @AfterEach
    public void cleanup() {
        SecurityContextHolder.clearContext();
    }
}
```

### Integration Testing with Spring Security

```java
@SpringBootTest
@AutoConfigureMockMvc
public class SecurityIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testAdminAccess() throws Exception {
        mockMvc.perform(get("/api/admin/resource"))
               .andExpect(status().isOk());
    }
    
    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    public void testUserCantAccessAdminArea() throws Exception {
        mockMvc.perform(get("/api/admin/resource"))
               .andExpect(status().isForbidden());
    }
    
    @Test
    public void testUnauthenticatedCantAccess() throws Exception {
        mockMvc.perform(get("/api/users"))
               .andExpect(status().isUnauthorized());
    }
}
```

## Best Practices

1. **Use HTTPS**: Always use HTTPS in production to protect credentials and tokens
2. **Password Encoding**: Never store raw passwords, use strong encoders
3. **Principle of Least Privilege**: Grant minimal permissions required
4. **Rate Limiting**: Protect against brute force attacks
5. **CSRF Protection**: Enable CSRF protection for form-based applications
6. **Content Security Policy**: Mitigate XSS attacks
7. **Regular Updates**: Keep Spring Security updated to benefit from security fixes
8. **Security Headers**: Configure security headers to protect against common attacks
9. **Proper Error Handling**: Don't leak sensitive information in error responses
10. **Audit Logging**: Log security events for monitoring and compliance

## Common Spring Security Annotations

### Framework Annotations

- `@EnableWebSecurity`: Enables Spring Security's web security support
- `@EnableMethodSecurity`: Enables method-level security
- `@Secured`: Legacy method security annotation
- `@RolesAllowed`: JSR-250 security annotation
- `@PreAuthorize`: Method security with SpEL expressions before method execution
- `@PostAuthorize`: Method security with SpEL expressions after method execution
- `@PreFilter`: Filters input collections before method execution
- `@PostFilter`: Filters output collections after method execution

### Testing Annotations

- `@WithMockUser`: Test with a mock user
- `@WithUserDetails`: Test with user details loaded from UserDetailsService
- `@WithAnonymousUser`: Test with anonymous user
- `@WithSecurityContext`: Test with a custom security context