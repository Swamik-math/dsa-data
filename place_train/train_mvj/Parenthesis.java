import java.util.Stack;

public class Parenthesis {
    
    public static void main(String args[]){
        String s = "{([])}(";

        Stack<Character> st = new Stack<>();

        for(char c : s.toCharArray()){
            if(c == '(' || c == '{' || c == '[' ){
                st.push(c);
            }
            else if(c == ')' || c == '}' || c == ']'){
                if(st.empty()){
                    System.out.println("Not valid");
                    return;
                }
                if((c == ')' && st.peek() != '(' ) ||
                     (c == '}' && st.peek() != '{') || 
                    (c == ']' && st.peek() != '[') ){
                    System.out.println("Not valid");
                    return;
                    }
                else{
                    st.pop();
                } 
            }

        }
        if(st.empty()){
            System.out.println("valid");
        }
        else{
            System.out.println("Not valid");
        }
    }
}
