#version 300 es
precision mediump float;

in vec3 aPosition;
in vec2 aTexCoord;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;

out vec2 pos;


void main() {
    pos = aTexCoord;
    
    vec4 position = vec4(aPosition, 1.0);
    // mat2 rotation = mat2(
    //     0.7071, -0.7071,
    //     0.7071, 0.7071
    // );
    // vec2 rotatedPos = rotation * aPosition.xy;
    // position.xy = position.xy * 2. - 1.;
    // position.y = -position.y;

    
    gl_Position = uProjectionMatrix * uModelViewMatrix * position;
}