# Multithreading in Java

## Introduction

Multithreading in Java allows concurrent execution of two or more threads. Java makes it easy to create and manage threads, which can significantly boost performance, particularly in applications that require parallel processing. This document provides an overview of Java threads, how to create them, and various methods and concepts related to thread management.

## What are Java Threads?

A thread in Java is a lightweight process that shares the same memory space with other threads of the same process, enabling parallel execution within a single program. Each thread runs a separate path of execution in the program, allowing for multitasking and improving performance in multi-core processors.

## How to Create Java Threads

### Thread Class

The `Thread` class provides constructors and methods to create and manage threads. To create a thread by extending the `Thread` class, you need to override the `run` method where you define the code that constitutes the new thread's task.

```java
class MyThread extends Thread {
    public void run() {
        System.out.println("Thread is running");
    }
}

public class Main {
    public static void main(String[] args) {
        MyThread thread = new MyThread();
        thread.start();  // Starts the thread, which invokes the run method.
    }
}
```

### Runnable Interface

Implementing the `Runnable` interface creates a thread by defining the `run` method. This approach is preferred when you need to extend another class, as Java does not support multiple inheritance.

```java
class MyRunnable implements Runnable {
    public void run() {
        System.out.println("Runnable thread is running");
    }
}

public class Main {
    public static void main(String[] args) {
        MyRunnable myRunnable = new MyRunnable();
        Thread thread = new Thread(myRunnable);
        thread.start();  // Starts the thread, which invokes the run method.
    }
}
```

### Difference Between `Thread` Class and `Runnable` Interface

- **Thread Class**: Inherits from `Thread` and overrides the `run` method. Easier for simpler use cases but less flexible as it requires inheritance.
- **Runnable Interface**: Implements the `Runnable` interface and defines the `run` method. More flexible and preferred due to the ability to extend other classes.

## Basic Methods of Thread

- `start()`: Begins the execution of the thread, calling the `run` method.
- `run()`: Defines the task for the thread. This method should be overridden.
- `sleep(long millis)`: Causes the current thread to sleep for a specified period.
- `join()`: Waits for the thread to die.
- `yield()`: Causes the currently executing thread to pause and allow other threads to execute.
- `interrupt()`: Interrupts a thread.

## Thread Lifecycle

- **New**: A thread is in the new state if you create an instance of the Thread class but haven't started it yet.
- **Runnable**: A thread is in the runnable state after it is started and ready to run. The thread may be waiting for CPU time.
- **Blocked**: A thread that is blocked waiting for a monitor lock.
- **Waiting**: A thread that is waiting indefinitely for another thread to perform a particular action.
- **Timed Waiting**: A thread that is waiting for another thread to perform an action within a bounded waiting time.
- **Terminated**: A thread that has exited.

## Thread Methods

### `Thread.yield()`

The `yield` method pauses the currently executing thread to give other threads a chance to run.

```java
public class Main {
    public static void main(String[] args) {
        Thread thread = new Thread(() -> {
            for (int i = 0; i < 5; i++) {
                System.out.println("Running thread");
                Thread.yield();
            }
        });
        thread.start();
    }
}
```

Sure! Here are updated examples for `join()`, daemon threads, and `interrupt()`.

### `Thread.join()`

The `join` method allows one thread to wait for the completion of another. This is useful when you want one task to wait for another to complete before proceeding.

```java
class PrintTask extends Thread {
    private String message;

    public PrintTask(String message) {
        this.message = message;
    }

    @Override
    public void run() {
        for (int i = 0; i < 5; i++) {
            System.out.println(message + " " + i);
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                System.out.println(message + " interrupted.");
            }
        }
        System.out.println(message + " completed.");
    }
}

public class Main {
    public static void main(String[] args) {
        Thread thread1 = new PrintTask("Thread1");
        Thread thread2 = new PrintTask("Thread2");

        thread1.start();
        try {
            thread1.join();  // Main thread waits for thread1 to complete.
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        thread2.start();  // This will start only after thread1 has completed.
        try {
            thread2.join();  // Main thread waits for thread2 to complete.
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("Both threads completed.");
    }
}
```

### Daemon Threads

Daemon threads are background service threads that automatically terminate when all user threads finish execution. They are useful for housekeeping tasks like garbage collection.

```java
public class DaemonThreadExample {

    public static void main(String[] args) {
        Thread daemonThread = new Thread(() -> {
            while (true) {
                System.out.println("Daemon thread is running");
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    System.out.println("Daemon thread interrupted.");
                }
            }
        });

        // Setting the thread as a daemon thread
        daemonThread.setDaemon(true);
        daemonThread.start();

        try {
            // Main thread sleeps for 3 seconds
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("Main thread ending. Daemon thread will also stop.");
    }
}
```

In this example, the daemon thread will stop running as soon as the main thread finishes.

### `Thread.interrupt()`

The `interrupt()` method is used to signal a thread that it should stop what it is doing and do something else. This can be caught using `InterruptedException`.

```java
public class InterruptExample {

    public static void main(String[] args) {
        Thread runningThread = new Thread(() -> {
            try {
                for (int i = 0; i < 10; i++) {
                    System.out.println("Running " + i);
                    Thread.sleep(1000);  // Simulating work with sleep
                }
            } catch (InterruptedException e) {
                System.out.println("Thread interrupted.");
            }
        });

        runningThread.start();

        try {
            // Main thread sleeps for 3 seconds before interrupting
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        runningThread.interrupt();  // Interrupting the thread after 3 seconds
    }
}
```

In this example, the `runningThread` will be interrupted after 3 seconds, and the message `"Thread interrupted."` will be printed.

## Conclusion

Multithreading in Java is a powerful tool for improving the performance of applications by allowing concurrent execution of tasks. Understanding the basics of creating threads, managing their lifecycle, and using essential methods such as `join`, `yield`, and daemon threads is vital for any Java developer. By leveraging these techniques, developers can write efficient, responsive, and high-performance Java applications.