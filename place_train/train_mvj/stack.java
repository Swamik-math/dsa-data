import java.util.Stack;

public class stack {
    public static void main(String[] args) {
        Stack<Integer> stack = new Stack<>();

        stack.push(10);
        stack.push(20);
        stack.push(30);

        System.out.println("top element: " + stack.peek());

        int removed = stack.pop();
        System.out.println("Removed: " + removed);
        System.out.println("New top :" + stack.peek());
        
    }

}
