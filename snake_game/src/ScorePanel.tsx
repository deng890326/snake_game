import React from "react";

type State = {
    score: number,
    level: number,
};

export default class ScorePanel extends React.Component<{}, State> {

    readonly levelScore = 5;

    constructor(props: {}) {
        super(props);
        this.state = {
            score: 0,
            level: 1,
        };
    }

    addScore() {
        let { score, level } = this.state;
        score++;
        if (score % this.levelScore == 0) {
            level++;
        }
        this.setState({ score, level });
    }

    get level() {
        return this.state.level;
    }

    render() {
        let { score, level } = this.state;
        return (
            <div className="ScorePanel"
                style={{
                    width: 300,
                    display: "flex",
                    justifyContent: "space-between",
                }}>
                <div>
                    Score:<span>{score}</span>
                </div>
                <div>
                    Level:<span>{level}</span>
                </div>
            </div>
        )
    }
}