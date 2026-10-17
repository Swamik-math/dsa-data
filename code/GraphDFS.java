import java.util.*;

public class GraphDFS {
    private int vertices;
    private LinkedList<Integer>[] adjList;

    // Constructor to initialize the graph
    public GraphDFS(int vertices) {
        this.vertices = vertices;
        adjList = new LinkedList[vertices];
        for (int i = 0; i < vertices; i++) {
            adjList[i] = new LinkedList<>();
        }
    }

    // Method to add an edge to the graph
    public void addEdge(int src, int dest) {
        adjList[src].add(dest);
    }

    // Helper method for recursive DFS traversal
    private void dfsUtil(int node, boolean[] visited) {
        // Mark the current node as visited and print it
        visited[node] = true;
        System.out.print(node + " ");

        // Recur for all the vertices adjacent to this vertex
        for (int neighbor : adjList[node]) {
            if (!visited[neighbor]) {
                dfsUtil(neighbor, visited);
            }
        }
    }

    // Main method to perform DFS traversal
    public void dfs(int startNode) {
        boolean[] visited = new boolean[vertices];
        System.out.print("DFS Traversal: ");
        dfsUtil(startNode, visited);
        System.out.println();
    }

    public static void main(String[] args) {
        GraphDFS graph = new GraphDFS(5);

        // Setting up graph connections
        graph.addEdge(0, 1);
        graph.addEdge(0, 2);
        graph.addEdge(1, 3);
        graph.addEdge(1, 4);
        graph.addEdge(2, 4);

        // Run DFS starting from node 0
        graph.dfs(0);
        // Expected Output: DFS Traversal: 0 1 3 4 2 
    }
}
