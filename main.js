
screen = document.getElementById("screen");

class object {
    constructor(colour, symbol, x, y) {
        this.HTML = document.createElement("p");
        this.HTML.classList.add("object");
        this.HTML.style.color = colour;
        this.HTML.innerText = symbol;
        this.HTML.style.zIndex = 20;
        this.x = x;
        this.y = y;
        screen.appendChild(this.HTML);
    }

    draw() {
        this.HTML.style.left = (this.x * 20) + "px";
        this.HTML.style.top = (this.y * 30) + "px";
    }

}

class Player extends object {
    constructor(x, y) {
        super("#afa", "@", x, y);
        floodreveal(this.x, this.y);
    }

    move(event) {
            let prevx = this.x;
            let prevy = this.y;
            if (event.key == "ArrowLeft") {
                this.x--;
            } else if (event.key == "ArrowUp") {
                this.y--;
            } else if (event.key == "ArrowRight") {
                this.x++;
            } else if (event.key == "ArrowDown") {
                this.y++;
            }
            if (this.x < 0 || this.x >= 30 || this.y < 0 || this.y >= 15) {
                this.x = prevx;
                this.y = prevy;
            } else {
                if (world[this.x][this.y].classList.contains("solid")) {
                    this.x = prevx;
                    this.y = prevy;
                }
            }
            
            if (world[this.x][this.y].innerText == "?") {
                //generateCorridor(this.x, this.y, world[this.x][this.y].getAttribute("direction"));
                world[this.x][this.y].innerText = ".";
                world[this.x][this.y].classList.remove("blocking");
                world[this.x][this.y].removeAttribute("direction");
                floodreveal(this.x, this.y);
            }

            drawWorld();

    }
}

let world = new Array(30).fill().map(() => new Array(15).fill().map(() => document.createElement("p")));
let objects = [];
let player = new Player(15, 7);
objects.push(player);

function setupWorld() {
    for (let i = 0; i < world.length; i++) {
        for (let j = 0; j < world[i].length; j++) {
            world[i][j].classList.add("tile");
            if (world[i][j].innerText == "") {
                world[i][j].classList.add("solid");
            }
            screen.appendChild(world[i][j]);
        }
    }
    let stairsX = 0;
    let stairsY = 0;
    while (world[stairsX][stairsY].innerText != "." || (stairsX == player.x && stairsY == player.y)) {
        stairsX = Math.floor(Math.random() * 30);
        stairsY = Math.floor(Math.random() * 15);
    }
    world[stairsX][stairsY].innerText = "\\";
}

function drawWorld() {
    for (let i = 0; i < world.length; i++) {
        for (let j = 0; j < world[i].length; j++) {
            world[i][j].style.left = (i * 20) + "px";
            world[i][j].style.top = (j * 30) + "px";
        }
    }
    objects.forEach(object => {
        object.draw();
    }); 
}
function generateRoom(entranceX, entranceY, entranceDirection, numExits, attempts = 0, hidden = false) {
    width = Math.floor(Math.random() * 5) + 3;
    height = Math.floor(Math.random() * 5) + 3;
    cornerX = 0;
    cornerY = 0;
    switch (entranceDirection) {
        case "right":
            cornerX = entranceX;
            cornerY = entranceY - Math.floor(Math.random() * (height - 2)) - 1;
            break;
        case "left":
            cornerX = entranceX - width + 1;
            cornerY = entranceY - Math.floor(Math.random() * (height - 2)) - 1;
            break;
        case "down":
            cornerX = entranceX - Math.floor(Math.random() * (width - 2)) - 1;
            cornerY = entranceY;
            break;  
        case "up":
            cornerX = entranceX - Math.floor(Math.random() * (width - 2)) - 1;
            cornerY = entranceY - height + 1;
            break;  
        case "none":
            cornerX = entranceX - Math.floor(Math.random() * (width - 2)) - 1;
            cornerY = entranceY - Math.floor(Math.random() * (height - 2)) - 1;
            break;
    }
    if (cornerX + width >= 30 || cornerX < 0 || cornerY + height >= 15 || cornerY < 0) {
        if (attempts < 5) {
            generateRoom(entranceX, entranceY, entranceDirection, numExits, attempts + 1, hidden);
            return;
        }
        world[entranceX][entranceY].innerText = "#";
        world[entranceX][entranceY].classList.add("solid");
        world[entranceX][entranceY].classList.add("blocking");
        if (hidden) {world[entranceX][entranceY].classList.add("hidden");}
        return;
    }
    
    for (let i = cornerX; i < cornerX + width; i++) {
        for (let j = cornerY; j < cornerY + height; j++) {
            if (world[i][j].innerText == "" || world[i][j].innerText == "#") {
                if ((i == cornerX || i == cornerX + width - 1 || j == cornerY || j == cornerY + height - 1) && (i != entranceX || j != entranceY)) {
                    world[i][j].classList.add("solid");
                    world[i][j].classList.add("blocking");
                    if (hidden) {world[i][j].classList.add("hidden");}
                    world[i][j].innerText = "#";
                } else {
                    world[i][j].classList.remove("solid");
                    if (hidden) {world[i][j].classList.add("hidden");}
                    world[i][j].innerText = ".";
                }
            }
        }
    }
    for (let i = 0; i < numExits; i++) {
        let exitDirection = ["right", "left", "down", "up"][Math.floor(Math.random() * 4)];
        let exitX = 0;
        let exitY = 0;
        switch (exitDirection) {
            case "right":
                exitX = cornerX + width - 1;
                exitY = cornerY + Math.floor(Math.random() * (height - 2)) + 1;
                break;
            case "left":
                exitX = cornerX;
                exitY = cornerY + Math.floor(Math.random() * (height - 2)) + 1;
                break;
            case "down":
                exitX = cornerX + Math.floor(Math.random() * (width - 2)) + 1;
                exitY = cornerY + height - 1;
                break;  
            case "up":
                exitX = cornerX + Math.floor(Math.random() * (width - 2)) + 1;
                exitY = cornerY;
                break;  
        }
        if ((exitX > 0 && exitX < 29 && exitY > 0 && exitY < 14) && world[exitX][exitY].classList.contains("solid")) {
            world[exitX][exitY].classList.remove("solid");
            world[exitX][exitY].setAttribute("direction", exitDirection);
            world[exitX][exitY].innerText = "?";
            if (hidden) {world[exitX][exitY].classList.add("hidden");}
            console.log(exitX + ", " + exitY);
            generateCorridor(exitX, exitY, exitDirection, true);
        } else {
            i--;
        }
    }
}

function generateCorridor(x, y, direction, hidden = false) {
    length = Math.floor(Math.random() * 3) + 1;
    walkerX = x;
    walkerY = y;
    for (let i = 0; i < length; i++) {
        switch (direction) {
            case "right":
                walkerX++;
                break;
            case "left":
                walkerX--;
                break;
            case "down":
                walkerY++;
                break;  
            case "up":
                walkerY--;
                break;  
        }
        if (world[walkerX][walkerY].classList.contains("solid")) {
            return;
        }
        switch (direction) {
            case "right":
            case "left":
                world[walkerX][walkerY].classList.remove("solid");
                if (hidden) {world[walkerX][walkerY].classList.add("hidden");}
                world[walkerX][walkerY].innerText = ".";
                world[walkerX][walkerY+1].classList.add("solid");
                world[walkerX][walkerY+1].classList.add("blocking");
                if (hidden) {world[walkerX][walkerY+1].classList.add("hidden");}
                world[walkerX][walkerY+1].innerText = "#";
                world[walkerX][walkerY-1].classList.add("solid");
                world[walkerX][walkerY-1].classList.add("blocking");
                if (hidden) {world[walkerX][walkerY-1].classList.add("hidden");}
                world[walkerX][walkerY-1].innerText = "#";
                break;
            case "down":
            case "up":
                world[walkerX][walkerY].classList.remove("solid");
                if (hidden) {world[walkerX][walkerY].classList.add("hidden");}
                world[walkerX][walkerY].innerText = ".";
                world[walkerX+1][walkerY].classList.add("solid");
                world[walkerX+1][walkerY].classList.add("blocking");
                if (hidden) {world[walkerX+1][walkerY].classList.add("hidden");}
                world[walkerX+1][walkerY].innerText = "#";
                world[walkerX-1][walkerY].classList.add("solid");
                world[walkerX-1][walkerY].classList.add("blocking");
                if (hidden) {world[walkerX-1][walkerY].classList.add("hidden");}
                world[walkerX-1][walkerY].innerText = "#";
                break;  
        }
        if (walkerX < 1 || walkerX >= 29 || walkerY < 1 || walkerY >= 14) {
            world[walkerX][walkerY].innerText = "#";
            if (hidden) {world[walkerX][walkerY].classList.add("hidden");}
            world[walkerX][walkerY].classList.add("solid");
            return;
        }
    }
    generateRoom(walkerX, walkerY, direction, Math.floor(Math.random() * 1.25) + 1, 0, true);
}

function floodreveal(x, y, tolerance = 2) {
        if (!world[x][y].classList.contains("hidden")) {
            tolerance--;
        }
        world[x][y].classList.remove("hidden");
        if (!world[x][y].classList.contains("blocking")) {
            if (tolerance < 0) {
                return;
            }
            floodreveal(x + 1, y, tolerance);
            floodreveal(x - 1, y, tolerance);
            floodreveal(x, y + 1, tolerance);
            floodreveal(x, y - 1, tolerance);
        }
}


document.addEventListener("keydown", function (event) {
    player.move(event);
});

generateRoom(15, 7, "none", 2);
setupWorld();
drawWorld();
