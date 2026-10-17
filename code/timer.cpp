// #include <bits/stdc++.h>
// using namespace std;

// vector<int> mostFrequent(vector<int> arr){
//     sort(arr.begin(), arr.end());
//     unordered_map<int, int> mp;
//     int n = arr.size();

//     for(int num : arr){
//         mp[num]++;
//     }


//     sort(mp.begin(), mp.end(), [&](int a, int b){
//         if(mp[a] < mp[b]){}
//         return a < b;

//     return mp[a] > mp[b];
//     });
//     return nums;
    
// }



// int main() {

//     vector<int> arr = {2, 3, 2, 4, 5, 3, 3, 12, 4};
//     mostFrequent(arr);

//     for(int i=0; i<arr.size(); i++){
//         cout << arr[i] << " ";
//     }
//     return 0;
// }


#include <bits/stdc++.h>
using namespace std;


int main() {
    vector<char> arr = {'a','a','a','b','b','c','d','c','c'};

    unordered_map<char, int> freq;

    for (char ch : arr) {
        freq[ch]++;
    }

    for (auto it : freq) {
        cout << it.second << it.first;
    }

    return 0;
}

// int main() {
//     vector<char> arr = {'a','a','a','b','b','c','d','c','c'};
//     sort(arr.begin(),arr.end());
//     int i=0;
//     int j=0;
//     int cnt =0;
//     while(j<arr.size()){
//         if(arr[i]==arr[j]){
//             cnt++;
//             j++;
//         }
//         else{
//             cout<<cnt<<arr[i];
//             cnt=0;
//             i=j;
//         }
        
//     }
//     cout<<cnt<<arr[j-1];
//     return 0;
// }