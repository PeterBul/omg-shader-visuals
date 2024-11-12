/**
 * @typedef {import('p5').Shader} Shader
 */

/** @type {Shader} */
let snakeShader;
/** @type {Shader} */
let eyesShader;
let snakeHead;

/**
 * @type {BezierCurve}
 */
let snakeHeadProfileCurve;
/**
 * @type {BezierCurve}
 */
let snakeHeadTopCurve;

/**
 * @type {CurveSlice[]}
 */
let snakeHeadProfileSlices;

/**
 * @type {CurveSlice[]}
 */
let snakeHeadTopSlices;

/**
 * @type {ColorManager}
 */
let colorManager;

function preload() {
  snakeShader = loadShader("snake.vert", "snake.frag");
  eyesShader = loadShader("eyes.vert", "eyes.frag");
  // snakeHead = loadModel("../models/snake-head-2.obj", true);
}

/**
 * @type {AudioManager}
 */
let audioManager;

function setup() {
  createCanvas(1920, 1280, WEBGL);

  audioManager = new AudioManager();

  colorManager = new ColorManager(lightBlue1, audioManager);

  snakeHeadProfileCurve = new BezierCurve({
    anchorColor: color(0),
    anchorSize: 5,
    controlColor: color(255, 0, 0),
    controlSize: 5,
    curveColor: color(0),
    curveWeight: 1,
  });

  snakeHeadTopCurve = new BezierCurve({
    anchorColor: color(0),
    anchorSize: 5,
    controlColor: color(255, 0, 0),
    controlSize: 5,
    curveColor: color(0),
    curveWeight: 1,
  });

  snakeHeadProfileCurve.fromSerialized(snakeProfile2);
  snakeHeadTopCurve.fromSerialized(greenViperTop);

  const scaleX = 0.09;
  const scaleY = 0.09;
  const scaleXTop = 0.87;
  snakeHeadProfileCurve.scaleX(scaleX).scaleY(scaleY).translateTo();
  snakeHeadTopCurve
    .scaleX(scaleX * scaleXTop)
    .scaleY(scaleY)
    .translateTo();
  snakeHeadProfileSlices = snakeHeadProfileCurve.getCurveSlices(0.4);
  snakeHeadTopSlices = snakeHeadTopCurve.getCurveSlices(0.4);

  noStroke();
}

function draw() {
  audioManager.draw();
  clear();
  rotateX(HALF_PI - 0.5);
  background(0);
  // rect(0, 0, width, height);
  shader(snakeShader);
  const cylinderRadius = 50;
  const cylinderHeight = 500;
  snakeShader.setUniform("uMillis", millis());
  snakeShader.setUniform("uRadius", cylinderRadius);
  snakeShader.setUniform("uHeight", cylinderHeight);
  colorManager.setShaderUniforms(snakeShader);
  cylinder(cylinderRadius, cylinderHeight, 150, 1000);

  const sphereRadius = 2;
  const eyeYOffset = 20;
  translate(-19, 250 - eyeYOffset, 20);
  shader(eyesShader);
  eyesShader.setUniform("uMillis", millis());
  eyesShader.setUniform("uCylinderRadius", cylinderRadius);
  eyesShader.setUniform("uSphereRadius", sphereRadius);
  eyesShader.setUniform("uHeight", cylinderHeight);
  eyesShader.setUniform("uEyeYOffset", eyeYOffset);
  colorManager.setShaderUniforms(eyesShader);
  // sphere(sphereRadius);

  orbitControl();
  const s = 0.9;
  resetShader();
  // scale([0.5 * s, 0.5 * s, 2 * s]);
  // rotateX(HALF_PI);
  // rotateY(PI);
  // translate(0, 0, 500);
  // resetShader();
  // exampleShader.setUniform("uMillis", millis());
  // exampleShader.setUniform("uRadius", cylinderRadius);
  // exampleShader.setUniform("uHeight", cylinderHeight);
  // shader(exampleShader);
}
