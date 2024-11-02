// Daniel Shiffman
// http://codingtra.in
// https://youtu.be/IKB1hWWedMk
// https://thecodingtrain.com/CodingChallenges/011-perlinnoiseterrain.html

// Edited by SacrificeProductions

var cols, rows;
var scl = 30;
var w = 1920;
var h = 1200;

var flying = 0;

var terrain = [];

function setup() {
  createCanvas(1920, 1080, WEBGL);
  cols = w / scl;
  rows = h / scl;

  for (var x = 0; x < cols; x++) {
    terrain[x] = [];
    for (var y = 0; y < rows; y++) {
      terrain[x][y] = 0; //specify a default value for now
    }
  }
}

const speed = 0.008;
const noiseOffset = 0.2;

function mousePressed() {
  fullscreen(true);
}

function draw() {
  var colorTop = color(135, 206, 235); // Sky blue at the top
  var colorBottom = color(34, 139, 34); // Dark green at the bottom
  flying -= speed;
  noiseDetail(4, 0.25);
  var yoff = flying;
  for (var y = 0; y < rows; y++) {
    var xoff = 0;
    for (var x = 0; x < cols; x++) {
      terrain[x][y] = map(noise(xoff, yoff), 0, 1, -100, 150);
      xoff += noiseOffset;
    }
    yoff += noiseOffset;
  }

  background(0);
  translate(0, 1);
  rotateX(PI / 3);
  stroke(100, 200, 200);
  translate(-w / 2, -h / 2 - 1000);
  for (var y = 0; y < rows - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    for (var x = 0; x < cols; x++) {
      // Calculate the color based on the y position to create a gradient effect
      var inter = map(y, 0, rows - 1, 0, 1);
      var col = lerpColor(colorTop, colorBottom, inter);
      fill(col);
      vertex(x * scl, y * scl, terrain[x][y]);
      vertex(x * scl, (y + 1) * scl, terrain[x][y + 1]);
    }
    endShape();
  }
  // Switch back to 2D drawing for the particle effect
  resetMatrix(); // Reset transformations to 2D
  translate(-width / 2, -height / 2); // Positioning for 2D coordinates

  for (let i = 0; i < 1000; i++) {
    let x = map(noise(xoff + i / 1000), 0, 1, 0, width);
    let y = map(noise(yoff + i / 1000), 0, 1, 0, height);
    fill(255 - i / 10, 100);
    ellipse(x + i / 10, y + i / 10, 10 + i / 10, 10 + i / 10);
  }

  fill(255);
  stroke(10, 20);

  xoff += 0.0005;
  yoff -= 0.0005;
}
