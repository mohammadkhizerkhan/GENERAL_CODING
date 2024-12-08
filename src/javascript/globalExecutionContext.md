# JavaScript Fundamentals

## Table of Contents
1. [Introduction to JavaScript](#introduction-to-javascript)
2. [Global Execution Context](#global-execution-context)
3. [Memory Creation Phase](#memory-creation-phase)
4. [Execution Phase](#execution-phase)
5. [How Variables Work](#how-variables-work)
6. [Hoisting](#hoisting)
7. [Temporal Dead Zone (TDZ)](#temporal-dead-zone-tdz)

## Introduction to JavaScript
JavaScript is a versatile, interpreted programming language primarily used for web development. It enables dynamic content, controls multimedia, animates images, and much more. JavaScript can interact with HTML and CSS to build interactive web applications.

## Global Execution Context
When a JavaScript program starts, it first creates a global execution context. The global execution context serves as the default context where the majority of the code executes when the program starts. It has two phases: the memory creation phase and the execution phase.

## Memory Creation Phase
During the memory creation phase, JavaScript's engine allocates memory for functions, variables, and objects. This phase also involves setting up the scope chain, the `this` keyword, and the global object.

1. **Variable Initialization**: Variables are declared and initialized in memory with the value `undefined`.
2. **Function Declarations**: Function declarations are stored in memory with their actual definitions.

```javascript
console.log(meaningOfLife); // undefined
console.log(add(2, 3)); // 5

var meaningOfLife = 42;
function add(a, b) {
    return a + b;
}
```

In the example above, during the memory phase:
- `meaningOfLife` is initialized to `undefined`.
- `add` function is stored with its function definition.

## Execution Phase
In the execution phase, the code is executed line-by-line. During execution:
- Variable values can be updated.
- Functions can be invoked, and their respective execution contexts are created.

```javascript
console.log(meaningOfLife); // undefined (hoisted but not initialized yet)
meaningOfLife = 42;

console.log(add(2, 3)); // 5
```

## How Variables Work
Variables in JavaScript can be declared using `var`, `let`, or `const`:
- **`var`**: Function scoped or globally scoped, can be redeclared, and hoisted.
- **`let`**: Block scoped, cannot be redeclared within the same scope, hoisted but not initialized.
- **`const`**: Block scoped, cannot be redeclared or reassigned, must be initialized at declaration.

### Example
```javascript
var x = 10;
let y = 20;
const z = 30;

function example() {
    var a = 1;
    let b = 2;
    const c = 3;
}
```

## Hoisting
Hoisting refers to the process where variable and function declarations are moved to the top of their containing scope during the memory creation phase.

### Example
```javascript
console.log(message); // undefined
var message = "Hello, World!";
```

Even though `message` is declared after the `console.log`, it gets hoisted to the top of its scope with an initial value of `undefined`.

Function declarations, but not expressions, are also hoisted:

```javascript
greet(); // "Hello, World!"

function greet() {
    console.log("Hello, World!");
}
```

## Temporal Dead Zone (TDZ)
The TDZ is a behavior where block-scoped variables (`let` and `const`) cannot be accessed before they are declared.

### Example
```javascript
console.log(a); // ReferenceError: Cannot access 'a' before initialization
let a = 5;
```

In the example above, accessing `a` before it is declared results in a `ReferenceError`.

## Conclusion
Understanding these JavaScript fundamentals is essential for writing efficient and bug-free code. Grasp the global execution context, phases of execution, variable behavior, hoisting, and the temporal dead zone to become proficient in JavaScript development.

For further reading, refer to comprehensive JavaScript guides, MDN Web Docs, or JavaScript tutorials available online.