package interfaces;

public class MyCar {
    Engine engine = new PowerEngine();
    Media player = new MediaPlayer();

    public void start(){
        engine.start();
    }

    public void stop(){
        engine.stop();
    }

    public void play(){
        player.start();
    }

    public void pause(){
        player.stop();
    }

    public void upgradeEngine(){
        this.engine  = new ElectricEngine();
    }
}
