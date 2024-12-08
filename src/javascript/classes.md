# Advanced JavaScript Fundamentals

## Table of Contents
14. [Objects](#objects)
15. [Classes and Class-Based Syntax](#classes-and-class-based-syntax)
16. [Object-Oriented Programming (OOP) Principles](#object-oriented-programming-oop-principles)

## Objects

### What are Objects
Objects in JavaScript are collections of key-value pairs, where keys are strings (or symbols) and values can be any data type, including other objects. Objects are fundamental to JavaScript and are used to model real-world entities.

### How to Create Objects
There are several ways to create objects in JavaScript:

1. **Object Literal Notation**:
```javascript
const person = {
    name: "John",
    age: 30,
    greet: function() {
        console.log("Hello!");
    }
};
console.log(person.name); // John
person.greet(); // Hello!
```

2. **Constructor Function**:
```javascript
function Person(name, age) {
    this.name = name;
    this.age = age;
    this.greet = function() {
        console.log("Hello!");
    };
}
const person = new Person("John", 30);
console.log(person.name); // John
person.greet(); // Hello!
```

3. **Using `Object.create`**:
```javascript
const personProto = {
    greet: function() {
        console.log("Hello!");
    }
};

const person = Object.create(personProto);
person.name = "John";
person.age = 30;

console.log(person.name); // John
person.greet(); // Hello!
```

## Classes and Class-Based Syntax

### Why Classes Introduced
Classes were introduced in ECMAScript 2015 (ES6) to provide a more intuitive and cleaner syntax for creating objects and handling inheritance. Classes make it easier to implement object-oriented programming (OOP) principles in JavaScript.

### Class-Based Syntax
JavaScript's class syntax is a syntactic sugar over the existing prototype-based inheritance. It provides a cleaner and more readable way to create constructor functions and prototype methods.

### Example
```javascript
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    greet() {
        console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
    }
}

const person = new Person("John", 30);
console.log(person.name); // John
person.greet(); // Hello, my name is John and I am 30 years old.
```

### Inheritance
```javascript
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    greet() {
        console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
    }
}

class Student extends Person {
    constructor(name, age, grade) {
        super(name, age);
        this.grade = grade;
    }

    study() {
        console.log(`${this.name} is studying.`);
    }
}

const student = new Student("Alice", 20, "A");
console.log(student.name); // Alice
student.greet(); // Hello, my name is Alice and I am 20 years old.
student.study(); // Alice is studying.
```

## Object-Oriented Programming (OOP) Principles

Object-oriented programming (OOP) is a paradigm centered around objects and classes. JavaScript supports OOP principles which can make code more modular, reusable, and flexible.

### Four Core Principles of OOP
1. **Encapsulation**
2. **Abstraction**
3. **Inheritance**
4. **Polymorphism**

### Encapsulation
Encapsulation restricts direct access to some of an object's components and can prevent the accidental modification of data. It is achieved using closures or ES6 classes.

#### Example
```javascript
class Person {
    #name; // Private field

    constructor(name) {
        this.#name = name;
    }

    getName() {
        return this.#name;
    }
}

const person = new Person("John");
console.log(person.getName()); // John
console.log(person.#name); // SyntaxError: Private field '#name' must be declared in an enclosing class
```

### Abstraction
Abstraction hides the complex implementation details and exposes only the necessary parts. It simplifies a complex system by modeling classes appropriate to the problem.

#### Example
```javascript
class Car {
    startEngine() {
        console.log("Engine started");
    }

    drive() {
        this.startEngine();
        console.log("Driving");
    }
}

const car = new Car();
car.drive(); // Engine started \n Driving
```

### Inheritance
Inheritance allows one class to inherit properties and methods from another class.

#### Example
```javascript
class Animal {
    constructor(name) {
        this.name = name;
    }

    speak() {
        console.log(`${this.name} makes a noise.`);
    }
}

class Dog extends Animal {
    constructor(name) {
        super(name);
    }

    speak() {
        console.log(`${this.name} barks.`);
    }
}

const dog = new Dog("Buddy");
dog.speak(); // Buddy barks.
```

### Polymorphism
Polymorphism allows methods to do different things based on the object it is acting upon. It provides a way to perform a single action in different forms.

#### Example
```javascript
class Animal {
    constructor(name) {
        this.name = name;
    }

    speak() {
        console.log(`${this.name} makes a noise.`);
    }
}

class Dog extends Animal {
    constructor(name) {
        super(name);
    }

    speak() {
        console.log(`${this.name} barks.`);
    }
}

class Cat extends Animal {
    constructor(name) {
        super(name);
    }

    speak() {
        console.log(`${this.name} meows.`);
    }
}

const animals = [new Dog("Buddy"), new Cat("Whiskers")];
animals.forEach(animal => animal.speak());
// Buddy barks.
// Whiskers meows.
```

## Conclusion

Understanding the core concepts of JavaScript including objects, class syntax, and OOP principles is key to writing organized and efficient code. By leveraging encapsulation, abstraction, inheritance, and polymorphism, developers can create robust and maintainable applications. The introduction of classes in ES6 has made it easier to apply these principles in a more readable and structured way.