#include <bits/stdc++.h>
using namespace std;

struct Node {
    int data;
    Node* left;
    Node* right;

    Node(int value) : data(value), left(nullptr), right(nullptr) {}
};

void preorder(Node* root){
    if(root == nullptr){
        return;
    }

    cout << root->data << ' ';
    preorder(root->left);
    preorder(root->right);
}

void inorder(Node* root){
    if(root == nullptr){
        return;
    }

    inorder(root->left);
    cout << root->data << ' ';
    inorder(root->right);
}

void postorder(Node* root){
    if(root == nullptr){
        return;
    }

    postorder(root->left);
    postorder(root->right);
    cout << root->data << ' ';
}

vector<vector<int>> levelorder(Node* root){

    vector<vector<int>> ans;

    if(root == nullptr){
        return {};
    }

    queue<Node*> q;
    q.push(root);

    while(!q.empty()){
        int size = q.size();
        vector<int> level;

        for(int i=0; i<size; i++){
            Node* node = q.front();
            q.pop();

            level.push_back(node->data);

            if(node->left != NULL) q.push(node->left);
            if(node->right != NULL) q.push(node->right);
        }
        ans.push_back(level);
    }
    return ans;
}

// stack preorder
vector<int> stackpreorder(Node* root){
    vector<int> ans;

    if(root == nullptr){
        return ans;
    }

    stack<Node*> st;

    st.push(root);

    while(!st.empty()){
        root = st.top();
        st.pop();
            ans.push_back(root->data);

        if(root->right != NULL) st.push(root->right);
        if(root->left != NULL) st.push(root->left);
    }

    return ans;
}

// stack inorder , traversal

vector<int> stacInorder(Node* root){
    stack<Node*> st;
    Node* node = root;
    vector<int> ans;

    while(true){
        if(node != NULL){
            st.push(node);
            node = node->left;

        }

        else{
            if(st.empty() == true) break;

            node = st.top();
            st.pop();
            ans.push_back(node->data);
            node = node->right;
        }
    }
    return ans;
}

// iterative postorder - by use of the 2 stack data structure
vector<int> postStack(Node* root){
    vector<int> ans;
    if(root == NULL) return ans;

    stack<Node*> st1, st2;
    st1.push(root);

    while(!st1.empty()){
        root = st1.top();
        st1.pop();
        st2.push(root);

        if(root->left != NULL) st1.push(root->left);
        if(root->right != NULL) st1.push(root->right);
    }

    while(!st2.empty()){
        ans.push_back(st2.top() -> data);
        st2.pop();
    }
    return ans;
}

int main() {
    Node* root = new Node(1);
    root->left = new Node(2);
    root->right = new Node(3);
    root->left->left = new Node(4);
    root->left->right = new Node(5);
    root->right->left = new Node(7);

    cout << "Preorder: ";
    preorder(root);
    cout << "\nInorder: ";
    inorder(root);
    cout << "\nPostorder: ";
    postorder(root);
    cout << "\nLevel order: ";
    cout << '\n';

    vector<vector<int>> ans = levelorder(root);

    for(auto level : ans){
        for(auto x : level){
            cout << x << " ";
        }
        cout << '\n';
    }

    // stack-preorder
    cout << "\nStack-preorder:";
        vector<int> stackAns = stackpreorder(root);

        for(int c : stackAns){
        cout << c << " ";
    }
    cout << '\n';


    //stack-inorder
    cout << "\nStack-inorder:";
        vector<int> res = stacInorder(root);

        for(int i : res){
        cout << i << " ";
    }
    cout << '\n';

    //stack-postorder
    cout << "\nStack-postorder:";
        vector<int> postres = postStack(root);

        for(int i : postres){
        cout << i << " ";
    }
    cout << '\n';


    return 0;
}