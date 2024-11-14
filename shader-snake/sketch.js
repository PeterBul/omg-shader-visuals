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

  shader(snakeShader);
  const cylinderRadius = 50;
  const cylinderHeight = 500;
  snakeShader.setUniform("uMillis", millis());
  snakeShader.setUniform("uRadius", cylinderRadius);
  snakeShader.setUniform("uHeight", cylinderHeight);
  colorManager.setShaderUniforms(snakeShader);
  cylinder(cylinderRadius, cylinderHeight, 150, 1000);

  orbitControl();
}

function mouseClicked() {
  audioManager.audioSetup();
  fullscreen(true);
}
