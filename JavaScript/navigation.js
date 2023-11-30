const nodes = {
    'Entrance': { x: 0, y: -3 },
    'Auditorium': { x: 2, y: -3 },
    'Admin-Office': { x: -2, y: -3 },
    'Staff-Room': { x: 3, y: -2 },
    'Dean-Room': { x: -3, y: -2 },
    'Gents-Washroom': { x: 1, y: 4 },
    'Ladies-Washroom': { x: -1, y: 4 },
    'MRUH-Central-Library': { x: 1, y: -3 },
    'Room-2-004': { x: 3, y: -1 },
    'Room-2-005': { x: 3, y: 0 },
    'Room-2-006': { x: 3, y: 1 },
    'Room-2-007': { x: 3, y: 2 },
    'Room-2-008': { x: 3, y: 3 },
    'Room-2-009': { x: 2, y: 3 },
    'Room-2-010': { x: -2, y: 3 },
    'Room-2-011': { x: -3, y: 3 },
    'Room-2-012': { x: -3, y: 2 },
    'Room-2-013': { x: -3, y: 1 },
    'Room-2-014': { x: -3, y: 0 },
    'Room-2-015': { x: -3, y: -1 },
    'Dept-of-Photography': { x: -1, y: -3 }
};

const graph = {
    'Entrance': ['Admin-Office','MRUH-Central-Library', 'Dept-of-Photography','Auditorium'],
    'Admin-Office': ['Entrance', 'Dean-Room', 'Dept-of-Photography'],
    'Auditorium': ['Entrance', 'MRUH-Central-Library', 'Staff-Room'],
    'MRUH-Central-Library': ['Entrance', 'Auditorium'],
    'Dept-of-Photography': ['Entrance', 'Admin-Office'],
    'Dean-Room': ['Admin-Office', 'Room-2-015'],
    'Staff-Room': ['Auditorium', 'Room-2-004'],
    'Gents-Washroom': ['Room-2-009', 'Ladies-Washroom'],
    'Ladies-Washroom': ['Room-2-010', 'Gents-Washroom'],
    'Room-2-004': ['Room-2-005', 'Staff-Room'],
    'Room-2-005': ['Room-2-005','Room-2-006'],
    'Room-2-006': ['Room-2-005','Room-2-007'],
    'Room-2-007': ['Room-2-006','Room-2-008'],
    'Room-2-008': ['Room-2-009', 'Room-2-007'],
    'Room-2-009': ['Gents-Washroom', 'Room-2-008'],
    'Room-2-010': ['Ladies-Washroom', 'Room-2-011'],
    'Room-2-011': ['Room-2-010', 'Room-2-012'],
    'Room-2-012': ['Room-2-011', 'Room-2-013'],
    'Room-2-013': ['Room-2-012', 'Room-2-014'],
    'Room-2-014': ['Room-2-013', 'Room-2-015'],
    'Room-2-015': ['Room-2-014', 'Dean-Room'],
};

class PriorityQueue {
    constructor() {
        this.elements = [];
    }

    enqueue(element, priority) {
        this.elements.push({ element, priority });
        this.elements.sort((a, b) => a.priority - b.priority);
    }

    dequeue() {
        return this.elements.shift().element;
    }

    isEmpty() {
        return this.elements.length === 0;
    }
}

function heuristic(nodeA, nodeB) {
    // This is a heuristic function used to estimate the distance between two nodes.
    // You can customize this function based on your needs.
    const dx = Math.abs(nodeA.x - nodeB.x);
    const dy = Math.abs(nodeA.y - nodeB.y);
    return dx + dy;
}

function aStarWithDirections(graph, nodes, startNode, endNode) {
    const openSet = new PriorityQueue();
    openSet.enqueue(startNode, 0);

    const cameFrom = {};
    const gScore = {};
    const fScore = {};

    Object.keys(nodes).forEach(node => {
        gScore[node] = Infinity;
        fScore[node] = Infinity;
    });

    gScore[startNode] = 0;
    fScore[startNode] = heuristic(nodes[startNode], nodes[endNode]);

    while (!openSet.isEmpty()) {
        const current = openSet.dequeue();

        if (current === endNode) {
            const path = reconstructPath(cameFrom, endNode);
            const navigationSteps = generateNavigationInstructions(path, nodes);
            return navigationSteps;
        }

        for (const neighbor of graph[current]) {
            const tentativeGScore = gScore[current] + heuristic(nodes[current], nodes[neighbor]);

            if (tentativeGScore < gScore[neighbor]) {
                cameFrom[neighbor] = current;
                gScore[neighbor] = tentativeGScore;
                fScore[neighbor] = gScore[neighbor] + heuristic(nodes[neighbor], nodes[endNode]);

                if (!openSet.elements.some(el => el.element === neighbor)) {
                    openSet.enqueue(neighbor, fScore[neighbor]);
                }
            }
        }
    }

    return null; // If no path is found
}

function reconstructPath(cameFrom, current) {
    const path = [current];
    while (cameFrom[current]) {
        current = cameFrom[current];
        path.unshift(current);
    }
    return path;
}

function generateNavigationInstructions(path, nodes) {
    const navigationSteps = document.getElementById('navigationSteps');
    navigationSteps.innerHTML = '';

    for (let i = 1; i < path.length; i++) {
        const current = path[i - 1];
        const next = path[i];
        const direction = calculateDirection(current, next, nodes);

        const li = document.createElement('li');
        li.textContent = `${direction} from ${current} to ${next}`;
        navigationSteps.appendChild(li);
    }
    const li = document.createElement('li');
    li.textContent = `You've Reached Your Destination !!`;
    navigationSteps.appendChild(li);
    const directions = document.querySelector('.directions');
    directions.style.display = 'block';

    return navigationSteps;
}

// Calculate direction function
function calculateDirection(currentNode, nextNode, nodes) {
    const currentPos = nodes[currentNode];
    const nextPos = nodes[nextNode];

    const deltaX = nextPos.x - currentPos.x;
    const deltaY = nextPos.y - currentPos.y;

    // Calculate absolute differences for direction determination
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (deltaX === 0 && deltaY === 0) {
        return 'Remain at the current position';
    } else if (deltaX === 0 && deltaY > 0) {
        return 'Go Straight';
    } else if (deltaX === 0 && deltaY < 0) {
        return 'Move South';
    } else if (deltaX > 0 && deltaY === 0) {
        return 'Turn Right & Go Staright';
    } else if (deltaX < 0 && deltaY === 0) {
        return 'Turn Left & Go Staright';
    } else if (deltaX > 0 && deltaY > 0 && absDeltaX === absDeltaY) {
        return 'Go Staright & Turn Left';
    } else if (deltaX < 0 && deltaY < 0 && absDeltaX === absDeltaY) {
        return 'Move Southwest';
    } else if (deltaX > 0 && deltaY < 0 && absDeltaX === absDeltaY) {
        return 'Move Northwest';
    } else if (deltaX < 0 && deltaY > 0 && absDeltaX === absDeltaY) {
        return 'Go Staright & Turn Right';
    }
    // Add more specific directional logics for your layout
    return 'Navigate as needed';
}

function showNavigation() {
    const urlParams = new URLSearchParams(window.location.search);
    const currentLocation = urlParams.get('currentLocation');
    const destination = urlParams.get('destination');

    updateMap(currentLocation, destination);

    const startNode = currentLocation;
    const endNode = destination;

    aStarWithDirections(graph, nodes, startNode, endNode);

}

function updateMap(currentLocation, destination){
    if (currentLocation != null){
        const mapImageSrc = `/Maps/${currentLocation}_${destination}.png`;
        document.getElementById('map').src = mapImageSrc;
    }
}

window.onload = showNavigation();
