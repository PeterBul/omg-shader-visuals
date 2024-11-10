#version 300 es
precision mediump float;

in vec2 pos;
out vec4 colour;

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
  vec4 top = mix(tl, tr, newPos.x);

  // vec4 bottom = mix(bl, br, newPos.x);
  // vec4 c = mix(bottom, top, newPos.y);

  vec4 a = vec4(0., 0., 0., 1.);
  vec4 b = vec4(1., 1., 1., 1.);
  vec4 c = vec4(1., 0., 1., 1.); // Magenta
  vec4 d = vec4(0., 1., 1., 1.); // Cyan
  
  vec4 c1 = mix(a, b, newPos.x / 2.);
  vec4 c2 = mix(c, d, newPos.x / 2.);
  vec4 c3 = mix(c2, d, newPos.x / 2.);

  colour = c2;
}