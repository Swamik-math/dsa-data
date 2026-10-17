import java.util.*;

class Animal{
    void eat(){
        System.out.println("Eating");
    }
}

class dog extends Animal{
    @Override   // it is used to rewrite the function , without creating the new function
    void eat(){
        System.out.println("Bark"); 
    }
}

class cat extends Animal{ 
    }

class myThread extends Thread{
    
    @Override
    public void run(){  // it is called as by using the runnabel interface
        // for(int i=1; i<=5; i++){
        //     System.out.println(i);
        // }
        System.out.println("Hello");
    }
}

public class Inheri {
    public static void main(
        String args[]
    ){
        // dog d = new dog();  // calling the eat method and d is the new object created
        // d.eat();     // it is also called as invoking the method

        myThread th1 = new myThread();
        // myThread th2 = new myThread();
        th1.run();  // not use th.run() - beacause it calls the main thread , so we have to use th.start() , then it will create the new thread
                    // th.start() - it tells jvm internally to create a new thread
        // cat c = new cat();
        // c.eat();
        // th2.start();
        System.out.println("hi");

        // for(char i = 'A'; i<= 'E'; i++ ){
        //     System.out.println(i);
        }
    }







/*

@override - it is a annotation
        - it intend to override the method from the parent class 

> A thread object can be started only once
*/

