# Algo-Visualizer
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Welcome to Algo-Visualizer! This is a web application that lets you visualize popular [pathfinding](#pathfinding) and [sorting](#sorting) algorithms. You can access the website through https://jovanmarkovic99.github.io/algo-visualizer/.

## Pathfinding

In the pathfinding section, you can find a customizable grid that fits your screen size.<br/>
After selecting the algorithm you wish to visualize, simply click on the play button in the center of the navigation bar.

### Navigation

You can easily select the start and end point of your path by clicking and dragging them anywhere on the grid. The path will update instantly even if you move them during the visualization process.<br/>
<br/>
You can add or remove walls and weights of different costs by left-clicking on a tile. You can also change between walls and weights by toggling the button on the top-right corner of the navigation bar. Adjusting the cost of the weights is done using the scroll wheel. To clear the walls and weights, click on the broom button.<br/>
<br/>
The animation speed can be controlled by clicking on the gauge button on the top-right corner of the navigation bar.

### Pathfinding algorithms

There are four pathfinding algorithms available for you to choose from:

* [Depth-first search](https://en.wikipedia.org/wiki/Depth-first_search)
* [Breadth-first search](https://en.wikipedia.org/wiki/Breadth-first_search)
* [A* search algorithm](https://en.wikipedia.org/wiki/A*_search_algorithm)
* [Dijkstra's algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm)

The table below shows which algorithm is weighted and if it guarantees the shortest path:

| Algorithm | Weighted | Shortest path |
|---|---|---|
| Depth-first search | No | No |
| Breadth-first search | No | Yes |
| A* search algorithm | Yes | Yes |
| Dijkstra's algorithm | Yes | Yes |

### Maze algorithms

For a more interesting path visualization, you can use various wall-creating algorithms to generate mazes.

* Recursive division
* Randomized Prim's algorithm

## Sorting

The sorting section is currently under construction, but will be available soon. Please check back later for updates.
