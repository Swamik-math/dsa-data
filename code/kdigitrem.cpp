#include <iostream>
#include <stack>
#include <string>
#include <algorithm>
using namespace std;

string removKDigit(string dig, int k)
{

    stack<char> st;

    
    for (char c : dig)
    {

        while(!st.empty() && st.top() > c && k > 0)
        {
            st.pop();
            k--;
        }
        st.push(c);
    }

    while (k > 0 && !st.empty())
    {
        st.pop();
        k--;
    }

    string res = "";
    while (!st.empty())
    {
        res.push_back(st.top());
        st.pop();
    }

    reverse(res.begin(), res.end());

    // for(int i=0; i<res.size(); i++){
    //     if(res[i] != '0'){
    //         break;
    //     }
    // }
    res.erase(0, res.find_first_not_of('0'));

    if(res.empty()){
        return "0";
    }

    return res;
}

int main()
{

    string che = "14";
    int k = 2;

    cout << removKDigit(che, k) << endl;
    return 0;
}