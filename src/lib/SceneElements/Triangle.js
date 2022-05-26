import { Primitive } from "./Primitive.js";

function distance(pt1, pt2) {
    return Math.sqrt((pt1[0] - pt2[0]) * (pt1[0] - pt2[0]) + (pt1[1] - pt2[1]) * (pt1[1] - pt2[1]));
}

export class Triangle extends Primitive {
    constructor(vertex1, vertex2, vertex3, color = new Float32Array([0.0, 0.0, 0.0])) {
        super();
        
        this.dims = vertex1.length;
        this.vertexSet = [vertex1, vertex2, vertex3];
        this.color = color;
        this.centroid = [];
        for (var i = 0; i < 3; i ++) {
            this.centroid[i] = (vertex1[i] + vertex2[i] + vertex3[i]) / 3;
        }

        this.area = 0.5 * distance(vertex1, vertex2) * distance(vertex2, vertex3);

        this.solidVertices = new Float32Array([vertex1[0], vertex1[1], vertex1[2], 
                vertex2[0], vertex2[1], vertex2[2], 
                vertex3[0], vertex3[1], vertex3[2]]);

        this.hollowVertices = new Float32Array([
            vertex1[0], vertex1[1], vertex1[2], 
            vertex2[0], vertex2[1], vertex2[2], 
            vertex2[0], vertex2[1], vertex2[2],
            vertex3[0], vertex3[1], vertex3[2],
            vertex3[0], vertex3[1], vertex3[2],
            vertex1[0], vertex1[1], vertex1[2]]);

        this.solidColors = new Float32Array([
            color[0], color[1], color[2], 
            color[0], color[1], color[2], 
            color[0], color[1], color[2]]);

        this.hollowColors = new Float32Array([
            color[0], color[1], color[2], 
            color[0], color[1], color[2],
            color[0], color[1], color[2],
            color[0], color[1], color[2],
            color[0], color[1], color[2], 
            color[0], color[1], color[2]]);

        // console.log(this.solidVertices);
        // console.log(this.solidColors);
    }

    drawFill(renderer, angle = 0) {
        // console.log("DrawFill", this.centroid);
        renderer.render(this.solidVertices, this.solidColors, this.dims, "triangles", angle, 
        [this.centroid[0], this.centroid[1], this.centroid[2] + 7]);
    }

    drawStroke(renderer) {
        renderer.render(this.hollowVertices, this.hollowColors, this.dims, "lines");
    }

    setSolidVertices(vertices) {
        this.solidVertices = vertices;
    }

    getSolidVertices(vertices) {
        return this.solidVertices;
    }

    getVertexSet() {
        return this.vertexSet;
    }

    setVertexSet(vset) {
        this.vertexSet = vset;
        console.log(this.vertexSet);
        console.log("Before", this.centroid);
        this.updateVertices();
        console.log("After", this.centroid);
    }

    updateVertices() {
        var vertex1 = this.vertexSet[0];
        var vertex2 = this.vertexSet[1]; 
        var vertex3 = this.vertexSet[2];
        this.centroid = [];
        for (var i = 0; i < 3; i ++) {
            this.centroid[i] = (vertex1[i] + vertex2[i] + vertex3[i]) / 3;
        }

        this.solidVertices = new Float32Array([vertex1[0], vertex1[1], vertex1[2], 
                vertex2[0], vertex2[1], vertex2[2], 
                vertex3[0], vertex3[1], vertex3[2]]);

        this.hollowVertices = new Float32Array([
            vertex1[0], vertex1[1], vertex1[2], 
            vertex2[0], vertex2[1], vertex2[2], 
            vertex2[0], vertex2[1], vertex2[2],
            vertex3[0], vertex3[1], vertex3[2],
            vertex3[0], vertex3[1], vertex3[2],
            vertex1[0], vertex1[1], vertex1[2]]);
    }

    getColor() {
        return this.color;
    }

    getCentroid() {
        return this.centroid;
    }

    getArea() {
        return this.area;
    }
}