let exampleShader;
let pandaImage;

function preload() {
  exampleShader = loadShader("example.vert", "example.frag");
  pandaImage = loadImage("panda.jpg");
}

function setup() {
  createCanvas(600, 600, WEBGL);

  noStroke();
}

function draw() {
  clear();
  background(0);
  // rect(0, 0, width, height);
  shader(exampleShader);
  exampleShader.setUniform("uMillis", millis());
  cylinder(50, 200, 150);
  orbitControl();
}

