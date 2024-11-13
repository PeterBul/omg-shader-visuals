let audioIn;
let fft;
let mic;
class AudioManager {
  audioSetup() {
    audioIn = new p5.AudioIn();
    audioIn.getSources(gotSources);
    fft = new p5.FFT();
    fft.setInput(audioIn);
    console.log("Audio initialized");
    this.initialized = true;
  }

  audioDraw() {
    if (!this.initialized) {
      return;
    }
    let spectrum = fft.analyze();
    beginShape();
    for (let i = 0; i < spectrum.length; i++) {
      vertex(i, map(spectrum[i], 0, 255, height, 0));
    }
    endShape();
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
