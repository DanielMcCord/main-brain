import nodegui from '@nodegui/nodegui';
import { readFileSync } from 'fs';
import { checkCode, Round, Turn } from './model.js';
import { gameState, startRound } from './controller.js';
import { colors } from './colors.js';

startRound();

/**
 * 
 * @param {nodegui.QMainWIndow} widget 
 */
const reloadStyleSheet = (widget) => {
    //widget.
};

// Allow needed nodegui bindings to be used in the global namespace for convenience.
const [
    QMainWindow, QWidget, QLabel,
    FlexLayout, QPushButton, QCheckBox,
    QRadioButton, QInputDialog
] =
    [
        nodegui.QMainWindow, nodegui.QWidget, nodegui.QLabel,
        nodegui.FlexLayout, nodegui.QPushButton, nodegui.QCheckBox,
        nodegui.QRadioButton, nodegui.QInputDialog
    ];

const fetchStyle = (path) => readFileSync(path, { encoding: 'utf8', flag: 'r' });
const externalStyleSheet = fetchStyle('./main.css');

// Names of id selectors for colors in main.css
// For use with newPin()
// The first six colors named here are colorblind-safe.
// Colors higher in the list generally have better overall usability for both
// colorblind and non-colorblind people, but the order is not guaranteed
// to be optimal.
const colorAlphabet = [
    'R', 'W', 'Y', 'S', 'B', 'D', 'P', 'N',
    'M', 'V', 'Q', 'K', 'O', 'U', 'H', 'G', 'L', 'Z', 'C', 'A', 'I',
    'E', 'T', 'F', 'X', 'J'
];

/**
 * Get a colorful circle that you can click on
 * @param {number} colorIndex 
 * @param {Color[]} colorArray
 * @param {*} parent
 * @param {boolean} isRadioButton
 */
function getPin(colorIndex, colorArray, parent, isRadioButton = false) {
    const constructor = isRadioButton ? QRadioButton : QPushButton;
    let p = new constructor(parent);
    p.isRadioButton = isRadioButton;
    if (colorIndex != undefined) {
        p.color = colorArray[colorIndex].hexStr;
        p.setText(colorArray[colorIndex].name);
    }

    p.styleBase = 'width: 50px; height: 50px; ';
    const styleStr = `${p.styleBase}${colorIndex >= 0 ?
        `background-color: ${p.color}; ` :
        ''} `;
    p.setInlineStyle(styleStr);
    p.addEventListener('clicked', () => {
        if (p.isEditable) {
            if (p.color == undefined) null;
        }
        else if (p.isRadioButton) {
            null;
        }

        console.log(p);
    });
    return p;
}

/**
 * 
 * @param {*} pinWidget 
 * @param {boolean} bool 
 */
function setIsEditable(pinWidget, bool) {
    pinWidget.isEditable = bool;
    if (pinWidget.isEditable) {
        null;
    }
}

//function updatePinColor(widget, )

//function 

const win = new QMainWindow();
win.setStyleSheet(externalStyleSheet);


const centralWidget = new QWidget();
win.setCentralWidget(centralWidget);
centralWidget.setLayout(new FlexLayout());

function initColorPalette (parentLayout, round, colors) {

}

/**
 * 
 * @param {*} parent 
 * @param {Round} round 
 */
function initGameBoard(parentLayout, round, colors) {
    // for (const t of round.turns) {
    for (let i = 0; i < round.turns.length; i++) {
        const t = round.turns[i];
        const turn = new QWidget();
        turn.setObjectName('turn');
        parentLayout.addWidget(turn);
        turn.setLayout(new FlexLayout());

        //
        const guess = new QWidget();
        turn.layout.addWidget(guess);
        guess.setObjectName('guess');
        guess.setLayout(new FlexLayout());
        guess.setInlineStyle('flex-direction: row; margin: 5px;');
        for (const value of t.guess) {
            const pinView = getPin(value, colors, guess);
            guess.layout.addWidget(pinView);
        }

        const result = new QWidget();
        turn.layout.addWidget(result);
        result.setObjectName('result');
        result.setLayout(new FlexLayout());
        for (const element of t.result) {
            const resultElementView = new QLabel();
            resultElementView.setText(element ?? '');
            guess.layout.addWidget(resultElementView);
            resultElementView.setObjectName('result');
        }
    }
}

let colorPalette = new QWidget();
initColorPalette(colorPalette, gameState.round.choices);

centralWidget.layout.addWidget(colorPalette);

let previousGuesses = new QWidget();
previousGuesses.setLayout(new FlexLayout());
centralWidget.layout.addWidget(previousGuesses);

initGameBoard(previousGuesses.layout, new Round(
    [5, 5, 1, 4],
    [
        [[0, 0, 1, 1], [1, 0]],
        [[2, 3, 3, 2], [0, 0]],
        [[4, 5, 5, 4], [2, 1]],
        [[1, 5, 4, 5], [1, 3]],
        [[4, 5, 1, 4], [3, 0]],
        [[5, 5, 1, 4], [4, 0]]
    ].map(t => new Turn(t[0], t[1]))
), colors);


const guessPanel = new QWidget();
guessPanel.setObjectName('pins');
centralWidget.layout.addWidget(guessPanel);

const sublayout = new FlexLayout();
guessPanel.setLayout(sublayout);


const checkbox = new QCheckBox();
checkbox.setText('Allow repeats in the secret');
centralWidget.layout.addWidget(checkbox);


console.log(win.size());
win.show();
global.win = win;