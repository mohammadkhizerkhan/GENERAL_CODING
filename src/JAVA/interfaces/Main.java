package interfaces;

public class Main {
    public static void main(String[] args) {
//        Car normalCar = new Car();
//
//        normalCar.accelarate();
//        normalCar.brake();
//        normalCar.start();
//        normalCar.stop();

        MyCar audi = new MyCar();

        audi.start();
        audi.stop();
        audi.play();
        audi.pause();
        audi.upgradeEngine();
        audi.start();

    }
}
