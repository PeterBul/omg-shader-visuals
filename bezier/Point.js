class Point {
  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {string} type
   */
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }

  draw() {
    point(this.x, this.y);
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @returns
   */
  isCloseTo(x, y) {
    return dist(this.x, this.y, x, y) < 20;
  }

  isCloseToMouse() {
    return this.isCloseTo(mouseX, mouseY);
  }
}
