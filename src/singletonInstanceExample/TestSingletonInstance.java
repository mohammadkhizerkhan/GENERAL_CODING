package singletonInstanceExample;

public class TestSingletonInstance {
    public static void main(String[] args) {
        SingletonInstanceExample instance1 = SingletonInstanceExample.getInstance(20);
        SingletonInstanceExample instance2 = SingletonInstanceExample.getInstance(30);
        SingletonInstanceExample instance3 = SingletonInstanceExample.getInstance(50);
//        System.out.println(instance1.getA());
//        System.out.println(instance2.getA());
//        System.out.println(instance3.getA());


    }
}
