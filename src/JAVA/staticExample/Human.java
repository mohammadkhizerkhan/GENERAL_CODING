package staticExample;

public class Human {

    int age;
    String name;
    static int population;

    static int dummyNumber;

    // will only runs once when first object is created
    // Human human1 = new Human(33,"khan")
    static {
        System.out.println("inside static block");
        dummyNumber += 20;
    }

    static int getPopulation() {
//        Non-static method 'greeting()' cannot be referenced from a static context
//        greeting();

//        if you want access the greeting it should be an instance of object
//        above greeting neither a static nor a instance of object
//        so we will reference an object to invoke greeting below

        Human khan = new Human(4,"khan");
        khan.greeting();

        //Non-static field 'name' cannot be referenced from a static context
//        System.out.println(name);

        return population;
    }

    void greeting(){
        System.out.println("hellow");
    }
    
    

    public Human(int age, String name) {
        this.age = age;
        this.name = name;
//        while defining,accesing , modifiying the static variable use class(Human) instead
//         of object reference.
        // if we this for static variable here it will work but,
        // if we use object as reference it will search if population exist in khan object(no) , then it will search in class(Human)
        Human.population += 1;
    }
}
