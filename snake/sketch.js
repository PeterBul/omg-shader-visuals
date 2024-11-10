let xoff = 0;
let yoff = 10;

/**
 * @type {BezierCurve}
 */
let snakeHeadProfileCurve;
/**
 * @type {BezierCurve}
 */
let snakeHeadTopCurve;

const snakeBodyEnd = 1000;

/**
 * @type {CurveSlice[]}
 */
let snakeHeadProfileSlices;

/**
 * @type {CurveSlice[]}
 */
let snakeHeadTopSlices;

function setup() {
  // put setup code here
  createCanvas(1920, 1080, WEBGL);
  strokeWeight(3);
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
  const snakeHeadStartRadius = snakeRadius(snakeBodyEnd);
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
}

function mousePressed() {
  fullscreen(true);
}

function draw() {
  background(0);
  stroke(0, 20);
  move();
  // noStroke();
  // 999 is the head of the snake
  const centerIndex = 1;
  const centerX =
    map(noise(xoff + (centerIndex - 1) / centerIndex), 0, 1, 0, width) -
    windowWidth / 2 +
    1000;
  const centerY =
    map(noise(yoff + (centerIndex - 1) / centerIndex), 0, 1, 0, height) -
    windowHeight / 2 +
    800;
  for (let z = 0; z < snakeBodyEnd; z++) {
    const x = map(noise(xoff + z / snakeBodyEnd), 0, 1, 0, width);
    const y = map(noise(yoff + z / snakeBodyEnd), 0, 1, 0, height);
    const centeredX = x - centerX;
    const centeredY = y - centerY;
    ellipse(centeredX, centeredY, snakeRadius(z), snakeRadius(z));
    if (z % 100 === 0) {
      // drawHexagon(centeredX, centeredY, snakeRadius(z), z);
    }

    // fill(((sin(z) + 1) / 2) * 255 - z / 10);
    // fill(((sin(z) + 1) / 2) * 255 - z / 10, 255, 100);
  }
  for (
    let z = snakeBodyEnd;
    z < snakeBodyEnd + snakeHeadProfileSlices.length;
    z++
  ) {
    const profileSlice = snakeHeadProfileSlices[z - snakeBodyEnd];
    const topSlice = snakeHeadTopSlices[z - snakeBodyEnd];
    const x = map(noise(xoff + z / snakeBodyEnd), 0, 1, 0, width);
    const y = map(noise(yoff + z / snakeBodyEnd), 0, 1, 0, height);
    const centeredX = x - centerX + topSlice.center;
    const centeredY = y - centerY + profileSlice.center;
    // ellipse(centeredX, centeredY, topSlice.height * 8, profileSlice.height * 7);
    // fill(255 - z / 10);
  }

  xoff += 0.003;
  // yoff -= 0.0005;
  // box(500, 500, 500);
}

const y1 = 0;
const y2 = 50;
const y3 = 200;
const deltaXSides = 50;
const deltaXMiddle = 50;
const x1 = -deltaXSides - deltaXMiddle;
const x2 = -deltaXMiddle;
const x3 = 0;
const x4 = deltaXMiddle;
const x5 = deltaXMiddle + deltaXSides;
function drawSnakeScale() {
  beginShape();
  vertex(x3, y2);
  vertex(x4, y1);
  vertex(x5, y2);
  vertex(x3, y3);
  vertex(x1, y2);
  vertex(x2, y1);
  endShape(CLOSE);
}

/**
 * Draws a hexagon at the given coordinates
 *
 * @param {number} centerX
 * @param {number} centerY
 * @param {number} radius
 * @param {number} rotation
 */
function drawHexagon(centerX, centerY, radius, rotation) {
  for (let i = 0; i < 6; i++) {
    const angle = (TWO_PI / 6) * i + (rotation || 0);
    const x = centerX + cos(angle) * radius;
    const y = centerY + sin(angle) * radius;
    point(x, y);
  }
}

function snakeRadius(z) {
  const radiusBase = 2;
  return radiusBase + z / 10;
}

function draw3DHead(x, y, z, baseRadius) {}

let cameraX = 0;
let cameraY = 0;
let cameraZ = 0;
let centerX = 0;
const cameraSpeed = 100;

function move() {
  if (keyIsDown(UP_ARROW)) {
    cameraZ += cameraSpeed;
  }
  if (keyIsDown(DOWN_ARROW)) {
    cameraZ -= cameraSpeed;
  }
  if (keyIsDown(LEFT_ARROW)) {
    cameraX += cameraSpeed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    cameraX -= cameraSpeed;
  }
  if (keyIsDown(65)) {
    console.log("Moving left");
    cameraX -= cameraSpeed;
    centerX -= cameraSpeed;
  }
  if (keyIsDown(68)) {
    cameraX += cameraSpeed;
    centerX += cameraSpeed;
  }
  camera(
    cameraX,
    cameraY,
    height / 2 / tan(PI / 6) + cameraZ,
    centerX,
    0,
    0,
    0,
    1,
    0
  );
}

function keyPressed() {
  if (key === "c") {
    console.log("Resetting camera");
    cameraX = 0;
    cameraY = 0;
    cameraZ = 0;
    centerX = 0;
  }
}
