export class Turn {
    /**
     * @param {number[]} guess 
     * @param {number[]} result 
     */
    constructor(guess, result) {
        this.guess = guess;
        this.result = result;
    }
}

export class Round {
    /**
     * @param {number[]} secret
     * @param {Turn[]} turns
     * @param {number} maxTurns
     */
    constructor(secret, turns = [], maxTurns = 10) {
        this.secret = secret;
        this.turns = turns;
        this.maxTurns = maxTurns;
    }

    turnsRemaining() {
        return this.maxTurns - this.turns.length;
    }
}

export function getCryptographicallyRandomInteger() {
    return null;
}

/**
 * 
 * @param {number} choices Integer. Number of "colors". Defaults to 6.
 * @param {number} length Integer. The length of the code. Defaults to 4.
 */
export function getNewCode(choices = 6, length = 4) {
    return Array(length).fill().map((x) => Math.trunc(Math.random() * choices));
}

/**
 * Returns an array containing integers [0, length) in a
 * cryptographically random order. Hardened against timing attacks.
 * Does not run in constant time, but the run time has no correlation to
 * the output.
 * @param {*} length 
 */
export function getShuffleOrder(length) {
    let order = [];
    for (let i = 0; i < length; i++) {
        while (true) {
            const num = getCryptographicallyRandomInteger(length);
            console.log(num);
            if (!order.includes(num)) {
                order.push(num);
                break;
            }
        }
    }

    return order;
}

/**
 * Returns how many positions in the guess exactly match the secret,
 * and how many are the correct value but in the wrong position.
 * @param {number[]} secret
 * @param {number[]} guess
 */
export function checkCode(secret, guess) {
    // Shuffle both the secret and guess to mitigate many timing attacks.
    // Use the same index mapping for both to preserve correctness.
    const shuffledIndices = getShuffleOrder(secret.length);
    const shuffledSecret = shuffledIndices.map((e) => secret[e]);
    const shuffledGuess = shuffledIndices.map((e) => guess[e]);

    // temporary arrays to track where matches have already been found,
    // based on the shuffled index order.
    const secretMatched = [];
    const guessMatched = [];

    // Mark exact matches in the temporary arrays with the number 1.
    for (let i = 0; i < secret.length; i++) {
        secretMatched[i] = guessMatched[i] = ((secret[i] === guess[i]) ? 1 : 0);
    }

    // Mark "wrong place" matches in the temporary arrays with the number 2.
    for (let i = 0; i < secret.length; i++) {
        for (let j = 0; j < secret.length; j++) {
            // Only check for matches with elements not already matched.
            if (!guessMatched[i] && !secretMatched[j] && (shuffledGuess[i] === shuffledSecret[j])) {
                guessMatched[i] = secretMatched[j] = 2;
                // Keep going, to mitigate another category of timing attacks.
            }
        }
    }

    return guessMatched.reduce((acc, current) => {
        switch(current) {
        case 1:
            return [acc[0] + 1, acc[1]];
        case 2:
            return [acc[0], acc[1] + 1];
        default:
            return acc;
        }
    }, [0, 0]);
}