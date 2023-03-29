import React from "react";
import App from "./App";
import { Boundary, Direction, Point } from "./Types";

type State = {
    parts: Array<Point>,
};

type Props = {
    initialParts: Array<Point>,
    boundary: Boundary,
    pixelWidth: number,
};

export default class Snake extends React.Component<Props, State> {

    private _tailDirection: Direction | undefined;
    private _headDirection: Direction | undefined;

    constructor(props: Props) {
        super(props);
        this.updateState(props);
    }

    componentWillReceiveProps(props: Props) {
        this.updateState(props);
    }

    private updateState(props: Props) {
        for (let p of props.initialParts) {
            if (!p.isInBoundary(props.boundary)) {
                return
            }
        }
        this.state = {
            ...this.state,
            parts: props.initialParts
        }
    }

    get headDirection(): Direction | undefined {
        return this._headDirection;
    }

    get headPosition(): Point {
        return this.state.parts[0];
    }

    get length(): number {
        return this.state.parts.length;
    }

    stepOne(direction: Direction): boolean {
        let parts = this.state.parts;
        let newhead = this.getPositionFront(parts[0], direction);
        let newParts = new Array<Point>(parts.length);

        // 判断新头是否出界
        let bound = this.props.boundary;
        newParts[0] = newhead;
        if (!newhead.isInBoundary(bound)) {
            return false;
        }

        // 判断撞自己
        for (let i = 1; i < newParts.length; i++) {
            const part = parts[i - 1];
            newParts[i] = part;
            if (newhead.x == part.x && newhead.y == part.y) {
                return false;
            }
        }

        // 设置蛇头的方向
        this._headDirection = direction;
        // 设置蛇尾的方向
        if (newParts.length > 1) {
            let last = newParts.length - 1;
            this._tailDirection = this.getDirection(newParts[last - 1], newParts[last]);
        } else {
            this._tailDirection = direction;
        }
        

        // 刷新
        this.setState({ parts: newParts });
        return true;
    }

    private getDirection(first: Point, second: Point): Direction | undefined {
        if (first.x == second.x) {
            if (first.y > second.y) {
                return Direction.Bottom;
            } else if (first.y < second.y) {
                return Direction.Top;
            } else {
                return undefined;
            }
        }
        if (first.y == second.y) {
            if (first.x > second.x) {
                return Direction.Right;
            } else if (first.x < second.x) {
                return Direction.Left;
            } else {
                return undefined;
            }
        }
    }

    private getPositionBehind(tail: Point, direction: Direction): Point {
        let pixel = this.props.pixelWidth;
        switch (direction) {
            case Direction.Left:
                return new Point(tail.x + pixel, tail.y);
            case Direction.Right:
                return new Point(tail.x - pixel, tail.y);
            case Direction.Top:
                return new Point(tail.x, tail.y + pixel);
            case Direction.Bottom:
                return new Point(tail.x, tail.y - pixel);
        }
    }

    private getPositionFront(point: Point, direction: Direction): Point {
        let pixelWidth = this.props.pixelWidth;
        switch (direction) {
            case Direction.Left:
                return new Point(point.x - pixelWidth, point.y);
            case Direction.Right:
                return new Point(point.x + pixelWidth, point.y);
            case Direction.Top:
                return new Point(point.x, point.y - pixelWidth);
            case Direction.Bottom:
                return new Point(point.x, point.y + pixelWidth);
        }
    }

    grow(): boolean {
        let oldParts = this.state.parts;
        let oldTail = oldParts[oldParts.length - 1];
        let newTail = this._tailDirection != undefined ?
            this.getPositionBehind(oldTail, this._tailDirection) :
            new Point(0, 0);

        // 判断新尾是否出界
        let bound = this.props.boundary;
        if (!newTail.isInBoundary(bound)) {
            return false;
        }
        // 判断新尾是否撞自己
        oldParts.forEach(p => {
            if (p.x == newTail.x && p.y == newTail.y) {
                return false;
            }
        });
        let parts = [...oldParts, newTail];
        this.setState({ parts });
        return true;
    }

    render() {
        let parts = this.state.parts;
        let pixelWidth = this.props.pixelWidth;
        return (
            <div className="Snake"
                style={{
                    //left: parts[0].x,
                    //top: parts[0].y,
                }}>
                {parts.map(part => (
                    <div style={{
                        width: pixelWidth,
                        height: pixelWidth,
                        left: part.x,
                        top: part.y,
                        backgroundColor: "black",
                        borderWidth: 1,
                        borderColor: App.bgColor,
                        borderStyle: "solid",
                        position: "absolute"
                    }} />
                ))}
            </div>
        );
    }
}