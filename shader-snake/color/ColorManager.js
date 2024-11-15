const lightBlue1 = [
  [31, 158, 136, 90],
  [0, 0, 0, 95],
  [7, 152, 171, 147],
  [167, 10, 178, 54],
];

class ColorManager {
  /**
   * @private
   * @type {MyColorEditor}
   */
  tlColorEditor;

  /**
   * @private
   * @type {MyColorEditor}
   */
  trColorEditor;

  /**
   * @private
   * @type {MyColorEditor}
   */
  blColorEditor;

  /**
   * @private
   * @type {MyColorEditor}
   */
  brColorEditor;

  /**
   * @private
   */
  logButton;

  /** @private */
  yOffsetPickerPosition = 30;

  /**
   * @private
   * @type {AudioManager}
   */
  audioManager;

  /**
   * @type {WithVisibility[]}
   */
  elements = [];

  hidden = false;

  /**
   *
   * @param {number[][]} levels
   * @param {AudioManager} audioManager
   */
  constructor(levels, audioManager, hide = false) {
    this.audioManager = audioManager;

    this.tlColorEditor = this.addColorEditor("#000000", hide);
    this.trColorEditor = this.addColorEditor("#ffffff", hide);
    this.blColorEditor = this.addColorEditor("#00ff00", hide);
    this.brColorEditor = this.addColorEditor("#ff00ff", hide);

    this.tlColorEditor.position(0, 0 * this.yOffsetPickerPosition);
    this.trColorEditor.position(0, 1 * this.yOffsetPickerPosition);
    this.blColorEditor.position(0, 2 * this.yOffsetPickerPosition);
    this.brColorEditor.position(0, 3 * this.yOffsetPickerPosition);

    if (levels) {
      this.tl = levels[0];
      this.tr = levels[1];
      this.bl = levels[2];
      this.br = levels[3];
    }

    this.logButton = this.addButton("Log Levels", hide);
    this.logButton.size(100, 25);
    this.logButton.position(0, 4 * this.yOffsetPickerPosition);
    this.logButton.mousePressed(() => this.logLevels());

    if (hide) {
      this.hide();
    }
  }

  isOnUI(x, y) {
    return this.elements.some((e) => {
      if ("elt" in e) {
        /**
         * @type {HTMLElement}
         */
        const elt = e.elt;
        return this.isOnRect(x, y, elt.getBoundingClientRect());
      }
      return e.isOnUI?.(x, y);
    });
  }

  /**
   *
   * @param {string} color
   * @param {boolean} hide
   */
  addColorEditor(color, hide = false) {
    const editor = new MyColorEditor(color, hide);
    this.elements.push(editor);
    return editor;
  }

  /**
   *
   * @param {string} label
   * @returns
   */
  addButton(label, hide = false) {
    const button = createButton(label);
    if (hide) {
      button.hide();
    }
    this.elements.push(button);
    button.addClass("atom-btn");
    return button;
  }

  toggleVisibility() {
    if (this.hidden) {
      this.show();
    } else {
      this.hide();
    }
  }

  show() {
    this.hidden = false;
    this.elements.forEach((e) => e.show());
  }

  hide() {
    this.hidden = true;
    this.elements.forEach((e) => e.hide());
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
    // const tl = [0, 0, 0, 0.5];

    // const bl = [0, 1, 1, 0.5];
    // shader.setUniform("uTopLeftColor", tl);
    // shader.setUniform("uTopRightColor", this.tr);
    // shader.setUniform("uBottomLeftColor", bl);
    // shader.setUniform("uBottomRightColor", this.br);

    const tl = [
      0 +
        this.audioManager.bassEnergyNormalized -
        this.audioManager.avgTrebleEnergyNormalized,
      1 - this.audioManager.avgBassEnergyNormalized,
      1 - this.audioManager.avgTrebleEnergyNormalized * 5,
      0.5,
    ];

    const tr = [
      0,
      0 +
        this.audioManager.TrebleEnergyNormalized * 10 -
        this.audioManager.bassEnergyNormalized,
      1,
      0.5,
    ];

    const bl = [
      0.5 + this.audioManager.avgBassEnergyNormalized,
      0 + this.audioManager.trebleEnergyNormalized * 5,
      1 - this.audioManager.avgBassEnergyNormalized,
      0.5 + this.audioManager.TrebleEnergyNormalized * 5,
    ];

    const br = [
      0 + this.audioManager.bassEnergyNormalized,
      0 + this.audioManager.avgTrebleEnergyNormalized * 5,
      1 - this.audioManager.avgTrebleEnergyNormalized * 3,
      0.5 + this.audioManager.TrebleEnergyNormalized * 5,
    ];

    shader.setUniform("uTopLeftColor", tl);
    shader.setUniform("uTopRightColor", tr);
    shader.setUniform("uBottomLeftColor", bl);
    shader.setUniform("uBottomRightColor", br);
  }

  /**
   * @private
   * @static
   * @param {number} x
   * @param {number} y
   * @param {DOMRect} rect
   */
  isOnRect(x, y, rect) {
    return (
      x > rect.x &&
      x < rect.x + rect.width &&
      y > rect.y &&
      y < rect.y + rect.height
    );
  }
}
