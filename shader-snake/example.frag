#version 300 es
precision mediump float;

in vec2 texPos;
in vec3 fragPos;
out vec4 colour;

uniform float uMillis;
uniform float uRadius;
uniform float uHeight;

#define PI 3.1415926538
mat2 deg45Rotation = mat2(
   0.7071, -0.7071,
   0.7071, 0.7071
);

void main() {

  // Repeating pattern
  float v = 18.52;

  vec2 newPos = texPos * deg45Rotation;
  newPos = vec2(fract(newPos.x * 2. * PI * uRadius / v), fract(newPos.y * 1.1 * uHeight / v));

  
  // 4 color gradient
  vec4 tl = vec4(0., 0., 0., 1.);
  vec4 tr = vec4(1., 1., 1., 1.);
  vec4 bl = vec4(0., 1., 0., 1.);
  vec4 br = vec4(1., 0., 1., 1.);
  vec4 top = mix(tl, tr, newPos.x);
  vec4 bottom = mix(bl, br, newPos.x);
  vec4 c = mix(bottom, top, newPos.y);
  
  float t = (fragPos.y + 0.5) / 1.0;  // Normalize y from 0 to 1
  float normX = (fragPos.x + 1.) / 2.0;  // Normalize x from 0 to 1
  float normZ = (fragPos.z + 1.) / 2.0;  // Normalize z from 0 to 1
  if (t > 0.9 && normZ < 0.90) {
    // c = vec4(vec3(0.), 1.0);
  }
  

  // vec2 newPos = (sin(pos * 20. + uMillis / 1000.) + 1.) / 2. ;
  // vec2 newPos = pos;
  // newPos.y = 1. - newPos.y;
  // newPos = newPos + (sin(newPos * 16. + uMillis / 1000.)/16.);
  // vec4 col = vec4(1., 0., 0.4, 1.);
  
  // Reverse the color
  // col = vec4(1.) - col;

  colour = c;
}