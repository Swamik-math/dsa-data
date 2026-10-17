#include <bits/stdc++.h>
using namespace std;

// int main() {
//     vector<int> arr = {1, 2, 3, 4, 5, 6, 7};

//     // vector<int> sub;
//     // int k = 3;

//     // for(int i=k; i< arr.size(); i++){
//     //     sub.push_back(arr[i]);
//     // }
//     // for(int i=0; i<k; i++){
//     //     sub.push_back(arr[i]);
//     // }

//     // for(int i : sub){
//     //     cout << i << " ";
//     // }
    
//     reverse(arr.begin(), arr.begin()+3);
//     reverse(arr.begin()+3, arr.end());
//     reverse(arr.begin(), arr.end());

//     for(int i : arr){
//         cout << i << " ";
//     }
//     return 0;
// }
 
int main(){
    vector<int> arr = {64, 34, 25, 12, 22, 11, 90, 5};

    int n = arr.size();
    for(int i=0; i<n-1; i++){
        bool swapped = false;
        for(int j=0; j<n-i-1; j++){
            if(arr[j] > arr[j+1]){
                swap(arr[j], arr[j+1]);
                swapped = true;
            }
        }
        if(swapped == false){
            break;
        }
    }

    for(int c : arr){
        cout << c << " ";
    }

    return 0;
}