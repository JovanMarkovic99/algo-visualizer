# Algo-Visualizer

A webpage for visualizing common [pathfinding](#pathfinding) and [sorting](#sorting) algorithms\
The website can be viewed at https://jovanmarkovic99.github.io/algo-visualizer/

* [Pathfinding](#pathfinding)
  * [Navigation](#navigation)
    * [Start & End point](#start--end-point)
    * [Walls & Weights](#walls--weights)
    * [Animation speed](#animation-speed)
  * [Pathfinding algorithms](#pathfinding-algorithms)
    * [Depth-first search](#depth-first-search)
    * [Breadth-first search](#breadth-first-search)
    * [A* search algorithm](#a-search-algorithm)
    * [Dijkstra's search algorithm](#dijkstras-algorithm)
  * [Maze algorithms](#maze-algorithms)
    * [Recursive division](#recursive-division)
* [Sorting](#sorting)

# Pathfinding

The pathfinding section contains a customizable grid appropriate to the screen size.\
After customizing and selecting the algorithm you wish to visualize, click on the play button in the middle of the navbar.

## Navigation

###### Start & End point

The starting and ending point can be click-and-dragged to anywhere on the grid. If the moving is done after the visualization,
the path will update instantly.

###### Walls & Weights

**Walls** and **weights** of different costs can be added/removed to a tile by **left-clicking on the tile**.
After visualizing, the path will update instantly on change.

Changing between walls and weights can be done by toggling the top-right button in the navbar.

Changing the **cost of the weights** can be done with the **scroll wheel**.

Clearing the walls & weights can be done by clicking on the broom button.
<br><br>

###### Animation speed

You can control how fast the algorithms are flagging the searched tiles by clicking on the gauge button on the top-right of the navbar
<br>

## Pathfinding algorithms

| Algorithm | Weighted | Shortest path |
|---|---|---|
| Depth-first search | No | No |
| Breadth-first search | No | Yes |
| A* search algorithm | Yes | Yes |
| Dijkstra's algorithm | Yes | Yes |

<br>

###### Depth-first search

[Depth-first search](https://en.wikipedia.org/wiki/Depth-first_search) is a **non-weighted** recursive algorithm that processes nodes in one direction until exhaustion and then backtracks when no searchable nodes are left in that direction.
It **doesn't guarantee rante the shortest path**.
<br><br>

###### Breadth-first search

[Breadth-first search](https://en.wikipedia.org/wiki/Breadth-first_search) is a **non-weighted** algorithm that processes nodes orderly, the closest ones first, utilizing a queue.
It **guarantees the shortest path**.
<br><br>

###### A* search algorithm

[A* search algorithm](https://en.wikipedia.org/wiki/A*_search_algorithm) is a **weighted** algorithm that processes nodes in an orderly fashion,
using a priority queue. The priority in the queue is determined by the sum of the already traveled distance and some heuristic function 
(e.g. absolute distance from the end). It **guarantees the shortest path**.
<br><br>

###### Dijkstra's algorithm

[Dijkstra's algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm) is a **weighted** algorithm that **determines the shortest path**
from a starting node to every other node. It searches every node while continuously updating the shortest path to all the neighboring nodes.
<br>

## Maze algorithms

Various wall-creating algorithms for interesting path visualizations.
<br><br>

###### Recursive division

[Recursive division](https://weblog.jamisbuck.org/2011/1/12/maze-generation-recursive-division-algorithm) generates a maze by creating a random valid wall
somewhere along the shorter axis, repeating the process on the newly created sections.

# Sorting

The sorting section is currently under construction, please check back later.
