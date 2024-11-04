/**
 * @typedef {Object} SerializedBezierPoint
 * @property {SerializedPoint} anchor
 * @property {SerializedPoint} controlIn
 * @property {SerializedPoint} controlOut
 */

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
    this._controlIn = new Point(
      x + this._controlInitOffset,
      y + this._controlInitOffset
    );

    this._controlOut = this.getMirrorControl();
  }

  get anchor() {
    return this._anchor;
  }

  get controlIn() {
    return this._controlIn;
  }

  get controlOut() {
    return this._controlOut;
  }

  drawAnchor() {
    this.anchor.draw();
  }

  drawControlIn() {
    this.controlIn.draw();
  }

  drawControlOut() {
    this.controlOut.draw();
  }

  clone() {
    const clone = new BezierPoint(this.anchor.x, this.anchor.y);
    clone.controlIn.x = this.controlIn.x;
    clone.controlIn.y = this.controlIn.y;
    clone.controlOut.x = this.controlOut.x;
    clone.controlOut.y = this.controlOut.y;
    return clone;
  }

  /**
   * @private
   */
  getMirrorControl() {
    const x = this.anchor.x - (this.controlIn.x - this.anchor.x);
    const y = this.anchor.y - (this.controlIn.y - this.anchor.y);
    return new Point(x, y);
  }
}
