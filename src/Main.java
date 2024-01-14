import java.lang.reflect.Array;
import java.util.Arrays;

// Press Shift twice to open the Search Everywhere dialog and type `show whitespaces`,
// then press Enter. You can now see whitespace characters in your code.
public class Main {
    public static void main(String[] args) {
        Student khizer = new Student( 3,"khizer",20,'M');
        System.out.println(khizer.greet());
    }
}

class Student{
    int id;
    String name;
    int age;
    char sex;

    public Student(int id, String name, int age, char sex) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.sex = sex;
    }

    public Student() {

    }

    public String  greet(){
        return "Hello " + this.name;
    }
}