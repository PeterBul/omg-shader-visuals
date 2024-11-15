#version 300 es
precision mediump float;

in vec2 vTexPos;
in vec3 vFragPos;
in vec3 vPos;

out vec4 colour;

uniform float uMillis;
uniform float uRadius;
uniform float uHeight;

uniform vec4 uTopLeftColor;
uniform vec4 uTopRightColor;
uniform vec4 uBottomLeftColor;
uniform vec4 uBottomRightColor;

#define PI 3.1415926538
mat2 deg45Rotation = mat2(
   0.7071, -0.7071,
   0.7071, 0.7071
);

void main() {

  float t = (vFragPos.y + 0.5) / 1.0;  // Normalize y from 0 to 1
  // Repeating pattern
  float v = 18.52;
  float w = 10.0;

  vec2 newPos = vTexPos * deg45Rotation;
  if (t > 0.9) {
    // c = vec4(vec3(0.), 1.0);
    newPos = vec2(fract(newPos.x * 2. * PI * uRadius / w), fract(newPos.y * 1.1 * uHeight / w));
  } else {
    newPos = vec2(fract(newPos.x * 2. * PI * uRadius / v), fract(newPos.y * 1.1 * uHeight / v));
  }

  
  // 4 color gradient
  vec4 tl = uTopLeftColor;
  vec4 tr = uTopRightColor;
  vec4 bl = uBottomLeftColor;
  vec4 br = uBottomRightColor;
  vec4 top = mix(tl, tr, newPos.x);
  vec4 bottom = mix(bl, br, newPos.x);
  vec4 c = mix(bottom, top, newPos.y);
  
  // c -= 0.2;
  
  float normX = (vFragPos.x + 1.) / 2.0;  // Normalize x from 0 to 1
  float normZ = (vFragPos.z + 1.) / 2.0;  // Normalize z from 0 to 1
  if (t > 0.9 && normZ < 0.90) {
    // c = vec4(vec3(0.), 1.0);
  }
  

  // vec2 newPos = (sin(pos * 20. + uMillis / 1000.) + 1.) / 2. ;
  // vec2 newPos = pos;
  // newPos.y = 1. - newPos.y;
  // newPos = newPos + (sin(newPos * 16. + uMillis / 1000.)/16.);
  // vec4 col = vec4(1., 0., 0.4, 1.);
  
  // Reverse the color
  // Removes half of the
  // colour = c * vec4(vPos.x, 1.0);
  colour = c;
}