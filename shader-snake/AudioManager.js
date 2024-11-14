let audioIn;
let fft;
let mic;
let selectedSourceId;

class AudioManager {
  /**
   * @type {number[]}
   */
  bassEnergyHistory = []; // Array to store historical bassEnergy values
  trebleEnergyHistory = []; // Array to store historical bassEnergy values
  midEnergyHistory = []; // Array to store historical bassEnergy values
  historyLength;
  initialized = false;

  /**
   *
   * @default 50
   * @param {number} historyLength
   */
  constructor(historyLength = 50) {
    this.historyLength = historyLength;
  }

  audioSetup() {
    if (this.initialized) {
      return 0;
    }
    let audioContext = getAudioContext();
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    audioIn = new p5.AudioIn();
    audioIn.getSources(gotSources);
    fft = new p5.FFT();
    fft.setInput(audioIn);
    this.initialized = true;
  }

  get spectrum() {
    if (!this.initialized) {
      return 0;
    }
    return fft.analyze();
  }

  get spectrumNormalized() {
    if (!this.initialized) {
      return 0;
    }
    return this.spectrum.map((val) => val / 255);
  }

  get centroid() {
    if (!this.initialized) {
      return 0;
    }
    return fft.getCentroid();
  }

  get centroidNormalized() {
    if (!this.initialized) {
      return 0;
    }
    return this.centroid / 5000;
  }

  get bassEnergy() {
    if (!this.initialized) {
      return 0;
    }
    return fft.getEnergy("bass");
  }

  get bassEnergyNormalized() {
    if (!this.initialized) {
      return 0;
    }
    return this.bassEnergy / 255;
  }

  get lowMidEnergy() {
    if (!this.initialized) {
      return 0;
    }
    return fft.getEnergy("lowMid");
  }

  get lowMidEnergyNormalized() {
    if (!this.initialized) {
      return 0;
    }
    return this.lowMidEnergy / 255;
  }

  get midEnergy() {
    if (!this.initialized) {
      return 0;
    }
    return fft.getEnergy("mid");
  }

  get midEnergyNormalized() {
    if (!this.initialized) {
      return 0;
    }
    return this.midEnergy / 255;
  }

  get highMidEnergy() {
    if (!this.initialized) {
      return 0;
    }
    return fft.getEnergy("highMid");
  }

  get highMidEnergyNormalized() {
    if (!this.initialized) {
      return 0;
    }
    return this.highMidEnergy / 255;
  }

  get trebleEnergy() {
    if (!this.initialized) {
      return 0;
    }
    return fft.getEnergy("treble");
  }

  get trebleEnergyNormalized() {
    if (!this.initialized) {
      return 0;
    }
    return this.trebleEnergy / 100;
  }

  get all() {
    if (!this.initialized) {
      return 0;
    }
    return {
      avgBassEnergy: this.avgBassEnergy,
      avgTrebleEnergy: this.avgTrebleEnergy,
      centroid: this.centroid,
      bassEnergy: this.bassEnergy,
      lowMidEnergy: this.lowMidEnergy,
      midEnergy: this.midEnergy,
      highMidEnergy: this.highMidEnergy,
      spectrum: this.spectrum,
      trebleEnergy: this.trebleEnergy,
    };
  }

  get allNormalized() {
    if (!this.initialized) {
      return;
    }
    return {
      avgBassEnergy: this.avgBassEnergyNormalized,
      avgTrebleEnergy: this.avgTrebleEnergyNormalized,
      centroid: this.centroidNormalized,
      bassEnergyNormalized: this.bassEnergyNormalized,
      lowMidEnergy: this.lowMidEnergyNormalized,
      midEnergy: this.midEnergyNormalized,
      highMidEnergy: this.highMidEnergyNormalized,
      spectrumNormalized: this.spectrumNormalized,
      trebleEnergy: this.trebleEnergyNormalized,
    };
  }

  get toStringNormalized() {
    if (!this.initialized) {
      return;
    }
    return (
      "Centroid: " +
      this.centroidNormalized +
      "\n" +
      "Bass Energy: " +
      this.bassEnergyNormalized +
      "\n" +
      "Low Mid Energy: " +
      this.lowMidEnergyNormalized +
      "\n" +
      "Mid Energy: " +
      this.midEnergyNormalized +
      "\n" +
      "High Mid Energy: " +
      this.highMidEnergyNormalized +
      "\n" +
      "Treble Energy: " +
      this.trebleEnergyNormalized +
      "\n" +
      "Avg Bass Energy: " +
      this.avgBassEnergyNormalized +
      "\n" +
      "Avg Treble Energy: " +
      this.avgTrebleEnergyNormalized
    );
  }

  audioDraw() {
    if (!this.initialized) {
      return;
    }
    fft.analyze();
    this.updateBassEnergyHistory();
    this.updateTrebleEnergyHistory();
    this.updateMidEnergyHistory();
  }

  /**
   * @private
   */
  updateMidEnergyHistory() {
    this.midEnergyHistory.push(this.midEnergy);

    // Limit history length
    if (this.midEnergyHistory.length > this.historyLength) {
      this.midEnergyHistory.shift(); // Remove oldest
    }
  }

  /**
   * @private
   */
  updateBassEnergyHistory() {
    this.bassEnergyHistory.push(this.bassEnergy);
    // Limit history length
    if (this.bassEnergyHistory.length > this.historyLength) {
      this.bassEnergyHistory.shift(); // Remove oldest entry
    }
  }

  /**
   * @private
   */
  updateTrebleEnergyHistory() {
    this.trebleEnergyHistory.push(this.trebleEnergy);
    // Limit history length
    if (this.trebleEnergyHistory.length > this.historyLength) {
      this.trebleEnergyHistory.shift(); // Remove oldest entry
    }
  }

  get avgMidEnergy() {
    if (!this.initialized) {
      return 0;
    }
    return (
      this.midEnergyHistory.reduce((acc, val) => acc + val, 0) /
      this.midEnergyHistory.length
    );
  }

  get avgBassEnergy() {
    if (!this.initialized) {
      return 0;
    }
    return (
      this.bassEnergyHistory.reduce((acc, val) => acc + val, 0) /
      this.bassEnergyHistory.length
    );
  }

  get avgTrebleEnergy() {
    if (!this.initialized) {
      return 0;
    }
    return (
      this.trebleEnergyHistory.reduce((acc, val) => acc + val, 0) /
      this.trebleEnergyHistory.length
    );
  }

  get avgMidEnergyNormalized() {
    if (!this.initialized) {
      return 0;
    }
    return this.avgMidEnergy / 255;
  }

  get avgBassEnergyNormalized() {
    if (!this.initialized) {
      return 0;
    }
    return this.avgBassEnergy / 255;
  }

  get avgTrebleEnergyNormalized() {
    if (!this.initialized) {
      return 0;
    }
    return this.avgTrebleEnergy / 100;
  }
}

function gotSources(deviceList) {
  // // Look for audio input sources
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
