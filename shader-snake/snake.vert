#version 300 es
precision mediump float;

#define PI 3.1415926538

in vec3 aPosition;
in vec2 aTexCoord;
in vec3 aNormal;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;
uniform float uNoiseMultiplier;

// --------------------- Cylinder to sphere ---------------------
uniform float uMorphFactor; // Morphing factor (0 = cylinder, 1 = torus)
// uniform float uMajorRadius; // Major radius (R)
// uniform float uMinorRadius; // Minor radius (r)

// -------------------------------------------------------------

uniform float uMillis;
in vec2 st;

out vec2 vTexPos;
out vec3 vFragPos;
out vec3 vPos;
out vec3 vNormal;

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

float halfCircle2(float x, float r)
{
    return sqrt(r * r - x * x);
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

// psrdnoise (c) Stefan Gustavson and Ian McEwan,
// ver. 2021-12-02, published under the MIT license:
// https://github.com/stegu/psrdnoise/

vec4 permute(vec4 i) {
     vec4 im = mod(i, 289.0);
     return mod(((im*34.0)+10.0)*im, 289.0);
}

float psrdnoise(vec3 x, vec3 period, float alpha, out vec3 gradient)
{
  const mat3 M = mat3(0.0, 1.0, 1.0, 1.0, 0.0, 1.0,  1.0, 1.0, 0.0);
  const mat3 Mi = mat3(-0.5, 0.5, 0.5, 0.5,-0.5, 0.5, 0.5, 0.5,-0.5);
  vec3 uvw = M * x;
  vec3 i0 = floor(uvw), f0 = fract(uvw);
  vec3 g_ = step(f0.xyx, f0.yzz), l_ = 1.0 - g_;
  vec3 g = vec3(l_.z, g_.xy), l = vec3(l_.xy, g_.z);
  vec3 o1 = min( g, l ), o2 = max( g, l );
  vec3 i1 = i0 + o1, i2 = i0 + o2, i3 = i0 + vec3(1.0);
  vec3 v0 = Mi * i0, v1 = Mi * i1, v2 = Mi * i2, v3 = Mi * i3;
  vec3 x0 = x - v0, x1 = x - v1, x2 = x - v2, x3 = x - v3;
  if(any(greaterThan(period, vec3(0.0)))) {
    vec4 vx = vec4(v0.x, v1.x, v2.x, v3.x);
    vec4 vy = vec4(v0.y, v1.y, v2.y, v3.y);
    vec4 vz = vec4(v0.z, v1.z, v2.z, v3.z);
	if(period.x > 0.0) vx = mod(vx, period.x);
	if(period.y > 0.0) vy = mod(vy, period.y);
	if(period.z > 0.0) vz = mod(vz, period.z);
	i0 = floor(M * vec3(vx.x, vy.x, vz.x) + 0.5);
	i1 = floor(M * vec3(vx.y, vy.y, vz.y) + 0.5);
	i2 = floor(M * vec3(vx.z, vy.z, vz.z) + 0.5);
	i3 = floor(M * vec3(vx.w, vy.w, vz.w) + 0.5);
  }
  vec4 hash = permute( permute( permute( 
              vec4(i0.z, i1.z, i2.z, i3.z ))
            + vec4(i0.y, i1.y, i2.y, i3.y ))
            + vec4(i0.x, i1.x, i2.x, i3.x ));
  vec4 theta = hash * 3.883222077;
  vec4 sz = hash * -0.006920415 + 0.996539792;
  vec4 psi = hash * 0.108705628;
  vec4 Ct = cos(theta), St = sin(theta);
  vec4 sz_prime = sqrt( 1.0 - sz*sz );
  vec4 gx, gy, gz;
  if(alpha != 0.0) {
    vec4 px = Ct * sz_prime, py = St * sz_prime, pz = sz;
    vec4 Sp = sin(psi), Cp = cos(psi), Ctp = St*Sp - Ct*Cp;
    vec4 qx = mix( Ctp*St, Sp, sz), qy = mix(-Ctp*Ct, Cp, sz);
    vec4 qz = -(py*Cp + px*Sp);
    vec4 Sa = vec4(sin(alpha)), Ca = vec4(cos(alpha));
    gx = Ca*px + Sa*qx; gy = Ca*py + Sa*qy; gz = Ca*pz + Sa*qz;
  }
  else {
    gx = Ct * sz_prime; gy = St * sz_prime; gz = sz;  
  }
  vec3 g0 = vec3(gx.x, gy.x, gz.x), g1 = vec3(gx.y, gy.y, gz.y);
  vec3 g2 = vec3(gx.z, gy.z, gz.z), g3 = vec3(gx.w, gy.w, gz.w);
  vec4 w = 0.5-vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3));
  w = max(w, 0.0); vec4 w2 = w * w, w3 = w2 * w;
  vec4 gdotx = vec4(dot(g0,x0), dot(g1,x1), dot(g2,x2), dot(g3,x3));
  float n = dot(w3, gdotx);
  vec4 dw = -6.0 * w2 * gdotx;
  vec3 dn0 = w3.x * g0 + dw.x * x0;
  vec3 dn1 = w3.y * g1 + dw.y * x1;
  vec3 dn2 = w3.z * g2 + dw.z * x2;
  vec3 dn3 = w3.w * g3 + dw.w * x3;
  gradient = 39.5 * (dn0 + dn1 + dn2 + dn3);
  return 39.5 * n;
}


float map(float x, float a, float b, float c, float d) {
    return c + (x - a) * (d - c) / (b - a);
}

float mapOrKill(float x, float a, float b, float c, float d) {
    if (x < a || x > b) {
        return 0.0;
    }
    return c + (x - a) * (d - c) / (b - a);
}

void main() {
    vTexPos = aTexCoord;
    vNormal = aNormal;
    vPos = aPosition;
    float vNoiseMultiplier = uNoiseMultiplier;
    
    vec3 modifiedPos = aPosition;
    
    // --------------------- Snake ---------------------
    // Perlin noise for snake movement
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
    vFragPos = modifiedPos;
    
    // --------------------- Periodic effect ---------------------

    // 10-minute interval in seconds
    float intervalSec = 600.0;
    
    // 10-second interval for testing
    // float intervalSec = 10.0;

    float secOffset = 585.0;
    float millisOffset = secOffset * 1000.0;

    // Interval in millis
    float interval = intervalSec * 1000.0;
    
    // Normalize time to [0, 1] for the 10-minute period
    float lIntervalTime = mod(uMillis + millisOffset, interval) / interval;
    
    float lEdge = 0.985;
    
    float lEffectOn = step(lEdge, lIntervalTime);

    // Not sure what happens when input is 0
    float lMapped = mapOrKill(lIntervalTime * lEffectOn, lEdge, 1.0, 0.0, PI);
    
    float lBump = sin(lMapped) * lEffectOn;
    
    float lClippedBump = clamp(lBump * 8., 0.0, 1.0);
    

    // --------------------- Cylinder to sphere ---------------------
    vec3 lSpherePos = aPosition;

    lSpherePos.x = halfCircle2(lSpherePos.y, 0.5) * lSpherePos.x * 10.;
    lSpherePos.z = halfCircle2(lSpherePos.y, 0.5) * lSpherePos.z * 10.;
    
    // TODO: Reset this when finished dev
    vFragPos = mix(vFragPos, lSpherePos, lClippedBump);
    
    vNoiseMultiplier *= 1.;
    
    // --------------------- Perlin noise dismorphia ---------------------
    float lTime = uMillis / 1000.0;
    
    float noiseMultiplierSnake = clamp((abs(vTexPos.x -  0.5) - 0.3) * 3.0, 0.0, 1.0) * vNoiseMultiplier;
    float noiseMultiplierBall = clamp((abs(vTexPos.x -  0.00) - 0.00) * 3.0, 0.0, 1.0) * vNoiseMultiplier * 3.;
    if (t == 0.0 || t == 1.0) {
        noiseMultiplierSnake = 0.0;
    }
    
    float noiseMultiplier = mix(noiseMultiplierSnake, noiseMultiplierBall, lClippedBump);
    


    vec3 lG = vec3(0.0);
    float noise = psrdnoise(vFragPos * 3., vec3(0.0), lTime, lG);
    float displacement = noise * noiseMultiplier;
    vFragPos = vFragPos + vNormal * displacement;
    
    
    
    // -------------------------------------------------------------------
    
    // --------------------- Spin effect ---------------------
     // Calculate rotation angle based on time
    float angle = uMillis / 1000.0;

    // Rotation matrix for the X-Y plane (spinning around Z-axis)
    float cosA = cos(angle);
    float sinA = sin(angle);
    mat2 rotation = mat2(
        cosA, -sinA,
        sinA, cosA
    );

    // Apply rotation to the X and Y coordinates of the position
    vec2 rotatedPos = rotation * vFragPos.xz;
    vFragPos.xz = mix(vFragPos.xz, rotatedPos, lClippedBump);
    


    // Apply the model-view and projection transformations from p5.js
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(vFragPos, 1.0);
}
