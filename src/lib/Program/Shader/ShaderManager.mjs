import { fragmentShaderSrc } from "./FragmentShaderSrc.mjs";
import { vertexShaderSrc } from "./VertexShaderSrc.mjs";

export default class ShaderManager {
    constructor(gl, shaderType) {
        this.type = "fragment";
        this.shaderSrc = fragmentShaderSrc;
        this.varName = "vertexColor";

        // console.log(gl.VERTEX_SHADER, shaderType, gl.FRAGMENT_SHADER);

        if (shaderType === gl.VERTEX_SHADER) {
            // console.log("Vertex Shader");
            this.shaderSrc = vertexShaderSrc;
            this.shaderType = "vertex";
            this.varName = "vertexPos";
        }

        this.shader = gl.createShader(shaderType)
        gl.shaderSource(this.shader, this.shaderSrc);
        gl.compileShader(this.shader);

        if (!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS)) {
            console.error("Error compiling " + this.type + " shader", gl.getShaderInfoLog(this.shader));
        }
    }

    getShader() {
        return this.shader;
    }

    getShaderSrc() {
        return this.type + "\n" + this.shaderSrc;
    }

    getVariableName() {
        return this.varName;
    }
}