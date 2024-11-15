/**
 * @typedef {import('p5').Shader} Shader
 */

/** @type {Shader} */
let torusShader;

function preload() {
  torusShader = loadShader("torus.vert", "torus.frag");
}
function setup() {
  createCanvas(1920, 1920, WEBGL);
  noStroke();
}

function draw() {
  clear();
  rotateX(PI);
  background(0);

  shader(torusShader);
  torus(250, 70, 64, 48);

  orbitControl();
}
