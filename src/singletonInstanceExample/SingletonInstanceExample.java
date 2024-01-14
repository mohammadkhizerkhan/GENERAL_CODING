package singletonInstanceExample;

public class SingletonInstanceExample {
    int a=30;
    private SingletonInstanceExample(int a) {
        System.out.println(a);
        this.a = a;
    }

   private static SingletonInstanceExample instance;

    public static SingletonInstanceExample getInstance(int a){

        if(instance == null){
            instance = new SingletonInstanceExample(a);
        }
        return instance;
    }

    public int getA() {
        return a;
    }

}
