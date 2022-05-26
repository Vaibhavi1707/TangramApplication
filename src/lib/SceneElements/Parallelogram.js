import { Triangle } from "./Triangle.js";
import { Primitive } from "./Primitive.js";

function distance(pt1, pt2) {
    return Math.sqrt((pt1[0] - pt2[0]) * (pt1[0] - pt2[0]) + (pt1[1] - pt2[1]) * (pt1[1] - pt2[1]));
}

export class Parallelogram extends Primitive {
    constructor(vertex1, vertex2, vertex3, vertex4, color = new Float32Array([0.0, 0.0, 0.0])) {
        super();
        this.dims = vertex1.length;
        this.vertexSet = [vertex1, vertex2, vertex3, vertex4];
        this.color = color;

        var ht = Math.abs((vertex4[1] + vertex3[1] * ((vertex4[0] - vertex1[0]) / (vertex1[0] - vertex3[0]))) 
            / ((vertex4[0] - vertex3[0]) / (vertex1[0] - vertex3[0])) - vertex1[1]);
        this.area = distance(vertex3, vertex4) * ht;

        this.centroid = new Float32Array([
            (vertex1[0] + vertex3[0]) / 2, 
            (vertex1[1] + vertex3[1]) / 2,
            (vertex1[2] + vertex3[1]) / 2
        ]);

        this.upperTriangle = new Triangle(vertex1, vertex2, vertex3, color);
        this.lowerTriangle = new Triangle(vertex1, vertex3, vertex4, color);

        this.hollowVertices = new Float32Array([
            vertex1[0], vertex1[1], vertex1[2], 
            vertex2[0], vertex2[1], vertex2[2], 
            vertex2[0], vertex2[1], vertex2[2],
            vertex3[0], vertex3[1], vertex3[2],
            vertex3[0], vertex3[1], vertex3[2],
            vertex4[0], vertex4[1], vertex4[2],
            vertex4[0], vertex4[1], vertex4[2],
            vertex1[0], vertex1[1], vertex1[2]]);

        this.hollowColors = new Float32Array([
            color[0], color[1], color[2], 
            color[0], color[1], color[2],
            color[0], color[1], color[2],
            color[0], color[1], color[2],
            color[0], color[1], color[2], 
            color[0], color[1], color[2],
            color[0], color[1], color[2], 
            color[0], color[1], color[2]]);
    }

    drawFill(renderer, angle = 0) {
        this.upperTriangle.drawFill(renderer, angle);
        this.lowerTriangle.drawFill(renderer, angle);
    }

    drawStroke(renderer) {
        // console.log("Hollow colors", this.hollowColors)
        renderer.render(this.hollowVertices, this.hollowColors, this.dims, "lines");
    }

    setSolidVertices(vertices) {
        this.solidVertices = vertices;
    }

    getVertexSet() {
        return this.vertexSet;
    }

    setVertexSet(vset) {
        this.vertexSet = vset;
        // console.log(this.vertexSet);
        this.updateVertices();
    }

    updateVertices() {
        var vertex1 = this.vertexSet[0];
        var vertex2 = this.vertexSet[1]; 
        var vertex3 = this.vertexSet[2];
        var vertex4 = this.vertexSet[3];

        this.centroid = new Float32Array([
            (vertex1[0] + vertex3[0]) / 2, 
            (vertex1[1] + vertex3[1]) / 2,
            (vertex1[2] + vertex3[1]) / 2
        ]);

        this.upperTriangle = new Triangle(vertex1, vertex2, vertex3, this.color);
        this.lowerTriangle = new Triangle(vertex1, vertex3, vertex4, this.color);
    }

    getColor() {
        return this.color;
    }

    setColor(color) {
        this.color = color;

        this.hollowColors = new Float32Array([
            color[0], color[1], color[2], 
            color[0], color[1], color[2],
            color[0], color[1], color[2],
            color[0], color[1], color[2],
            color[0], color[1], color[2], 
            color[0], color[1], color[2],
            color[0], color[1], color[2], 
            color[0], color[1], color[2]]);
    }

    getCentroid() {
        return this.centroid;
    }

    getArea() {
        return this.centroid;
    }
}