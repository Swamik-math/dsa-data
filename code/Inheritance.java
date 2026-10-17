import java.util.*;

class Employee{
    String name;
    int age;
    double salary;
}

// without rewriting everything it is called as inheriting the properties
/*           Employee
          /      |      \
         /       |       \
Developer Tester Manager
*/


// by using the in "extends" we can inherit the non-prenitive properties and methods of another class
class Developer extends Employee{
    
}
class Tester extends Employee{

}
class Manager extends Employee{

}

// METHOD OVER-RIDING
class Animal{
    void sound(){
        System.out.println("Animal make sound");
    }
}

class dog extends Animal{
    @Override  // method overriding
    void sound(){
        System.out.println("barks");
    }
}

class pup extends dog{  
    // multiple inheritance
}
    


public class Inheritance {
    
    public static void main(String args[]){
    // reference                    actual object
        dog d =                     new dog();
      // |->it is the variable type      |->it is the object created , output depends on the type of the object created
        d.sound();

        pup p = new pup();
        p.sound();
    }

}









/*

> a child class can have its own method
> overide  - it is used to over write the main class method 
> parent cannot access child methods

* thread methods - start(), 
                    run(),
                    join(),
                    isAlive()

> non-premitive datatypes - ??

> java does not support multiple inheritance
>runtime polymorphism - 

*/