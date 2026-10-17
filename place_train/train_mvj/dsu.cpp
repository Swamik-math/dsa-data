#include <bits/stdc++.h>
using namespace std;


// recursive implementation of dsu - (disjoint set union)

int find(int x){

    if(parent[x] == x){
        return x;
    }

    return find(paresnt[x]);
}


int main() {

   
    return 0;
}