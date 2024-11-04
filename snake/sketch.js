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
  createCanvas(1920, 1080);
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
  background(0, 100);
  // stroke(0, 20);
  noStroke();
  // 999 is the head of the snake
  const centerIndex = 1;
  const centerX =
    map(noise(xoff + (centerIndex - 1) / centerIndex), 0, 1, 0, width) -
    windowWidth / 2 +
    55;
  const centerY =
    map(noise(yoff + (centerIndex - 1) / centerIndex), 0, 1, 0, height) -
    windowHeight / 2 +
    55;
  for (let z = 0; z < snakeBodyEnd; z++) {
    const x = map(noise(xoff + z / snakeBodyEnd), 0, 1, 0, width);
    const y = map(noise(yoff + z / snakeBodyEnd), 0, 1, 0, height);
    const centeredX = x - centerX;
    const centeredY = y - centerY;
    ellipse(centeredX, centeredY, snakeRadius(z), snakeRadius(z));
    fill(255 - z / 10);
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
    ellipse(centeredX, centeredY, topSlice.height * 8, profileSlice.height * 7);
    fill(255 - z / 10);
  }

  xoff += 0.003;
  // yoff -= 0.0005;
}

function snakeRadius(z) {
  const radiusBase = 2;
  return radiusBase + z / 10;
}

function draw3DHead(x, y, z, baseRadius) {}
