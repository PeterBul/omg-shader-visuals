// Click the mouse near the red dot in the top-left corner
// and drag to change the curve's shape.
let isChanging = false;
/**
 * @type {BezierCurve}
 */
let snakeCurve;

function setup() {
  createCanvas(1920, 1080);

  describe(
    "A gray square with three curves. A black s-curve has two straight, red lines that extend from its ends. The endpoints of all the curves are marked with dots."
  );
  snakeCurve = new BezierCurve({
    anchorColor: color(0),
    anchorSize: 5,
    controlColor: color(255, 0, 0),
    controlSize: 5,
    curveColor: color(0),
    curveWeight: 1,
  });

  snakeCurve.fromSerialized(snake).translate(220, 400).scale(1.5);
}

const snake = [
  {
    anchor: {
      x: 0,
      y: -83,
    },
    controlIn: {
      x: 313,
      y: -84,
    },
    controlOut: {
      x: 238,
      y: -83,
    },
  },
  {
    anchor: {
      x: 526,
      y: -259,
    },
    controlIn: {
      x: 364,
      y: -259,
    },
    controlOut: {
      x: 722,
      y: -259,
    },
  },
  {
    anchor: {
      x: 876,
      y: -37,
    },
    controlIn: {
      x: 876,
      y: -117,
    },
    controlOut: {
      x: 876,
      y: 37,
    },
  },
  {
    anchor: {
      x: 454,
      y: 137,
    },
    controlIn: {
      x: 642,
      y: 137,
    },
    controlOut: {
      x: 300,
      y: 137,
    },
  },
  {
    anchor: {
      x: -2,
      y: 83,
    },
    controlIn: {
      x: 242,
      y: 83,
    },
    controlOut: {
      x: -34,
      y: 31,
    },
  },
];

function draw() {
  background(200);

  snakeCurve.draw();
}

let dragged = false;
// Start changing the first control point if the user clicks near it.
function mousePressed() {
  dragged = false;
  snakeCurve.startDragging();
}

// Stop changing the first control point when the user releases the mouse.
/**
 *
 * @param {PointerEvent} e
 */
function mouseReleased(e) {
  snakeCurve.stopDragging();
}

/**
 * Update the first control point while the user drags the mouse.
 * @param {MouseEvent} e
 */
function mouseDragged(e) {
  dragged = true;
  snakeCurve.drag(e);
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
    snakeCurve.remove(mouseX, mouseY);
  } else {
    snakeCurve.add(mouseX, mouseY);
  }
}

function keyPressed() {
  switch (key) {
    case "s":
      console.log(snakeCurve.serialize());
      break;
  }
}
