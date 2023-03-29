import React, { ReactNode } from 'react';
import App from './App';
import { Boundary, Point } from './Types';

type Props = {
    boundary: Boundary,
    width: number,
    height: number,
    initalPosition: Point,
};

type State = {
    position: Point,
    color: string
};

export default class Food extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        let color = this.getRandomColor();
        this.state = { ...this.state, color };
        this.updateState(props);
    }

    componentWillReceiveProps(props: Props) {
        this.updateState(props);
    }

    private updateState(props: Props) {
        let position: Point;
        if (props.initalPosition.isInBoundary(props.boundary)) {
            position = props.initalPosition;
        } else {
            let { boundary, width, height } = this.props;
            position = boundary.genarateRandomPoint(width, height)
        }
        this.state = { ...this.state, position };
    }

    get position(): Point {
        return this.state.position;
    }

    set position(value: Point) {
        if (value.isInBoundary(this.props.boundary)) {
            this.setState({ position: value });
        }
    }

    /**
     * 随机更新位置和颜色
     * */
    change() {
        let { boundary, width, height } = this.props;
        let position: Point;
        while (true) {
            position = boundary.genarateRandomPoint(width, height);
            if (position.isInBoundary(boundary)) {
                break;
            }
        }

        let color = this.getRandomColor();

        this.setState({ position, color });
    }

    getRandomColor(): string {
        while (true) {
            let color = "#";
            for (let i = 0; i < 3; i++) {
                let sub = Math.floor(Math.random() * 256).toString(16);
                color += (sub.length == 1 ? "0" + sub : sub);
            }
            color = color.toLowerCase();
            if (color != App.bgColor) {
                return color;
            }
        }
    }

    override render(): ReactNode {
        let { position, color } = this.state;
        let { width, height } = this.props;
        return (
            <div className="food"
                style={{
                    width, height,
                    position: "absolute",
                    left: position.x + 'px',
                    top: position.y + 'px',
                    display: "flex",
                    flexFlow: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignContent: "space-between"
                }}>
                {[1, 2, 3, 4].map(_ => (
                    <div style={{
                        width: 4,
                        height: 4,
                        backgroundColor: color,
                        transform: 'rotate(45deg)',
                    }} />
                ))}
            </div>
        );
    }
}