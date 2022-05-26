import { ProgramManager } from "./Program/ProgramManager.mjs";
import { BufferManager } from "./BufferManager.mjs";

const VERTEX = "vertex";
const FRAGMENT = "fragment";

export class Renderer {
    constructor(canvasElement) {
        this.width, this.height = canvasElement.width, canvasElement.height;
        this.gl = canvasElement.getContext('webgl');

        if (!this.gl) {
            console.log("WebGL not supported..falling back on experimental");
            gl = canvas.getContext('experimental-webgl');
        }
    
        if (!this.gl) {
            alert("Your browser doesn't support webgl");
        }

        this.programManager = new ProgramManager(this.gl);
        this.program = this.programManager.getProgram();
    }

    clearCanvas(color) {
        this.gl.clearColor(color[0], color[1], color[2], color[3]);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    enableAttributeArray(attrType, coordinateDims) {
        // var 

        if (attrType === FRAGMENT) {
            // console.log(attrType);
            var shaderVarName = this.programManager.getFragmentVariable();
        } else {
            var shaderVarName = this.programManager.getVertexVariable();
        }

        // console.log(shaderVarName);

        var attrLocation = this.gl.getAttribLocation(this.program, shaderVarName);

        this.gl.vertexAttribPointer(
            attrLocation,
            coordinateDims, // No. of values in each vertex
            this.gl.FLOAT,
            this.gl.FALSE,
            coordinateDims * Float32Array.BYTES_PER_ELEMENT, // Size of individual element
            0 // offset from the begining
        );

        this.gl.enableVertexAttribArray(attrLocation);
    }

    enableMatrices() {
        var matWorldUniLoc = this.gl.getUniformLocation(this.program, 'mWorld');
        
        var matWorld = new Float32Array(16);
        var matView = new Float32Array(16);
        var matProj = new Float32Array(16);
        
        glMatrix.mat4.identity(matWorld);

        this.gl.uniformMatrix4fv(matWorldUniLoc, this.gl.FALSE, matWorld);

        return [matWorld, matWorldUniLoc];
    }

    render(vertices, colors, coordinateDim, shape, angle = 0, centroid = [0, 0, 1]) {
        var vertexBufferManager = new BufferManager(this.gl, vertices);
        this.enableAttributeArray(VERTEX, coordinateDim);

        var colorBuffer = new BufferManager(this.gl, colors).getBuffer();
        this.enableAttributeArray(FRAGMENT, coordinateDim);

        this.programManager.useProgram();
        // var pos = [0, 0, 1];

        var matInfo = this.enableMatrices();

        var matWorld = matInfo[0];
        var matWorldUniLoc = matInfo[1];

        // // console.log(matWorld, matWorldUniLoc);
        // glMatrix.mat4.fromRotation(matWorld, angle, centroid);
        // this.gl.uniformMatrix4fv(matWorldUniLoc, this.gl.FALSE, matWorld);

        var shapes = new Map([
            ["points", this.gl.POINTS],
            ["lines", this.gl.LINES],
            ["triangles", this.gl.TRIANGLES]
        ]);
        var noOfPoints = vertices.length / coordinateDim;
        
        // console.log(vertices.length);
        // console.log(noOfPoints);
        
        this.gl.drawArrays(shapes.get(shape), 0, noOfPoints);

        return matWorld, matWorldUniLoc;
    }
}