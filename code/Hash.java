import java.util.*;

public class Hash {
    public static void main(String[] args){
        HashMap<Integer, Integer> hs = new HashMap<>();

        hs.put(1000, 1);
        hs.put(500, 1);
        hs.put(200, 0);
        hs.put(100, 1);
        hs.put(50, 3);
        hs.put(20, 2);
        hs.put(10, 0);
        hs.put(5, 1);
        hs.put(2, 6);
        hs.put(1, 1500);

        int sum = 1000;
        int req = 726;

        int key[] = {1000, 500, 200,100, 50, 20, 10, 5, 2, 1};

        HashMap<Integer, Integer> res = new HashMap<>();

        int n = 0;
        for(int i=0; i<key.length; i++){
            
            while(req >= key[i] && hs.get(key[i])>0){
                int x = hs.get(key[i]);
                req = req - key[i];
                n++;
                hs.put(key[i], x-1);
            }
            if(n > 0){
                res.put(key[i], n);
            }
            n = 0;
        }
        System.out.println(res);

    }
}
