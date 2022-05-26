import ShaderManager from "./Shader/ShaderManager.mjs";

export class ProgramManager {
    constructor(gl) {
        this.gl = gl;

        this.vertexShaderManager = new ShaderManager(gl, gl.VERTEX_SHADER);
        this.fragmentShaderManager = new ShaderManager(gl, gl.FRAGMENT_SHADER);
    
        var vertexShader = this.vertexShaderManager.getShader();
        var fragmentShader = this.fragmentShaderManager.getShader();
        
        this.program = gl.createProgram();
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.error("Error linking program", gl.getProgramInfoLog(this.program));
            return;
        }
    
        gl.validateProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.VALIDATE_STATUS)) {
            console.log("Error validating the program", gl.getProgramInfoLog(this.program));
            return;
        }
    }

    getProgram() {
        return this.program;
    }

    getVertexShader() {
        return this.vertexShaderManager.getShader();
    }

    getFragmentShader() {
        return this.fragmentShaderManager.getShader();
    }

    getVertexShaderSrc() {
        return this.vertexShaderManager.getShaderSrc();
    }

    getFragmentShaderSrc() {
        return this.fragmentShaderManager.getShaderSrc();
    }

    getVertexVariable() {
        return this.vertexShaderManager.getVariableName();
    }

    getFragmentVariable() {
        return this.fragmentShaderManager.getVariableName();
    }

    useProgram() {
        this.gl.useProgram(this.program);
    }
}
