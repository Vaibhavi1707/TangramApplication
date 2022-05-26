export class BufferManager {
    constructor(gl, vertices) {
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    }

    getBuffer() {
        return this.buffer;
    }
}