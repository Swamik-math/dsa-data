import java.util.*;

@FunctionalInterface
interface MvjInterface{

    void mvj(int a, int b);

}

interface mi{
    void helo();
}

// class MyClass implements MvjInterface{

//     @Override
//     public void Mvj1(){
//         System.out.println("Maghadheera");
//     }
// }

public class Mvjlamda {
    
    public static void main(String args[]){

        // MyClass m1 = new MyClass();   // create the object
        // m1.Mvj1();    // give the method call

        MvjInterface m1 = (a, b) -> {System.out.println(a+b);};
        m1.mvj(5, 6);

        // method reference
        mi can = demo::cat;

        can.helo();
        
    }

}

class demo{
    public static void cat(){
        System.out.println("hi hello bye bye");
    }
}



/*

-> functional interface can have only one abstract interface

*/
