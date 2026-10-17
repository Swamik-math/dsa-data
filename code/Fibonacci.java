public class Fibonacci {
    
         static long fib(long n)
    {
        
        if (n <= 1)
            return n;

        return fib(n - 1) + fib(n - 2);
    }
        
        public static long dp(int n){
        long f[] = new long[n+2];
        
        f[0] = 0;
        f[1] = 1;

        for(int i=2; i<=n; i++){
            f[i] = f[i-1] + f[i-2];
        }
        return f[n];
        
    }

    public static void main(String[] args) {
        int N = 5;

        for(int i=0; i<=N; i++){
            System.out.println(fib(i) + " ");
        }
    }
}
