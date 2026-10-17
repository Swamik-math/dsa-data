import java.util.ArrayList;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.*;

public class Stream {
    
    // public static void main(String args[]){
        // List<Integer> l = new ArrayList<>();

        // l.add(1);
        // l.add(2);
        // l.add(3); 
        // l.add(4);
        // l.add(5);
        // l.add(6);

        // l.stream().filter((x) -> x%2 == 0).map(x -> x*10)
        // .forEach(x -> System.out.println(x));

        public static void main(String[] args){

            String str = "Java article are Awesome!";

            str.chars()
            .mapToObj(c -> Character.toLowerCase(Character.valueOf((char)c)))
            .collect(Collectors.groupingBy(Function.identity(), LinkedHashMap::new, Collectors.counting()))
            .entrySet()
            .stream()
            .filter(x-> x.getValue() < 2)
            .findFirst()
            .ifPresent(x -> System.out.println(x));

        }
    }

