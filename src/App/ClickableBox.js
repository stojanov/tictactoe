import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ClickableBox extends Component {
    static propTypes = {
        id: PropTypes.number.isRequired,
    }
    
    constructor() {
        super();

        this.state = {
            clicked: false,
            display: -1,
        }
    }

    resetState() { 
        this.setState({ clicked: false });
    }

    renderInner() {
        const comp = txt => <div className="text">{txt}</div> 
        switch (this.props.player) {
            case 0: return comp('X');
            case 1: return comp('O');
            default: return;
        }
    }

    getStyle() {
        return ("TicTacToe-Box ") + (this.props.background == 0 ? '' : 'bg');
    }

    render() {
        return (
            <div className={this.getStyle()} onClick={this.props.onClick}>
                { this.renderInner() }
            </div> 
        )
    }
}