import { checkCode, getNewCode, Round, Turn } from './model.js';

export const defaultSettings = {
    allowRepeats: true
};

export class Game {
    /**
     * @param {*} [roundOpts] (Optional) arguments for the `Round` constructor.
     */
    constructor(...roundOpts) {
        this.round = new Round(...roundOpts);
        this.currentGuess = [...Array(this.round.codeLength)];
    }

    get turnsTaken() {
        return this.round.turns.length;
    }

    /**
     * Getter that returns a string representing the game status.
     * Possible return values are 'win', 'lose', and 'play',
     * indicating the current game is respectively won, lost, or in progress.
     */
    get status() {
        const r = this.round;
        if ((this.turnsTaken > 0) && (r.turns[this.turnsTaken - 1].result[0] == r.codeLength)) return 'win';
        else if (r.turns.length >= r.maxTurns) return 'lose';
        else return 'play';
    }

    /**
     * Attempts to take a turn.
     */
    takeTurn() {
        const g = this.currentGuess;
        if ((this.status === 'play') && isValidGuess(g, this.round.choices, this.round.codeLength)) {
            const r = this.round;
            r.recordTurn(new Turn(g, checkCode(r.secret, g)));
        }
    }

}

/**
 * Set the active number.
 * @param {number} n An integer.
 */
export function setActive(n, stateObj) {
    stateObj.active = n;
}

function modifyPin(guess, index, value) {
    guess[index] = value;
}

/**
 * 
 * @param {number[]} guess 
 * @param {number} choices 
 * @param {number} codeLength 
 */
export function isValidGuess(guess, choices, codeLength) {
    return guess ? (guess.length === codeLength) && guess.reduce(
        (acc, current) => acc &&
            [...Array(choices).keys()].includes(current), true
    ) : false;
}

export let gameState = {};

/**
 * 
 * @param {*} settings 
 */
export function startRound(settings = gameState.settings) {
    gameState.settings = {
        allowRepeats: (
            (settings != undefined) && (settings.allowRepeats != undefined)
        ) ? settings.allowRepeats : defaultSettings.allowRepeats
    };

    gameState.currentGuess = [...Array(
        gameState.settings.codeLength ?? defaultSettings.codeLength
    )];

    gameState.round = new Round(getNewCode());
    gameState.active = 0;
}