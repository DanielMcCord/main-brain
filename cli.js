import readline from 'readline-sync';
import { Game, isValidGuess } from './controller.js';

let allowRepeats;
let codeLength;
let choices;

console.log('Welcome to the command-line version of Main Brain!');

while (allowRepeats == undefined) {
    const input = ''.concat(readline.question('Should the secret code be allowed to have repeated values? [y/n] > '));
    switch (input) {
        case 'y':
            allowRepeats = true;
            break;
        case 'n':
            allowRepeats = false;
            break;
        default:
            break;
    }
}

while (codeLength == undefined) {
    const input = Number(''.concat(readline.question('How long should the codes be? > ')));
    if (Number.isInteger(input) && input > 0) codeLength = input;
}

while (choices == undefined) {
    const input = Number(''.concat(readline.question('How many choices for each position? > ')));
    if (Number.isInteger(input) && (input > 0) && (input <= 10)) choices = input;
}


let game = new Game(undefined, undefined, undefined, allowRepeats, codeLength, choices);
console.log(
    `game has been created with code length ${codeLength}, ${choices} choices, and with repeats ${allowRepeats ? '' : 'NOT '}allowed.`
);

while (game.status === 'play') {
    let guess;
    while (!isValidGuess(guess, choices, codeLength)) {
        guess = readline.question(
            `Please enter your guess, as a ${codeLength} digit number with values from 0 to ${codeLength - 1}: `
        ).split('').map(x => Number(x));
    }
    game.currentGuess = guess;
    game.takeTurn();
    const turn = game.round.turns[game.round.turns.length -1 ];
    console.log(`${turn.result[0]} digits are correct and in the correct position, and \n${turn.result[1]} are correct but in the wrong position.`);
}

switch (game.status) {
    case 'win':
        console.log('You win!');
        break;
    case 'lose':
        console.log('Ran out of guesses - game over.');
        break;
    default:
        console.log('Error: game ended in an unrecognized state.');
        break;
}

console.log(`The secret code was: ${game.round.secret.join('')}`);