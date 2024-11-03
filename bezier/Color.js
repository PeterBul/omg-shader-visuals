class MyColor {
  /**
   *
   * @param {number} r
   * @param {number | undefined} g
   * @param {number | undefined} b
   */
  constructor(r, g, b) {
    if (r !== undefined && g === undefined && b === undefined) {
      this.r = r;
      this.g = r;
      this.b = r;
      return;
    }
    this.r = r;
    this.g = g;
    this.b = b;
  }
}
