var scl = 40;

var rows, cols;

var navBarSize = 2 * scl;
var margin = 10;

const grid = [];

// Nav Bar
let startButton;
let selectSort;
let websiteButton;

function setup() {
  createCanvas(windowWidth, windowHeight);

  initializeGrid();
  initializeButtons();
}

function draw() {
  background(80);

  // Create grid space
  stroke(40);
  fill(40);
  rect(0, navBarSize, width, height - navBarSize, 10);
  
  for(var i = 0; i < grid.length; i++) {
    grid[i].show();
  }

  // Create Nav Bar
  createNavBar();

}

function initializeGrid() {
  var h = height - navBarSize - margin;
  var w = width - margin;

  rows = floor(h / scl);
  cols = floor(w / scl);

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      var cell = new Cell(i, j);
      grid.push(cell);
    }
  }
}

function initializeButtons() {
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

  websiteButton.position(width - 70, 10);
}

class Cell {
  constructor(i, j) {
    this.i = i;
    this.j = j;

    // 0 = empty cell, 1 = wall, 2 = start, 3 = end
    this.val = 0;

    this.show = function () {
      var xOff = (1/2) * (width - (cols * scl));
      var yOff = (1/2) * (height - navBarSize - (rows * scl));
      var x = this.i * scl + xOff;
      var y = this.j * scl + yOff + navBarSize;
      
      stroke(200);
      fill(20);

      rect(x, y, scl, scl);
    };
  }
}