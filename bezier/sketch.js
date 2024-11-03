// Click the mouse near the red dot in the top-left corner
// and drag to change the curve's shape.
let isChanging = false;

function setup() {
  createCanvas(600, 600);

  describe(
    "A gray square with three curves. A black s-curve has two straight, red lines that extend from its ends. The endpoints of all the curves are marked with dots."
  );
}

const bezierCurve = new BezierCurve();
const bezierPt1 = bezierCurve.addWithControl(85, 20, 10, 10);
const bezierPt2 = bezierCurve.addWithControl(15, 80, 90, 90);

function draw() {
  background(200);

  // Draw the anchor points in black.
  stroke(0);
  strokeWeight(5);
  bezierPt1.drawAnchor();
  bezierPt2.drawAnchor();

  // Draw the control points in red.
  stroke(255, 0, 0);
  bezierPt1.drawControl();
  bezierPt2.drawControl();

  // Draw a black bezier curve.
  noFill();
  stroke(0);
  strokeWeight(1);
  bezierCurve.draw();

  // Draw red lines from the anchor points to the control points.
  stroke(255, 0, 0);
  line(
    bezierPt1.anchor.x,
    bezierPt1.anchor.y,
    bezierPt1.control.x,
    bezierPt1.control.y
  );
  line(
    bezierPt2.anchor.x,
    bezierPt2.anchor.y,
    bezierPt2.control.x,
    bezierPt2.control.y
  );
}

// Start changing the first control point if the user clicks near it.
function mousePressed() {
  bezierCurve.startDragging();
}

// Stop changing the first control point when the user releases the mouse.
function mouseReleased() {
  bezierCurve.stopDragging();
}

// Update the first control point while the user drags the mouse.
function mouseDragged() {
  bezierCurve.drag();
}

