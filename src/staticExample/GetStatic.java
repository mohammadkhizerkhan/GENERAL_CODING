package staticExample;

//class InnerClass{
//    static String  country;
//    static String lang;
//    public InnerClass(String country, String lang) {
//        InnerClass.country = country;
//        InnerClass.lang = lang;
//    }
//
//}

public class GetStatic {

    static class InnerClass{
         String  country;
         String lang;
        public InnerClass(String country, String lang) {
            this.country = country;
            this.lang = lang;
        }

    }

    public static void main(String[] args) {
        InnerClass country1 = new InnerClass("india","hindi");
        InnerClass country2 = new InnerClass("srilanka","tamil");

        System.out.println(country1.country);
        System.out.println(country2.country);



Human.dummyNumber = 20;
        Human person1 = new Human(2,"khan");
        Human.dummyNumber=40;
        Human person2 = new Human(5,"khizer");

        System.out.println(Human.dummyNumber);
        System.out.println(Human.dummyNumber);



    }
}
