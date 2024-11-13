let testAudioManager;
function setup() {
  testAudioManager = new TestAudioManager();
  createCanvas(710, 400);
}

function draw() {
  background(200);

  testAudioManager.audioDraw();
}

function mouseClicked() {
  testAudioManager.audioSetup();
}
