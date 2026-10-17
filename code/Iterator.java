import java.util.*;

public class Iterator {

    public static void main(String args[]) {
        ArrayList<Integer> arrlist = new ArrayList<>();

        arrlist.add(1);
        arrlist.add(4);
        arrlist.add(3);
        arrlist.add(20);

        ListIterator<Integer> itr = arrlist.listIterator();

        System.out.println("Iterating through an iterator");
        while(itr.hasNext()){
            itr.next();
        }

        while (itr.hasPrevious()) {

            System.out.println(itr.previous());
            // int num = itr.next();

            // if(num == 20){
            // itr.remove();
            // }
        }
        // for(Integer i : arrlist){
        // System.out.println(i);
        // }
    }
}
