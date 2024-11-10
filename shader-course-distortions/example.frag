#version 300 es

precision mediump float;

in vec2 pos;
out vec4 colour;

uniform sampler2D uBackground;

void main() {
  float x = sin(pos.y * 12.56) * 0.05;
  float y = sin(pos.x * 12.56) * 0.05;
  vec2 offset = vec2(x, y);
  colour = texture(uBackground, pos + offset);
}