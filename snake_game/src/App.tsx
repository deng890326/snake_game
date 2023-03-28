import React from 'react';
import Food from './Food';
import ScorePanel from './ScorePanel';
import Snake from './Snake';
import { Boundary, Direction, Point } from './Types';

class App extends React.Component {

    static readonly bgColor = "#b7d4a8";
    readonly stageWidth = 304;
    readonly stageHeight = 304;
    readonly stageBorderWidth = 2;
    readonly pixelWidth = 10
    readonly initalFlashTime = 1000;
    readonly levelUpMinusTime = 30;

    private food = React.createRef<Food>();
    private snake = React.createRef<Snake>();
    private scorePanle = React.createRef<ScorePanel>();

    private direction: Direction | undefined;
    private flashTime: number;
    timeout: NodeJS.Timeout | undefined;

    get stageBoundary() {
        let extra = this.stageBorderWidth * 2 + this.pixelWidth;
        let right = this.stageWidth - extra;
        let bottom = this.stageHeight - extra;
        return new Boundary(0, 0, right, bottom);
    }

    constructor(props: {}) {
        super(props);
        this.direction = undefined;
        this.flashTime = this.initalFlashTime
    }

    componentDidMount() {
        document.addEventListener('keydown', this.keydownHandler.bind(this))
        this.run();
    }

    run() {
        console.log(this.flashTime);
        console.log(Date.now());
        let snake = this.snake.current;
        if (snake == null) return;
        let food = this.food.current;
        let scorePanel = this.scorePanle.current;
        if (scorePanel == null) return;

        if (this.direction != undefined) {
            if (!snake.stepOne(this.direction)) {
                alert("游戏结束");
                return;
            }
            let snakeHead = snake.headPosition;
            let fp = food?.position;
            if (snakeHead.x == fp?.x && snakeHead.y == fp.y) {
                scorePanel.addScore();
                this.flashTime = Math.max(0,
                    this.initalFlashTime - scorePanel.level * this.levelUpMinusTime);
                snake.grow();
                food?.change();
            }
        }

        this.timeout = setTimeout(this.run.bind(this), this.flashTime);
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    keydownHandler(ev: KeyboardEvent) {
        let newDirection: Direction;
        switch (ev.key) {
            case "ArrowUp":
                newDirection = Direction.Top;
                break;
            case "ArrowDown":
                newDirection = Direction.Bottom;
                break;
            case "ArrowLeft":
                newDirection = Direction.Left;
                break;
            case "ArrowRight":
                newDirection = Direction.Right;
                break;
            default:
                return;
        }

        let shouldUpdate = this.direction == undefined
            || (this.isHorizontal(this.direction) && !this.isHorizontal(newDirection))
            || (!this.isHorizontal(this.direction) && this.isHorizontal(newDirection));
        if (shouldUpdate) {
            this.direction = newDirection;
        }
    }

    private isHorizontal(direction: Direction | undefined) {
        return direction == Direction.Left || direction == Direction.Right;
    }

    render() {
        return (
            <div className="App"
                style={{
                    width: 360,
                    height: 420,
                    margin: 100,
                    backgroundColor: App.bgColor,
                    borderWidth: 10,
                    borderStyle: "solid",
                    borderColor: "black",
                    borderRadius: 40,
                    display: "flex",
                    flexFlow: "column",
                    alignItems: "center",
                    justifyContent: "space-around"
                }}>
                <div className="Stage"
                    style={{
                        width: this.stageWidth,
                        height: this.stageHeight,
                        borderWidth: this.stageBorderWidth,
                        borderColor: "black",
                        borderStyle: "solid",
                        position: "relative"
                    }}>
                    <Food ref={this.food}
                        width={this.pixelWidth}
                        height={this.pixelWidth}
                        boundary={this.stageBoundary}
                        initalPosition={new Point(40, 100)}
                    />
                    <Snake ref={this.snake}
                        pixelWidth={this.pixelWidth}
                        boundary={this.stageBoundary}
                        initialParts={[new Point(0, 0)]}
                    />
                </div>
                <ScorePanel ref={this.scorePanle} />
            </div>
        );
    }
}

export default App;
