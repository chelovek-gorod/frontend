'use strict';

const D4_1 = '    ^\n  / 1 \\\n /_____\\\n';
const D4_2 = '    ^\n  / 2 \\\n /_____\\\n';
const D4_3 = '    ^\n  / 3 \\\n /_____\\\n';
const D4_4 = '    ^\n  / 4 \\\n /_____\\\n';

const D6_1 = '---------\n|       |\n|   *   |\n|       |\n---------\n';
const D6_2 = '---------\n| *     |\n|       |\n|     * |\n---------\n';
const D6_3 = '---------\n| *     |\n|   *   |\n|     * |\n---------\n';
const D6_4 = '---------\n| *   * |\n|       |\n| *   * |\n---------\n';
const D6_5 = '---------\n| *   * |\n|   *   |\n| *   * |\n---------\n';
const D6_6 = '---------\n| *   * |\n| *   * |\n| *   * |\n---------\n';

const D8_1 = '  ___\n /   \\\n/  1  \\\n\\_____/\n';
const D8_2 = '  ___\n /   \\\n/  2  \\\n\\_____/\n';
const D8_3 = '  ___\n /   \\\n/  3  \\\n\\_____/\n';
const D8_4 = '  ___\n /   \\\n/  4  \\\n\\_____/\n';
const D8_5 = '  ___\n /   \\\n/  5  \\\n\\_____/\n';
const D8_6 = '  ___\n /   \\\n/  6  \\\n\\_____/\n';
const D8_7 = '  ___\n /   \\\n/  7  \\\n\\_____/\n';
const D8_8 = '  ___\n /   \\\n/  8  \\\n\\_____/\n';

function throwDicesD4( number ) {
    console.clear();

    for (let i = 0; i < number; i++) {
        let n = Math.ceil( Math.random() * 4 );
        switch ( n ) {
            case 1 : console.log( D4_1 ); break;
            case 2 : console.log( D4_2 ); break;
            case 3 : console.log( D4_3 ); break;
            case 4 : console.log( D4_4 ); break;
        }
    }
}

function throwDicesD6( number ) {
    console.clear();

    for (let i = 0; i < number; i++) {
        let n = Math.ceil( Math.random() * 4 );
        switch ( n ) {
            case 1 : console.log( D6_1 ); break;
            case 2 : console.log( D6_2 ); break;
            case 3 : console.log( D6_3 ); break;
            case 4 : console.log( D6_4 ); break;
            case 5 : console.log( D6_5 ); break;
            case 6 : console.log( D6_6 ); break;
        }
    }
}

function throwDicesD8( number ) {
    console.clear();

    for (let i = 0; i < number; i++) {
        let n = Math.ceil( Math.random() * 4 );
        switch ( n ) {
            case 1 : console.log( D8_1 ); break;
            case 2 : console.log( D8_2 ); break;
            case 3 : console.log( D8_3 ); break;
            case 4 : console.log( D8_4 ); break;
            case 5 : console.log( D8_5 ); break;
            case 6 : console.log( D8_6 ); break;
            case 7 : console.log( D8_7 ); break;
            case 8 : console.log( D8_8 ); break;
        }
    }
}

let number = +prompt('Сколько кубиков бросаем ?');

while ( number > 0 ) {
    let sides = +prompt('Сколько граней у кубиков (4, 6 или 8) ?');

    switch ( sides ) {
        case 4 : throwDicesD4( number ); break;
        case 6 : throwDicesD6( number ); break;
        case 8 : throwDicesD8( number ); break;
        default : alert('Граней может быть 4, 6 или 8!')
    }

    number = +prompt('Сколько кубиков бросаем ?');
}