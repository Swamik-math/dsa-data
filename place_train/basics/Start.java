

class student{

    String name;
    int age;
    int rollNo;

    void study(){
        System.out.println(name + " is studying.");
    }
}


public class Start{   // create a class named Start  - it is like a container

    public static void main(String[] args) {
        student s1 = new student();

        s1.name = "Sup";
        s1.age = 21;
        s1.rollNo = 101;

        s1.study();
    }

}

// java - organise program around objects and classes
/*




*/