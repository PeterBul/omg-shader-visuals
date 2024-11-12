class AudioManager {
  /**
   * @private
   */
  mic;
  /**
   * @private
   */
  fft;

  /**
   * @type {number[]}
   */
  bassEnergyHistory = []; // Array to store historical bassEnergy values
  trebleEnergyHistory = []; // Array to store historical bassEnergy values
  historyLength;

  /**
   *
   * @default 50
   * @param {number} historyLength
   */
  constructor(historyLength = 50) {
    this.historyLength = historyLength;

    this.logButton = createButton("Init audio");
    this.logButton.size(100, 25);
    this.logButton.position(0, 500);
    this.logButton.mousePressed(() => this.setup());
    this.initialized = false;
  }

  setup() {
    this.mic = new p5.AudioIn();
    this.mic.start();

    this.fft = new p5.FFT();
    this.fft.setInput(this.mic);

    this.logButton.remove();
    this.initialized = true;
  }

  get spectrum() {
    return this.fft.analyze();
  }

  get centroid() {
    return this.fft.getCentroid();
  }

  get bassEnergy() {
    if (!this.initialized) {
      return;
    }
    return this.fft.getEnergy("bass");
  }

  get LmidEnergy() {
    return this.fft.getEnergy("lowMid");
  }

  get midEnergy() {
    return this.fft.getEnergy("mid");
  }

  get HmidEnergy() {
    return this.fft.getEnergy("highMid");
  }

  get trebleEnergy() {
    return this.fft.getEnergy("treble");
  }

  updateBassEnergyHistory() {
    this.bassEnergyHistory.push(this.bassEnergy);
    // Limit history length
    if (this.bassEnergyHistory.length > this.historyLength) {
      this.bassEnergyHistory.shift(); // Remove oldest entry
    }
  }

  updateTrebleEnergyHistory() {
    this.trebleEnergyHistory.push(this.trebleEnergy);
    // Limit history length
    if (this.trebleEnergyHistory.length > this.historyLength) {
      this.trebleEnergyHistory.shift(); // Remove oldest entry
    }
  }

  get avgBassEnergy() {
    return (
      this.bassEnergyHistory.reduce((acc, val) => acc + val, 0) /
      this.bassEnergyHistory.length
    );
  }

  get avgTrebleEnergy() {
    return (
      this.trebleEnergyHistory.reduce((acc, val) => acc + val, 0) /
      this.trebleEnergyHistory.length
    );
  }

  get avgBassEnergyNormalized() {
    return this.avgBassEnergy / 255;
  }

  get avgTrebleEnergyNormalized() {
    return this.avgTrebleEnergy / 255;
  }

  draw() {
    if (!this.initialized) {
      return;
    }
    console.log("Bass", this.fft.getEnergy("bass"));
    // Add current bassEnergy and trebleEnergy to history:
    this.updateBassEnergyHistory();
    this.updateTrebleEnergyHistory();
  }
}
