#version 300 es
precision mediump float;

in vec3 aPosition;
in vec2 aTexCoord;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;

uniform float uMillis;
in vec2 st;

out vec2 texPos;
out vec3 fragPos;

mat4 rotateX90 = mat4(
    1.0, 0.0, 0.0, 0.0,
    0.0, 0.0, -1.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 0.0, 1.0
);

float waveAmplitude = 1.0;
float waveFrequency = 15.0;

// float headRadius = 1.0;  // Radius at the head (top of the snake)
float tailRadius = 0.2;  // Radius at the tail (bottom of the snake)
float len = 1.0;  // The total length of the snake (seems to be 1.0). Modifying this does not change the actual length - this is used to normalize the y position of the vertex

vec4 toBezier(float delta, int i, vec4 P0, vec4 P1, vec4 P2, vec4 P3)
{
    float t = delta * float(i);
    float t2 = t * t;
    float one_minus_t = 1.0 - t;
    float one_minus_t2 = one_minus_t * one_minus_t;
    return (P0 * one_minus_t2 * one_minus_t + P1 * 3.0 * t * one_minus_t2 + P2 * 3.0 * t2 * one_minus_t + P3 * t2 * t);
}

float squared(float x)
{
    return x * x;
}

float halfCircle(float x, float radius)
{
    return sqrt(radius*radius - (x - radius) * (x - radius));
}

float linear(float x, float a, float b)
{
    return a*x + b;
}

// psrdnoise (c) Stefan Gustavson and Ian McEwan,
// ver. 2021-12-02, published under the MIT license:
// https://github.com/stegu/psrdnoise/

float psrdnoise(vec2 x, vec2 period, float alpha, out vec2 gradient)
{
  vec2 uv = vec2(x.x+x.y*0.5, x.y);
  vec2 i0 = floor(uv), f0 = fract(uv);
  float cmp = step(f0.y, f0.x);
  vec2 o1 = vec2(cmp, 1.0-cmp);
  vec2 i1 = i0 + o1, i2 = i0 + 1.0;
  vec2 v0 = vec2(i0.x - i0.y*0.5, i0.y);
  vec2 v1 = vec2(v0.x + o1.x - o1.y*0.5, v0.y + o1.y);
  vec2 v2 = vec2(v0.x + 0.5, v0.y + 1.0);
  vec2 x0 = x - v0, x1 = x - v1, x2 = x - v2;
  vec3 iu, iv, xw, yw;
  if(any(greaterThan(period, vec2(0.0)))) {
    xw = vec3(v0.x, v1.x, v2.x);
    yw = vec3(v0.y, v1.y, v2.y);
    if(period.x > 0.0)
    xw = mod(vec3(v0.x, v1.x, v2.x), period.x);
    if(period.y > 0.0)
      yw = mod(vec3(v0.y, v1.y, v2.y), period.y);
    iu = floor(xw + 0.5*yw + 0.5); iv = floor(yw + 0.5);
  } else {
    iu = vec3(i0.x, i1.x, i2.x); iv = vec3(i0.y, i1.y, i2.y);
  }
  vec3 hash = mod(iu, 289.0);
  hash = mod((hash*51.0 + 2.0)*hash + iv, 289.0);
  hash = mod((hash*34.0 + 10.0)*hash, 289.0);
  vec3 psi = hash*0.07482 + alpha;
  vec3 gx = cos(psi); vec3 gy = sin(psi);
  vec2 g0 = vec2(gx.x, gy.x);
  vec2 g1 = vec2(gx.y, gy.y);
  vec2 g2 = vec2(gx.z, gy.z);
  vec3 w = 0.8 - vec3(dot(x0, x0), dot(x1, x1), dot(x2, x2));
  w = max(w, 0.0); vec3 w2 = w*w; vec3 w4 = w2*w2;
  vec3 gdotx = vec3(dot(g0, x0), dot(g1, x1), dot(g2, x2));
  float n = dot(w4, gdotx);
  vec3 w3 = w2*w; vec3 dw = -8.0*w3*gdotx;
  vec2 dn0 = w4.x*g0 + dw.x*x0;
  vec2 dn1 = w4.y*g1 + dw.y*x1;
  vec2 dn2 = w4.z*g2 + dw.z*x2;
  gradient = 10.9*(dn0 + dn1 + dn2);
  return 10.9*n;
}

float map(float x, float a, float b, float c, float d) {
    return c + (x - a) * (d - c) / (b - a);
}

void main() {
    texPos = aTexCoord;
    
    vec3 modifiedPos = aPosition;
    
    // Perlin noise
    float time = uMillis / 6000.0;
    const float scale = 2.;
    vec2 v = scale * vec2(time + aPosition.y * 0.8);
    const vec2 p = vec2(0.0);
    float alpha = 0.;
    vec2 g;

    float n = psrdnoise(v, p, alpha, g) * 1.5;

    // Normalize the position to be within the range of 0.0 to 1.0
    float t = (aPosition.y + 0.5) / len;  // Normalize y from 0 to 1

    // Apply a quadratic function for smooth tapering
    float radius = acosh(0.2 * t + 1.) * 1.;
    modifiedPos.x *= radius; // Apply radius to x-axis
    modifiedPos.z *= radius; // Apply radius to z-axis

    float headNormT = (t - 0.9) * 10.;
    // Draw a head at the top of the snake
    float headRadiusX = halfCircle(t - 0.9, 0.05) * 25.;
    float headRadiusZ = halfCircle(t - 0.9, 0.05) * 12.;

    if (t > 0.9) {
        float oldX = modifiedPos.x;
        float oldZ = modifiedPos.z;
        modifiedPos.x *= 1. + headRadiusX;
        modifiedPos.z *= 1. + headRadiusZ;
        modifiedPos.x -= mix(0., oldX, headNormT);
        modifiedPos.z -= mix(0., oldZ, headNormT);
    }
    if (t == 1.0) {
        modifiedPos.x = 0.0;
        modifiedPos.z = 0.0;
    }

    // Apply the displacement along the x-axis based on the y position of the vertex
    // float snakeMovementDisplacement = waveAmplitude * sin(waveFrequency * aPosition.y + uMillis / 1000.0) + n * 1.;
    float snakeMovementDisplacement = n;
    modifiedPos.x += snakeMovementDisplacement;

    // Pass the modified position to the fragment shader
    fragPos = modifiedPos;
    

    // Apply the model-view and projection transformations from p5.js
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(modifiedPos, 1.0);
}
