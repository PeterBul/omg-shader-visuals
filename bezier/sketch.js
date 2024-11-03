// Click the mouse near the red dot in the top-left corner
// and drag to change the curve's shape.
let isChanging = false;

function setup() {
  createCanvas(600, 600);

  describe(
    "A gray square with three curves. A black s-curve has two straight, red lines that extend from its ends. The endpoints of all the curves are marked with dots."
  );
}

const bezierCurve = new BezierCurve({
  anchorColor: new MyColor(0),
  anchorSize: 5,
  controlColor: new MyColor(255, 0, 0),
  controlSize: 5,
  curveColor: new MyColor(0),
  curveWeight: 1,
});

const bezierPt1 = bezierCurve.add(200, 200);
const bezierPt2 = bezierCurve.add(350, 300);
const bezierPt3 = bezierCurve.add(400, 400);

function draw() {
  background(200);

  bezierCurve.draw();
}

let dragged = false;
// Start changing the first control point if the user clicks near it.
function mousePressed() {
  dragged = false;
  bezierCurve.startDragging();
}

// Stop changing the first control point when the user releases the mouse.
/**
 *
 * @param {PointerEvent} e
 */
function mouseReleased(e) {
  bezierCurve.stopDragging();
}

// Update the first control point while the user drags the mouse.
function mouseDragged() {
  dragged = true;
  bezierCurve.drag();
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
    bezierCurve.remove(mouseX, mouseY);
  } else {
    bezierCurve.add(mouseX, mouseY);
  }
}
