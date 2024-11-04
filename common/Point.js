/**
 * @typedef {Object} SerializedPoint
 * @property {number} x
 * @property {number} y
 */

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

  clone() {
    return new Point(this.x, this.y, this.type);
  }

  isCloseToMouse() {
    return this.isCloseTo(mouseX, mouseY);
  }

  serialize() {
    return {
      x: this.x,
      y: this.y,
    };
  }
}
