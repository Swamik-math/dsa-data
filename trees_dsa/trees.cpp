#include <bits/stdc++.h>
using namespace std;

struct Node {
    int data;
    Node* left;
    Node* right;

    Node(int value) : data(value), left(nullptr), right(nullptr) {}
};

void printTraversal(Node* root) {
    if (root == nullptr) {
        cout << "Tree is empty" << endl;
        return;
    }

    vector<int> pre, in, post;
    stack<pair<Node*, int>> st;
    st.push({root, 1});

    while (!st.empty()) {
        auto it = st.top();
        st.pop();

        if (it.second == 1) {
            pre.push_back(it.first->data);
            st.push({it.first, 2});
            if (it.first->left != nullptr) {
                st.push({it.first->left, 1});
            }
        } else if (it.second == 2) {
            in.push_back(it.first->data);
            st.push({it.first, 3});
            if (it.first->right != nullptr) {
                st.push({it.first->right, 1});
            }
        } else {
            post.push_back(it.first->data);
        }
    }

    cout << "Preorder: ";
    for (int x : pre) cout << x << " ";
    cout << endl;

    cout << "Inorder: ";
    for (int x : in) cout << x << " ";
    cout << endl;

    cout << "Postorder: ";
    for (int x : post) cout << x << " ";
    cout << endl;
}

// height of the tree
int maxheight(Node* root){

    if(root == NULL) return 0;

    int lh = maxheight(root->left);
    int rh = maxheight(root->right);

    return 1 + max(lh, rh);
}

int main() {
    Node* root = new Node(1);
    root->left = new Node(2);
    root->right = new Node(3);
    root->left->left = new Node(4);
    root->left->right = new Node(5);
    root->right->left = new Node(7);
    root->right->left->right = new Node(10);

    printTraversal(root);

    cout << maxheight(root) << '\n';
    return 0;
}