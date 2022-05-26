export class Scene {
    constructor(solidPrimitives, hollowPrimitives = []) {
        this.solidPrimitives = solidPrimitives;
        this.hollowPrimitives = hollowPrimitives;
        // console.log(this.solidPrimitives);
    }

    drawSolid(renderer) {
        for (var i = 0; i < this.solidPrimitives.length; i ++) {
            // console.log("Primitive loop");
            this.solidPrimitives[i].drawFill(renderer);
        }
    }

    drawHollow(renderer) {
        for (var i = 0; i < this.hollowPrimitives.length; i ++) {
            this.hollowPrimitives[i].drawStroke(renderer);
        }
    }

    getSolidPrimitives() {
        return this.solidPrimitives;
    }

    getHollowPrimitives() {
        return this.hollowPrimitives;
    }
}