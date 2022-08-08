var sorting_container = document.getElementById("sorting-container");
var sorting_link = document.getElementById("sorting");
var pathfinding_link = document.getElementById("pathfinding");

var onSortingClick = (e) => {
    e.preventDefault();

    sorting_link.removeEventListener("click", onSortingClick);
    pathfinding_link.removeEventListener("click", onPathfindingClick);

    sorting_link.className += " banner-active";
    pathfinding_link.className += " banner-inactive";

    setTimeout(() => {
        window.location.href = sorting_link.href;
    }, 1000);
};
var onPathfindingClick = (e) => {
    e.preventDefault();
    
    pathfinding_link.removeEventListener("click", onPathfindingClick);
    sorting_link.removeEventListener("click", onSortingClick);

    pathfinding_link.className += " banner-active";
    sorting_link.className += " banner-inactive";

    setTimeout(() => {
        window.location.href = pathfinding_link.href;
    }, 1000);
}

sorting_link.addEventListener("click", onSortingClick);
pathfinding_link.addEventListener("click", onPathfindingClick);