
class thread1 extends Thread{
    @Override
    public void run(){
        int count = 0;
        while(count < 10){
            System.out.println("thread 1 running.");
            count++;
        }
    }
}
class thread2 extends Thread{
    @Override
    public void run(){
        int count = 0;
        while(count < 10){
            System.out.println("thread 2 running.");
            count++;
        }
    }
}


public class Threads {
    
    public static void main(String args[]){
        thread1 t1 = new thread1();
        thread2 t2 = new thread2();

        t1.start();
        t2.start();
    }
}
