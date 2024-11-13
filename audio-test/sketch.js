// let audioIn;
// let fft;
// let mic;
// let selectedSourceId;

let audioManager;
function setup() {
  audioManager = new AudioManager();
  createCanvas(710, 400);
}

// function gotSources(deviceList) {
//   // Look for audio input sources
//   let audioSources = deviceList.filter(
//     (device) => device.kind === "audioinput"
//   );

//   // Print available audio sources
//   console.log("Available audio sources:");
//   audioSources.forEach((source, index) =>
//     console.log(index + ": " + source.label)
//   );

//   // Set the source to the first item in the audioSources array
//   if (audioSources.length > 0) {
//     let selectedSource = audioSources[2];
//     selectedSourceId = selectedSource.deviceId;
//     mic = new p5.AudioIn();
//     mic.setSource(selectedSourceId);
//     mic.start();
//     fft.setInput(mic);
//     console.log("Selected source:", selectedSource.label);
//   }
// }

// let initialized = false;

function draw() {
  background(200);

  audioManager.audioDraw();
  // if (!initialized) {
  //   return;
  // }

  // let spectrum = fft.analyze();

  // beginShape();
  // for (let i = 0; i < spectrum.length; i++) {
  //   vertex(i, map(spectrum[i], 0, 255, height, 0));
  // }
  // endShape();
}

function mouseClicked() {
  audioManager.audioSetup();
  // audioIn = new p5.AudioIn();
  // audioIn.getSources(gotSources);
  // fft = new p5.FFT();
  // console.log("Audio initialized");
  // initialized = true;
}
