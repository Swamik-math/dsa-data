
// UNIVERSAL BACKTRACKING TECHNIQUES

void solve(state){
    if(base case)
    {
        save answer;
        return;
    }

    for(each choice)
    {
        if(invalid)
            continue;
        
        choose();

        solve(new state);

        undo();
    }
}