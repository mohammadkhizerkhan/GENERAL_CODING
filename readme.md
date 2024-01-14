OOP


Class , object & constructor
- Class is a template of object (in js it’s just like object type ex: {userName:string} ).
- Object is a instance of class (in js is’s an object with with values of type what ever you defined ex:{userName:”khan”} )
- If Object initialised without new  keyword it by default points to null. ex: Student student1;
- If we use new  keyword to create an object, it will allocate a memory during run time and returns reference of that memory. ex: Student student1 = new Student();
- Above Student() is a constructor. Constructor basically defines what happens when your objects get created.
- If we don’t write anything like in 3rd point, java will create an object with default values of properties.
- A consturctor will run when an object is created.

This keyword.
- Student khan = new Student(); khan.name = “khizer” khan.greeting();  class Student { String name; void greeting(){ sout(“helllo”+this.name)// hello khizer } Student(){ this.name = name }
- When an object is created(khan) =>
- If we use this keyword inside a class then it will have the reference of respective object (here its khan)

Final keyword.
- Final keyword means we can’t change the value (just like const in js)
- It should be initialised with value while declaring.
- You cannot reassign a value to non-primitive ex : final Student khizer = new Student(“khizer”);  // this is wrong khizer = new Student(“khan”); // this you can do khizer.name = “khan”


Static keyword.
- static is keyword where we use on variables/ properties or methods, only If it is not related to object but are common to all the objects of one class. ex: Class Human can have static variable of population, which is common for all the human objects.
-  Public static void main , we write this because program should able to run the main class, we don’t want to create new object of class main and then call method, main is common of all objects
- You cannot use non static methods/ variables inside a static method. Because we don’t know which instance they belong, static things belongs to Class not instance , so things which are accessing inside static should also be static.
- You can’t use this inside a static because of the same reason above.(this points to instance object not class)

Inheritance.
- Parent class will not have access to child class but child class will have reference of parent class.
- ParentClass childClass1 = new ChildClass(10,20,30);
- childClass1 is of type Parent class so it will not have reference to child class properties (in our case 30)
- ChildClass childClass1 = new ParentClass(10,20,30);
- There is no multiple inheritance in JAVA use interface for this. 
Polymorphism.
- Many => poly, morphism => types
- 2 Types of polymorphism
    - Static polymorphism - compile time ( achived via method overloading )
    - Dynamic polymorphism - runtime time ( achived via method overriding )
        - Parent obj = new Child();
        - Obj.greeting();
        - Above which method will be called is depend upon the type of object ( here its child class method will get called), this is called upcasting.
    - If we use final key word , we cannot override the method
    - If we use static key word , we cannot override the method ( static depends on class , override depend on object so we can’t override static methods)

Abstract.
- Parent class will define a method on what to do like (Abstract void career(String name))
- Child class must implement those methods by overriding them
- Any parent class contains one or more abstracts methods must also be declared as abstract.
- You cannot create objects of abstract class, you need to override it’s method while creating
- You cannot call abstract constructors.
- You cannot create abstract static methods, because abstract methods can override but static will not allow it, but we can create static method inside abstract classes. - ex : abstract static void career() is wrong - static void career() is right
- You can’t have final abstract class, because abstract are inherited

Interfaces.
- It is just like abstract, but we can inherit multiple interface to single class like Car class can implement Brake, Media, Engine
- Class inherits interface using implement keyword but interface inherit interface using extends keyword.
- Static method cannot be declared without a body, because it cannot be overridden.
- To know more look into the code
