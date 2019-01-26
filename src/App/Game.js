import { createArray, clone } from './utils'

// Minimax consts
const PLAYER1_WIN = 10;
const PLAYER2_WIN = -10;
const DRAW_SCORE = 0;

const WINING_SCENARIOS = [
    '123', '456', '789',
    '159', '357',
    '147', '258', '369'
].map(el => el.split(''));

const getInitalState = () => {
    const newState = {
        CURRENT_PLAYER: 0,
        PLAYED_IDS: createArray(10, x => 0),
        MOVES: [],
        BOARD: [ [], [] ],
    };

    newState.PLAYED_IDS[0] = 1;
    return newState;
};

const makeMove = (state, player, id) => {
    if (state.PLAYED_IDS[id] == 1)
        return true;

    state.BOARD[player].push(id);
    state.PLAYED_IDS[id] = 1;
    state.MOVES.push({ player, id });

    return false;
};

const removeLastMove = state => {
    if (state.MOVES.length == 0) {
        return;
    }

    const { player, id } = state.MOVES.pop();

    state.BOARD[player].pop();
    state.PLAYED_IDS[id] = 0;
};

const switchPlayer = player => player == 0 ? 1 : 0;

const hasWon = board => {
    const arr = WINING_SCENARIOS.filter(scenario => {
        return board.filter(n => scenario.includes(String(n))).length >= 3;
    });

    if (arr.length >= 1)
        return arr[0];
    else
        return null;
}

const getFreeSpots = state => state.PLAYED_IDS
    .map((o, i) => ({ id: i, value: o }))
    .filter(o => o.value == 0)
    .map(o => o.id);


const getFromPlayer = (player, a, b) => !player ? a : b;

// Originally with alpha beta prunning but it had weird results
// Surely i did something wrong
const minimax = (state, player, depth = 0) => {
    const free = getFreeSpots(state);

    if (hasWon(state.BOARD[0])) 
        return PLAYER1_WIN - depth;
    
    if (hasWon(state.BOARD[1]))
        return PLAYER2_WIN + depth;

    if (free.length == 0)
        return DRAW_SCORE;

    let bestScore = getFromPlayer(player, Number.MIN_VALUE, Number.MAX_VALUE);

    for(let i = 0; i < free.length; i++) {
        const move = free[i];

        makeMove(state, player, move);
        const score = minimax(state, switchPlayer(player), depth + 1);
        removeLastMove(state);

        const MaxOrMin = getFromPlayer(player, Math.max, Math.min);
        bestScore = MaxOrMin(score, bestScore);
    }

    return bestScore;
}

const getBestMove = (state, player) => { // 0 Max
    const free = getFreeSpots(state);
    const newState = clone(state);
    let bestMove = { id: -1, value: getFromPlayer(player, Number.MIN_VALUE, Number.MAX_VALUE) };
    
    for(let i = 0; i < free.length; i++) {
        const move = free[i];
        makeMove(newState, player, move);
        const moveScore = minimax(newState, switchPlayer(player));
        removeLastMove(newState)

        const cmpRes = getFromPlayer(player, moveScore > bestMove.value, moveScore < bestMove.value);

        if (cmpRes) {
            bestMove.value = moveScore;
            bestMove.id = move;
        }
    }
    
    return bestMove.id;
}

// Interface for the world to use
export default class TicTacToe {
    constructor(state) {
        this.GameState = state || getInitalState();
    }

    resetGame() {
        this.GameState = getInitalState();
    }
    
    currentPlayer() {
        return this.GameState.CURRENT_PLAYER;
    }

    makeMove(id) {
        const { CURRENT_PLAYER } = this.GameState;
        const res = makeMove(this.GameState, CURRENT_PLAYER, id);

        if (res) return res;

        this.GameState.CURRENT_PLAYER = switchPlayer(CURRENT_PLAYER);

        return false;
    }

    async ComputerMove() {
        const id = await getBestMove(this.GameState, this.GameState.CURRENT_PLAYER);
        if (id == -1) return;

        this.makeMove(id);
    }

    getBoard() {
        return this.GameState.BOARD;
    }

    hasWon() {
        let res = hasWon(this.GameState.BOARD[0]);

        if (res) 
            return [ 0, res ];

        res = hasWon(this.GameState.BOARD[1]);

        if (res)
            return [ 1, res]; 

        if (this.GameState.MOVES.length == 9)
            return [ 2, [] ];
    
        return [ -1, [] ];
    }
}
