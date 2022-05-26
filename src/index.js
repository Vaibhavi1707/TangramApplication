import { Renderer } from "./lib/Renderer.js";
import { Triangle } from "./lib/SceneElements/Triangle.js";
import { Parallelogram } from "./lib/SceneElements/Parallelogram.js";
import { Scene } from "./lib/SceneElements/Scene.js";

// Colors
const bgWhite = scalePoints(255, 255, 255, [242, 245, 255]);
const orange = scalePoints(255, 255, 255, [249,153,45]);
const turquoise = scalePoints(255, 255, 255, [91,248,253]);
const blue = scalePoints(255, 255, 255, [74,134,232]);
const yellow = scalePoints(255, 255, 255, [251,239,60]);
const green = scalePoints(255, 255, 255, [115,232,49]);
const pink = scalePoints(255, 255, 255, [235,121,252]);
const red = scalePoints(255, 255, 255, [243,68,35]);
const borderGreen = scalePoints(255, 255, 255, [0, 255, 0]);
const borderRed = scalePoints(255, 255, 255, [255, 0, 0]);

const upleftVert = [-640, 200, 0];
const uprightVert = [-240, 200, 0]; 
const centerVert = [-440, 0, 0];
const lowRightVert = [-240, -200, 0];
const lowLeftVert = [-640, -200, 0];
const lowMidVert = [-440, -200, 0];
const leftMidVert = [-640, 0, 0];

const refUpLeft = [-870, 500, 0];
const refUpRight = [-30, 500, 0];
const refLowRight = [-30, -500, 0];
const refLowLeft = [-870, -500, 0];

const upperLeftMidPt = [-540, 100, 0];
const lowerLeftMidPt = [-540, -100, 0];
const lowerRightMidPt = [-340, -100, 0];

var primitiveInd;

function scalePoints(maxHt, maxWt, maxDt = 1, point) {
    return new Float32Array([point[0] / maxWt, point[1] / maxHt, point[2] / maxDt]);
}

function prepareCanvas(canvas) {
    var preppedRenderer = new Renderer(canvas);
    preppedRenderer.clearCanvas([0.95, 0.96, 1.0, 1.0]);
    return preppedRenderer;
}

function reflectThroughYAxis(primitives, maxWidth) {
    var reflectedPrimitives = [];

    primitives.forEach(primitive => {
        if (primitive.getVertexSet().length == 3) {
            var vertex1 = primitive.getVertexSet()[0];
            var vertex2 = primitive.getVertexSet()[1];
            var vertex3 = primitive.getVertexSet()[2];

            vertex1[0] = 1.0 + vertex1[0];
            vertex2[0] = 1.0 + vertex2[0];
            vertex3[0] = 1.0 + vertex3[0];

            reflectedPrimitives.push(new Triangle(vertex1, vertex2, vertex3, primitive.getColor()));
        }
        else if (primitive.getVertexSet().length == 4) {
            var vertex1 = primitive.getVertexSet()[0];
            var vertex2 = primitive.getVertexSet()[1];
            var vertex3 = primitive.getVertexSet()[2];
            var vertex4 = primitive.getVertexSet()[3];

            vertex1[0] = 1.0 + vertex1[0];
            vertex2[0] = 1.0 + vertex2[0]; 
            vertex3[0] = 1.0 + vertex3[0];
            vertex4[0] = 1.0 + vertex4[0];

            reflectedPrimitives.push(new Parallelogram(vertex1, vertex2, vertex3, vertex4, primitive.getColor()));
        }
    });

    return reflectedPrimitives
}

function randomizePositions(scene) {
    scene.getSolidPrimitives().forEach(primitive => {
        var sign = Math.floor(Math.random() * 2);
        var posToUpdate = Math.floor(Math.random() * 2);

        var valToUpdate = Math.random() * 0.05;

        var vertexSet = primitive.getVertexSet();
        var newVertices = [];

        for (let i = 0; i < vertexSet.length; i ++) {
            vertexSet[i][posToUpdate] = vertexSet[i][posToUpdate] + sign * valToUpdate;
            newVertices.push(vertexSet[i]);
        }
        primitive.setVertexSet(newVertices);
    });
}

function findDistance(pt1, pt2) {
    return (pt1[0] - pt2[0]) * (pt1[0] - pt2[0]) + (pt1[1] - pt2[1]) * (pt1[1] - pt2[1]);
}

function getNearestPrimitive(mouseX, mouseY, primitives) {
    var minDist = 10000;
    var nearestPrimitive = 0;
    
    for (let i = 0; i < primitives.length; i ++) {
        var dist = findDistance(primitives[i].getCentroid(), [mouseX, mouseY]);
        console.log("Distance", dist);
        if (minDist > dist) {
            nearestPrimitive = i;
            minDist = dist;
        }
    }

    console.log(nearestPrimitive);
    return nearestPrimitive;
}

function processMode(mode, scene, reflectedScene, canvasRenderer) {
    console.log("Mode :", mode);
    
    if (mode == 0) {
        console.log("0");
        canvasRenderer.clearCanvas(bgWhite);
        scene.drawHollow(canvasRenderer);
        scene.drawSolid(canvasRenderer);

        reflectedScene.drawHollow(canvasRenderer);
        randomizePositions(reflectedScene); 
        reflectedScene.drawSolid(canvasRenderer);
    }
    else if (mode == 1) {
        console.log("Mode 1");
        canvasRenderer.clearCanvas(bgWhite);
        scene.drawHollow(canvasRenderer);
        scene.drawSolid(canvasRenderer);

        reflectedScene.drawHollow(canvasRenderer);
        reflectedScene.drawSolid(canvasRenderer);
        document.getElementById('screen').addEventListener("click", (event) => {
            var mouseX = (event.pageX - 450) / 450;
            var mouseY = -(event.pageY - 450) / 450;
            primitiveInd = getNearestPrimitive(mouseX, mouseY, reflectedScene.getSolidPrimitives()); 
            return;
        }, true);

        console.log("PrimitiveInd", primitiveInd);
    }
    else if (mode == 2) {
        console.log("Mode 2");
        canvasRenderer.clearCanvas(bgWhite);
        scene.drawHollow(canvasRenderer);
        scene.drawSolid(canvasRenderer);

        reflectedScene.drawHollow(canvasRenderer);
        reflectedScene.drawSolid(canvasRenderer);
    }
    else {
        console.log("Mode 3");
        canvasRenderer.clearCanvas(bgWhite);
        scene.drawHollow(canvasRenderer);
        scene.drawSolid(canvasRenderer);

        reflectedScene.drawHollow(canvasRenderer);
    }
}

function dot(k, vec) {
    var res = [];

    console.log(vec);
    for (var i = 0; i < vec.length; i ++) {
        res.push(k * vec[i]);
    }
    console.log(res);
    return res;
}

function add(list1, list2, wt = 1) {
    var sumList = [];
    list2 = dot(wt, list2);
    for (let i = 0; i < list1.length; i ++) {
        sumList.push(list1[i] + list2[i]);
    }
    console.log(sumList)
    return sumList;
}

function performTranslation(fixed, movable, movDir, renderer) {
    console.log("In tranformations method");
    renderer.clearCanvas(bgWhite);
    fixed.drawHollow(renderer);
    fixed.drawSolid(renderer);

    movable.drawHollow(renderer);

    console.log(primitiveInd);
    var primitives = movable.getSolidPrimitives();
    var newVertices = [];
    for (let i = 0; i < primitives.length; i ++) {
        if (i == primitiveInd) {
            var vertices = primitives[i].getVertexSet();
            
            console.log(vertices);
            for (let j = 0; j < vertices.length; j ++) {
                newVertices.push(add(vertices[j], movDir));
            }
            console.log(newVertices);
            primitives[i].setVertexSet(newVertices);
        }

        primitives[i].drawFill(renderer);
    }
    // movable.drawSolid(renderer);
}

function rotate(vertex, angle, centre, centre2 = [0, 0, 0]) {
    // vertex = add(vertex, centre);
    var x = vertex[0] * Math.cos(angle) - vertex[1] * Math.sin(angle) - centre[0] - centre2[0];
    var y = vertex[0] * Math.sin(angle) + vertex[1] * Math.cos(angle) - centre[1] - centre2[1];
    var z = vertex[2] - centre[2] - centre2[2];
    return [x, y, z];
}

function performRotation(fixed, movable, angle, renderer) {
    console.log("In rotations method");
    renderer.clearCanvas(bgWhite);
    fixed.drawHollow(renderer);
    fixed.drawSolid(renderer);

    movable.drawHollow(renderer);

    console.log(primitiveInd);
    var primitives = movable.getSolidPrimitives();
    var newVertices = [];
    for (let i = 0; i < primitives.length; i ++) {
        if (i == primitiveInd) {
            var vertices = primitives[i].getVertexSet();
            
            console.log(vertices);
            for (let j = 0; j < vertices.length; j ++) {
                newVertices.push(rotate(vertices[j], angle, primitives[i].getCentroid()));
            }
            console.log(newVertices);
            primitives[i].setVertexSet(newVertices);
        } 
    } 

    movable.drawSolid(renderer);
}

function scale(arr1, n) {
    return [arr1[0] * n, arr1[1] * n, arr1[2] * n];
}

function scaleTangram(fixed, movable, zoomVal, renderer) {
    console.log("In tranformations method");
    renderer.clearCanvas(bgWhite);
    fixed.drawHollow(renderer);
    fixed.drawSolid(renderer);

    movable.drawHollow(renderer);

    console.log(primitiveInd);
    var primitives = movable.getSolidPrimitives();
    
    for (let i = 0; i < primitives.length; i ++) {
        var vertices = primitives[i].getVertexSet();
        var newVertices = [];
        console.log(vertices);
        for (let j = 0; j < vertices.length; j ++) {
            newVertices.push(scale(vertices[j], zoomVal));
        }
        console.log(newVertices);
        primitives[i].setVertexSet(newVertices);
    }

    movable.drawSolid(renderer);
}

function translateTangram(fixed, movable, movDir, renderer) {
    console.log("In tranformations method");
    renderer.clearCanvas(bgWhite);
    fixed.drawHollow(renderer);
    fixed.drawSolid(renderer);

    movable.drawHollow(renderer);

    console.log(primitiveInd);
    var primitives = movable.getSolidPrimitives();
    
    for (let i = 0; i < primitives.length; i ++) {
        var vertices = primitives[i].getVertexSet();
        var newVertices = [];
        console.log(vertices);
        for (let j = 0; j < vertices.length; j ++) {
            newVertices.push(add(vertices[j], movDir));
        }
        console.log(newVertices);
        primitives[i].setVertexSet(newVertices);
    }

    movable.drawSolid(renderer);
}

function rotateTangram(fixed, movable, angle, renderer) {
    renderer.clearCanvas(bgWhite);
    fixed.drawHollow(renderer);
    fixed.drawSolid(renderer);

    movable.drawHollow(renderer);

    console.log(primitiveInd);
    var primitives = movable.getSolidPrimitives();

    var centroid = [0, 0, 0];
    var totalArea = () => {
        var sum = 0;
        primitives.forEach(primitive => {
            sum += primitive.getArea();
        });
        return sum;
    };
    primitives.forEach(primitive => {
        centroid = add(centroid, primitive.getCentroid(), totalArea()); 
    });
    
    for (let i = 0; i < primitives.length; i ++) {
        var vertices = primitives[i].getVertexSet();
        var newVertices = [];
        console.log(vertices);
        for (let j = 0; j < vertices.length; j ++) {
            newVertices.push(rotate(vertices[j], angle, centroid));
        }
        console.log(newVertices);
        primitives[i].setVertexSet(newVertices);
    } 

    movable.drawSolid(renderer);
}

function main() {
    var canvas = document.getElementById("screen");
    canvas.width = 900;
    canvas.height = 900;
    var canvasRenderer  = prepareCanvas(canvas);
    // console.log(1000, 1000);
    var mode = -1;

    var orangeTriangle = new Triangle(
        scalePoints(canvas.height, canvas.width, 1, upleftVert),
        scalePoints(canvas.height, canvas.width, 1, uprightVert),
        scalePoints(canvas.height, canvas.width, 1, centerVert),
        orange
    );

    var blueTriangle = new Triangle(
        scalePoints(canvas.height, canvas.width, 1, uprightVert),
        scalePoints(canvas.height, canvas.width, 1, lowRightVert),
        scalePoints(canvas.height, canvas.width, 1, centerVert),
        blue
    );

    var redSquare = new Parallelogram(
        scalePoints(canvas.height, canvas.width, 1, centerVert),
        scalePoints(canvas.height, canvas.width, 1, lowerRightMidPt),
        scalePoints(canvas.height, canvas.width, 1, lowMidVert),
        scalePoints(canvas.height, canvas.width, 1, lowerLeftMidPt),
        red
    );

    var greenTriangle = new Triangle(
        scalePoints(canvas.height, canvas.width, 1, lowLeftVert),
        scalePoints(canvas.height, canvas.width, 1, lowMidVert),
        scalePoints(canvas.height, canvas.width, 1, leftMidVert),
        green
    );

    var yellowTriangle = new Triangle(
        scalePoints(canvas.height, canvas.width, 1, lowRightVert),
        scalePoints(canvas.height, canvas.width, 1, lowerRightMidPt),
        scalePoints(canvas.height, canvas.width, 1, lowMidVert),
        yellow
    );
    

    var turquoiseTriangle = new Triangle(
        scalePoints(canvas.height, canvas.width, 1, lowerLeftMidPt),
        scalePoints(canvas.height, canvas.width, 1, upperLeftMidPt),
        scalePoints(canvas.height, canvas.width, 1, centerVert),
        turquoise
    );

    var pinkParallelogram = new Parallelogram(
        scalePoints(canvas.height, canvas.width, 1, upleftVert),
        scalePoints(canvas.height, canvas.width, 1, upperLeftMidPt),
        scalePoints(canvas.height, canvas.width, 1, lowerLeftMidPt),
        scalePoints(canvas.height, canvas.width, 1, leftMidVert),
        pink
    );

    var referenceBorder = new Parallelogram(
        scalePoints(canvas.height, canvas.width, 1, refUpLeft),
        scalePoints(canvas.height, canvas.width, 1, refUpRight),
        scalePoints(canvas.height, canvas.width, 1, refLowRight),
        scalePoints(canvas.height, canvas.width, 1, refLowLeft),
        borderGreen
    );

    var solidPrimitives = [orangeTriangle, blueTriangle, greenTriangle,
        yellowTriangle, turquoiseTriangle, redSquare, pinkParallelogram];

    var hollowPrimitives = [referenceBorder];

    var scene = new Scene(solidPrimitives, hollowPrimitives);
    scene.drawHollow(canvasRenderer);
    scene.drawSolid(canvasRenderer);

    var reflectedSolids = reflectThroughYAxis(solidPrimitives, canvas.width);
    var reflectedHollows = reflectThroughYAxis(hollowPrimitives, canvas.width);
    reflectedHollows[0].setColor(borderRed);
    var reflectedScene = new Scene(reflectedSolids, reflectedHollows);

    
    // processMode(mode, scene, canvas.width, canvas.height, canvasRenderer);
    // console.log(canvas);
    document.addEventListener("keydown", function (event) {
        console.log(event.key);
        if (event.key == "Shift") {
            
        }
        else if (event.key == "ArrowUp") {
            if (mode == 2) {
                translateTangram(scene, reflectedScene, [0, 0.01, 0], canvasRenderer);
            }
            else {
            console.log("Arrow Up");
                performTranslation(scene, reflectedScene, [0, 0.01, 0], canvasRenderer);
            }
        }
        else if (event.key == "ArrowDown") {
            if (mode == 2) {
                translateTangram(scene, reflectedScene, [0, -0.01, 0], canvasRenderer);
            }
            else {
                performTranslation(scene, reflectedScene, [0, -0.01, 0], canvasRenderer);
            }
        }
        else if (event.key == "ArrowLeft") {
            if (mode == 2) {
                translateTangram(scene, reflectedScene, [-0.01, 0, 0], canvasRenderer);
            }
            else {
                performTranslation(scene, reflectedScene, [-0.01, 0, 0], canvasRenderer);
            }
        }
        else if (event.key == "ArrowRight") {
            if (mode == 2) {
                translateTangram(scene, reflectedScene, [0.01, 0, 0], canvasRenderer);
            }
            else {
                performTranslation(scene, reflectedScene, [0.01, 0, 0], canvasRenderer);
            }
        } 
        else if (event.key == "(") {
            if (mode == 2) {
                rotateTangram(scene, reflectedScene, -Math.PI / 180, canvasRenderer);
            }
            else {
                performRotation(scene, reflectedScene, -Math.PI / 180, canvasRenderer);
            }
        }
        else if (event.key == ")") {
            // Anti Clockwise Direction
            if (mode == 2) {
                rotateTangram(scene, reflectedScene, Math.PI / 180, canvasRenderer);
            }
            else {
                performRotation(scene, reflectedScene, Math.PI / 180, canvasRenderer);
            }
        }
        else if (mode == 2 && event.key == '+') {
            scaleTangram(scene, reflectedScene, 1.2, canvasRenderer);
        }
        else if (mode == 2 && event.key == '-') {
            scaleTangram(scene, reflectedScene, 1 / 1.2, canvasRenderer);
        }
        else {
            mode = (mode + 1) % 4;
            var primitiveInd = processMode(mode, scene, reflectedScene, canvasRenderer);
            // console.log(primitive);
        }
    }, true);  

    // var reflectedSolids = reflectThroughYAxis(solidPrimitives, canvas.width);
    // var reflectedHollows = reflectThroughYAxis(hollowPrimitives, canvas.width);
    // reflectedHollows[0].setColor(borderRed);

    // var reflectedScene = new Scene(reflectedSolids, reflectedHollows);
    // reflectedScene.drawHollow(canvasRenderer);
    // reflectedScene.drawSolid(canvasRenderer);
}

main();
