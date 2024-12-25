package abrstract;

public abstract class Parent {

    /**
     * 'Parent' is abstract; cannot be instantiated
     */
//    Parent parent = new Parent();

//    we cannot create abstract static methods
//    because abstract methods can be overriden but static methods can't
//    abstract static  void career();

//    but we can create static methods inside abstract class
    static String callme() {
        return "hello world";
    }

    void normalMethod(){
        System.out.println("1 + 1 is 2");
    }

    abstract void career();
    abstract void marriage();
}
