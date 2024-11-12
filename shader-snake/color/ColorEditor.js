class ColorEditor {
  /**
   * @private
   */
  colorPicker;
  /** @private */
  alphaSlider;
  /** @private */
  xOffsetSliderPosition = 50;
  /** @private */
  posX = 0;
  /** @private */
  posY = 0;

  /**
   *
   * @param {string} color
   */
  constructor(color) {
    this.colorPicker = createColorPicker(color);
    this.alphaSlider = createSlider(0, 255, 255);
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   */
  position(x, y) {
    this.posX = x;
    this.posY = y;
    this.colorPicker.position(x, y);
    this.alphaSlider.position(x + this.xOffsetSliderPosition, y);
  }

  /**
   * @returns {[number, number, number, number]} The normalized color levels 0 - 1
   */
  get normalized() {
    return this.levels.map((c) => c / 255);
  }

  /**
   * @returns {[number, number, number, number]} The color levels 0 - 255
   */
  get levels() {
    const c = this.colorPicker.color().levels;
    c[3] = this.alphaSlider.value();
    return c;
  }

  /**
   * @param {[number, number, number, number] | string} color The color levels 0 - 255 or hex string
   */
  set color(color) {
    this.colorPicker.remove();
    if (typeof color === "string") {
      const rgbString = color.slice(0, 7);
      this.colorPicker = createColorPicker(rgbString);
      if (color.length === 9) {
        this.alphaSlider.value(this.hexToDec(color.slice(7)));
      }
    } else {
      const hex = this.rgbToHex(color);
      this.colorPicker = createColorPicker(hex);
      if (color.length > 3) {
        this.alphaSlider.value(color[3]);
      }
    }
    this.colorPicker.position(this.posX, this.posY);
  }

  /**
   * @private
   * @param {string} x
   */
  hexToDec(x) {
    return parseInt(x, 16);
  }

  /**
   * Creates a hex value from number with two characters
   * @private
   * @param {number} x
   */
  decToHex(x) {
    return x.toString(16).padStart(2, "0");
  }

  /**
   * @private
   * @param {string} hex
   */
  hexToRgb(hex) {
    return [
      this.hexToDec(hex.substring(1, 3)),
      this.hexToDec(hex.substring(3, 5)),
      this.hexToDec(hex.substring(5, 7)),
    ];
  }

  /**
   * @private
   * @param {number[]} rgb
   */
  rgbToHex(rgb) {
    return `#${this.decToHex(rgb[0])}${this.decToHex(rgb[1])}${this.decToHex(
      rgb[2]
    )}`;
  }

  /**
   *
   * @param {*} r
   * @param {*} g
   * @param {*} b
   * @returns
   */
  rgbToHsl(r, g, b) {
    // Normalize RGB values to the range 0-1
    r /= 255;
    g /= 255;
    b /= 255;

    // Find the min and max RGB values
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let delta = max - min;

    // Calculate Lightness
    let l = (max + min) / 2;

    let h, s;

    if (delta === 0) {
      // If there is no color difference (grayscale)
      h = 0;
      s = 0;
    } else {
      // Calculate Saturation
      s = l < 0.5 ? delta / (max + min) : delta / (2 - max - min);

      // Calculate Hue
      if (max === r) {
        h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
      } else if (max === g) {
        h = ((b - r) / delta + 2) / 6;
      } else {
        h = ((r - g) / delta + 4) / 6;
      }
    }

    // Return H, S, L as values in range [0, 1]
    return { h, s, l };
  }
}
