# Advanced JavaScript Fundamentals

## Table of Contents
8. [Asynchronous Programming](#asynchronous-programming)
9. [Call Stack](#call-stack)
10. [Event Loop](#event-loop)
11. [Task Queue (Callback Queue)](#task-queue-callback-queue)
12. [Microtask Queue](#microtask-queue)
13. [Difference Between Task Queue and Microtask Queue](#difference-between-task-queue-and-microtask-queue)

## Asynchronous Programming

### Introduction to Asynchronous Programming
Asynchronous programming in JavaScript allows for performing tasks such as data fetching, file reading, and timers without blocking the main thread. This is crucial for creating performant web applications that remain responsive to user interactions while waiting for other operations to complete.

### Example of Asynchronous Code
```javascript
console.log('Start');

setTimeout(() => {
    console.log('Async Operation');
}, 2000);

console.log('End');
```
Output:
```
Start
End
Async Operation
```

Here, `setTimeout` is an asynchronous function that schedules the callback to execute after the given delay, allowing the rest of the code to run without waiting.

## Call Stack

### What is Call Stack
The call stack is a data structure used by the JavaScript engine to keep track of function calls. When a function is invoked, it is added to the top of the stack. When the function finishes executing, it is removed from the stack.

### Example
```javascript
function first() {
    second();
    console.log('First Function');
}

function second() {
    console.log('Second Function');
}

first();
```
Output:
```
Second Function
First Function
```

Here's how the call stack evolves:
- `first` is added to the stack.
- `second` is added to the stack.
- `second` is removed from the stack after logging.
- `first` is removed from the stack after logging.

## Event Loop

### What is Event Loop
The event loop is a mechanism that coordinates the execution of code, collects and processes events, and executes queued sub-tasks. Its primary role is to check the call stack and task queue (callback queue) to decide what should be executed.

### Why Event Loop is Created
The event loop was created to handle non-blocking asynchronous operations, ensuring that the JavaScript engine can perform long-running operations without stopping the entire script.

### How Event Loop Works
1. The event loop checks the call stack and executes any functions there.
2. If the stack is empty, it looks into the task queue and moves the first task to the stack.
3. It repeats this process continuously.

## Task Queue (Callback Queue)

### What is Task Queue
The task queue (or callback queue) is a queue where tasks (generally callbacks) are placed once they are ready to be executed. These tasks are usually results of asynchronous operations such as `setTimeout`, `setInterval`, or `event handlers`.

### Example
```javascript
console.log('Start');

setTimeout(() => {
    console.log('Timeout Callback');
}, 0);

console.log('End');
```
Output:
```
Start
End
Timeout Callback
```

The callback from `setTimeout` is placed in the task queue and executed when the call stack is empty.

## Microtask Queue

### What is Microtask Queue
The microtask queue is similar to the task queue but has a higher priority. Microtasks include promises and other queue microtasks. The event loop processes the microtask queue before the task queue, ensuring these operations are handled as soon as the current stack frame clears.

### Example
```javascript
console.log('Start');

Promise.resolve().then(() => {
    console.log('Promise Callback');
});

console.log('End');
```
Output:
```
Start
End
Promise Callback
```

The callback in the promise is placed in the microtask queue and executed before the task queue items.

## Difference Between Task Queue and Microtask Queue

### Main Differences

1. **Priority**:
    - **Microtask Queue**: Higher priority, processed before the task queue.
    - **Task Queue**: Lower priority, processed after the microtask queue.

2. **Use Cases**:
    - **Microtask Queue**: Promises and `MutationObserver`.
    - **Task Queue**: `setTimeout`, `setInterval`, and other callback-based APIs.

3. **Execution**:
    - **Microtask Queue**: Drained entirely before the event loop processes the next frame.
    - **Task Queue**: Executes one task per iteration of the event loop.

### Example for Difference
```javascript
console.log('Start');

setTimeout(() => {
    console.log('Timeout Callback');
}, 0);

Promise.resolve().then(() => {
    console.log('Promise Callback');
});

console.log('End');
```
Output:
```
Start
End
Promise Callback
Timeout Callback
```

Here, the promise callback (`Promise Callback`) in the microtask queue executes before the `setTimeout` callback (`Timeout Callback`) in the task queue.

## Conclusion
Understanding these advanced JavaScript concepts is critical to mastering asynchronous programming and writing efficient, non-blocking code. The event loop, task queue, and microtask queue are fundamental to managing asynchronous operations, ensuring that JavaScript applications remain responsive and performant.