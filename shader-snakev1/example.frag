precision mediump float;

varying vec2 pos;

uniform float uMillis;

void main() {

  // Repeating pattern
  vec2 newPos = vec2(fract(pos.x * 20.), fract(pos.y * 20.));
  
  // 4 color gradient
  vec4 tl = vec4(0., 1., 1., 1.);
  vec4 tr = vec4(1., 1., 1., 1.);
  vec4 bl = vec4(0., 1., 0., 1.);
  vec4 br = vec4(1., 0., 1., 1.);
  vec4 top = mix(tl, tr, newPos.x);
  vec4 bottom = mix(bl, br, newPos.x);
  vec4 c = mix(bottom, top, newPos.y);
  

  // vec2 newPos = (sin(pos * 20. + uMillis / 1000.) + 1.) / 2. ;
  // vec2 newPos = pos;
  // newPos.y = 1. - newPos.y;
  // newPos = newPos + (sin(newPos * 16. + uMillis / 1000.)/16.);
  // vec4 col = vec4(1., 0., 0.4, 1.);
  
  // Reverse the color
  // col = vec4(1.) - col;

  gl_FragColor = c;
}