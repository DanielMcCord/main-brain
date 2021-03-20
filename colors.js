/**
 * An object representing an RGB color with no transparency.
 * A `name` for the color can be included.
 */
export class Color {
    /**
     * @param {string} [name]
     * @param {number} r
     * @param {number} g
     * @param {number} b
     */
    constructor(name, r, g, b) {
        this.name = name;
        this.r = r;
        this.g = g;
        this.b = b;
    }

    /**
     * Helper method that returns a number[] with the rgb values.
     */
    get values() {
        return [this.r, this.g, this.b];
    }

    /**
     * Returns the color's 6-digit hexadecimal RGB code, prefixed with '#'.
     * e.g. '#ff0000' for pure red.
     */
    get hexStr() {
        return this.values.reduce((str, channel) => str.concat(
            ((c) => {
                const hex = Math.min(Math.max(c, 0), 255).toString(16);
                return '0'.repeat(2 - hex.length).concat(hex);
            })(channel)
        ), '#');
    }
}

// These color codes are from
// https://eleanormaclure.files.wordpress.com/2011/03/colour-coding.pdf
// They are intended to be mostly easy to distinguish.
// Each RGB triplet in this array corresponds to a letter of the alphabet,
// i.e. [240, 163, 255] is 'A', [0, 117, 220] is 'B', ... , [255, 80, 5] is 'Z'.
const colorCodesAlphabetical = [
    [240, 163, 255], [0, 117, 220], [153, 63, 0], [76, 0, 92],
    [25, 25, 25], [0, 92, 49], [43, 206, 72], [255, 204, 153],
    [128, 128, 128], [148, 255, 181], [143, 124, 0], [157, 204, 0],
    [194, 0, 136], [0, 51, 128], [255, 164, 5], [255, 168, 187],
    [66, 102, 0], [255, 0, 16], [94, 241, 242], [0, 153, 143],
    [224, 255, 102], [116, 10, 255], [153, 0, 0], [255, 255, 128],
    [255, 255, 0], [255, 80, 5]
];

/**
 * My custom ordering of the above colors. The first six are colorblind-safe,
 * except for monochromats (sorry; it's hard to make a game with colors work without colors).
 */
const customAlphabetOrder = [ 
    'R', 'W', 'Y', 'S', 'B', 'D', 'P', 'N',
    'M', 'V', 'Q', 'K', 'O', 'U', 'H', 'G', 'L', 'Z', 'C', 'A', 'I', 
    'E', 'T', 'F', 'X', 'J'
];

/**
 * An array of 26 colors with good contrast, in a custom order.
 */
export const colors = customAlphabetOrder.map(
    (letter) => new Color(
        letter,
        ...colorCodesAlphabetical['ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(letter)]
    )
);