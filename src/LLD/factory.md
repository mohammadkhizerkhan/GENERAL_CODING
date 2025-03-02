# Factory Design Patterns

## Simple Factory Pattern

### What is the Simple Factory Pattern?

The Simple Factory pattern is a creational design pattern that provides an interface for creating objects without specifying their concrete classes. It encapsulates object creation logic in a single class that decides which concrete implementation to instantiate based on parameters.

### Why is it needed?

Simple Factory is useful when:

1. **Encapsulation of creation logic**: When object creation involves complex logic that should be separated from client code
2. **Decoupling**: When client code should be independent of how objects are created
3. **Centralized control**: When you want to centralize the creation of related objects for easier maintenance
4. **Reduced duplication**: When similar object creation code would be repeated throughout the application

### How to implement

The basic implementation involves:

1. Creating a factory class with a static method that returns objects
2. Using parameters to determine which concrete class to instantiate
3. Returning instances that share a common interface or superclass

### Basic Implementation in Java

```java
// Product interface
public interface Payment {
    void processPayment(double amount);
}

// Concrete implementations
public class CreditCardPayment implements Payment {
    @Override
    public void processPayment(double amount) {
        System.out.println("Processing credit card payment of $" + amount);
        // Credit card-specific processing logic
    }
}

public class PayPalPayment implements Payment {
    @Override
    public void processPayment(double amount) {
        System.out.println("Processing PayPal payment of $" + amount);
        // PayPal-specific processing logic
    }
}

public class BankTransferPayment implements Payment {
    @Override
    public void processPayment(double amount) {
        System.out.println("Processing bank transfer payment of $" + amount);
        // Bank transfer-specific processing logic
    }
}

// Simple Factory
public class PaymentFactory {
    public static Payment createPayment(String paymentMethod) {
        if (paymentMethod == null) {
            return null;
        }
        
        if (paymentMethod.equalsIgnoreCase("CREDIT_CARD")) {
            return new CreditCardPayment();
        } else if (paymentMethod.equalsIgnoreCase("PAYPAL")) {
            return new PayPalPayment();
        } else if (paymentMethod.equalsIgnoreCase("BANK_TRANSFER")) {
            return new BankTransferPayment();
        }
        
        throw new IllegalArgumentException("Unknown payment method: " + paymentMethod);
    }
}

// Client code
public class PaymentProcessor {
    public static void main(String[] args) {
        // Client creates a payment without knowing the concrete class
        Payment payment = PaymentFactory.createPayment("CREDIT_CARD");
        payment.processPayment(100.0);
        
        Payment payment2 = PaymentFactory.createPayment("PAYPAL");
        payment2.processPayment(75.50);
    }
}
```

### Real-life Software Engineering Examples

#### Payment Processing System

An e-commerce application can use a Simple Factory to create different payment processors:

```java
// Usage in a checkout service
public class CheckoutService {
    public void processOrder(Order order, String paymentMethod) {
        // Calculate total
        double total = order.calculateTotal();
        
        // Use the factory to create the appropriate payment processor
        Payment payment = PaymentFactory.createPayment(paymentMethod);
        
        // Process the payment
        payment.processPayment(total);
        
        // Complete the order
        order.setStatus("PAID");
    }
}
```

#### Document Parser

A document management system can use a Simple Factory to create different document parsers:

```java
// Document parser interface
public interface DocumentParser {
    Document parse(String content);
}

// Concrete parsers for different formats
public class PDFParser implements DocumentParser { /* Implementation */ }
public class WordParser implements DocumentParser { /* Implementation */ }
public class TextParser implements DocumentParser { /* Implementation */ }

// Simple Factory
public class ParserFactory {
    public static DocumentParser createParser(String fileExtension) {
        if (fileExtension.equalsIgnoreCase("pdf")) {
            return new PDFParser();
        } else if (fileExtension.equalsIgnoreCase("docx")) {
            return new WordParser();
        } else if (fileExtension.equalsIgnoreCase("txt")) {
            return new TextParser();
        }
        throw new IllegalArgumentException("Unsupported file format: " + fileExtension);
    }
}

// Usage
public class DocumentProcessor {
    public Document processFile(String filePath) {
        String fileExtension = getFileExtension(filePath);
        String content = readFileContent(filePath);
        
        DocumentParser parser = ParserFactory.createParser(fileExtension);
        return parser.parse(content);
    }
    
    private String getFileExtension(String filePath) {
        // Extract file extension
        return filePath.substring(filePath.lastIndexOf('.') + 1);
    }
    
    private String readFileContent(String filePath) {
        // Read file content
        return "file content";
    }
}
```

## Factory Method Pattern

### What is the Factory Method Pattern?

The Factory Method pattern is a creational design pattern that defines an interface for creating objects but allows subclasses to alter the type of objects that will be created. It provides a way to delegate instantiation logic to child classes.

### Why is it needed?

Factory Method is useful when:

1. **Class hierarchy flexibility**: When a class doesn't know what subclasses will be required to create
2. **Subclass determination**: When a class wants its subclasses to specify the objects it creates
3. **Extensibility**: When you want to provide users with a way to extend your framework's internal components
4. **Reuse of knowledge**: When you want to reuse existing objects instead of rebuilding them each time

### How to implement

The basic implementation involves:

1. Creating an abstract creator class with a factory method
2. Creating concrete creator subclasses that override the factory method
3. Using the factory method to create and return product objects

### Basic Implementation in Java

```java
// Product interface
public interface Logger {
    void log(String message);
}

// Concrete products
public class ConsoleLogger implements Logger {
    @Override
    public void log(String message) {
        System.out.println("Console: " + message);
    }
}

public class FileLogger implements Logger {
    private String filePath;
    
    public FileLogger(String filePath) {
        this.filePath = filePath;
    }
    
    @Override
    public void log(String message) {
        System.out.println("File (" + filePath + "): " + message);
        // Actual file writing logic would go here
    }
}

public class DatabaseLogger implements Logger {
    private String connectionString;
    
    public DatabaseLogger(String connectionString) {
        this.connectionString = connectionString;
    }
    
    @Override
    public void log(String message) {
        System.out.println("Database (" + connectionString + "): " + message);
        // Actual database logging logic would go here
    }
}

// Abstract creator
public abstract class LoggerFactory {
    // Factory method
    public abstract Logger createLogger();
    
    // Template method that uses the factory method
    public void logMessage(String message) {
        Logger logger = createLogger();
        logger.log(message);
    }
}

// Concrete creators
public class ConsoleLoggerFactory extends LoggerFactory {
    @Override
    public Logger createLogger() {
        return new ConsoleLogger();
    }
}

public class FileLoggerFactory extends LoggerFactory {
    private String filePath;
    
    public FileLoggerFactory(String filePath) {
        this.filePath = filePath;
    }
    
    @Override
    public Logger createLogger() {
        return new FileLogger(filePath);
    }
}

public class DatabaseLoggerFactory extends LoggerFactory {
    private String connectionString;
    
    public DatabaseLoggerFactory(String connectionString) {
        this.connectionString = connectionString;
    }
    
    @Override
    public Logger createLogger() {
        return new DatabaseLogger(connectionString);
    }
}

// Client code
public class Application {
    private LoggerFactory loggerFactory;
    
    public Application(LoggerFactory loggerFactory) {
        this.loggerFactory = loggerFactory;
    }
    
    public void run() {
        // Log messages using the configured logger
        loggerFactory.logMessage("Application starting...");
        // Application logic
        loggerFactory.logMessage("Application shutting down...");
    }
    
    public static void main(String[] args) {
        // Configure for console logging
        Application consoleApp = new Application(new ConsoleLoggerFactory());
        consoleApp.run();
        
        // Configure for file logging
        Application fileApp = new Application(new FileLoggerFactory("app.log"));
        fileApp.run();
        
        // Configure for database logging
        Application dbApp = new Application(new DatabaseLoggerFactory("jdbc:mysql://localhost/logs"));
        dbApp.run();
    }
}
```

### Real-life Software Engineering Examples

#### UI Component Creation

A cross-platform application might use the Factory Method pattern to create platform-specific UI components:

```java
// UI component interface
public interface Button {
    void render();
    void onClick();
}

// Concrete button implementations
public class WindowsButton implements Button {
    @Override
    public void render() {
        System.out.println("Rendering a button in Windows style");
    }
    
    @Override
    public void onClick() {
        System.out.println("Windows button clicked");
    }
}

public class MacOSButton implements Button {
    @Override
    public void render() {
        System.out.println("Rendering a button in MacOS style");
    }
    
    @Override
    public void onClick() {
        System.out.println("MacOS button clicked");
    }
}

// Abstract UI factory
public abstract class GUIFactory {
    public abstract Button createButton();
    
    // Other factory methods for different UI components
    // public abstract TextField createTextField();
    // public abstract Checkbox createCheckbox();
}

// Concrete factories
public class WindowsFactory extends GUIFactory {
    @Override
    public Button createButton() {
        return new WindowsButton();
    }
}

public class MacOSFactory extends GUIFactory {
    @Override
    public Button createButton() {
        return new MacOSButton();
    }
}

// Client code
public class Application {
    private GUIFactory factory;
    private Button button;
    
    public Application(GUIFactory factory) {
        this.factory = factory;
    }
    
    public void createUI() {
        this.button = factory.createButton();
    }
    
    public void paint() {
        button.render();
    }
    
    public static void main(String[] args) {
        // Determine the current OS
        String osName = System.getProperty("os.name").toLowerCase();
        GUIFactory factory;
        
        if (osName.contains("windows")) {
            factory = new WindowsFactory();
        } else {
            factory = new MacOSFactory();
        }
        
        Application app = new Application(factory);
        app.createUI();
        app.paint();
    }
}
```

#### Content Export System

A document management system can use the Factory Method pattern for creating different exporters:

```java
// Document exporter interface
public interface DocumentExporter {
    void export(Document document, String filePath);
}

// Concrete exporters
public class PDFExporter implements DocumentExporter {
    @Override
    public void export(Document document, String filePath) {
        System.out.println("Exporting document to PDF: " + filePath);
        // PDF-specific export logic
    }
}

public class DOCXExporter implements DocumentExporter {
    @Override
    public void export(Document document, String filePath) {
        System.out.println("Exporting document to DOCX: " + filePath);
        // DOCX-specific export logic
    }
}

public class HTMLExporter implements DocumentExporter {
    @Override
    public void export(Document document, String filePath) {
        System.out.println("Exporting document to HTML: " + filePath);
        // HTML-specific export logic
    }
}

// Abstract export factory
public abstract class ExportFactory {
    public abstract DocumentExporter createExporter();
    
    public void exportDocument(Document document, String filePath) {
        DocumentExporter exporter = createExporter();
        exporter.export(document, filePath);
    }
}

// Concrete factories
public class PDFExportFactory extends ExportFactory {
    @Override
    public DocumentExporter createExporter() {
        return new PDFExporter();
    }
}

public class DOCXExportFactory extends ExportFactory {
    @Override
    public DocumentExporter createExporter() {
        return new DOCXExporter();
    }
}

public class HTMLExportFactory extends ExportFactory {
    @Override
    public DocumentExporter createExporter() {
        return new HTMLExporter();
    }
}

// Usage in document management system
public class DocumentManagementSystem {
    private Map<String, ExportFactory> exportFactories;
    
    public DocumentManagementSystem() {
        exportFactories = new HashMap<>();
        exportFactories.put("pdf", new PDFExportFactory());
        exportFactories.put("docx", new DOCXExportFactory());
        exportFactories.put("html", new HTMLExportFactory());
    }
    
    public void exportDocument(Document document, String format, String filePath) {
        ExportFactory factory = exportFactories.get(format.toLowerCase());
        if (factory != null) {
            factory.exportDocument(document, filePath);
        } else {
            throw new IllegalArgumentException("Unsupported export format: " + format);
        }
    }
}
```

## Abstract Factory Pattern

### What is the Abstract Factory Pattern?

The Abstract Factory pattern is a creational design pattern that provides an interface for creating families of related or dependent objects without specifying their concrete classes. It's essentially a factory of factories.

### Why is it needed?

Abstract Factory is useful when:

1. **System independence**: When your system needs to be independent of how its products are created, composed, and represented
2. **Family of products**: When your system needs to work with multiple families of related products
3. **Consistency guarantee**: When you need to enforce that products used together are compatible
4. **Third-party integration**: When you want to provide a class library of products without revealing their implementations

### How to implement

The basic implementation involves:

1. Creating abstract product interfaces for each type of product
2. Creating concrete product classes that implement these interfaces
3. Creating an abstract factory interface with a creation method for each abstract product
4. Creating concrete factory classes that implement these creation methods to return specific products
5. Using factories to create families of related objects

### Basic Implementation in Java

```java
// Abstract product interfaces
public interface Button {
    void render();
    void click();
}

public interface Checkbox {
    void render();
    void toggle();
}

public interface TextField {
    void render();
    void setText(String text);
    String getText();
}

// Concrete products for Windows
public class WindowsButton implements Button {
    @Override
    public void render() {
        System.out.println("Rendering a button in Windows style");
    }
    
    @Override
    public void click() {
        System.out.println("Windows button clicked");
    }
}

public class WindowsCheckbox implements Checkbox {
    private boolean checked = false;
    
    @Override
    public void render() {
        System.out.println("Rendering a checkbox in Windows style");
    }
    
    @Override
    public void toggle() {
        checked = !checked;
        System.out.println("Windows checkbox toggled to: " + checked);
    }
}

public class WindowsTextField implements TextField {
    private String text = "";
    
    @Override
    public void render() {
        System.out.println("Rendering a text field in Windows style");
    }
    
    @Override
    public void setText(String text) {
        this.text = text;
        System.out.println("Windows text field updated: " + text);
    }
    
    @Override
    public String getText() {
        return text;
    }
}

// Concrete products for MacOS
public class MacOSButton implements Button {
    @Override
    public void render() {
        System.out.println("Rendering a button in MacOS style");
    }
    
    @Override
    public void click() {
        System.out.println("MacOS button clicked");
    }
}

public class MacOSCheckbox implements Checkbox {
    private boolean checked = false;
    
    @Override
    public void render() {
        System.out.println("Rendering a checkbox in MacOS style");
    }
    
    @Override
    public void toggle() {
        checked = !checked;
        System.out.println("MacOS checkbox toggled to: " + checked);
    }
}

public class MacOSTextField implements TextField {
    private String text = "";
    
    @Override
    public void render() {
        System.out.println("Rendering a text field in MacOS style");
    }
    
    @Override
    public void setText(String text) {
        this.text = text;
        System.out.println("MacOS text field updated: " + text);
    }
    
    @Override
    public String getText() {
        return text;
    }
}

// Abstract factory interface
public interface GUIFactory {
    Button createButton();
    Checkbox createCheckbox();
    TextField createTextField();
}

// Concrete factories
public class WindowsFactory implements GUIFactory {
    @Override
    public Button createButton() {
        return new WindowsButton();
    }
    
    @Override
    public Checkbox createCheckbox() {
        return new WindowsCheckbox();
    }
    
    @Override
    public TextField createTextField() {
        return new WindowsTextField();
    }
}

public class MacOSFactory implements GUIFactory {
    @Override
    public Button createButton() {
        return new MacOSButton();
    }
    
    @Override
    public Checkbox createCheckbox() {
        return new MacOSCheckbox();
    }
    
    @Override
    public TextField createTextField() {
        return new MacOSTextField();
    }
}

// Client code
public class Application {
    private Button button;
    private Checkbox checkbox;
    private TextField textField;
    
    public Application(GUIFactory factory) {
        button = factory.createButton();
        checkbox = factory.createCheckbox();
        textField = factory.createTextField();
    }
    
    public void render() {
        button.render();
        checkbox.render();
        textField.render();
    }
    
    public void simulateUserInteraction() {
        button.click();
        checkbox.toggle();
        textField.setText("User input");
        System.out.println("Text entered: " + textField.getText());
    }
    
    public static void main(String[] args) {
        // Determine the current OS
        String osName = System.getProperty("os.name").toLowerCase();
        GUIFactory factory;
        
        if (osName.contains("windows")) {
            factory = new WindowsFactory();
        } else {
            factory = new MacOSFactory();
        }
        
        Application app = new Application(factory);
        app.render();
        app.simulateUserInteraction();
    }
}
```

### Real-life Software Engineering Examples

#### Cross-platform UI Framework

A UI framework that needs to maintain consistent styling across different platforms:

```java
// Usage in a cross-platform application
public class CrossPlatformApp {
    private final GUIFactory factory;
    
    public CrossPlatformApp(String platform) {
        if (platform.equalsIgnoreCase("Windows")) {
            factory = new WindowsFactory();
        } else if (platform.equalsIgnoreCase("MacOS")) {
            factory = new MacOSFactory();
        } else {
            throw new IllegalArgumentException("Unsupported platform: " + platform);
        }
    }
    
    public void createLoginScreen() {
        TextField usernameField = factory.createTextField();
        TextField passwordField = factory.createTextField();
        Checkbox rememberMeCheckbox = factory.createCheckbox();
        Button loginButton = factory.createButton();
        
        // Configure components
        usernameField.render();
        passwordField.render();
        rememberMeCheckbox.render();
        loginButton.render();
        
        // In a real application, you would add these to a container/layout
    }
}
```

#### Database Connection Systems

An application that needs to work with different database systems:

```java
// Abstract product interfaces
public interface Connection {
    boolean open(String connectionString);
    void close();
    boolean isConnected();
}

public interface Command {
    void setQuery(String query);
    void setParameter(String name, Object value);
    ResultSet execute();
}

public interface ResultSet {
    boolean next();
    String getString(String columnName);
    int getInt(String columnName);
    // Other data retrieval methods
}

// Abstract factory interface
public interface DatabaseFactory {
    Connection createConnection();
    Command createCommand();
}

// Concrete factories
public class MySQLFactory implements DatabaseFactory {
    @Override
    public Connection createConnection() {
        return new MySQLConnection();
    }
    
    @Override
    public Command createCommand() {
        return new MySQLCommand();
    }
}

public class PostgreSQLFactory implements DatabaseFactory {
    @Override
    public Connection createConnection() {
        return new PostgreSQLConnection();
    }
    
    @Override
    public Command createCommand() {
        return new PostgreSQLCommand();
    }
}

// Usage in a data access layer
public class UserRepository {
    private final DatabaseFactory dbFactory;
    private Connection connection;
    
    public UserRepository(DatabaseFactory dbFactory) {
        this.dbFactory = dbFactory;
    }
    
    public void connect(String connectionString) {
        connection = dbFactory.createConnection();
        connection.open(connectionString);
    }
    
    public User getUserById(int userId) {
        if (!connection.isConnected()) {
            throw new IllegalStateException("Database connection is not open");
        }
        
        Command command = dbFactory.createCommand();
        command.setQuery("SELECT * FROM users WHERE id = :id");
        command.setParameter("id", userId);
        
        ResultSet results = command.execute();
        
        if (results.next()) {
            User user = new User();
            user.setId(results.getInt("id"));
            user.setUsername(results.getString("username"));
            user.setEmail(results.getString("email"));
            return user;
        }
        
        return null;
    }
    
    public void close() {
        if (connection != null && connection.isConnected()) {
            connection.close();
        }
    }
}

// Configuration in application
public class DatabaseConfiguration {
    public static DatabaseFactory getDatabaseFactory(String dbType) {
        if (dbType.equalsIgnoreCase("MySQL")) {
            return new MySQLFactory();
        } else if (dbType.equalsIgnoreCase("PostgreSQL")) {
            return new PostgreSQLFactory();
        } else {
            throw new IllegalArgumentException("Unsupported database type: " + dbType);
        }
    }
}
```

## Comparison of Factory Patterns

### Simple Factory
- **Structure**: A single factory class with one creation method
- **Purpose**: Encapsulate object creation in a single place
- **When to use**: When you have a simple hierarchy and don't need extensibility for new product types
- **Advantages**: Simple to implement, centralizes object creation
- **Disadvantages**: Violates Open/Closed Principle, factory must be modified for new products

### Factory Method
- **Structure**: Abstract creator class with abstract factory method, concrete creator subclasses
- **Purpose**: Let subclasses decide which concrete classes to instantiate
- **When to use**: When you want to delegate object creation to subclasses, when you don't know exactly what types of objects your code will be working with
- **Advantages**: Follows Open/Closed Principle, flexible and extensible
- **Disadvantages**: May lead to many subclasses, more complex than Simple Factory

### Abstract Factory
- **Structure**: Abstract factory interface, concrete factory implementations, multiple product families
- **Purpose**: Create families of related objects without specifying concrete classes
- **When to use**: When your system needs to work with multiple families of related products
- **Advantages**: Ensures compatibility between products, isolates concrete classes
- **Disadvantages**: Hard to add new product types (requires modifying the factory interface), most complex of the three

## Summary

Factory patterns are essential for managing object creation and promoting loose coupling in software systems. They provide different levels of abstraction and flexibility:

1. **Simple Factory**: A basic pattern that centralizes object creation in a single class
2. **Factory Method**: A more flexible pattern that lets subclasses decide which classes to instantiate
3. **Abstract Factory**: A comprehensive pattern for creating families of related objects

By using these patterns appropriately, you can create more maintainable, testable, and extensible code that adapts well to changing requirements.