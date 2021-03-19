import { checkCode, getNewCode, Turn, Round, getShuffleOrder } from './model.js';

/**
 * Determines the relative frequency of each choice vs. the expected frequency.
 * Returns an array of decimal percentages, one for each choice.
 * @param {number} iterations Integer. How many codes to generate.
 * @param {number} [choices] Integer. Total distinct choices for
 * one position in in the code. Defaults to 6.
 * @param {number} [length] Integer. Length of each code. Defaults to 4.
 */
function testFrequencies(iterations, choices = 6, length = 4) {
    
    let frequencies = Array(choices).fill(0);
    // Outer loop is procedural to limit memory usage.
    for (let i = 0; i < iterations; i++) {
        getNewCode(choices, length).forEach((value) => frequencies[value]++);
    }

    const expectedCount = length / choices * iterations;
    return frequencies.map((count) => count / expectedCount);
}

function doFrequencyTest() {
    console.log('Running frequency test. This takes about 15-30 seconds on modern hardware.');
    const result = testFrequencies(80000000).map((n) => n.toFixed(4));
    console.log('The numbers below are percentages of the expected frequency.'); 
    console.log(result);
    console.log('Values should approximate \'1.0000\'.');
}

function testCheckCode() {
    console.log(checkCode([1,2,3,4],[1,2,3,4]));
    console.log(checkCode([1,2,3,4],[2,3,4,1]));
    console.log(checkCode([1,2,3,4],[1,3,2,4]));

    const realGameData = [
        [
            [5, 5, 1, 4],
            [
                [[0, 0, 1, 1], [1, 0]],
                [[2, 3, 3, 2], [0, 0]],
                [[4, 5, 5, 4], [2, 1]],
                [[1, 5, 4, 5], [1, 3]],
                [[4, 5, 1, 4], [3, 0]],
                [[5, 5, 1, 4], [4, 0]]
            ]
        ],
        [
            [5, 0, 2, 0],
            [
                [[2, 1, 0, 0], [1, 2]],
                [[4, 4, 5, 5], [0, 1]],
                [[1, 0, 0, 4], [1, 1]],
                [[5, 1, 0, 2], [1, 2]],
                [[5, 0, 2, 0], [4, 0]]
            ]
        ],
        [
            [5, 0, 4, 4],
            [
                [[4, 4, 2, 1], [0, 2]],
                [[0, 3, 3, 0], [0, 1]],
                [[0, 0, 4, 4], [3, 0]],
                [[5, 0, 4, 4], [4, 0]]
            ]
        ]
    ].map((round) => new Round(round[0], round[1].map((turn) => new Turn(...turn))));

    console.assert(realGameData.reduce(
        (correct, round) => correct && round.turns.reduce(
            (correct, turn) => correct && checkCode(round.secret, turn.guess).reduce(
                (correct, element, i) => correct && (element === turn.result[i]), true
            ), true
        ), true
    ) === true);
}

function testShuffle() {
    // A truly empty object. Doesn't even have a __proto__ field.
    const result = Object.create(null);
    const iterations = 1000000;
    for(let i = 0; i < iterations; i++) {
        const key = getShuffleOrder(4).join('');
        result[key] = result[key] ? result[key] + 1 : 1;
    }

    console.log(result);
}

function runTests() {
    // Some of these tests can take a while.
    doFrequencyTest();
    testCheckCode();
    testShuffle();
}

runTests();