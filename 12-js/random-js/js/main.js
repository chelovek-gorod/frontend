'use strict';

const D1 = '---------\n|       |\n|   *   |\n|       |\n---------\n';
const D2 = '---------\n| *     |\n|       |\n|     * |\n---------\n';
const D3 = '---------\n| *     |\n|   *   |\n|     * |\n---------\n';
const D4 = '---------\n| *   * |\n|       |\n| *   * |\n---------\n';
const D5 = '---------\n| *   * |\n|   *   |\n| *   * |\n---------\n';
const D6 = '---------\n| *   * |\n| *   * |\n| *   * |\n---------\n';

let isThrow = confirm('Бросаем кубики?');

if (isThrow) {
    let dices = +prompt('Сколько кубиков бросаем (1-6)?', 1);

    if (dices > 0) {
        let dice_result = Math.ceil( Math.random() * 6 );
        if (dice_result === 1) console.log(D1);
        if (dice_result === 2) console.log(D1);
        if (dice_result === 3) console.log(D3);
        if (dice_result === 4) console.log(D4);
        if (dice_result === 5) console.log(D5);
        if (dice_result === 6) console.log(D6);
    }
    
    if (dices > 1) {
        let dice_result = Math.ceil( Math.random() * 6 );
        if (dice_result === 1) console.log(D1);
        if (dice_result === 2) console.log(D1);
        if (dice_result === 3) console.log(D3);
        if (dice_result === 4) console.log(D4);
        if (dice_result === 5) console.log(D5);
        if (dice_result === 6) console.log(D6);
    }

    if (dices > 2) {
        let dice_result = Math.ceil( Math.random() * 6 );
        if (dice_result === 1) console.log(D1);
        if (dice_result === 2) console.log(D1);
        if (dice_result === 3) console.log(D3);
        if (dice_result === 4) console.log(D4);
        if (dice_result === 5) console.log(D5);
        if (dice_result === 6) console.log(D6);
    }

    if (dices > 3) {
        let dice_result = Math.ceil( Math.random() * 6 );
        if (dice_result === 1) console.log(D1);
        if (dice_result === 2) console.log(D1);
        if (dice_result === 3) console.log(D3);
        if (dice_result === 4) console.log(D4);
        if (dice_result === 5) console.log(D5);
        if (dice_result === 6) console.log(D6);
    }
    
    if (dices > 4) {
        let dice_result = Math.ceil( Math.random() * 6 );
        if (dice_result === 1) console.log(D1);
        if (dice_result === 2) console.log(D1);
        if (dice_result === 3) console.log(D3);
        if (dice_result === 4) console.log(D4);
        if (dice_result === 5) console.log(D5);
        if (dice_result === 6) console.log(D6);
    }

    if (dices > 5) {
        let dice_result = Math.ceil( Math.random() * 6 );
        if (dice_result === 1) console.log(D1);
        if (dice_result === 2) console.log(D1);
        if (dice_result === 3) console.log(D3);
        if (dice_result === 4) console.log(D4);
        if (dice_result === 5) console.log(D5);
        if (dice_result === 6) console.log(D6);
    }
} else {
    console.log('Обновите страницу');
}