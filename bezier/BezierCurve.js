class BezierCurve {
  /**
   * @type {BezierPoint[]}
   * @private
   */
  _points = [];

  /**
   *
   * @param {object} props
   * @param {MyColor} props.anchorColor
   * @param {MyColor} props.controlColor
   * @param {number} props.anchorSize
   * @param {number} props.controlSize
   * @param {MyColor} props.curveColor
   * @param {number} props.curveWeight
   * @returns
   */
  constructor(props) {
    /**
     * @type {MyColor}
     * @private
     */
    this._anchorColor = props.anchorColor;
    /**
     * @type {MyColor}
     * @private
     */
    this._controlColor = props.controlColor;
    /**
     * @type {number}
     * @private
     */
    this._anchorSize = props.anchorSize;
    /**
     * @type {number}
     * @private
     */
    this._controlSize = props.controlSize;
    /**
     * @type {MyColor}
     * @private
     */
    this._curveColor = props.curveColor;
    /**
     * @type {number}
     * @private
     */
    this._curveWeight = props.curveWeight;
  }

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
   */
  remove(x, y) {
    const point = this.getCloseAnchor(x, y);
    if (point) {
      const index = this._points.indexOf(point);
      this._points.splice(index, 1);
    }
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
    point.controlIn.x = controlX;
    point.controlIn.y = controlY;
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

      if (point.controlIn.isCloseTo(x, y)) {
        return point.controlIn;
      }

      if (point.controlOut.isCloseTo(x, y)) {
        return point.controlOut;
      }
    }
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @returns
   */
  getCloseAnchor(x, y) {
    for (const point of this._points) {
      if (point.anchor.isCloseTo(x, y)) {
        return point;
      }
    }
  }

  getClosePointToMouse() {
    for (const bezierPoint of this._points) {
      if (bezierPoint.anchor.isCloseToMouse()) {
        return {
          bezierPoint,
          type: "anchor",
          point: bezierPoint.anchor,
          initialLocation: bezierPoint.anchor.clone(),
        };
      }

      if (bezierPoint.controlIn.isCloseToMouse()) {
        return {
          bezierPoint,
          type: "controlIn",
          point: bezierPoint.controlIn,
          initialLocation: bezierPoint.controlIn.clone(),
        };
      }

      if (bezierPoint.controlOut.isCloseToMouse()) {
        return {
          bezierPoint,
          type: "controlOut",
          point: bezierPoint.controlOut,
          initialLocation: bezierPoint.controlOut.clone(),
        };
      }
    }
  }

  draw() {
    this.drawCurve();
    this.drawAnchorPoints();
    this.drawControlPoints();
    this.drawAnchorLines();
  }

  drawCurve() {
    noFill();
    stroke(this._curveColor.r, this._curveColor.g, this._curveColor.b);
    strokeWeight(this._curveWeight);
    for (let i = 0; i < this._points.length - 1; i++) {
      const point1 = this._points[i];
      const point2 = this._points[i + 1];
      bezier(
        point1.anchor.x,
        point1.anchor.y,
        point1.controlOut.x,
        point1.controlOut.y,
        point2.controlIn.x,
        point2.controlIn.y,
        point2.anchor.x,
        point2.anchor.y
      );
    }
  }

  drawAnchorPoints() {
    stroke(this._anchorColor.r, this._anchorColor.g, this._anchorColor.b);
    strokeWeight(this._anchorSize);
    for (const point of this._points) {
      point.drawAnchor();
    }
  }

  drawControlPoints() {
    stroke(this._controlColor.r, this._controlColor.g, this._controlColor.b);
    strokeWeight(this._controlSize);
    for (let i = 0; i < this._points.length; i++) {
      const point = this._points[i];
      if (i !== 0) {
        point.drawControlIn();
      }
      if (i !== this._points.length - 1) {
        point.drawControlOut();
      }
    }
  }

  drawAnchorLines() {
    stroke(this._controlColor.r, this._controlColor.g, this._controlColor.b);
    strokeWeight(this._curveWeight);
    for (let i = 0; i < this._points.length; i++) {
      const point = this._points[i];
      if (i !== 0) {
        line(
          point.anchor.x,
          point.anchor.y,
          point.controlIn.x,
          point.controlIn.y
        );
      }
      if (i !== this._points.length - 1) {
        line(
          point.anchor.x,
          point.anchor.y,
          point.controlOut.x,
          point.controlOut.y
        );
      }
    }
  }

  startDragging() {
    this.draggedPoint = this.getClosePointToMouse();
  }

  /**
   * Update the first control point while the user drags the mouse.
   * @param {MouseEvent} e
   */
  drag(e) {
    if (this.draggedPoint) {
      this.draggedPoint.point.x = e.altKey
        ? this.draggedPoint.bezierPoint.anchor.x
        : mouseX;
      this.draggedPoint.point.y = e.shiftKey
        ? this.draggedPoint.bezierPoint.anchor.y
        : mouseY;
    }
  }

  getDragDirection() {
    if (
      abs(this.getDragAngle()) > QUARTER_PI &&
      abs(this.getDragAngle()) < 3 * QUARTER_PI
    ) {
      return "vertical";
    } else {
      return "horizontal";
    }
  }

  getDragAngle() {
    if (this.draggedPoint) {
      return atan2(
        mouseY - this.draggedPoint.initialLocation.y,
        mouseX - this.draggedPoint.initialLocation.x
      );
    }
  }

  stopDragging() {
    this.draggedPoint = null;
  }
}
