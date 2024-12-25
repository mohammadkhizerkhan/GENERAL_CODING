# Java OOP Fundamentals

## 1. Class

A class is a blueprint or template for creating objects. It defines the attributes (fields) and behaviors (methods) that the objects of that class will have.

```java
public class Car {
    // Fields (attributes)
    String brand;
    String model;
    int year;

    // Method (behavior)
    public void startEngine() {
        System.out.println("The car's engine is starting.");
    }
}
```

## 2. Objects

An object is an instance of a class. It represents a specific entity with its own set of data and behaviors defined by the class.

```java
Car myCar = new Car();
myCar.brand = "Toyota";
myCar.model = "Corolla";
myCar.year = 2022;
myCar.startEngine();
```

## 3. Class vs Objects

- A class is a template, while an object is an instance of that template.
- A class is defined once, but you can create multiple objects from it.
- Objects have their own unique set of data, but share the same structure and methods defined in the class.

## 4. Constructors

Constructors are special methods used to initialize objects. They have the same name as the class and are called when creating a new object.

```java
public class Car {
    String brand;
    String model;
    int year;

    // Constructor
    public Car(String brand, String model, int year) {
        this.brand = brand;
        this.model = model;
        this.year = year;
    }
}

// Using the constructor
Car myCar = new Car("Toyota", "Corolla", 2022);
```

## 5. 'this' Keyword

The 'this' keyword refers to the current instance of the class. It's often used to differentiate between class fields and constructor/method parameters with the same name.

```java
public class Person {
    String name;

    public Person(String name) {
        this.name = name; // 'this.name' refers to the class field, 'name' refers to the parameter
    }
}
```

## 6. Constructor Overloading

Constructor overloading allows a class to have multiple constructors with different parameter lists.

```java
public class Car {
    String brand;
    String model;
    int year;

    // Constructor with all parameters
    public Car(String brand, String model, int year) {
        this.brand = brand;
        this.model = model;
        this.year = year;
    }

    // Overloaded constructor with fewer parameters
    public Car(String brand, String model) {
        this(brand, model, 2023); // Calls the first constructor with a default year
    }
}
```

## 7. Calling a Constructor Inside Another Constructor

This is done using the `this()` call, which must be the first statement in the constructor.

```java
public class Car {
    String brand;
    String model;
    int year;

    public Car(String brand, String model, int year) {
        this.brand = brand;
        this.model = model;
        this.year = year;
    }

    public Car(String brand, String model) {
        this(brand, model, 2023); // Calls the first constructor
    }

    public Car(String brand) {
        this(brand, "Unknown"); // Calls the second constructor
    }
}
```

## 8. Final Keyword

The 'final' keyword can be used with variables, methods, and classes:

- With variables: The value cannot be changed once assigned.
- With methods: The method cannot be overridden in subclasses.
- With classes: The class cannot be inherited.

```java
public class Circle {
    final double PI = 3.14159; // Constant value, cannot be changed

    final void calculateArea(double radius) {
        System.out.println("Area: " + (PI * radius * radius));
    }
}

final class ImmutableClass {
    // This class cannot be inherited
}
```

Remember, these concepts build upon each other. Understanding classes and objects is crucial before moving on to constructors and more advanced topics. Practice and experimentation will help reinforce these concepts.