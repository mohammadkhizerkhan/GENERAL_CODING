# Java Comparator - Complete Guide

## Table of Contents
1. [What is Comparator?](#what-is-comparator)
2. [Comparator vs Comparable](#comparator-vs-comparable)
3. [Creating Comparators](#creating-comparators)
4. [Common Use Cases](#common-use-cases)
5. [Method Reference and Lambda Expressions](#method-reference-and-lambda-expressions)
6. [Chaining Comparators](#chaining-comparators)
7. [Utility Methods](#utility-methods)
8. [Real-World Examples](#real-world-examples)
9. [Best Practices](#best-practices)

## What is Comparator?

**Comparator** is a functional interface in Java that defines a comparison function to impose a total ordering on objects. Unlike `Comparable`, which requires modifying the class itself, `Comparator` allows you to define custom sorting logic externally.

### Key Features:
- **Functional Interface**: Contains only one abstract method `compare(T o1, T o2)`
- **External Sorting**: Define sorting logic without modifying the original class
- **Multiple Sorting Strategies**: Create different comparators for the same class
- **Flexible**: Can be used with Collections, Arrays, Streams, and more

### Interface Definition:
```java
@FunctionalInterface
public interface Comparator<T> {
    int compare(T o1, T o2);
    // default and static methods...
}
```

## Comparator vs Comparable

| Aspect | Comparable | Comparator |
|--------|------------|------------|
| **Location** | Inside the class | External class/lambda |
| **Method** | `compareTo(T o)` | `compare(T o1, T o2)` |
| **Sorting Logic** | Single, natural ordering | Multiple custom orderings |
| **Modification** | Requires class modification | No class modification needed |
| **Package** | `java.lang` | `java.util` |

## Creating Comparators

### 1. Anonymous Inner Class (Traditional Way)
```java
import java.util.*;

public class ComparatorExample {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("John", "Alice", "Bob", "Charlie");
        
        // Sort by length using anonymous inner class
        Collections.sort(names, new Comparator<String>() {
            @Override
            public int compare(String s1, String s2) {
                return Integer.compare(s1.length(), s2.length());
            }
        });
        
        System.out.println("Sorted by length: " + names);
        // Output: [Bob, John, Alice, Charlie]
    }
}
```

### 2. Lambda Expressions (Modern Way)
```java
import java.util.*;

public class LambdaComparator {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("John", "Alice", "Bob", "Charlie");
        
        // Sort by length using lambda
        Collections.sort(names, (s1, s2) -> Integer.compare(s1.length(), s2.length()));
        
        // Even shorter with method reference
        Collections.sort(names, Comparator.comparing(String::length));
        
        System.out.println("Sorted by length: " + names);
    }
}
```

### 3. Separate Comparator Class
```java
class LengthComparator implements Comparator<String> {
    @Override
    public int compare(String s1, String s2) {
        return Integer.compare(s1.length(), s2.length());
    }
}

// Usage
List<String> names = Arrays.asList("John", "Alice", "Bob");
Collections.sort(names, new LengthComparator());
```

## Common Use Cases

### 1. Sorting Custom Objects
```java
class Person {
    private String name;
    private int age;
    private double salary;
    
    public Person(String name, int age, double salary) {
        this.name = name;
        this.age = age;
        this.salary = salary;
    }
    
    // Getters
    public String getName() { return name; }
    public int getAge() { return age; }
    public double getSalary() { return salary; }
    
    @Override
    public String toString() {
        return String.format("Person{name='%s', age=%d, salary=%.2f}", name, age, salary);
    }
}

public class PersonSorting {
    public static void main(String[] args) {
        List<Person> people = Arrays.asList(
            new Person("Alice", 30, 50000),
            new Person("Bob", 25, 60000),
            new Person("Charlie", 35, 45000)
        );
        
        // Sort by age
        Collections.sort(people, Comparator.comparing(Person::getAge));
        System.out.println("Sorted by age: " + people);
        
        // Sort by salary (descending)
        Collections.sort(people, Comparator.comparing(Person::getSalary).reversed());
        System.out.println("Sorted by salary (desc): " + people);
        
        // Sort by name
        Collections.sort(people, Comparator.comparing(Person::getName));
        System.out.println("Sorted by name: " + people);
    }
}
```

### 2. Null-Safe Comparisons
```java
public class NullSafeComparison {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("Alice", null, "Bob", "Charlie", null);
        
        // Null-safe comparison (nulls last)
        Collections.sort(names, Comparator.nullsLast(String::compareTo));
        System.out.println("Nulls last: " + names);
        
        // Null-safe comparison (nulls first)
        Collections.sort(names, Comparator.nullsFirst(String::compareTo));
        System.out.println("Nulls first: " + names);
    }
}
```

## Method Reference and Lambda Expressions

### Common Patterns:
```java
// Method reference examples
Comparator<Person> byAge = Comparator.comparing(Person::getAge);
Comparator<Person> byName = Comparator.comparing(Person::getName);
Comparator<String> byLength = Comparator.comparing(String::length);

// Lambda expressions
Comparator<Person> bySalary = (p1, p2) -> Double.compare(p1.getSalary(), p2.getSalary());
Comparator<String> ignoreCase = (s1, s2) -> s1.compareToIgnoreCase(s2);

// Complex lambda
Comparator<Person> custom = (p1, p2) -> {
    int ageComparison = Integer.compare(p1.getAge(), p2.getAge());
    if (ageComparison != 0) {
        return ageComparison;
    }
    return p1.getName().compareTo(p2.getName());
};
```

## Chaining Comparators

### 1. Using thenComparing()
```java
public class ComparatorChaining {
    public static void main(String[] args) {
        List<Person> people = Arrays.asList(
            new Person("Alice", 30, 50000),
            new Person("Bob", 30, 60000),
            new Person("Alice", 25, 55000)
        );
        
        // First by name, then by age, then by salary
        Comparator<Person> multiSort = Comparator
            .comparing(Person::getName)
            .thenComparing(Person::getAge)
            .thenComparing(Person::getSalary);
        
        Collections.sort(people, multiSort);
        System.out.println("Multi-level sort: " + people);
    }
}
```

### 2. Mixed Ascending/Descending
```java
// Sort by age ascending, then salary descending
Comparator<Person> mixedSort = Comparator
    .comparing(Person::getAge)
    .thenComparing(Comparator.comparing(Person::getSalary).reversed());

Collections.sort(people, mixedSort);
```

## Utility Methods

### 1. Static Factory Methods
```java
// Natural order
Comparator<String> natural = Comparator.naturalOrder();

// Reverse natural order
Comparator<String> reverse = Comparator.reverseOrder();

// Comparing by key extractor
Comparator<Person> byAge = Comparator.comparing(Person::getAge);

// Comparing with custom comparator
Comparator<Person> byNameIgnoreCase = Comparator.comparing(
    Person::getName, String.CASE_INSENSITIVE_ORDER);
```

### 2. Numeric Comparisons
```java
// For primitive types - more efficient than boxing
Comparator<Person> byAge = Comparator.comparingInt(Person::getAge);
Comparator<Person> bySalary = Comparator.comparingDouble(Person::getSalary);
Comparator<Product> byPrice = Comparator.comparingLong(Product::getPrice);
```

## Real-World Examples

### 1. Sorting Collections
```java
public class CollectionSorting {
    public static void main(String[] args) {
        // ArrayList
        List<Integer> numbers = new ArrayList<>(Arrays.asList(5, 2, 8, 1, 9));
        Collections.sort(numbers, Comparator.reverseOrder());
        
        // TreeSet with custom comparator
        Set<Person> peopleByAge = new TreeSet<>(Comparator.comparing(Person::getAge));
        peopleByAge.add(new Person("Alice", 30, 50000));
        peopleByAge.add(new Person("Bob", 25, 60000));
        
        // Priority Queue
        Queue<Person> agePriorityQueue = new PriorityQueue<>(
            Comparator.comparing(Person::getAge).reversed()
        );
    }
}
```

### 2. Stream Operations
```java
public class StreamSorting {
    public static void main(String[] args) {
        List<Person> people = Arrays.asList(
            new Person("Alice", 30, 50000),
            new Person("Bob", 25, 60000),
            new Person("Charlie", 35, 45000)
        );
        
        // Get top 2 earners
        List<Person> topEarners = people.stream()
            .sorted(Comparator.comparing(Person::getSalary).reversed())
            .limit(2)
            .collect(Collectors.toList());
        
        // Find oldest person
        Optional<Person> oldest = people.stream()
            .max(Comparator.comparing(Person::getAge));
        
        // Group by age and sort groups
        Map<Integer, List<Person>> byAge = people.stream()
            .collect(Collectors.groupingBy(Person::getAge));
    }
}
```

### 3. Array Sorting
```java
public class ArraySorting {
    public static void main(String[] args) {
        Person[] people = {
            new Person("Alice", 30, 50000),
            new Person("Bob", 25, 60000),
            new Person("Charlie", 35, 45000)
        };
        
        // Sort array by salary
        Arrays.sort(people, Comparator.comparing(Person::getSalary));
        System.out.println("Sorted array: " + Arrays.toString(people));
    }
}
```

## Best Practices

### 1. **Use Method References When Possible**
```java
// Good
Comparator.comparing(Person::getName)

// Less readable
(p1, p2) -> p1.getName().compareTo(p2.getName())
```

### 2. **Use Specific Numeric Comparators**
```java
// Efficient - no boxing
Comparator.comparingInt(Person::getAge)

// Less efficient - boxing required
Comparator.comparing(p -> p.getAge())
```

### 3. **Handle Null Values**
```java
// Safe approach
Comparator<String> nullSafe = Comparator.nullsLast(String::compareTo);

// Or use Optional in your classes
Comparator.comparing(person -> person.getMiddleName().orElse(""))
```

### 4. **Chain Comparators for Complex Sorting**
```java
// Clear and maintainable
Comparator<Person> complexSort = Comparator
    .comparing(Person::getDepartment)
    .thenComparing(Person::getAge)
    .thenComparing(Person::getName);
```

### 5. **Store Reusable Comparators**
```java
public class PersonComparators {
    public static final Comparator<Person> BY_AGE = 
        Comparator.comparing(Person::getAge);
    
    public static final Comparator<Person> BY_NAME = 
        Comparator.comparing(Person::getName);
    
    public static final Comparator<Person> BY_SALARY_DESC = 
        Comparator.comparing(Person::getSalary).reversed();
}

// Usage
Collections.sort(people, PersonComparators.BY_AGE);
```

## Performance Considerations

### 1. **Method References vs Lambdas**
Method references are generally more efficient and readable than equivalent lambda expressions.

### 2. **Primitive Comparators**
Use `comparingInt()`, `comparingLong()`, `comparingDouble()` for primitive values to avoid boxing overhead.

### 3. **Comparison Caching**
For expensive comparison operations, consider caching the comparison keys:

```java
// If getName() is expensive, cache the result
Map<Person, String> nameCache = new HashMap<>();
Comparator<Person> cached = Comparator.comparing(
    person -> nameCache.computeIfAbsent(person, Person::getName)
);
```

## Summary

Comparator is a powerful tool for custom sorting in Java that provides:
- **Flexibility**: Multiple sorting strategies for the same class
- **Clean Code**: Lambda expressions and method references
- **Chaining**: Complex multi-level sorting
- **Null Safety**: Built-in null handling
- **Performance**: Specialized methods for primitives

Use Comparator when you need custom sorting logic, multiple sorting strategies, or when you cannot modify the original class to implement Comparable.