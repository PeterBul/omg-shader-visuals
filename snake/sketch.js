let xoff = 0;
let yoff = 10;

function setup() {
  // put setup code here
  createCanvas(windowWidth, windowHeight);

  strokeWeight(3);
}

function draw() {
  background(0, 100);
  for (i = 0; i < 1000; i++) {
    const x = map(noise(xoff + i / 1000), 0, 1, 0, width);
    const y = map(noise(yoff + i / 1000), 0, 1, 0, height);
    ellipse(x + i / 10, y + i / 10, 10 + i / 10, 10 + i / 10);
    fill(255 - i / 10);
  }

  fill(255);
  stroke(0, 20);
  //    noStroke();

  xoff += 0.0005;
  yoff -= 0.0005;
}
