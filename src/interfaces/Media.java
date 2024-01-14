package interfaces;

public interface Media {
    //    Static methods in interfaces should have a body
//    static void device();
    static void device() {
        System.out.println("this is radio player");
    };

    void start();

    void stop();
}
