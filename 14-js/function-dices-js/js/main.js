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

let diceSides = +prompt('Введите число граней игрального кубика 4, 6 или 8:');
let dices = +prompt('Введите число игральных кубиков для броска:');

let throwDice = size => Math.ceil( Math.random() * size );

let logDice = () => {
    let throwResult = throwDice( diceSides );
    switch(throwResult) {
        case 1 : 
            if (diceSides === 4) console.log(D4_1);
            else if (diceSides === 6) console.log(D6_1);
            else console.log(D8_1);
            break;
        case 2 : 
            if (diceSides === 4) console.log(D4_2);
            else if (diceSides === 6) console.log(D6_2);
            else console.log(D8_2);
            break;
        case 3 : 
            if (diceSides === 4) console.log(D4_3);
            else if (diceSides === 6) console.log(D6_3);
            else console.log(D8_3);
            break;
        case 4 : 
            if (diceSides === 4) console.log(D4_4);
            else if (diceSides === 6) console.log(D6_4);
            else console.log(D8_4);
            break;
        case 5 : 
            (diceSides === 6) ? console.log(D6_5) : console.log(D8_5);
            break;
        case 6 : 
            (diceSides === 6) ? console.log(D6_6) : console.log(D8_6);
            break;
        case 7 : console.log(D8_7); break;
        case 8 : console.log(D8_8); break;
    }
    
    dices = dices - 1;
    if (dices > 0) logDice();
}

if ( isFinite(dices) && !isNaN(dices) && dices > 0 ) {
    switch(diceSides) {
        case 4 : logDice(); break;
        case 6 : logDice(); break;
        case 8 : logDice(); break;
        default : alert('Введено неверное значение (граней может быть 4, 6 или 8)');
    }
} else alert('Введено неверное значение (количество кубиков должно быть конечным числом больше 0)');
