interface Vehicle {
    void start();

    default void stop() {
        System.out.println("Stop");
    }

    static void print() {
        System.out.println("Hello");
    }
}

class VehicleImpl implements Vehicle {

    @Override
    public void start() {
        System.out.println("start");
    }
}

public class Interfac {
    public static void main(String args[]) {
        VehicleImpl v1 = new VehicleImpl();
        v1.start();
        v1.stop();

        Vehicle.print();


    }
}


// i can only override defauld, not the static method
