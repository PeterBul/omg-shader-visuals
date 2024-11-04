// Click the mouse near the red dot in the top-left corner
// and drag to change the curve's shape.
let isChanging = false;
/**
 * @type {BezierCurve}
 */
let snakeCurve;

let img;

// Load the image.
function preload() {
  img = loadImage("./green-viper-top.jpg");
}

function setup() {
  createCanvas(1920, 1080);

  describe(
    "A gray square with three curves. A black s-curve has two straight, red lines that extend from its ends. The endpoints of all the curves are marked with dots."
  );
  snakeHeadProfileCurve = new BezierCurve({
    anchorColor: color(0),
    anchorSize: 5,
    controlColor: color(255, 0, 0),
    controlSize: 5,
    curveColor: color(0),
    curveWeight: 1,
  });

  snakeHeadProfileCurve.fromSerialized(greenViperTop);
}

function draw() {
  background(200);

  rotate(-HALF_PI);
  image(img, -950, 300);
  rotate(HALF_PI);
  snakeHeadProfileCurve.draw();
}

let dragged = false;
// Start changing the first control point if the user clicks near it.
function mousePressed() {
  dragged = false;
  snakeHeadProfileCurve.startDragging();
}

// Stop changing the first control point when the user releases the mouse.
/**
 *
 * @param {PointerEvent} e
 */
function mouseReleased(e) {
  snakeHeadProfileCurve.stopDragging();
}

/**
 * Update the first control point while the user drags the mouse.
 * @param {MouseEvent} e
 */
function mouseDragged(e) {
  dragged = true;
  snakeHeadProfileCurve.drag(e);
}

/**
 *
 * @param {MouseEvent} e
 * @returns
 */
function mouseClicked(e) {
  if (dragged) {
    return;
  }
  // If shift is pressed, delete
  if (e.shiftKey) {
    snakeHeadProfileCurve.remove(mouseX, mouseY);
  } else {
    snakeHeadProfileCurve.add(mouseX, mouseY);
  }
}

function keyPressed() {
  switch (key) {
    case "s":
      console.log(snakeHeadProfileCurve.serialize());
      break;
  }
}
