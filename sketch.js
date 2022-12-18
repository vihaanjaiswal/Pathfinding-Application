/////////// VARIABLES /////////////

var scl = 40;
var rows, cols;
var navBarSize = 2 * scl;
var margin = 10;

const grid = [];
var startX;
var startY;
var endX;
var endY;

let changeStart;
let changeEnd;
let buildWalls;
let breakWalls;
let startButton;
let selectSort;
let makeMaze;
let clearButton;
let websiteButton;

// 0 = Can't build anything, 1 = Move start, 2 = Move End, 3 = Add Walls, 4 = Break Walls
var buildMode = 0;
// 0 = BFS, 1 = DFS, 2 = A*, 3 = Dijkstra
var algorithmMode = 0;

/////////// SETUP AND DRAW /////////////

function setup() {
  createCanvas(windowWidth, windowHeight);

  initializeGrid();
  initializeButtons();
}

function draw() {
  background(80);

  stroke(40);
  fill(40);
  rect(0, navBarSize, width, height - navBarSize, 10);
  
  for(var i = 0; i < grid.length; i++) {
    for(var j = 0; j < grid[i].length; j++) {
      grid[i][j].show();
    }
  }

  createNavBar();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  remakeGrid();
}

function remakeGrid() {
  var h = height - navBarSize - margin;
  var w = width - margin;

  var newRows = floor(h / scl);
  var newCols = floor(w / scl);

  if(newRows > rows) {
    for(var i = rows; i < newRows; i++) {
      const gridRow = [];
      for(var j = 0; j < cols; j++) {
        var cell = new Cell(i, j, 0);
        gridRow.push(cell);
      }
      grid.push(gridRow);
    }
  } else if(newRows < rows) {
    for(var i = rows - 1; i >= newRows; i--) {
      if(startY == i) {
        startY--;
        grid[startY][startX] = new Cell(grid[startY][startX].i, grid[startY][startX].j, 2);
      }
      if(endY == i) {
        endY--;
        grid[endY][endX] = new Cell(grid[endY][endX].i, grid[endY][endX].j, 3);
      }
      grid.pop();
    }
  }

  if(newCols > cols) {
    for(var i = 0; i < newRows; i++) {
      for(var j = cols; j < newCols; j++) {
        var cell = new Cell(i, j, 0);
        grid[i].push(cell);
      }
    }
  } else if(newCols < cols) {
    for(var i = 0; i < newRows; i++) {
      for(var j = cols - 1; j >= newCols; j--) {
        if(startX == j) {
          startX--;
          grid[startY][startX] = new Cell(grid[startY][startX].i, grid[startY][startX].j, 2);
        }
        if(endX == j) {
          endX--;
          grid[endY][endX] = new Cell(grid[endY][endX].i, grid[endY][endX].j, 3);
        }
        grid[i].pop();
      }
    }
  }

  rows = newRows;
  cols = newCols;
}

/////////// CREATE INITIAL WINDOW /////////////

function initializeGrid() {
  var h = height - navBarSize - margin;
  var w = width - margin;

  rows = floor(h / scl);
  cols = floor(w / scl);

  for(var i = 0; i < rows; i++) {
    const gridRow = [];
    for(var j = 0; j < cols; j++) {
      var cell = new Cell(i, j, 0);
      gridRow.push(cell);
    }
    grid.push(gridRow);
  }

  startY = 0;
  startX = 0;
  grid[startY][startX] = new Cell(grid[startY][startX].i, grid[startY][startX].j, 2);
  endY = grid.length - 1;
  endX = grid[grid.length - 1].length - 1;
  grid[endY][endX] = new Cell(grid[endY][endX].i, grid[endY][endX].j, 3);
}

function initializeButtons() {
  changeStart = createButton('Move Start');
  changeStart.class('move-start-button');
  changeStart.mousePressed(moveStartMode);

  changeEnd = createButton('Move End');
  changeEnd.class('move-start-button');
  changeEnd.mousePressed(moveEndMode);

  buildWalls = createButton('Build Walls');
  buildWalls.class('move-start-button');
  buildWalls.mousePressed(buildWallsMode);

  breakWalls = createButton('Break Walls');
  breakWalls.class('move-start-button');
  breakWalls.mousePressed(breakWallsMode);

  startButton = createButton('Start');
  startButton.class('start-button');
  startButton.mousePressed(startAlgorithm);

  websiteButton = createButton('VJ');
  websiteButton.class('website-button');
  websiteButton.attribute('onclick', "location.href='https://github.com/vihaanjaiswal';");
}

function createNavBar() {
  textFont('Trebuchet-MS', 35);
  fill(255);
  text('PATHFINDING', 10, 38);
  textSize(25);
  text('APPLICATION', 10, 68);

  changeStart.position(500, 10);
  changeEnd.position(600, 10);
  buildWalls.position(700, 10);
  breakWalls.position(800, 10);
  startButton.position(300, 10);
  websiteButton.position(width - 70, 10);
}

/////////// CHANGE MODES /////////////

function mousePressed() {
  var gridX = mouseX;
  var gridY = mouseY;
  if(isInGrid(gridX, gridY)) {
    gridX -= (1/2) * (width - (cols * scl));
    gridY -= (1/2) * (height + navBarSize - (rows * scl));
    gridX = floor(gridX / scl);
    gridY = floor(gridY / scl);

    if(buildMode == 1) {
      if(gridX != endX || gridY != endY){
        grid[startY][startX] = new Cell(grid[startY][startX].i, grid[startY][startX].j, 0);
        startX = gridX;
        startY = gridY;
        grid[startY][startX] = new Cell(grid[startY][startX].i, grid[startY][startX].j, 2);
      }
    } else if(buildMode == 2) {
      if(gridX != startX || gridY != startY) {
        grid[endY][endX] = new Cell(grid[endY][endX].i, grid[endY][endX].j, 0);
        endX = gridX;
        endY = gridY;
        grid[endY][endX] = new Cell(grid[endY][endX].i, grid[endY][endX].j, 3);
      }
    } else if(buildMode == 3) {
      if((gridX != endX || gridY != endY) && (gridX != startX || gridY != startY)) {
        grid[gridY][gridX] = new Cell(grid[gridY][gridX].i, grid[gridY][gridX].j, 1);
      }
    } else if(buildMode == 4) {
      if((gridX != endX || gridY != endY) && (gridX != startX || gridY != startY)) {
        grid[gridY][gridX] = new Cell(grid[gridY][gridX].i, grid[gridY][gridX].j, 0);
      }
    }
  }
}

function isInGrid(x, y) {
  var minX = (1/2) * (width - (cols * scl));
  var minY = (1/2) * (height + navBarSize - (rows * scl));
  var maxX = (1/2) * (width + (cols * scl));
  var maxY = (1/2) * (height + navBarSize + (rows * scl));
  if(x >= minX && x < maxX && y >= minY && y < maxY) {
    return true;
  }
  return false;
}

function moveStartMode() {
  buildMode = 1;
}

function moveEndMode() {
  buildMode = 2;
}

function buildWallsMode() {
  buildMode = 3;
}

function breakWallsMode() {
  buildMode = 4;
}

/////////// ALGORITHMS /////////////
function startAlgorithm() {

}

function DFS() {

}

function BFS() {

}

function AStar() {

}

function Dijkstra() {

}

/////////// CREATE MAZE /////////////

function createMaze() {

}

/////////// CELL CLASS /////////////

class Cell {
  constructor(i, j, val) {
    this.i = i;
    this.j = j;

    // 0 = empty cell, 1 = wall, 2 = start, 3 = end
    this.val = val;

    this.show = function () {
      var xOff = (1/2) * (width - (cols * scl));
      var yOff = (1/2) * (height + navBarSize - (rows * scl));
      var x = this.j * scl + xOff;
      var y = this.i * scl + yOff;
      
      stroke(200);
      
      if(val == 0) {
        fill(20);
      } else if(val == 1) {
        fill(255);
      } else if(val == 2) {
        fill(0, 255, 0);
      }else if (val == 3) {
        fill(255, 0, 0);
      }

      rect(x, y, scl, scl);
    };
  }
}