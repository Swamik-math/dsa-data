#include <bits/stdc++.h>
using namespace std;


bool solve(int n){

    vector<int> dp(n+1, -1);

    if(n == 0){
        return false;
    }

    for(int i=1; i*i <= n; i++){

        int sq = i*i;

        if(dp[n] != -1){
            return dp[n];
        }

        if(!solve(n - sq)){
            return dp[n] = true;
        }
    }
    return dp[n] = false;
}

bool stoneGame(int n){
    return solve(n);
}

int main() {

    int n = 10;
    cout << (stoneGame(n) ? "true" : "false") << endl ;
    return 0;
}