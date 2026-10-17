import java.util.*;

public class set{
    public static void main(String args[]){
    //     Set<String> myset = new TreeSet<String>();

    //     myset.add("xyz");
    //     myset.add("mno");
    //     myset.add("abc");
    //     myset.add("uvw");

        
    //         System.out.println(myset);
        // myset.remove("xyz");
            // System.out.println(myset);

            // Set<Integer> s = new HashSet<>();

            // int arr[] = {1, 2, 2, 2, 3, 4, 5, 5, 6};
            // for(int i=0; i<arr.length; i++){
            //     s.add(arr[i]);
            // }

            // System.out.println(s.size());

            Queue<Integer> q = new ArrayDeque<>();

            int arr[] = {1, 2, 3, 4, 5, 6};

            
            for(int i=0; i<arr.length; i++){
                q.add(arr[i]);
            }

            Stack<Integer> s = new Stack<>();

            for(int i=0; i<arr.length; i++){
                int r = q.peek();
                s.push(r);
                q.remove();
            }

            for(int i=0; i<arr.length; i++){
                int r = s.peek();
                q.add(r);
                s.pop();
            }

            System.out.println(q);


            // System.err.println(q);

            // q.remove();
            // System.out.println(q);
            // System.out.println(q.peek());



    }
}


/*
Questions :
1. hashmap, linkedhashmap, treemap, concurenthashmap, 

Treemap - stores the elements in the order way
Hashmap - stores in unorder or random way
*/