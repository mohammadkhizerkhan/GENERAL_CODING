# Java Interfaces

## 1. Interface Basics

An interface in Java is a completely abstract class that is used to group related methods with empty bodies. It defines a contract for classes that implement it.

```java
public interface Animal {
    void makeSound();
    void move();
}
```

## 2. Variables Inside Interface

All variables declared in an interface are implicitly public, static, and final. They are essentially constants.

```java
public interface Constants {
    int MAX_SIZE = 100;
    String DEFAULT_NAME = "Unknown";
}
```

## 3. Implementing Interfaces

A class can implement an interface using the `implements` keyword. It must provide implementations for all the methods declared in the interface.

```java
public class Dog implements Animal {
    @Override
    public void makeSound() {
        System.out.println("Woof!");
    }

    @Override
    public void move() {
        System.out.println("Dog is running");
    }
}
```

## 4. Multiple Interfaces

A class can implement multiple interfaces, allowing for a form of multiple inheritance in Java.

```java
interface Swimmer {
    void swim();
}

interface Flyer {
    void fly();
}

public class Duck implements Animal, Swimmer, Flyer {
    // Implement all methods from Animal, Swimmer, and Flyer
}
```

## 5. Extending Interfaces

An interface can extend one or more other interfaces, creating a hierarchy of interfaces.

```java
interface Vehicle {
    void start();
    void stop();
}

interface ElectricVehicle extends Vehicle {
    void charge();
}
```

## 6. Abstract Class vs Interface

While both abstract classes and interfaces are used to achieve abstraction, they have some key differences:

1. Multiple Inheritance: A class can implement multiple interfaces but can extend only one abstract class.
2. Variables: Interface variables are public, static, and final by default. Abstract classes can have non-static and non-final variables.
3. Method Implementation: Interfaces can have default and static methods (Java 8+), but all other methods must be abstract. Abstract classes can have both abstract and non-abstract methods.
4. Constructor: Interfaces cannot have constructors. Abstract classes can have constructors.

### When to use which:

- Use an interface when:
  - You want to define a contract for unrelated classes.
  - You need multiple inheritance.
  - You want to specify the behavior of a particular data type, but not concerned about who implements its behavior.

- Use an abstract class when:
  - You want to provide a common base class implementation to all the subclasses.
  - You need to declare non-public members.
  - You want to add new methods in the future without breaking existing code.

## 7. Edge Cases and Additional Considerations

### 7.1 Default Methods (Java 8+)

Interfaces can have default methods with implementation. This allows adding new methods to interfaces without breaking existing implementations.

```java
public interface Greeting {
    default void sayHello() {
        System.out.println("Hello!");
    }
}
```

### 7.2 Static Methods in Interfaces (Java 8+)

Interfaces can have static methods with implementation.

```java
public interface MathOperations {
    static int add(int a, int b) {
        return a + b;
    }
}
```

### 7.3 Private Methods in Interfaces (Java 9+)

Interfaces can have private methods to share code between default methods.

```java
public interface Logger {
    default void logInfo(String message) {
        log(message, "INFO");
    }

    default void logError(String message) {
        log(message, "ERROR");
    }

    private void log(String message, String level) {
        System.out.println(level + ": " + message);
    }
}
```

### 7.4 Functional Interfaces

An interface with exactly one abstract method is called a functional interface. They can be used with lambda expressions.

```java
@FunctionalInterface
public interface Runnable {
    void run();
}

// Usage
Runnable r = () -> System.out.println("Hello, World!");
```

### 7.5 Marker Interfaces

Interfaces with no methods are called marker interfaces. They are used to indicate something to the compiler or JVM.

```java
public interface Serializable {
}
```

### 7.6 Diamond Problem Resolution

When a class implements multiple interfaces with the same default method, the class must override the method to resolve the conflict.

```java
interface A {
    default void foo() {
        System.out.println("A's foo");
    }
}

interface B {
    default void foo() {
        System.out.println("B's foo");
    }
}

class C implements A, B {
    @Override
    public void foo() {
        A.super.foo(); // Calls A's implementation
    }
}
```

### 7.7 Interfaces and Abstract Classes Together

You can use interfaces and abstract classes together to create a flexible and powerful design.

```java
interface Drawable {
    void draw();
}

abstract class Shape {
    abstract double area();
}

class Circle extends Shape implements Drawable {
    @Override
    public void draw() {
        System.out.println("Drawing a circle");
    }

    @Override
    double area() {
        // Calculate and return area
        return 0;
    }
}
```

### 7.8 Sealed Interfaces (Java 15+)

Sealed interfaces restrict which classes or interfaces may implement or extend them.

```java
public sealed interface Shape permits Circle, Square, Triangle {
    double area();
}

final class Circle implements Shape {
    @Override
    public double area() {
        // Implementation
    }
}
```

Remember, interfaces are a powerful tool in Java for defining contracts and achieving loose coupling between components. They play a crucial role in design patterns and in creating flexible, extensible software architectures. When used judiciously, they can greatly enhance the modularity and maintainability of your code.