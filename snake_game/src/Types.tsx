export class Point {

    constructor(
        public x: number,
        public y: number
    ) { }

    isInBoundary(this: Point, boundary: Boundary): boolean {
        return this.x >= boundary.left && this.x <= boundary.right
            && this.y >= boundary.top && this.y <= boundary.bottom;
    }
};

export class Boundary {
    constructor(
        public left: number,
        public top: number,
        public right: number,
        public bottom: number
    ) { }

    genarateRandomPoint(this: Boundary, xStep: number, yStep: number): Point {
        let width = this.right - this.left;
        let heiht = this.bottom - this.top;
        let xn = Math.floor(width / xStep);
        let yn = Math.floor(heiht / yStep);
        let x = Math.round(xn * Math.random());
        let y = Math.round(yn * Math.random());
        return new Point(xStep * x, yStep * y);
    }
};

export enum Direction {
    Left, Right,
    Top,  Bottom
}
