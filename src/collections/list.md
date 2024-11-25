```markdown
# Java Collections Documentation

## 1. What is Java Collection?
The Java Collections Framework provides a set of classes and interfaces that implement commonly reusable collection data structures. These include lists, sets, maps, and queues. The collection classes provide a way to store and manipulate groups of data, with various built-in methods for adding, removing, and accessing elements. The framework is part of the `java.util` package.

---

## 2. What is a List?
A `List` in Java is an ordered collection (also known as a sequence) that allows duplicate elements. Elements can be inserted or accessed by their position (index). The `List` interface is a subtype of the `Collection` interface, and it is implemented by classes such as `ArrayList`, `LinkedList`, and `Vector`.

---

## 3. List Example

Here's a simple example using `ArrayList`, which implements the `List` interface:

```java
import java.util.List;
import java.util.ArrayList;

public class ListExample {
    public static void main(String[] args) {
        List<String> fruits = new ArrayList<>();
        
        // Adding elements
        fruits.add("Apple");
        fruits.add("Banana");
        fruits.add("Orange");
        
        // Accessing elements
        System.out.println(fruits.get(1)); // Output: Banana
        
        // Iterating over the list
        for (String fruit : fruits) {
            System.out.println(fruit);
        }
    }
}
```

---

## 4. Capacity vs Size
- **Capacity**: The total number of elements that a `List` can hold before it needs to resize. This is an internal property of a `List` (particularly `ArrayList`).
- **Size**: The number of elements currently stored in the list, which is a property accessible through the `size()` method.

```java
ArrayList<Integer> numbers = new ArrayList<>(10); // Initial capacity is 10
System.out.println(numbers.size());  // Returns 0, since no elements are added
```

The capacity of a list can grow dynamically as elements are added, but the size reflects how many elements are currently stored.

---

## 5. ArrayList vs List

- **ArrayList**: A concrete class that implements the `List` interface. It uses a dynamic array to store elements. ArrayLists allow fast random access and are efficient when accessing elements by index.
- **List**: An interface that defines a contract for ordered collections. `ArrayList` is one implementation of this interface.

Example:
```java
List<String> list = new ArrayList<>();
list.add("A");
list.add("B");
```
In the above code, `ArrayList` is used to implement the `List` interface.

---

## 6. Iteration Methods

- **For-Loop**: Standard loop for accessing elements by index.
  ```java
  for (int i = 0; i < list.size(); i++) {
      System.out.println(list.get(i));
  }
  ```
  
- **Enhanced For-Loop (foreach)**: Shorter syntax to iterate over the entire list.
  ```java
  for (String item : list) {
      System.out.println(item);
  }
  ```
  
- **Iterator**: A `ListIterator` allows traversing the list in forward and backward directions.
  ```java
  Iterator<String> iterator = list.iterator();
  while (iterator.hasNext()) {
      System.out.println(iterator.next());
  }
  ```
  
- **Stream API**: Java 8 introduced Streams for functional-style operations on collections.
  ```java
  list.stream().forEach(System.out::println);
  ```

---

## 7. Basic Operations

- **get()**: Retrieves an element by its index.
  ```java
  String fruit = list.get(0); // Gets the first element
  ```

- **set()**: Replaces an element at a specific index.
  ```java
  list.set(1, "Grapes"); // Replaces the second element with "Grapes"
  ```

- **add()**: Adds an element to the list.
  ```java
  list.add("Peach"); // Adds "Peach" to the end of the list
  ```

- **remove()**: Removes an element by its index or by object reference.
  ```java
  list.remove(1); // Removes the element at index 1
  list.remove("Peach"); // Removes the "Peach" element
  ```

- **addAll()**: Adds all elements from another collection to the list.
  ```java
  List<String> moreFruits = Arrays.asList("Mango", "Pineapple");
  list.addAll(moreFruits); // Adds all elements of moreFruits to list
  ```

---

## 8. `Arrays.asList()` vs `List.of()`

- **`Arrays.asList()`**: Converts an array to a fixed-size list. It creates a backed list that directly reflects changes to the underlying array.
  
  Example:
  ```java
  String[] fruitsArray = {"Apple", "Banana", "Orange"};
  List<String> fruitsList = Arrays.asList(fruitsArray);
  fruitsList.set(1, "Grapes"); // Modifies the array as well
  ```

- **`List.of()`**: A convenience method to create immutable lists in Java. Once created, elements in the list cannot be changed.

  Example:
  ```java
  List<String> fruits = List.of("Apple", "Banana", "Orange");
  // fruits.add("Peach"); // Throws UnsupportedOperationException
  ```

---

## 9. Additional List Operations

- **contains()**: Checks if the list contains a specific element.
  ```java
  boolean hasApple = list.contains("Apple"); // Returns true if "Apple" is in the list
  ```

- **clear()**: Removes all elements from the list.
  ```java
  list.clear(); // Clears all elements in the list
  ```

- **indexOf()**: Finds the index of the first occurrence of an element.
  ```java
  int index = list.indexOf("Banana"); // Returns the index of "Banana"
  ```

- **subList()**: Returns a view of the portion of the list between two specified indexes.
  ```java
  List<String> subList = list.subList(1, 3); // Returns a sublist from index 1 to 2
  ```

---

## 10. Conclusion
Java `List` is a versatile collection type, offering ordered storage and various methods for interacting with its elements. Understanding the differences between `ArrayList`, `List`, and other collection methods (like `addAll`, `get`, `set`, etc.) is crucial for writing efficient Java programs.
```