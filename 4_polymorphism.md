# Java Polymorphism Concepts

## 1. Polymorphism Basics

Polymorphism in Java allows objects of different types to be treated as objects of a common super type. It enables a single interface to represent different underlying forms (data types or classes).

## 2. Types of Polymorphism

There are two main types of polymorphism in Java:

1. Compile-time Polymorphism (Static Polymorphism)
2. Runtime Polymorphism (Dynamic Polymorphism)

### 2.1 Compile-time Polymorphism (Static Polymorphism)

This type of polymorphism is achieved through method overloading.

#### Method Overloading

Method overloading allows a class to have multiple methods with the same name but different parameters.

```java
class Calculator {
    int add(int a, int b) {
        return a + b;
    }
    
    double add(double a, double b) {
        return a + b;
    }
    
    int add(int a, int b, int c) {
        return a + b + c;
    }
}

// Usage
Calculator calc = new Calculator();
System.out.println(calc.add(5, 10));       // Calls the first method
System.out.println(calc.add(5.5, 10.5));   // Calls the second method
System.out.println(calc.add(5, 10, 15));   // Calls the third method
```

### 2.2 Runtime Polymorphism (Dynamic Polymorphism)

This type of polymorphism is achieved through method overriding.

#### Method Overriding

Method overriding occurs when a subclass has a method with the same name and signature as a method in its superclass.

```java
class Animal {
    void makeSound() {
        System.out.println("The animal makes a sound");
    }
}

class Dog extends Animal {
    @Override
    void makeSound() {
        System.out.println("The dog barks");
    }
}

class Cat extends Animal {
    @Override
    void makeSound() {
        System.out.println("The cat meows");
    }
}

// Usage
Animal myDog = new Dog();
Animal myCat = new Cat();
myDog.makeSound();  // Outputs: The dog barks
myCat.makeSound();  // Outputs: The cat meows
```

## 3. How Java Determines Which Method to Run

### 3.1 For Static Polymorphism (Method Overloading)

The compiler determines which method to call based on the method name and the number, types, and order of the arguments passed.

### 3.2 For Dynamic Polymorphism (Method Overriding)

The Java Virtual Machine (JVM) determines which method to call at runtime based on the actual object type, not the reference type.

```java
Animal genericAnimal = new Dog();
genericAnimal.makeSound();  // Outputs: The dog barks
```

Even though `genericAnimal` is of type `Animal`, it calls the `Dog` class's `makeSound()` method because the actual object is a `Dog`.

## 4. Why We Can't Override Static Methods

Static methods belong to the class rather than instances of the class. They are resolved at compile time based on the reference type, not the object type. Therefore, they can't be overridden in the same way instance methods can.

```java
class Parent {
    static void staticMethod() {
        System.out.println("Parent's static method");
    }
}

class Child extends Parent {
    // This hides Parent's staticMethod, it doesn't override it
    static void staticMethod() {
        System.out.println("Child's static method");
    }
}

// Usage
Parent.staticMethod();  // Outputs: Parent's static method
Child.staticMethod();   // Outputs: Child's static method

Parent p = new Child();
p.staticMethod();       // Outputs: Parent's static method
```

## 5. Edge Cases and Additional Considerations

### 5.1 Covariant Return Types

Since Java 5, it's possible to override a method and have it return a subclass of the return type declared in the superclass.

```java
class Animal {}
class Dog extends Animal {}

class AnimalTrainer {
    Animal getAnimal() {
        return new Animal();
    }
}

class DogTrainer extends AnimalTrainer {
    @Override
    Dog getAnimal() {  // Covariant return type
        return new Dog();
    }
}
```

### 5.2 Private Methods and Polymorphism

Private methods are not inherited and therefore cannot be overridden. They can, however, be redefined in the subclass.

```java
class Parent {
    private void privateMethod() {
        System.out.println("Parent's private method");
    }
    
    public void publicMethod() {
        privateMethod();
    }
}

class Child extends Parent {
    private void privateMethod() {
        System.out.println("Child's private method");
    }
}

// Usage
Parent p = new Child();
p.publicMethod();  // Outputs: Parent's private method
```

### 5.3 Method Hiding with Instance Variables

While methods can be overridden, instance variables cannot. They can be hidden, but this can lead to confusing behavior.

```java
class Parent {
    public String name = "Parent";
}

class Child extends Parent {
    public String name = "Child";
}

// Usage
Parent p = new Child();
System.out.println(p.name);  // Outputs: Parent
```

### 5.4 Polymorphism and Interfaces

Interfaces play a crucial role in achieving polymorphism in Java, especially when multiple inheritance of behavior is needed.

```java
interface Flyable {
    void fly();
}

class Bird implements Flyable {
    public void fly() {
        System.out.println("The bird flies");
    }
}

class Airplane implements Flyable {
    public void fly() {
        System.out.println("The airplane flies");
    }
}

// Usage
Flyable flyingObject1 = new Bird();
Flyable flyingObject2 = new Airplane();
flyingObject1.fly();  // Outputs: The bird flies
flyingObject2.fly();  // Outputs: The airplane flies
```

### 5.5 Polymorphism and Exception Handling

When overriding methods, the overriding method can't throw broader checked exceptions than declared in the superclass method.

```java
class Parent {
    void method() throws IOException {
        // method implementation
    }
}

class Child extends Parent {
    @Override
    void method() throws FileNotFoundException {  // This is okay (FileNotFoundException is a subclass of IOException)
        // method implementation
    }
}
```

Remember, while polymorphism is a powerful feature of object-oriented programming, it should be used judiciously. Overuse can lead to complex and hard-to-maintain code. Always strive for clear and understandable designs.