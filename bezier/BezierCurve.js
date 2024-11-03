/**
 * @typedef {import('p5').Color} Color
 */

/**
 * @typedef {Object} CurveSlice
 * @property {number} height - The height of the slice
 * @property {number} center - The center of the slice
 */

class BezierCurve {
  /**
   * @type {BezierPoint[]}
   * @private
   */
  _points = [];

  /**
   *
   * @param {object} props
   * @param {Color} props.anchorColor
   * @param {Color} props.controlColor
   * @param {number} props.anchorSize
   * @param {number} props.controlSize
   * @param {Color} props.curveColor
   * @param {number} props.curveWeight
   * @returns
   */
  constructor(props) {
    /**
     * @type {Color}
     * @private
     */
    this._anchorColor = props.anchorColor;
    /**
     * @type {Color}
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
     * @type {Color}
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
    this.drawXYMappings(1);
    this.drawCurveSlices(1);
  }

  drawCurve() {
    noFill();
    stroke(0);
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

  /**
   *
   * @param {number} deltaX
   * @returns
   */
  drawXYMappings(deltaX) {
    for (let i = 0; i < this._points.length - 1; i++) {
      const point1 = this._points[i];
      const point2 = this._points[i + 1];
      this.drawXYMappingsForSegment(deltaX, point1, point2);
    }
  }

  getDirectionFromPoints(pointA, pointB) {
    return pointA.anchor.x <= pointB.anchor.x ? "right" : "left";
  }

  /**
   *
   * @param {number} deltaX
   * @returns
   */
  drawXYMappingsForSegment(deltaX, pointA, pointB) {
    const direction = this.getDirectionFromPoints(pointA, pointB);
    const directionCoefficient = direction === "right" ? 1 : -1;
    let mappings = this.getXYMappings(deltaX, pointA, pointB, direction);

    stroke(0, 255, 0);
    strokeWeight(2);

    for (let i = 0; i < mappings.length; i++) {
      point(pointA.anchor.x + i * deltaX * directionCoefficient, mappings[i]);
    }
  }

  drawAnchorPoints() {
    stroke(this._anchorColor);
    strokeWeight(this._anchorSize);
    for (const point of this._points) {
      point.drawAnchor();
    }
  }

  drawControlPoints() {
    stroke(this._controlColor);
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
    stroke(this._controlColor);
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

  /**
   *
   * @param {number} deltaX
   * @returns {CurveSlice[]}
   */
  getCurveSlices(deltaX) {
    const start = this._points[0].anchor;
    const end = this._points[this._points.length - 1].anchor;

    const baseCenterY = (start.y + end.y) / 2;
    /**
     * @type {number[]}
     */
    const rightMappings = [];
    /**
     * @type {number[]}
     */
    let leftMappings = [];

    for (let i = 0; i < this._points.length - 1; i++) {
      const point1 = this._points[i];
      const point2 = this._points[i + 1];
      const direction = this.getDirectionFromPoints(point1, point2);
      const mappings = this.getXYMappings(deltaX, point1, point2, direction);
      if (direction === "right") {
        rightMappings.push(...mappings);
      } else {
        leftMappings.push(...mappings);
      }
    }

    leftMappings = leftMappings.reverse();

    /**
     * @type {CurveSlice[]}
     */
    const slices = [];
    for (let i = 0; i < rightMappings.length; i++) {
      const y1 = rightMappings[i];
      const y2 = leftMappings[i];
      const center = (y1 + y2) / 2;
      const height = abs(y1 - y2);
      slices.push({ center, height });
    }

    return slices;
  }

  drawCurveSlices(deltaX) {
    const slices = this.getCurveSlices(deltaX);
    stroke(0, 0, 255, 50);
    const start = this._points[0].anchor;
    for (let i = 0; i < slices.length; i++) {
      const slice = slices[i];
      const y1 = slice.center - slice.height / 2;
      const y2 = slice.center + slice.height / 2;
      const x = start.x + i * deltaX;
      line(x, y1, x, y2);
    }
  }

  // for (let j = 0; j < mappings.length - 1; j++) {
  // const y1 = mappings[j] - baseCenterY;
  // const y2 = mappings[j + 1] - baseCenterY;
  // const center = (y1 + y2) / 2;
  // const height = abs(y1 - y2);
  // if (direction === "right") {
  //   rightSlices.push({ center, height });
  // } else {
  //   leftSlices.push({ center, height });
  // }

  /**
   *
   * @param {number} deltaX
   * @param {BezierPoint} pointA
   * @param {BezierPoint} pointB
   * @param {'right' | 'left'} direction
   */
  getXYMappings(deltaX, pointA, pointB, direction) {
    const comparator =
      direction === "right" ? (a, b) => a >= b : (a, b) => a <= b;

    const directionCoefficient = direction === "right" ? 1 : -1;
    const deltaT = 0.001;
    const x1 = pointA.anchor.x;
    const y1 = pointA.anchor.y;
    const mappings = [y1];
    let targetX = x1 + deltaX * directionCoefficient;

    for (let t = 0; t < 1; t += deltaT) {
      const x = bezierPoint(
        pointA.anchor.x,
        pointA.controlOut.x,
        pointB.controlIn.x,
        pointB.anchor.x,
        t
      );
      if (comparator(x, targetX)) {
        mappings.push(
          bezierPoint(
            pointA.anchor.y,
            pointA.controlOut.y,
            pointB.controlIn.y,
            pointB.anchor.y,
            t
          )
        );
        targetX += deltaX * directionCoefficient;
      }
    }

    mappings.push(pointB.anchor.y);
    return mappings;
  }

  /**
   *
   * @returns {SerializedBezierPoint[]}
   */
  serialize() {
    return this._points.map((point) => {
      return {
        anchor: point.anchor.serialize(),
        controlIn: point.controlIn.serialize(),
        controlOut: point.controlOut.serialize(),
      };
    });
  }

  /**
   * @param {SerializedBezierPoint[]} serializedData
   */
  fromSerialized(serializedData) {
    this._points = serializedData.map((data) => {
      const point = new BezierPoint(data.anchor.x, data.anchor.y);
      point.controlIn.x = data.controlIn.x;
      point.controlIn.y = data.controlIn.y;
      point.controlOut.x = data.controlOut.x;
      point.controlOut.y = data.controlOut.y;
      return point;
    });
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
