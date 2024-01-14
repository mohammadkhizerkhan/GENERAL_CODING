package inheritence;

public class TestInheritence {
    public static void main(String[] args) {
        ChildClass childClass = new ChildClass(10);
        ParentClass childClass1 = new ChildClass(10,20,30);

//       childClass2 should have variable to intialize in ChildClass,
//       so new ParentClass(10,20) object is not intializing properties of childclass,
//       becuase parent doesn't know what are there in child class
//        ChildClass childClass2 = new ParentClass(10,20);


        System.out.println(childClass.area());
        System.out.println(childClass.perimeter());
    }
}
