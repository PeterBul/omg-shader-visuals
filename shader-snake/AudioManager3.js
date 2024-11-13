let selectedSourceId;
let mic;
let fft;
class AudioManager {
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

    this.initialized = false;
  }

  audioSetup() {
    mic = new p5.AudioIn();
    mic.start();

    fft = new p5.FFT();
    fft.setInput(mic);

    this.initialized = true;
    this.testSources();
  }

  getBass() {
    if (!this.initialized) {
      return;
    }
    return fft.getEnergy("bass");
  }

  get spectrum() {
    return fft.analyze();
  }

  get centroid() {
    return fft.getCentroid();
  }

  get bassEnergy() {
    if (!this.initialized) {
      return;
    }
    return fft.getEnergy("bass");
  }

  get LmidEnergy() {
    return fft.getEnergy("lowMid");
  }

  get midEnergy() {
    return fft.getEnergy("mid");
  }

  get HmidEnergy() {
    return fft.getEnergy("highMid");
  }

  get trebleEnergy() {
    return fft.getEnergy("treble");
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
    console.log("Bass", fft.getEnergy("bass"));
    // Add current bassEnergy and trebleEnergy to history:
    this.updateBassEnergyHistory();
    this.updateTrebleEnergyHistory();
  }

  testSources() {
    mic.getSources(gotSources);
  }
}

function gotSources(deviceList) {
  // Look for audio input sources
  let audioSources = deviceList.filter(
    (device) => device.kind === "audioinput"
  );

  // Print available audio sources
  console.log("Available audio sources:");
  audioSources.forEach((source, index) =>
    console.log(index + ": " + source.label)
  );

  // Set the source to the first item in the audioSources array
  if (audioSources.length > 0) {
    let selectedSource = audioSources[2];
    selectedSourceId = selectedSource.deviceId;
    mic = new p5.AudioIn();
    mic.setSource(selectedSourceId);
    mic.start();
    fft.setInput(mic);
    console.log("Selected source:", selectedSource.label);
  }
}
