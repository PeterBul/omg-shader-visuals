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
  const size = 300;
  const boxW = size;
  const boxH = size;
  const boxD = size;
  exampleShader.setUniform("uMillis", millis());
  exampleShader.setUniform("uWidth", boxW);
  exampleShader.setUniform("uHeight", boxH);
  exampleShader.setUniform("uDepth", boxD);
  box(boxW, boxH, boxD);
  orbitControl();
}

