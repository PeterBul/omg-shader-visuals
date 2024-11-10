#version 300 es
precision mediump float;

in vec2 pos;
out vec4 colour;

uniform float uWidth;
uniform float uHeight;
uniform float uDepth;

#define PI 3.1415926538

void main() {

  

  // vec2 newPos = (sin(pos * 20. + uMillis / 1000.) + 1.) / 2. ;
  // vec2 newPos = pos;
  vec2 newPos = pos;
  // newPos.y = 1. - newPos.y;
  // newPos = newPos + (sin(newPos * 16. + uMillis / 1000.)/16.);
  // vec4 col = vec4(1., 0., 0.4, 1.);
  
  // Reverse the color
  // col = vec4(1.) - col;

  // 4 color gradient
  vec4 bl = vec4(0., 0., 0., 1.);
  vec4 br = vec4(1., 1., 1., 1.);
  vec4 tl = vec4(1., 0., 1., 1.); // Magenta
  vec4 tr = vec4(0., 1., 1., 1.); // Cyan
  vec4 top = mix(tl, tr, newPos.y);
  // vec4 bottom = mix(bl, br, newPos.x);
  // vec4 c = mix(bottom, top, newPos.y);

  colour = top;
}