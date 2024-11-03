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
