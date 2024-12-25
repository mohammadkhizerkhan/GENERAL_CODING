# SOLID Principles in Java

SOLID is an acronym for five design principles in object-oriented programming that aim to make software designs more understandable, flexible, and maintainable. This document covers the first four principles:

1. Single Responsibility Principle (SRP)
2. Open-Closed Principle (OCP)
3. Liskov Substitution Principle (LSP)
4. Interface Segregation Principle (ISP)

## 1. Single Responsibility Principle (SRP)

The SRP states that a class should have only one reason to change, meaning it should have only one primary responsibility.

### Bad Example:

```java
public class Employee {
    private String name;
    private double salary;

    public void calculateSalary() {
        // Calculate salary logic
    }

    public void saveEmployee() {
        // Save employee to database
    }

    public void generateReport() {
        // Generate employee report
    }
}
```

In this bad example, the `Employee` class has multiple responsibilities: managing employee data, calculating salary, saving to a database, and generating reports.

### Good Example:

```java
public class Employee {
    private String name;
    private double salary;

    // Getters and setters
}

public class SalaryCalculator {
    public double calculateSalary(Employee employee) {
        // Calculate salary logic
    }
}

public class EmployeeRepository {
    public void saveEmployee(Employee employee) {
        // Save employee to database
    }
}

public class ReportGenerator {
    public void generateReport(Employee employee) {
        // Generate employee report
    }
}
```

In the good example, responsibilities are separated into different classes, each with a single purpose.

## 2. Open-Closed Principle (OCP)

The OCP states that software entities (classes, modules, functions, etc.) should be open for extension but closed for modification.

### Bad Example:

```java
public class PaymentProcessor {
    public void processPayment(String paymentType, double amount) {
        if (paymentType.equals("CreditCard")) {
            // Process credit card payment
        } else if (paymentType.equals("PayPal")) {
            // Process PayPal payment
        } else if (paymentType.equals("Bitcoin")) {
            // Process Bitcoin payment
        }
    }
}
```

In this bad example, whenever we want to add a new payment method, we need to modify the `PaymentProcessor` class, violating the OCP.

### Good Example:

```java
public interface PaymentMethod {
    void processPayment(double amount);
}

public class CreditCardPayment implements PaymentMethod {
    @Override
    public void processPayment(double amount) {
        // Process credit card payment
    }
}

public class PayPalPayment implements PaymentMethod {
    @Override
    public void processPayment(double amount) {
        // Process PayPal payment
    }
}

public class BitcoinPayment implements PaymentMethod {
    @Override
    public void processPayment(double amount) {
        // Process Bitcoin payment
    }
}

public class PaymentProcessor {
    public void processPayment(PaymentMethod paymentMethod, double amount) {
        paymentMethod.processPayment(amount);
    }
}
```

In the good example, we can add new payment methods by creating new classes that implement the `PaymentMethod` interface, without modifying the `PaymentProcessor` class.


## 3. Liskov Substitution Principle (LSP)

The LSP states that objects of a superclass should be replaceable with objects of its subclasses without affecting the correctness of the program.

### Bad Example:

```java
public class Rectangle {
    protected int width;
    protected int height;

    public void setWidth(int width) {
        this.width = width;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public int getArea() {
        return width * height;
    }
}

public class Square extends Rectangle {
    @Override
    public void setWidth(int width) {
        super.setWidth(width);
        super.setHeight(width);
    }

    @Override
    public void setHeight(int height) {
        super.setWidth(height);
        super.setHeight(height);
    }
}
```

This violates LSP because a `Square` cannot be used interchangeably with a `Rectangle` without unexpected behavior.

### Good Example:

```java
public interface Shape {
    int getArea();
}

public class Rectangle implements Shape {
    protected int width;
    protected int height;

    public Rectangle(int width, int height) {
        this.width = width;
        this.height = height;
    }

    @Override
    public int getArea() {
        return width * height;
    }
}

public class Square implements Shape {
    private int side;

    public Square(int side) {
        this.side = side;
    }

    @Override
    public int getArea() {
        return side * side;
    }
}
```

In the good example, `Square` and `Rectangle` are separate implementations of the `Shape` interface, ensuring that they can be used interchangeably without violating expectations.

## 3. Liskov Substitution Principle (LSP)

The LSP states that objects of a superclass should be replaceable with objects of its subclasses without affecting the correctness of the program.

### Bad Example:

```java
public class Bird {
    public void fly() {
        System.out.println("Flying...");
    }
}

public class Ostrich extends Bird {
    @Override
    public void fly() {
        throw new UnsupportedOperationException("Ostriches can't fly");
    }
}

public class BirdFlight {
    public void makeBirdFly(Bird bird) {
        bird.fly();
    }
}
```

This violates LSP because an `Ostrich` cannot be used interchangeably with a `Bird` without causing unexpected behavior (throwing an exception).

### Good Example:

```java
public interface FlyingBird {
    void fly();
}

public interface RunningBird {
    void run();
}

public class Sparrow implements FlyingBird {
    @Override
    public void fly() {
        System.out.println("Sparrow flying...");
    }
}

public class Ostrich implements RunningBird {
    @Override
    public void run() {
        System.out.println("Ostrich running...");
    }
}

public class BirdMovement {
    public void moveFlying(FlyingBird bird) {
        bird.fly();
    }

    public void moveRunning(RunningBird bird) {
        bird.run();
    }
}
```

In the good example, we separate flying and running behaviors into different interfaces. This allows us to use `Sparrow` and `Ostrich` objects according to their capabilities without violating the LSP.


## 4. Interface Segregation Principle (ISP)

The ISP states that clients should not be forced to depend on interfaces they do not use. It's better to have multiple specific interfaces rather than one general-purpose interface.

### Bad Example:

```java
public interface Worker {
    void work();
    void eat();
    void sleep();
}

public class Human implements Worker {
    @Override
    public void work() {
        // Working implementation
    }

    @Override
    public void eat() {
        // Eating implementation
    }

    @Override
    public void sleep() {
        // Sleeping implementation
    }
}

public class Robot implements Worker {
    @Override
    public void work() {
        // Working implementation
    }

    @Override
    public void eat() {
        // Robots don't eat, but forced to implement
    }

    @Override
    public void sleep() {
        // Robots don't sleep, but forced to implement
    }
}
```

In this bad example, the `Robot` class is forced to implement methods it doesn't need.

### Good Example:

```java
public interface Workable {
    void work();
}

public interface Eatable {
    void eat();
}

public interface Sleepable {
    void sleep();
}

public class Human implements Workable, Eatable, Sleepable {
    @Override
    public void work() {
        // Working implementation
    }

    @Override
    public void eat() {
        // Eating implementation
    }

    @Override
    public void sleep() {
        // Sleeping implementation
    }
}

public class Robot implements Workable {
    @Override
    public void work() {
        // Working implementation
    }
}
```

In the good example, interfaces are segregated, allowing classes to implement only the methods they need.


# SOLID Principles in Java

[Previous content remains unchanged]

## 5. Dependency Inversion Principle (DIP)

The Dependency Inversion Principle states that:
1. High-level modules should not depend on low-level modules. Both should depend on abstractions.
2. Abstractions should not depend on details. Details should depend on abstractions.

### Traditional Approach (Tightly Coupled)

In a traditional approach, high-level modules often depend directly on low-level modules, creating tight coupling. Here's an example:

```java
public class LightBulb {
    public void turnOn() {
        System.out.println("LightBulb: Bulb turned on...");
    }

    public void turnOff() {
        System.out.println("LightBulb: Bulb turned off...");
    }
}

public class ElectricPowerSwitch {
    private LightBulb bulb;
    private boolean on;

    public ElectricPowerSwitch(LightBulb bulb) {
        this.bulb = bulb;
        this.on = false;
    }

    public boolean isOn() {
        return this.on;
    }

    public void press() {
        if (this.on) {
            bulb.turnOff();
            this.on = false;
        } else {
            bulb.turnOn();
            this.on = true;
        }
    }
}
```

In this example, the `ElectricPowerSwitch` (high-level module) directly depends on the `LightBulb` (low-level module). This creates tight coupling, making it difficult to switch to other devices or mock the `LightBulb` for testing.

### Applying Dependency Inversion Principle

To apply DIP, we introduce an abstraction that both high-level and low-level modules depend on:

```java
public interface Switchable {
    void turnOn();
    void turnOff();
}

public class LightBulb implements Switchable {
    @Override
    public void turnOn() {
        System.out.println("LightBulb: Bulb turned on...");
    }

    @Override
    public void turnOff() {
        System.out.println("LightBulb: Bulb turned off...");
    }
}

public class Fan implements Switchable {
    @Override
    public void turnOn() {
        System.out.println("Fan: Fan started rotating...");
    }

    @Override
    public void turnOff() {
        System.out.println("Fan: Fan stopped rotating...");
    }
}

public class ElectricPowerSwitch {
    private Switchable device;
    private boolean on;

    public ElectricPowerSwitch(Switchable device) {
        this.device = device;
        this.on = false;
    }

    public boolean isOn() {
        return this.on;
    }

    public void press() {
        if (this.on) {
            device.turnOff();
            this.on = false;
        } else {
            device.turnOn();
            this.on = true;
        }
    }
}
```

Now, both `ElectricPowerSwitch` and the devices (`LightBulb`, `Fan`) depend on the `Switchable` abstraction. This allows for easy extension and flexibility.

### Dependency Injection

Dependency Injection (DI) is a technique for achieving Dependency Inversion. It allows the creation of dependent objects outside of a class and provides those objects to a class through different ways. Here are three common types of dependency injection:

1. Constructor Injection:
```java
public class ElectricPowerSwitch {
    private Switchable device;
    private boolean on;

    public ElectricPowerSwitch(Switchable device) {
        this.device = device;
        this.on = false;
    }
    
    // Other methods...
}

// Usage
Switchable bulb = new LightBulb();
ElectricPowerSwitch switch = new ElectricPowerSwitch(bulb);
```

2. Setter Injection:
```java
public class ElectricPowerSwitch {
    private Switchable device;
    private boolean on;

    public void setDevice(Switchable device) {
        this.device = device;
    }
    
    // Other methods...
}

// Usage
ElectricPowerSwitch switch = new ElectricPowerSwitch();
switch.setDevice(new Fan());
```

3. Interface Injection:
```java
public interface DeviceInjector {
    void injectDevice(Switchable device);
}

public class ElectricPowerSwitch implements DeviceInjector {
    private Switchable device;
    private boolean on;

    @Override
    public void injectDevice(Switchable device) {
        this.device = device;
    }
    
    // Other methods...
}

// Usage
ElectricPowerSwitch switch = new ElectricPowerSwitch();
switch.injectDevice(new LightBulb());
```

Dependency Injection is related to the Dependency Inversion Principle because it's a way to implement DIP. By using DI, we can:

1. Decouple the usage of an object from its creation.
2. Allow for easier testing by injecting mock objects.
3. Increase the reusability of code.
4. Improve the flexibility of our code by allowing us to easily switch implementations.

In our example, by injecting the `Switchable` device into `ElectricPowerSwitch`, we've inverted the dependency. The high-level module (`ElectricPowerSwitch`) no longer depends on low-level modules (`LightBulb` or `Fan`) but instead depends on an abstraction (`Switchable`). This adheres to the Dependency Inversion Principle.