export const vertexShaderSrc = `
    precision mediump float;
    attribute vec3 vertexPos;
    attribute vec3 vertexColor;
    varying vec3 vColor;
    uniform mat4 mWorld;

    void main() {
        vColor = vertexColor;
        gl_Position = mWorld * vec4(vertexPos, 1.0);
    }
`;