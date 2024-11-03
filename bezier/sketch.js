// Click the mouse near the red dot in the top-left corner
// and drag to change the curve's shape.

let isChanging = false;

function setup() {
  createCanvas(600, 600);

  describe(
    "A gray square with three curves. A black s-curve has two straight, red lines that extend from its ends. The endpoints of all the curves are marked with dots."
  );
}

class Points {
  draggedPoint = null;

  constructor() {
    this.points = [];
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @returns {Point}
   */
  add(x, y) {
    const point = new Point(x, y);
    this.points.push(point);
    return point;
  }

  getClosePoint(x, y) {
    return this.points.find((point) => point.isCloseTo(x, y));
  }

  getClosePointToMouse() {
    return this.points.find((point) => point.isCloseToMouse());
  }

  startDragging() {
    this.draggedPoint = this.getClosePointToMouse();
  }

  drag() {
    if (this.draggedPoint) {
      this.draggedPoint.x = mouseX;
      this.draggedPoint.y = mouseY;
    }
  }

  stopDragging() {
    this.draggedPoint = null;
  }
}

class Point {
  /**
   *
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    point(this.x, this.y);
  }

  isCloseTo(x, y) {
    return dist(this.x, this.y, x, y) < 20;
  }

  isCloseToMouse() {
    return this.isCloseTo(mouseX, mouseY);
  }
}

class BezierPoint {
  /**
   * @private
   */
  _controlInitOffset = 20;

  /**
   *
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    /**
     * @type {Point}
     * @private
     */
    this._anchor = new Point(x, y);
    /**
     * @type {Point}
     * @private
     */
    this._control = new Point(
      x + this._controlInitOffset,
      y + this._controlInitOffset
    );
  }

  get anchor() {
    return this._anchor;
  }

  get control() {
    return this._control;
  }

  drawAnchor() {
    this.anchor.draw();
  }

  drawControl() {
    this.control.draw();
  }
}

class BezierCurve {
  /**
   * @type {BezierPoint[]}
   * @private
   */
  _points = [];

  /**
   *
   * @param {number} x
   * @param {number} y
   * @returns {BezierPoint}
   */
  add(x, y) {
    const point = new BezierPoint(x, y);
    this._points.push(point);
    return point;
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} controlX
   * @param {number} controlY
   * @returns
   */
  addWithControl(x, y, controlX, controlY) {
    const point = new BezierPoint(x, y);
    point.control.x = controlX;
    point.control.y = controlY;
    this._points.push(point);
    return point;
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @returns
   */
  getClosePoint(x, y) {
    for (const point of this._points) {
      if (point.anchor.isCloseTo(x, y)) {
        return point.anchor;
      }

      if (point.control.isCloseTo(x, y)) {
        return point.control;
      }
    }
  }

  getClosePointToMouse() {
    for (const point of this._points) {
      if (point.anchor.isCloseToMouse()) {
        return point.anchor;
      }

      if (point.control.isCloseToMouse()) {
        return point.control;
      }
    }
  }

  draw() {
    for (let i = 0; i < this._points.length - 1; i++) {
      const point1 = this._points[i];
      const point2 = this._points[i + 1];
      bezier(
        point1.anchor.x,
        point1.anchor.y,
        point1.control.x,
        point1.control.y,
        point2.control.x,
        point2.control.y,
        point2.anchor.x,
        point2.anchor.y
      );
    }
  }

  startDragging() {
    this.draggedPoint = this.getClosePointToMouse();
  }

  drag() {
    if (this.draggedPoint) {
      this.draggedPoint.x = mouseX;
      this.draggedPoint.y = mouseY;
    }
  }

  stopDragging() {
    this.draggedPoint = null;
  }
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

