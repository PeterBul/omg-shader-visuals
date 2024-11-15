/**
 * @typedef {import('p5').Shader} Shader
 */

/** @type {Shader} */
let snakeShader;

/**
 * @type {ColorManager}
 */
let colorManager;

function preload() {
  snakeShader = loadShader("snake.vert", "snake.frag");
}

/**
 * @type {AudioManager}
 */
let audioManager;

function setup() {
  createCanvas(1920, 1280, WEBGL);

  audioManager = new AudioManager();

  colorManager = new ColorManager(lightBlue1, audioManager);

  noStroke();
}

function draw() {
  audioManager.audioDraw();
  clear();
  rotateX(HALF_PI - 0.5);
  background(0);

  const cylinderRadius = 50;
  const cylinderHeight = 500;
  const lShader = snakeShader;
  shader(lShader);
  // Don't touch --------------
  lShader.setUniform("uMillis", millis());
  lShader.setUniform("uRadius", cylinderRadius);
  lShader.setUniform("uHeight", cylinderHeight);
  // --------------------------

  lShader.setUniform("uMorphFactor", 1);
  lShader.setUniform("uNoiseMultiplier", 0);
  colorManager.setShaderUniforms(lShader);
  cylinder(cylinderRadius, cylinderHeight, 150, 1000);

  orbitControl();
}

let mouseDownTime = 0;
function mousePressed() {
  mouseDownTime = millis();
}

/**
 * @param {MouseEvent} e
 */
function mouseClicked(e) {
  audioManager.audioSetup();
  if (colorManager.isOnUI(e.clientX, e.clientY)) {
    return;
  }
  if (millis() - mouseDownTime > 200) {
    toggleFullscreen();
  }
  fullscreen(true);
}

function keyPressed() {
  if (key === "c") {
    colorManager.toggleVisibility();
  }
}
