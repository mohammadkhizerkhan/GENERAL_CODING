# Advanced JavaScript Fundamentals

## Table of Contents
17. [Prototypes](#prototypes)
18. [Prototype Inheritance](#prototype-inheritance)
19. [Understanding `__proto__`](#understanding-proto)
20. [Difference Between `prototype` and `__proto__`](#difference-between-prototype-and--proto)

## Prototypes

### What are Prototypes
In JavaScript, every object has a prototype. A prototype is also an object. When you try to access a property or method of an object, the JavaScript engine looks for that property or method on the object itself. If it doesn't find it, it then looks for it on the object's prototype, and then on the prototype's prototype, and so on, until it reaches the top of the prototype chain (`Object.prototype`). This is called prototypal inheritance.

### Example
```javascript
const person = {
    greet: function() {
        console.log("Hello!");
    }
};

const student = Object.create(person);
student.study = function() {
    console.log("Studying");
};

student.greet(); // Hello! (inherited from person)
student.study(); // Studying
```

## Prototype Inheritance

### How Prototype Inheritance Works
Prototype inheritance allows objects to inherit properties and methods from other objects. This is accomplished by setting one object as the prototype of another. When a request for a property or method is made, the JavaScript engine travels up the prototype chain looking for a match.

### Example
```javascript
function Animal(name) {
    this.name = name;
}

Animal.prototype.speak = function() {
    console.log(`${this.name} makes a sound.`);
};

function Dog(name) {
    Animal.call(this, name);
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.speak = function() {
    console.log(`${this.name} barks.`);
};

const dog = new Dog("Buddy");
dog.speak(); // Buddy barks.
```

In the example above:
- `Animal.prototype.speak` is accessible via the prototype chain.
- `Dog.prototype` is set to an object created from `Animal.prototype`.

## Understanding `__proto__`

### What is `__proto__`
The `__proto__` property is a way to access the prototype of an object. It's a historical, non-standard way of accessing the internal `[[Prototype]]` property of an object. 

### Example
```javascript
const person = {
    greet: function() {
        console.log("Hello!");
    }
};

const student = {
    study: function() {
        console.log("Studying");
    }
};

student.__proto__ = person;

student.greet(); // Hello!
student.study(); // Studying
```

Though `__proto__` is widely supported, it's recommended to use `Object.getPrototypeOf` and `Object.setPrototypeOf` for accessing and setting prototypes to avoid potential compatibility issues.

### Example using `Object.getPrototypeOf` and `Object.setPrototypeOf`
```javascript
const person = {
    greet: function() {
        console.log("Hello!");
    }
};

const student = {
    study: function() {
        console.log("Studying");
    }
};

Object.setPrototypeOf(student, person);

console.log(Object.getPrototypeOf(student) === person); // true
student.greet(); // Hello!
student.study(); // Studying
```

## Difference Between `prototype` and `__proto__`

### `prototype`
`prototype` is a property of constructor functions. When you create a function in JavaScript, JavaScript adds a `prototype` property to the function. This `prototype` property is an object that contains a constructor property, which points back to the function itself.

### Example
```javascript
function Person(name) {
    this.name = name;
}

console.log(Person.prototype); // { constructor: f Person(), ... }
```

When you create an object using a constructor function (`new Person()`), the created object's internal `[[Prototype]]` property (`__proto__`) is set to the constructor's `prototype` object.

### `__proto__`
`__proto__` is a reference to the prototype object that is used for inheritance. All objects have `__proto__`, which points to their prototype.

### Example
```javascript
const person = new Person("John");

console.log(person.__proto__ === Person.prototype); // true
```

### Key Differences
- **`prototype`**: 
  - Property of a constructor function.
  - Used when creating new objects.
  - Contains all the properties and methods that should be available to instances of the constructor.

- **`__proto__`**: 
  - Internal property of all objects (except objects created with `Object.create(null)`).
  - Points to the prototype of the object.
  - Used to access properties and methods from the prototype chain.

## Recap of Additional Concepts

### Inherent Ability to Extend Prototypes
JavaScript allows extending the built-in prototypes like `Array.prototype`, `String.prototype`, etc. However, it needs to be done carefully to avoid conflicts.

### Example
```javascript
Array.prototype.sum = function() {
    return this.reduce((acc, current) => acc + current, 0);
};

const numbers = [1, 2, 3, 4];
console.log(numbers.sum()); // 10
```

### Avoiding Issues with Prototype Modification
- **Use Object.create**: Creating objects with `Object.create` without prototypes can avoid accidental conflicts.
- **Namespace Your Extensions**: Ensure you namespace any prototype extensions to avoid overriding existing properties.

### Example
```javascript
const myNamespace = {
    sum: function(arr) {
        return arr.reduce((acc, current) => acc + current, 0);
    }
};

console.log(myNamespace.sum([1, 2, 3, 4])); // 10
```

## Conclusion

Understanding prototypes and how they relate to inheritance in JavaScript is crucial for mastering the language’s object-oriented aspects. The distinction between `prototype` and `__proto__` is fundamental for leveraging prototypal inheritance correctly. Building a solid understanding of these concepts, along with careful management of prototype extensions, will ensure that your JavaScript code remains robust, maintainable, and free of unintended conflicts.