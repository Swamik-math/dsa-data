package atm;

import java.util.Scanner;
import java.util.*;

public class Atm {


    // declare variables
    Scanner scanner = new Scanner(System.in);
    double balance;
    boolean isRunning = true;

    int choice;

    public void menue(){

    //display menue
    System.out.println("*********************");
    System.out.println("Welcome to AtM");
    System.out.println("*********************");
    System.out.println("1. Show balance");
    System.out.println("2. Deposit");
    System.out.println("3. Withdraw");
    System.out.println("4. Exit");
    System.out.println("*********************");

    //get and process users choice
    System.out.print("Enter your choice (1-4) > ");
    choice = scanner.nextInt();

    switch(choice){
        case 1 -> System.out.println("SHOW BALANCE");
        case 2 -> System.out.println("DEPOSITE");
        case 3 -> System.out.println("WITHDRAW");
        case 4 -> isRunning = false;
        default -> System.out.println("Invalid choice.");
    }


    // show balance()
    
    //deposit()

    //withdraw()

    //Exit message

    scanner.close();

    }
}
