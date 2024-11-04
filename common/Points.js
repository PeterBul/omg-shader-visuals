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
