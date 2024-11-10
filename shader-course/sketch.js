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
  exampleShader.setUniform("uMillis", millis());
  exampleShader.setUniform("uBackground", pandaImage);
  rect(0, 0, width, height);
  // orbitControl();
}

