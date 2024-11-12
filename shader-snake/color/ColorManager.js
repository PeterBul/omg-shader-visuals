const lightBlue1 = [
  [31, 158, 136, 90],
  [0, 0, 0, 95],
  [7, 152, 171, 147],
  [167, 10, 178, 54],
];

class ColorManager {
  /**
   * @private
   * @type {ColorEditor}
   */
  tlColorEditor;

  /**
   * @private
   * @type {ColorEditor}
   */
  trColorEditor;

  /**
   * @private
   * @type {ColorEditor}
   */
  blColorEditor;

  /**
   * @private
   * @type {ColorEditor}
   */
  brColorEditor;

  /**
   * @private
   */
  logButton;

  /** @private */
  yOffsetPickerPosition = 30;

  /**
   *
   * @param {number[][]} levels
   */
  constructor(levels) {
    this.tlColorEditor = new ColorEditor("#000000");
    this.trColorEditor = new ColorEditor("#ffffff");
    this.blColorEditor = new ColorEditor("#00ff00");
    this.brColorEditor = new ColorEditor("#ff00ff");

    if (levels) {
      this.tl = levels[0];
      this.tr = levels[1];
      this.bl = levels[2];
      this.br = levels[3];
    }

    this.logButton = createButton("Log Levels");
    this.logButton.size(100, 25);
    this.logButton.position(0, 4 * this.yOffsetPickerPosition);
    this.logButton.mousePressed(() => this.logLevels());

    this.tlColorEditor.position(0, 0 * this.yOffsetPickerPosition);
    this.trColorEditor.position(0, 1 * this.yOffsetPickerPosition);
    this.blColorEditor.position(0, 2 * this.yOffsetPickerPosition);
    this.brColorEditor.position(0, 3 * this.yOffsetPickerPosition);
  }

  /**
   * @returns {number[]} The color levels for the top left corner
   */
  get tl() {
    return this.tlColorEditor.normalized;
  }

  /**
   * @returns {number[]} The color levels for the top right corner
   */
  get tr() {
    return this.trColorEditor.normalized;
  }

  /**
   * @returns {number[]} The color levels for the bottom left
   */
  get bl() {
    return this.blColorEditor.normalized;
  }

  /**
   * @returns {number[]} The color levels for the bottom right
   */
  get br() {
    return this.brColorEditor.normalized;
  }

  /**
   * @param {number[]} color
   */
  set tl(color) {
    this.tlColorEditor.color = color;
  }

  /**
   * @param {number[]} color
   */
  set tr(color) {
    this.trColorEditor.color = color;
  }

  /**
   * @param {number[]} color
   */
  set bl(color) {
    this.blColorEditor.color = color;
  }

  /**
   * @param {number[]} color
   */
  set br(color) {
    this.brColorEditor.color = color;
  }

  /**
   * @private
   */
  logLevels() {
    console.log([
      this.tlColorEditor.levels,
      this.trColorEditor.levels,
      this.blColorEditor.levels,
      this.brColorEditor.levels,
    ]);
  }

  /**
   *
   * @param {Shader} shader
   */
  setShaderUniforms(shader) {
    shader.setUniform("uTopLeftColor", this.tl);
    shader.setUniform("uTopRightColor", this.tr);
    shader.setUniform("uBottomLeftColor", this.bl);
    shader.setUniform("uBottomRightColor", this.br);
  }
}
