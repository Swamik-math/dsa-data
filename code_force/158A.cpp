#include <bits/stdc++.h>
using namespace std;

int main() {

    int n, k;
    cin >> n >> k;

    int res = 0;

    vector<int> arr(n);
    for(int i=0; i<n; i++){
        cin >> arr[i];
    }

    int tar = arr[k - 1];

    for(int x : arr){
        if(x > 0 && x >= tar) res++;
    }

    cout << res << endl;

    return 0;
}