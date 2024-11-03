// Click the mouse near the red dot in the top-left corner
// and drag to change the curve's shape.
let isChanging = false;

function setup() {
  createCanvas(600, 600);

  describe(
    "A gray square with three curves. A black s-curve has two straight, red lines that extend from its ends. The endpoints of all the curves are marked with dots."
  );
}

const snake = [
  {
    anchor: {
      x: 63.5,
      y: 220.5,
    },
    controlIn: {
      x: 220,
      y: 220,
    },
    controlOut: {
      x: 182.5,
      y: 220.5,
    },
  },
  {
    anchor: {
      x: 326.5,
      y: 132.5,
    },
    controlIn: {
      x: 245.5,
      y: 132.5,
    },
    controlOut: {
      x: 424.5,
      y: 132.5,
    },
  },
  {
    anchor: {
      x: 501.5,
      y: 243.5,
    },
    controlIn: {
      x: 501.5,
      y: 203.5,
    },
    controlOut: {
      x: 501.5,
      y: 280.5,
    },
  },
  {
    anchor: {
      x: 290.5,
      y: 330.5,
    },
    controlIn: {
      x: 384.5,
      y: 330.5,
    },
    controlOut: {
      x: 213.5,
      y: 330.5,
    },
  },
  {
    anchor: {
      x: 62.5,
      y: 303.5,
    },
    controlIn: {
      x: 184.5,
      y: 303.5,
    },
    controlOut: {
      x: 46.5,
      y: 277.5,
    },
  },
];

const bezierCurve = new BezierCurve({
  anchorColor: new MyColor(0),
  anchorSize: 5,
  controlColor: new MyColor(255, 0, 0),
  controlSize: 5,
  curveColor: new MyColor(0),
  curveWeight: 1,
});

bezierCurve.fromSerialized(snake);

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

/**
 * Update the first control point while the user drags the mouse.
 * @param {MouseEvent} e
 */
function mouseDragged(e) {
  dragged = true;
  bezierCurve.drag(e);
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

function keyPressed() {
  if (key === "s") {
    console.log(bezierCurve.serialize());
  }
}
