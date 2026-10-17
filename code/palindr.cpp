#include <bits/stdc++.h>
using namespace std;


string smallPalindrome(string s){
    map<char, int> mp;

    for(char ch : s){
        mp[ch]++;
    }

    string left = "";
    string mid = "";
    int oddcount = 0;

    for(auto it : mp){
        char ch = it.first;
        int count = it.second;

        left += string(count/2, ch);

        if(count%2 == 1){    // to check whether any char appear odd number of times
            oddcount++;
            mid = ch;
        }
    }
    //if more than one char has appeared odd time
    if(oddcount > 1) return "Not possible";

    string right = left;
    reverse(right.begin(), right.end());

    return left + mid + right;
}

int main() {
    string ch = "aabbaaacccmmoo";
    cout << smallPalindrome(ch) << "\n";
    return 0;
}