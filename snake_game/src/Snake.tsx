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

    constructor(props: Props) {
        super(props);
        this.setupState(props);
    }

    componentWillReceiveProps(props: Props) {
        this.setupState(props);
    }

    private setupState(props: Props) {
        for (let p of props.initialParts) {
            if (!p.isInBoundary(props.boundary)) {
                return
            }
        }
        this.state = {
            parts: props.initialParts
        }
    }

    get headPosition(): Point {
        return this.state.parts[0];
    }

    stepOne(direction: Direction): boolean {
        let parts = this.state.parts;
        let newhead = this.copy(parts[0], direction);
        let newParts = new Array<Point>(parts.length);

        // �ж���ͷ�Ƿ����
        let bound = this.props.boundary;
        if (!newhead.isInBoundary(bound)) {
            return false;
        } else {
            newParts[0] = newhead;
        }

        // �ж�ײ�Լ�
        for (let i = 1; i < newParts.length; i++) {
            const part = parts[i - 1];
            if (newhead.x == part.x && newhead.y == part.y) {
                return false;
            } else {
                newParts[i] = part;
            }
        }

        // ˢ��
        this.setState({ parts: newParts });
        return true;
    }

    grow(): boolean {
        // TODO ������β�ķ�����ӵ��ʵ���λ�ò�ˢ��
        this.state.parts.push(new Point(0, 0));
        return true;
    }

    private copy(point: Point, direction: Direction): Point {
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