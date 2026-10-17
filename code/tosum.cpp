#include <bits/stdc++.h>
using namespace std;


int sumcount(vector<int>& num, int target){

    sort(num.begin(), num.end());
    int n = num.size();

    int i=0;
    int j = n-1;
    int count = 0;

    while(i < j){
       
        int sum = num[i] + num[j];

        if(sum < target){
            i++;
        }
        else if(sum > target){
            j--;
        }
        else{
            count++;
            
            int left = num[i];
            int right = num[j];

            while(i<j && num[i] == left){
                i++;
            }
            while(i<j && num[j] == right){
                j--;
            }
        }
    }
    return count;

}

int main() {

    vector<int> n = {1, 2, 2, 3, 5, 10,11, 2};
    cout << sumcount(n, 12) << endl;
    return 0;
}