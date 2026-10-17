import java.util.*;

public class Employee implements Comparable<Employee> {

    private int id;
    private String name;

    public Employee(int id, String name) {
        this.id = id;
        this.name = name;
    }

    @Override
    public int compareTo(Employee o) {
        return Integer.compare(o.id, this.id);
    }

    public static Comparator<Employee> NameComparator = new Comparator<Employee>() {
        public int compare(Employee e1, Employee e2){
            return e1.name.compareTo(e2.name);
        }
    };

    public static void main(String args[]){

        Employee employees[] = new Employee[5];

        employees[0] = new Employee(101, "Rahul");
        employees[1] = new Employee(102, "Amit");
        employees[2] = new Employee(103, "Neha");
        employees[3] = new Employee(104, "Priya");
        employees[4] = new Employee(105, "Karan");

        Arrays.sort(employees);

        System.out.println("Sorted by id (descending):");
        for (Employee employee : employees) {
            System.out.println(employee.id + " " + employee.name);
        }

        Arrays.sort(employees, NameComparator);

        System.out.println("Sorted by name (ascending):");
        for (Employee employee : employees) {
            System.out.println(employee.id + " " + employee.name);
        }

    }

}


/*

JAVA 8 features

1. lamda expression
2. Method reference
3. Stream api
4. Functional Inerface
5. Interface default and static method

*wthat is anonymous class and anonymous object.
*/