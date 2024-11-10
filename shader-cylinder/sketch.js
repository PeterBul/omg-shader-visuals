let exampleShader;

function preload() {
  exampleShader = loadShader("example.vert", "example.frag");
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
  const cylinderRadius = 50;
  const cylinderHeight = 200;
  exampleShader.setUniform("uMillis", millis());
  exampleShader.setUniform("uRadius", cylinderRadius);
  exampleShader.setUniform("uHeight", cylinderHeight);
  cylinder(cylinderRadius, cylinderHeight, 150);
  orbitControl();
}

