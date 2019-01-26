import React, { Component } from 'react';
import ClickableBox from './ClickableBox';
import { createArray } from './utils'

import './App.css'
import TicTacToe from './Game';

const gameInstance = new TicTacToe();

export default class App extends Component {
    constructor() {
        super();

        this.state = {
            resetKey: 'reset',
            Board : gameInstance.getBoard(),
            won: []
        };

        this.handleClick = this.handleClick.bind(this);
    }   

    resetGame() {
        // Reset keys to force reset on all boxes.
        const newKey = this.state.resetKey == 'reset' ? '' : 'reset';

        gameInstance.resetGame();

        this.setState({ resetKey: newKey, won: [], Board: gameInstance.getBoard() });
    }

    async handleClick(id) {
        if (gameInstance.makeMove(id)) return;

        await gameInstance.ComputerMove();

        const [ won, arr ] = gameInstance.hasWon();
        console.log(won);
        if (won >= 0 && won <= 2) {
            
            this.setState({
                won: arr
            });
            
            // Wait for two seconds before reseting the game
            setTimeout(this.resetGame.bind(this), 2000);
        }

        this.setState({ Board: gameInstance.getBoard() });
    }

    renderButtons(b) {
        return createArray(3, x => x + b + 1).map(x => {
            const player1 = this.state.Board[0].includes(x);
            const player2 = this.state.Board[1].includes(x);

            let play = -1;
            let bg = 0;

            if (this.state.won.length > 0) {
                if (this.state.won.includes(String(x))) {
                    bg = 1;
                }    
            }

            if (player1) {
                play = 0;
            } else if (player2) {
                play = 1;
            }
            return (
                <ClickableBox
                    key={x + this.state.resetKey} 
                    background={bg} 
                    player={play} 
                    id={x} 
                    onClick={this.handleClick.bind(this, x)}
                />
            )
        });
    }

    render() {
        return (
            <div className="TicTacToe-Wrapper">
                <div className="TicTacToe">
                    <div className="TicTacToe-Row">
                        { this.renderButtons(0) }
                    </div>
                    <div className="TicTacToe-Row">
                        { this.renderButtons(3) }
                    </div>
                    <div className="TicTacToe-Row">
                        { this.renderButtons(6) }
                    </div>
                </div>
            </div>
        )
    }
}