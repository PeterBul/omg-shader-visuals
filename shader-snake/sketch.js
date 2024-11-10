let exampleShader;
let pandaImage;
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

function preload() {
  exampleShader = loadShader("example.vert", "example.frag");
  // snakeHead = loadModel("../models/snake-head-2.obj", true);
}

function setup() {
  createCanvas(600, 600, WEBGL);

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
  clear();
  rotateX(HALF_PI - 0.5);
  background(0);
  // rect(0, 0, width, height);
  shader(exampleShader);
  const cylinderRadius = 50;
  const cylinderHeight = 500;
  exampleShader.setUniform("uMillis", millis());
  exampleShader.setUniform("uRadius", cylinderRadius);
  exampleShader.setUniform("uHeight", cylinderHeight);
  cylinder(cylinderRadius, cylinderHeight, 150, 1000);
  orbitControl();
  const s = 0.9;
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

