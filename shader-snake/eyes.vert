#version 300 es
precision mediump float;

in vec3 aPosition;
in vec2 aTexCoord;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;

uniform float uMillis;
uniform float uSphereRadius;
uniform float uCylinderRadius;
uniform float uEyeYOffset;

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

void main() {
    texPos = aTexCoord;
    
    vec3 modifiedPos = aPosition;

    // Normalize the position to be within the range of 0.0 to 1.0
    float t = (aPosition.y + 0.5) / len;  // Normalize y from 0 to 1

    // Apply the displacement along the x-axis based on the y position of the vertex
    float snakeMovementDisplacement = waveAmplitude * uCylinderRadius / uSphereRadius * sin(waveFrequency * (0.5 - uEyeYOffset * 0.002) + uMillis / 1000.0);
    modifiedPos.x += snakeMovementDisplacement;

    // Pass the modified position to the fragment shader
    fragPos = modifiedPos;
    

    // Apply the model-view and projection transformations from p5.js
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(modifiedPos, 1.0);
}
