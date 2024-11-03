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
