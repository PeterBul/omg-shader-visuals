#version 300 es
precision mediump float;

in vec2 vUv;        // in vec2 texPos;
in vec3 vPosition;  //in vec3 fragPos;
in vec3 vNormal;
in vec3 vPattern;

uniform float uMillis;

out vec4 colour;

void main() {
  colour = vec4(vec3(1.0), 1.0);
}