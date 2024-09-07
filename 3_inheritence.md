# Java Inheritance Concepts

## 1. Inheritance Basics

Inheritance is a fundamental concept in object-oriented programming that allows a class to inherit properties and methods from another class.

```java
class Animal {
    void eat() {
        System.out.println("This animal eats food");
    }
}

class Dog extends Animal {
    void bark() {
        System.out.println("The dog barks");
    }
}

// Usage
Dog myDog = new Dog();
myDog.eat();  // Inherited from Animal
myDog.bark(); // Defined in Dog
```

## 2. Private Keyword

The `private` keyword restricts access to the class in which it is declared. Private members are not inherited by subclasses.

```java
class Parent {
    private int privateVar = 10;
    
    public int getPrivateVar() {
        return privateVar;
    }
}

class Child extends Parent {
    void tryToAccess() {
        // System.out.println(privateVar); // Compilation error
        System.out.println(getPrivateVar()); // This works
    }
}
```

## 3. Super Keyword

The `super` keyword is used to refer to the superclass (parent) object. It can be used to call superclass methods and to access the superclass constructor.

```java
class Animal {
    String name;
    
    Animal(String name) {
        this.name = name;
    }
    
    void makeSound() {
        System.out.println("The animal makes a sound");
    }
}

class Dog extends Animal {
    Dog(String name) {
        super(name); // Call to superclass constructor
    }
    
    @Override
    void makeSound() {
        super.makeSound(); // Call to superclass method
        System.out.println("The dog barks");
    }
}
```

## 4. Types of Inheritance

### 4.1 Single Inheritance

Java supports single inheritance, where a class can inherit from only one superclass.

```java
class A {
    void methodA() {
        System.out.println("Method from class A");
    }
}

class B extends A {
    void methodB() {
        System.out.println("Method from class B");
    }
}
```

### 4.2 Multiple Inheritance (Through Interfaces)

Java doesn't support multiple inheritance of classes, but it can be achieved through interfaces.

```java
interface Flyable {
    void fly();
}

interface Swimmable {
    void swim();
}

class FlyingFish implements Flyable, Swimmable {
    @Override
    public void fly() {
        System.out.println("The flying fish glides through the air");
    }
    
    @Override
    public void swim() {
        System.out.println("The flying fish swims in the water");
    }
}
```

### 4.3 Hierarchical Inheritance

One superclass has multiple subclasses.

```java
class Animal {
    void eat() {
        System.out.println("This animal eats");
    }
}

class Dog extends Animal {
    void bark() {
        System.out.println("The dog barks");
    }
}

class Cat extends Animal {
    void meow() {
        System.out.println("The cat meows");
    }
}
```

### 4.4 Hybrid Inheritance

Hybrid inheritance is a combination of two or more types of inheritance. In Java, this can be achieved using a combination of classes and interfaces.

```java
interface Swimmable {
    void swim();
}

class Animal {
    void eat() {
        System.out.println("This animal eats");
    }
}

class Fish extends Animal implements Swimmable {
    @Override
    public void swim() {
        System.out.println("The fish swims");
    }
}

class Duck extends Animal implements Swimmable {
    @Override
    public void swim() {
        System.out.println("The duck swims");
    }
    
    void quack() {
        System.out.println("The duck quacks");
    }
}
```

## 5. Edge Cases and Additional Considerations

### 5.1 Constructor Chaining

Constructors are not inherited, but the superclass constructor is always called (implicitly or explicitly) when creating a subclass object.

```java
class Parent {
    Parent() {
        System.out.println("Parent constructor");
    }
}

class Child extends Parent {
    Child() {
        // super(); is implicitly called here if not explicitly written
        System.out.println("Child constructor");
    }
}

// Output when creating a Child object:
// Parent constructor
// Child constructor
```

### 5.2 Method Overriding vs Method Hiding

Instance methods are overridden, while static methods are hidden.

```java
class Parent {
    void instanceMethod() {
        System.out.println("Parent instance method");
    }
    
    static void staticMethod() {
        System.out.println("Parent static method");
    }
}

class Child extends Parent {
    @Override
    void instanceMethod() {
        System.out.println("Child instance method");
    }
    
    // This hides Parent's staticMethod
    static void staticMethod() {
        System.out.println("Child static method");
    }
}

// Usage
Parent p = new Child();
p.instanceMethod(); // Outputs: Child instance method
p.staticMethod();   // Outputs: Parent static method
```

### 5.3 Final Classes and Methods

The `final` keyword prevents inheritance when used with a class, and prevents method overriding when used with a method.

```java
final class FinalClass {
    void method() {
        System.out.println("This class cannot be inherited");
    }
}

// class ChildClass extends FinalClass {} // Compilation error

class Parent {
    final void finalMethod() {
        System.out.println("This method cannot be overridden");
    }
}

class Child extends Parent {
    // void finalMethod() {} // Compilation error
}
```

### 5.4 Abstract Classes and Methods

Abstract classes cannot be instantiated and may contain abstract methods (methods without a body) that must be implemented by non-abstract subclasses.

```java
abstract class Shape {
    abstract double area();
    
    void display() {
        System.out.println("This is a shape");
    }
}

class Circle extends Shape {
    double radius;
    
    Circle(double radius) {
        this.radius = radius;
    }
    
    @Override
    double area() {
        return Math.PI * radius * radius;
    }
}
```

Remember, while inheritance is a powerful feature, it should be used judiciously. Overuse can lead to complex class hierarchies that are difficult to understand and maintain. Always consider composition as an alternative to inheritance when designing your classes.