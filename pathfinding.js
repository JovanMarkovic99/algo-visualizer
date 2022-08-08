// Remove banner
let banner = document.getElementById("banner");
setTimeout(() => { banner.remove(); }, 1000);

// Handle table creation/deletion
let pathfinding_table = document.getElementById("pathfinding-table");
let pathfinding_tile_matrix;
// Holds a 0 for a wall, 1 for a non weighted-square, and 2+ for the weight number
let pathfinding_wall_weights_matrix;
let grid_num_rows = Math.floor((window.innerHeight - 260) / 35);
let grid_num_cols = Math.floor((window.innerWidth - 100) / 40);
let grid_start_pos = (grid_num_cols > grid_num_rows) 
                ? { row: Math.floor(grid_num_rows / 2), col: grid_num_cols > 2 ? 1 : 0 }
                : { row: grid_num_rows > 2 ? 1 : 0, col: Math.floor(grid_num_cols / 2) };
let grid_end_pos = (grid_num_cols > grid_num_rows)
                ? { row: grid_start_pos.row, col: grid_num_cols - grid_start_pos.col - 1}
                :  { row: grid_num_rows - grid_start_pos.row - 1, col: grid_start_pos.col };
let grid_created = false;
let start_svg;
let end_svg;
let createGrid = (delay, delay_increment) => {
    start_reset_button.disabled = true;
    mazes_menu_button.disabled = true;

    // Stop mouse listeners
    if (grid_created) {
        grid_created = false;
        stopMouseListeners();

        // Replace the table
    }

    pathfinding_tile_matrix = Array(grid_num_rows).fill().map(() => Array(grid_num_cols).fill());
    pathfinding_wall_weights_matrix = Array(grid_num_rows).fill().map(() => Array(grid_num_cols).fill(1));

    // Add rows
    for (let row = 0; row < grid_num_rows; ++row)
    {
        let new_row = document.createElement("tr");
        new_row.id = "row-" + row;
        pathfinding_table.appendChild(new_row);
    }

    // Add tiles diagonaly
    for (let starting_col = 0; starting_col < grid_num_cols + grid_num_rows; ++starting_col)
        for (let diagonal = 0; diagonal < grid_num_rows; ++diagonal)
        {
            let pos = { row: diagonal, col: starting_col - diagonal };

            if (pos.col >= grid_num_cols)
                continue;
            if (pos.col < 0)
                break;

            // Create new tile
            let new_tile = document.createElement("td");
            new_tile.id = pos.row + '-' + (pos.col);
            pathfinding_tile_matrix[pos.row][pos.col] = new_tile;
            if (pos.row == grid_start_pos.row && pos.col == grid_start_pos.col)
            {
                let start_clone = document.getElementById("legend-start").cloneNode(true);
                start_clone.id = "start";
                start_clone.className = "";
                start_svg = start_clone;
                new_tile.className = "start";
                new_tile.appendChild(start_clone);
            }
            if (pos.row == grid_end_pos.row && pos.col == grid_end_pos.col)
            {
                let end_clone = document.getElementById("legend-end").cloneNode(true);
                end_clone.id = "end";
                end_clone.className = "";
                end_svg = end_clone;
                new_tile.className = "end";
                new_tile.appendChild(end_clone);
            }

            // Add the tile to the
            pathfinding_table.children[pos.row].appendChild(new_tile); 
            setTimeout(() => { 
                new_tile.style.opacity = 1;
                new_tile.animate([{opacity: 0}, {opacity: 1}], {duration: 300, iterations: 1, easing: 'ease-in'});
                new_tile.animate([{transform: 'translateY(-70px)'}, {transform: 'translateY(0px)'}], {duration: 300, iterations: 1, easing: 'ease-in-out'}); 
            }, delay);
            delay += delay_increment;
        }

    // Start mouse listeners
    setTimeout(() => { 
        grid_created = true; 
        startMouseListeners(); 
        mazes_menu_button.disabled = false;
        if (pathfinding_algorithm !== null)
            start_reset_button.disabled = false;
    }, delay)
};

// Handle mouse events
let table_mouse_down = false;
let setting_walls = true;
let weight_count = 2;
let picked_up_ele = null;
let offset_pos = { x: 0, y: 0 };
let onMouseEvent = (event) => {
    event.preventDefault();
    if (event.button != 0)
        return;

    let element = event.target;

    switch (event.type) {
        case "mousemove":
            if (picked_up_ele !== null)
                trackPickedUp(event);
            break;

        case "mouseover":
            if (table_mouse_down && picked_up_ele === null)
                if (setting_walls)
                    toggleWall(element);
                else
                    toggleWeight(element);
            break;

        case "mouseup":
            if (picked_up_ele !== null)
                tryPlaceDown(element);
            table_mouse_down = false;
            break;

        case "mousedown":
            if (setting_walls)
                toggleWall(element);
            else
                toggleWeight(element);
            if (picked_up_ele === null)
                tryPickUp(element);
            table_mouse_down = true;
            break;
    }
};
let startMouseListeners = () => {
    ["mouseup", "mousedown", "mouseover", "mousemove"].map((event) => {
        pathfinding_table.addEventListener(event, onMouseEvent);
    });
};
let stopMouseListeners = () => {
    ["mouseup", "mousedown", "mouseover", "mousemove"].map((event) => {
        pathfinding_table.removeEventListener(event, onMouseEvent);
    });
};
let toggleWall = (element, pos = null) => {
    if (element.className.startsWith("wall"))
    {
        element.className = element.className.slice(4);

        if (pos == null)
            pos = getElementPos(element);
        pathfinding_wall_weights_matrix[pos.row][pos.col] = 1;

        if (did_pathfinding)
            pathfind();
    }
    else if (element.className === "" || element.className[0] === ' ')
    {
        element.className = "wall" + element.className;

        if (pos == null)
            pos = getElementPos(element);
        pathfinding_wall_weights_matrix[pos.row][pos.col] = 0;

        if (did_pathfinding && element.className.includes("searched"))
            pathfind();
    }
};
let toggleWeight = (element, pos = null) => {
    if (element.className.startsWith("weight"))
    {
        if (element.className.indexOf(' ') == -1)
            element.className = "";
        else
            element.className = element.className.substring(element.className.indexOf(' '));
        element.removeChild(element.lastChild);

        if (pos == null)
            pos = getElementPos(element);
        pathfinding_wall_weights_matrix[pos.row][pos.col] = 1;

        if (did_pathfinding)
            pathfind();
    }
    else if (element.className === "" || element.className[0] === ' ')
    {
        element.className = "weight-" + weight_count.toString() + element.className;
        let new_weight = nav_weight_svg.cloneNode(true);
        new_weight.id = "";
        element.appendChild(new_weight);

        if (pos == null)
            pos = getElementPos(element);
        pathfinding_wall_weights_matrix[pos.row][pos.col] = weight_count;

        if (did_pathfinding && element.className.includes("searched"))
            pathfind();
    }
};
let tryPickUp = (element) => {
    if (element.className.startsWith("start"))
    {
        let rect = pathfinding_tile_matrix[grid_start_pos.row][grid_start_pos.col].getBoundingClientRect();
        offset_pos.x = rect.left + 5;
        offset_pos.y = rect.top + 5;
        picked_up_ele = start_svg;
        picked_up_ele.className += " draging";
    }
    else if (element.className.startsWith("end"))
    {
        let rect = pathfinding_tile_matrix[grid_end_pos.row][grid_end_pos.col].getBoundingClientRect();
        offset_pos.x = rect.left + 5;
        offset_pos.y = rect.top + 5;
        picked_up_ele = end_svg;
        picked_up_ele.className += " draging";
    }
};
let trackPickedUp = (event) => {
    picked_up_ele.style.top = event.clientY - offset_pos.y;
    picked_up_ele.style.left = event.clientX - offset_pos.x;
};
let tryPlaceDown = (element) => {
    if (element.className === "" || element.className[0] === ' ')
    {
        let old_start_end;
        if (picked_up_ele === start_svg)
        {
            old_start_end = pathfinding_tile_matrix[grid_start_pos.row][grid_start_pos.col];
            grid_start_pos = getElementPos(element);
        }
        else
        {
            old_start_end = pathfinding_tile_matrix[grid_end_pos.row][grid_end_pos.col];
            grid_end_pos = getElementPos(element);
        }
        element.className = old_start_end.className;
        old_start_end.className = "";
        old_start_end.removeChild(picked_up_ele);
        element.appendChild(picked_up_ele);
    }

    picked_up_ele.className = "";
    picked_up_ele.style = "";
    picked_up_ele = null;
    if (did_pathfinding)
        pathfind();
};
let getElementPos = (element) => {
    return { row: parseInt(element.id.split('-')[0]), col: parseInt(element.id.split('-')[1]) };
};

// Pathfinding algorithms
let pathfinding_algorithm = null;
let animation_delay = 0;
let animation_delay_increment = 50;
let depthFirstSearch = (start, end) => {
    let path_map = new Map();

    let search_stack = [{ prev_pos: start, current_pos: start }];
    while (search_stack.length) 
    {
        let { prev_pos, current_pos } = search_stack.pop();

        if (path_map.has(JSON.stringify(current_pos)))
            continue;
        path_map.set(JSON.stringify(current_pos), prev_pos);

        setSearchedORPath(current_pos, true);

        if (current_pos.row == end.row && current_pos.col == end.col)
            break;

        search_stack = search_stack.concat(
            grabAdjacentSearchable(current_pos)
            .filter((pos) => !path_map.has(JSON.stringify(pos)))
            .map(pos => ({ prev_pos: current_pos, current_pos: pos }))
        );
    }

    return deconstructPath(start, end, path_map);
};
let breadthFirstSearch = (start, end) => {
    let path_map = new Map();

    let search_queue = [{ prev_pos: start, current_pos: start }];
    while (search_queue.length) 
    {
        let { prev_pos, current_pos } = search_queue.shift();

        if (path_map.has(JSON.stringify(current_pos)))
            continue;
        path_map.set(JSON.stringify(current_pos), prev_pos);

        setSearchedORPath(current_pos, true);

        if (current_pos.row == end.row && current_pos.col == end.col)
            break;

        search_queue = search_queue.concat(
            grabAdjacentSearchable(current_pos)
            .filter((pos) => !path_map.has(JSON.stringify(pos)))
            .map(pos => ({ prev_pos: current_pos, current_pos: pos }))
        );
    }

    return deconstructPath(start, end, path_map);
};
let AStarSearch = (start, end) => {
    let path_map = new Map();
    
    let path_score = Array(grid_num_rows).fill().map(() => Array(grid_num_cols).fill(Number.MAX_SAFE_INTEGER));
    path_score[start.row][start.col] = 0;
    
    let hueristic_func = (current) => Math.abs(current.row - end.row) + Math.abs(current.col - end.col);

    let total_path_score = Array(grid_num_rows).fill().map(() => Array(grid_num_cols).fill(Number.MAX_SAFE_INTEGER));
    total_path_score[start.row][start.col] = hueristic_func(start);

    let priority_queue = new window.PriorityQueue((a, b) => total_path_score[a.row][a.col] < total_path_score[b.row][b.col]);
    priority_queue.push(start);
    while (!priority_queue.isEmpty())
    {
        current = priority_queue.pop();
        if (!pathfinding_tile_matrix[current.row][current.col].className.includes("searched"))
            setSearchedORPath(current, true);
        if (current.row === end.row && current.col === end.col)
            return deconstructPath(start, end, path_map);

        grabAdjacentSearchable(current).forEach((next) => {
            let new_score = path_score[current.row][current.col] + pathfinding_wall_weights_matrix[next.row][next.col];
            if (new_score < path_score[next.row][next.col])
            {
                path_map.set(JSON.stringify(next), current);
                path_score[next.row][next.col] = new_score;
                total_path_score[next.row][next.col] = new_score + hueristic_func(next);

                if (!priority_queue.includes(next, (a, b) => a.row === b.row && a.col === b.col))
                    priority_queue.push(next);
            }
        });
    }

    return [];
};
let dijkstrasAlgorithm = (start, end) => {
    let path_map = new Map();

    let dist_from_start = Array(grid_num_rows).fill().map(() => Array(grid_num_cols).fill(Number.MAX_SAFE_INTEGER));
    dist_from_start[start.row][start.col] = 0;

    let priority_queue = new window.PriorityQueue((a, b) => dist_from_start[a.row][a.col] < dist_from_start[b.row][b.col]);
    for (let i = 0; i < grid_num_rows; ++i)
        for (let j = 0; j < grid_num_cols; ++j)
            if (pathfinding_tile_matrix[i][j].className !== "wall")
                priority_queue.push({ row: i, col: j });

    while (!priority_queue.isEmpty())
    {
        let current = priority_queue.pop();

        let current_dist = dist_from_start[current.row][current.col];
        if (current_dist == Number.MAX_SAFE_INTEGER)
            break;

        setSearchedORPath(current, true);
        if (current.row == end.row && current.col == end.col)
            break;

        grabAdjacentSearchable(current)
        .filter((next) => priority_queue.includes(next, (a, b) => a.row == b.row && a.col == b.col))
        .forEach((next) => {
            let new_dist = current_dist + pathfinding_wall_weights_matrix[next.row][next.col];
            if (new_dist < dist_from_start[next.row][next.col])
            {
                dist_from_start[next.row][next.col] = new_dist;
                path_map.set(JSON.stringify(next), current);
                priority_queue.recalculate(next, (a, b) => a.row == b.row && a.col == b.col);
            }
        });
    }

    console.log("OUT")
    return deconstructPath(start, end, path_map);
};
let pathfind = () => {
    resetPathfindingTiles();

    let path = pathfinding_algorithm(grid_start_pos, grid_end_pos);

    path.forEach((pos) => setSearchedORPath(pos, false));
};
// Helper funtions
let grabAdjacentSearchable = (pos) => {
    let adj = [];

    if (pos.row > 0 && pathfinding_wall_weights_matrix[pos.row - 1][pos.col])
        adj.push({ row: pos.row - 1, col: pos.col });
    if (pos.row + 1 < grid_num_rows && pathfinding_wall_weights_matrix[pos.row + 1][pos.col])
        adj.push({ row: pos.row  + 1, col: pos.col });
    if (pos.col > 0 && pathfinding_wall_weights_matrix[pos.row][pos.col - 1])
        adj.push({ row: pos.row, col: pos.col - 1 });
    if (pos.col + 1 < grid_num_cols && pathfinding_wall_weights_matrix[pos.row][pos.col + 1])
        adj.push({ row: pos.row, col: pos.col + 1 });

    return adj;
};
let setSearchedORPathAnimated = (pos, searched) => {
    setTimeout(() => setSearchedORPathNonAnimated(pos, searched), animation_delay);
    animation_delay += animation_delay_increment;
};
// Used for dynamic instant regeneration of pathfinding on grid change
let setSearchedORPathNonAnimated = (pos, searched) => {
    pathfinding_tile_matrix[pos.row][pos.col].className += searched ? " searched" : " path";
};
let deconstructPath = (start, end, path_map) => {
    if (!path_map.has(JSON.stringify(end)))
        return [];

    let path = [];
    let current = end;
    while (current.row != start.row || current.col != start.col)
    {
        path.push(current);
        current = path_map.get(JSON.stringify(current));
    }
    path.push(current);
    return path.reverse();
};
let setSearchedORPath = setSearchedORPathAnimated;
let resetPathfindingTiles = () => {
    pathfinding_tile_matrix.forEach((row) => 
        row.forEach((ele) => {
            if (ele.className.endsWith(" path"))
                ele.className = ele.className.replace(" path", '');
            if (ele.className.endsWith(" searched"))
                ele.className = ele.className.replace(" searched", '');
        })
    );
};
let resetWallWeightTiles = () => {    
    pathfinding_tile_matrix.forEach((row) =>
        row.forEach((ele) => {
            if (ele.className === "wall")
                ele.className = "";
            else if (ele.className.startsWith("weight"))
            {
                ele.className = "";
                ele.removeChild(ele.lastChild);
            }
        })
    );

    pathfinding_wall_weights_matrix.forEach((row) => row.fill(1));
}

// Maze algorithms
let recursiveDivisionCaller = () => recursiveDivision({x: 0, y: 0}, grid_num_cols, grid_num_rows);
let recursiveDivision = ({x, y}, width, height) => {
    if (width <= 1 || height <= 1 || (width <= 2 && height <= 2))
        return;

    if (height >= width)
    {
        let valid_horizontal_wall_pos = Array(height - 2).fill().map((_, index) => y + index + 1);
        if (x > 0 && x + width < grid_num_cols)
            valid_horizontal_wall_pos = valid_horizontal_wall_pos.filter((pos) => !pathfinding_wall_weights_matrix[pos][x - 1] || !pathfinding_wall_weights_matrix[pos][x + width]);

        let horizontal_wall_pos = valid_horizontal_wall_pos.length > 0 ? valid_horizontal_wall_pos[Math.floor(Math.random() * valid_horizontal_wall_pos.length)] : -1;
        if (horizontal_wall_pos == -1)
            return;

        let horizontal_hole_pos = Math.floor(Math.random() * width) + x;
        if (x > 0 && pathfinding_wall_weights_matrix[horizontal_wall_pos][x - 1])
            horizontal_hole_pos = x;
        else if (x + width < grid_num_cols && pathfinding_wall_weights_matrix[horizontal_wall_pos][x + width])
            horizontal_hole_pos = x + width - 1;

        for (let i = x; i < x + width; ++i)
            if (i != horizontal_hole_pos
                && !(horizontal_wall_pos == grid_start_pos.row && i == grid_start_pos.col)
                && !(horizontal_wall_pos == grid_end_pos.row && i == grid_end_pos.col))
            {
                pathfinding_wall_weights_matrix[horizontal_wall_pos][i] = 0;
                setTimeout(() => toggleWall(pathfinding_tile_matrix[horizontal_wall_pos][i], { row: horizontal_wall_pos, col: i }), animation_delay);
                animation_delay += animation_delay_increment;
            }
            
        // Top section
        recursiveDivision({x: x, y: y}, width, horizontal_wall_pos - y);
        // Bottom section
        recursiveDivision({x: x, y: horizontal_wall_pos + 1}, width, y + height - horizontal_wall_pos - 1);
    }
    else
    {
        let valid_vertical_wall_pos = Array(width - 2).fill().map((_, index) => x + index + 1);
        if (y > 0 && y + height < grid_num_rows)
            valid_vertical_wall_pos = valid_vertical_wall_pos.filter((pos) => !pathfinding_wall_weights_matrix[y - 1][pos] || !pathfinding_wall_weights_matrix[y + height][pos]);

        let vertical_wall_pos = valid_vertical_wall_pos.length > 0 ? valid_vertical_wall_pos[Math.floor(Math.random() * valid_vertical_wall_pos.length)] : -1;
        if (vertical_wall_pos == -1)
            return;

        let vertical_hole_pos = Math.floor(Math.random() * height) + y;
        if (y > 0 && pathfinding_wall_weights_matrix[y - 1][vertical_wall_pos])
            vertical_hole_pos = y;
        else if (y + height < grid_num_rows && pathfinding_wall_weights_matrix[y + height][vertical_wall_pos])
            vertical_hole_pos = y + height -1;

        for (let i = y; i < y + height; ++i)
            if (i != vertical_hole_pos
                && !(vertical_wall_pos == grid_start_pos.col && i == grid_start_pos.row)
                && !(vertical_wall_pos == grid_end_pos.col && i == grid_end_pos.col))
            {
                pathfinding_wall_weights_matrix[i][vertical_wall_pos] = 0;
                setTimeout(() => toggleWall(pathfinding_tile_matrix[i][vertical_wall_pos], { row: i, col: vertical_wall_pos }), animation_delay);
                animation_delay += animation_delay_increment;
            }

        // Left section
        recursiveDivision({x: x, y: y}, vertical_wall_pos - x, height);
        // Right section
        recursiveDivision({x: vertical_wall_pos + 1, y: y}, x + width - vertical_wall_pos - 1, height);
    }
};
let createMaze = (maze_algorithm) => {
    algorithms_menu_button.disabled = true;
    mazes_menu_button.disabled = true;
    clear_walls_weights_button.disabled = true;
    if (pathfinding_algorithm !== null)
        start_reset_button.disabled = true;
    stopMouseListeners();

    resetWallWeightTiles();

    animation_delay = 0;
    maze_algorithm();

    setTimeout(() => {
        algorithms_menu_button.disabled = false;
        mazes_menu_button.disabled = false;
        clear_walls_weights_button.disabled = false;
        if (pathfinding_algorithm !== null)
            start_reset_button.disabled = false;
        startMouseListeners();
    }, animation_delay);
}

// Nav
let start_reset_button = document.getElementById("start-reset-button");
let algorithms_menu_button = document.getElementById("algorithms-menu-button");
let mazes_menu_button = document.getElementById("mazes-menu-button");
let did_pathfinding = false;
start_reset_button.addEventListener("click", () => {
    if (start_reset_button.className.endsWith(" toggled"))
    {
        start_reset_button.className = start_reset_button.className.replace(" toggled", '');
        algorithms_menu_button.disabled = false;
        mazes_menu_button.disabled = false;
        clear_walls_weights_button.disabled = false;
        
        resetPathfindingTiles();
    
        setSearchedORPath = setSearchedORPathAnimated;
        did_pathfinding = false;
    }
    else
    {
        start_reset_button.className += " toggled";
        start_reset_button.disabled = true;
        algorithms_menu_button.disabled = true;
        mazes_menu_button.disabled = true;
        clear_walls_weights_button.disabled = true;

        stopMouseListeners();

        animation_delay = 0;
        pathfind();
    
        setTimeout(() => { 
            setSearchedORPath = setSearchedORPathNonAnimated;
            did_pathfinding = true;
            startMouseListeners();
            start_reset_button.disabled = false;
        }, animation_delay);
    }
});

let algorithm_button_array = [
    { algorithm: breadthFirstSearch, button: document.getElementById("breadth-first-button") },
    { algorithm: depthFirstSearch, button: document.getElementById("depth-first-button") },
    { algorithm: AStarSearch, button: document.getElementById("a-start-search") },
    { algorithm: dijkstrasAlgorithm, button: document.getElementById("dijkstras-algorithm") },
]
let algorithm_name_span = document.getElementById("algorithm-name");
algorithm_button_array.forEach(({ algorithm, button }) => {
    button.addEventListener("click", () => {
        pathfinding_algorithm = algorithm;
        algorithm_name_span.innerHTML = button.innerHTML;
        if (grid_created)
            start_reset_button.disabled = false;
    });
});
let maze_algorithm_button_array = [
    { algorithm: recursiveDivisionCaller, button: document.getElementById("recursive-divison-button")},
]
maze_algorithm_button_array.forEach(({ algorithm, button }) => {
    button.addEventListener("click", () => {
        createMaze(algorithm);
    });
});

let clear_walls_weights_button = document.getElementById("clear-walls-weights-button");
let toggle_wall_weights_button = document.getElementById("toggle-wall-weights");
let nav_weight = document.getElementById("nav-weight");
let nav_weight_svg = document.getElementById("nav-weight-svg");
let animation_speed_button = document.getElementById("animation-speed-button");
clear_walls_weights_button.addEventListener("click", () => resetWallWeightTiles());
toggle_wall_weights_button.addEventListener("click", () => {
    setting_walls = !setting_walls;
    if (toggle_wall_weights_button.className.endsWith(" switched"))
        toggle_wall_weights_button.className = toggle_wall_weights_button.className.replace(" switched", '');
    else
        toggle_wall_weights_button.className += " switched";
});
document.body.addEventListener("wheel", (event) => {
    if (event.deltaY % 100 == 0)
        weight_count -= event.deltaY / 100;
    else
        weight_count -= event.deltaY;
    if (weight_count < 2)
        weight_count = 2;

    nav_weight_svg.className = "weight-" + weight_count.toString();
    nav_weight_svg.children[1].innerHTML = weight_count;
});
animation_speed_button.addEventListener("click", () => {
    if (animation_speed_button.className.endsWith(" very-fast"))
    {
        animation_speed_button.className = animation_speed_button.className.replace(" very-fast", " very-slow")
        animation_delay_increment = 200;
    } else if (animation_speed_button.className.endsWith(" fast"))
    {
        animation_speed_button.className = animation_speed_button.className.replace(" fast", " very-fast")
        animation_delay_increment = 10;
    } else if (animation_speed_button.className.endsWith(" slow"))
    {
        animation_speed_button.className = animation_speed_button.className.replace(" slow", '');
        animation_delay_increment = 50;
    } else if (animation_speed_button.className.endsWith(" very-slow"))
    {
        animation_speed_button.className = animation_speed_button.className.replace(" very-slow", " slow");
        animation_delay_increment = 100;
    } else
    {
        animation_speed_button.className += " fast";
        animation_delay_increment = 25;
    }
});

createGrid(1100, 5);

// Priority queue
{
    const top = 0;
    const left = i => (i << 1) + 1;
    const right = i => (i + 1) << 1;
    const parent = i => ((i + 1) >>> 1) - 1;

    class PriorityQueue {
        constructor(comparator = (a, b) => a > b) {
            this._heap = [];
            this._comparator = comparator;
        }

        size() {
            return this._heap.length;
        }

        isEmpty() {
            return this.size() == 0;
        }

        peek() {
            return this._heap[top];
        }

        push(...values) {
            values.forEach((value) => {
                this._heap.push(value);
                this._siftUp();
            });

            return this.size();
        }

        pop() {
            const popped_val = this.peek();
            const bottom = this.size() - 1;
            if (bottom > top)
                this._swap(bottom, top);
            
            this._heap.pop();
            this._siftDown();

            return popped_val;
        }

        replace(value) {
            const replaced_val = this.peak();

            this._heap[top] = value;
            this._siftDown();

            return replaced_val; 
        }

        includes(value, equality_comparison = (a, b) => a === b) {
            return this._heap.some(current => equality_comparison(current, value));
        }

        recalculate(value, equality_comparison = (a, b) => a == b) {
            this._siftUp(this._heap.findIndex(ele => equality_comparison(ele, value)));
        }

        _swap(i, j) {
            [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
        }

        _siftUp(i = this.size() - 1) {
            let current = i;
            while (current > top && this._greater(current, parent(current)))
            {
                this._swap(current, parent(current));
                current = parent(current);
            }
        }

        _siftDown(i = top) {
            let current = i;
            while (left(current) < this.size() && this._greater(left(current), current) 
                || right(current) < this.size() && this._greater(right(current), current))
            {
                let max_next = (right(current) < this.size() && this._greater(right(current), left(current))) ? right(current) : left(current);
                this._swap(current, max_next);
                current = max_next;
            }
        }

        _greater(i, j) {
            return this._comparator(this._heap[i], this._heap[j]);
        }
    }

    window.PriorityQueue = PriorityQueue;
}