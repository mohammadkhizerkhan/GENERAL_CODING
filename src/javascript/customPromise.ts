type Executor<T> = (
    resolve: (value: T) => void,
    reject: (reason?: any) => void
  ) => void;
  
  enum PromiseState {
    PENDING,
    FULFILLED,
    REJECTED,
  }
  
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
  
    private resolve(value: T) {
      setTimeout(() => {
        if (this.state === PromiseState.PENDING) {
          this.state = PromiseState.FULFILLED;
          this.value = value;
          this.onFulfilledCallbacks.forEach((callback) => callback(value));
        }
      }, 0);
    }
  
    private reject(reason: any) {
      setTimeout(() => {
        if (this.state === PromiseState.PENDING) {
          this.state = PromiseState.REJECTED;
          this.reason = reason;
          this.onRejectedCallbacks.forEach((callback) => callback(reason));
        }
      }, 0);
    }
  
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
  
    public catch<U>(
      onRejected: (reason: any) => U | CustomPromise<U>
    ): CustomPromise<U> {
      return this.then(undefined, onRejected);
    }
  
    public static resolve<U>(value: U): CustomPromise<U> {
      return new CustomPromise<U>((resolve) => resolve(value));
    }
  
    public static reject<U>(reason: any): CustomPromise<U> {
      return new CustomPromise<U>((_, reject) => reject(reason));
    }
  }
  
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