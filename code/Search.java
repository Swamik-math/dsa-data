import java.util.Arrays;

public class Search {
    
    public static void main(String args[]){

        int num[] = {2, 3, 8, 5, 1};
        int tar = 5;

        Arrays.sort(num);
        
        
        int lef = 0;
        int rig = num.length-1;

        while(lef <= rig){
            int mid = (lef + rig )/2;
            if(num[mid] == tar){
                System.out.println("Found");
                return ;
            }
            else if(num[mid] < tar){
                lef = mid+1;
            }
            else{
                rig = mid-1;
            }
        }

    }
}