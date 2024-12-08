# Custom Promise Implementation in TypeScript

## Table of Contents
1. [Introduction](#introduction)
2. [Executor Type and Promise States](#executor-type-and-promise-states)
3. [CustomPromise Class](#custompromise-class)
4. [Internal Methods](#internal-methods)
5. [Promise Chaining](#promise-chaining)
6. [Usage Example](#usage-example)
7. [Conclusion](#conclusion)

## Introduction

In JavaScript and TypeScript, promises are used for handling asynchronous operations. Here, we demonstrate a custom implementation of a promise (`CustomPromise`). This implementation mimics the behavior of native promises, providing essential methods like `then`, `catch`, `resolve`, and `reject`.

## Executor Type and Promise States

### Executor Type
An executor is a function that gets passed to the constructor of the `CustomPromise`. It takes two functions as parameters: `resolve` and `reject`.

```typescript
type Executor<T> = (
  resolve: (value: T) => void,
  reject: (reason?: any) => void
) => void;
```

### Promise States
A promise can be in one of three states: `PENDING`, `FULFILLED`, or `REJECTED`. These states inform the state of the asynchronous operation.

```typescript
enum PromiseState {
  PENDING,
  FULFILLED,
  REJECTED,
}
```

## CustomPromise Class

The `CustomPromise` class encapsulates the logic for handling asynchronous operations and allows chaining via the `then` and `catch` methods.

### Constructor
The constructor initializes the promise state and starts the executor:

```typescript
class CustomPromise<T> {
  private state: PromiseState = PromiseState.PENDING;
  private value: T | null = null;
  private reason: any = null;
  private onFulfilledCallbacks: Array<(value: T) => void> = [];
  private onRejectedCallbacks: Array<(reason: any) => void> = [];

  constructor(executor: Executor<T>) {
    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }
```

## Internal Methods

### Resolve
The `resolve` method transitions the promise from the `PENDING` state to the `FULFILLED` state and triggers any `then` callbacks.

```typescript
private resolve(value: T) {
  setTimeout(() => {
    if (this.state === PromiseState.PENDING) {
      this.state = PromiseState.FULFILLED;
      this.value = value;
      this.onFulfilledCallbacks.forEach((callback) => callback(value));
    }
  }, 0);
}
```

### Reject
The `reject` method transitions the promise from the `PENDING` state to the `REJECTED` state and triggers any `catch` callbacks.

```typescript
private reject(reason: any) {
  setTimeout(() => {
    if (this.state === PromiseState.PENDING) {
      this.state = PromiseState.REJECTED;
      this.reason = reason;
      this.onRejectedCallbacks.forEach((callback) => callback(reason));
    }
  }, 0);
}
```

## Promise Chaining

### Then
The `then` method allows for chaining promises. It accepts two callbacks: `onFulfilled` and `onRejected`.

```typescript
public then<U>(
  onFulfilled?: (value: T) => U | CustomPromise<U>,
  onRejected?: (reason: any) => U | CustomPromise<U>
): CustomPromise<U> {
  return new CustomPromise<U>((resolve, reject) => {
    const handleFulfilled = (value: T) => {
      if (onFulfilled) {
        try {
          const result = onFulfilled(value);
          if (result instanceof CustomPromise) {
            result.then(resolve, reject);
          } else {
            resolve(result);
          }
        } catch (error) {
          reject(error);
        }
      } else {
        resolve(value as unknown as U);
      }
    };

    const handleRejected = (reason: any) => {
      if (onRejected) {
        try {
          const result = onRejected(reason);
          if (result instanceof CustomPromise) {
            result.then(resolve, reject);
          } else {
            resolve(result);
          }
        } catch (error) {
          reject(error);
        }
      } else {
        reject(reason);
      }
    };

    if (this.state === PromiseState.FULFILLED) {
      handleFulfilled(this.value as T);
    } else if (this.state === PromiseState.REJECTED) {
      handleRejected(this.reason);
    } else {
      this.onFulfilledCallbacks.push(handleFulfilled);
      this.onRejectedCallbacks.push(handleRejected);
    }
  });
}
```

### Catch
The `catch` method handles promise rejections and allows chaining error handling.

```typescript
public catch<U>(
  onRejected: (reason: any) => U | CustomPromise<U>
): CustomPromise<U> {
  return this.then(undefined, onRejected);
}
```

### Static Methods
The `resolve` and `reject` static methods create fulfilled and rejected promises respectively.

```typescript
public static resolve<U>(value: U): CustomPromise<U> {
  return new CustomPromise<U>((resolve) => resolve(value));
}

public static reject<U>(reason: any): CustomPromise<U> {
  return new CustomPromise<U>((_, reject) => reject(reason));
}
```

## Usage Example

The following example demonstrates how to use the custom promise with chaining operations.

```typescript
// Usage Example with Chaining
const asyncOperation = (): CustomPromise<string> => {
  return new CustomPromise<string>((resolve, reject) => {
    setTimeout(() => {
      const success = true;
      if (success) {
        resolve('Operation completed successfully');
      } else {
        reject('Operation failed');
      }
    }, 2000);
  });
};

const anotherAsyncOperation = (input: string): CustomPromise<string> => {
  return new CustomPromise<string>((resolve, reject) => {
    setTimeout(() => {
      resolve(`Processed: ${input}`);
    }, 1000);
  });
};

const customPromiseInstance = asyncOperation();

customPromiseInstance
  .then((result) => {
    console.log(result); // Output: Operation completed successfully
    return anotherAsyncOperation(result); // Return another promise
  })
  .then((newResult) => {
    console.log(newResult); // Output: Processed: Operation completed successfully
  })
  .catch((error) => {
    console.error(error);
  });
```

## Explanation

1. **Executor Function**: `asyncOperation` is defined to return a `CustomPromise` that resolves after 2 seconds.
2. **Promise Chaining**: `then` methods are used to chain further operations. The first `then` logs the result of `asyncOperation` and invokes `anotherAsyncOperation` with the result as input.
3. **Result Handling**: The second `then` logs the result of `anotherAsyncOperation`.
4. **Error Handling**: The `catch` method handles any errors that may occur during the promise execution.

## Conclusion

The `CustomPromise` class is a powerful demonstration of how promises work internally in JavaScript. It provides a robust mechanism for handling asynchronous operations, with support for promise chaining and error handling. By understanding and implementing a custom promise, we gain deeper insights into the inner workings of JavaScript promises and asynchronous programming.

### CustomPromise Class Diagram

```plaintext
+-------------------------------------+
|            CustomPromise            |
|-------------------------------------|
| - state: PromiseState               |
| - value: T | null                   |
| - reason: any                       |
| - onFulfilledCallbacks: Array<>     |
| - onRejectedCallbacks: Array<>      |
|-------------------------------------|
| + constructor(executor: Executor<T>)|
| + then<U>(onFulfilled?, onRejected?)|
| + catch<U>(onRejected?)             |
| + static resolve<U>(value: U)       |
| + static reject<U>(reason: any)     |
+-------------------------------------+
```

## Summary

This document has covered the implementation details of a custom promise in TypeScript, explained promise states, and explored promise chaining through the `then` and `catch` methods. By following the example provided, developers can better grasp the mechanics of promises and apply these concepts in real-world applications.