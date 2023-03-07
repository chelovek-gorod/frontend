'use strict';
let input = prompt('Введите двузначное число:').trim();

testNumber(input);

function testNumber(number) {
    let num_1 = +number[0];
    let num_2 = +number[1];

    if (!isNaN(num_1) && num_1 > 0 && !isNaN(num_2)) {
        alert( 'Большее число из ' + num_1 + ' и ' + num_2 + ' -> ' + getMax(num_1, num_2) );
        alert( num_1 + ' + ' + num_2 + ' = ' + getSum(num_1, num_2) );
        alert( num_1 + ' * ' + num_2 + ' = ' + getMultiply(num_1, num_2) );
        alert( num_1 + '' + num_2 + ' ** 2 = ' + getPow2(num_1 * 10 + num_2) );
        console.log( num_1 + '' + num_2 + ' это число - ' + numberToString(num_1, num_2) );
    
    } else {
        alert('Вы ввели не двузначное число');
    }
}

function getMax(num_1, num_2) {
    return num_1 > num_2 ? num_1 : num_2;
}

function getSum(num_1, num_2) {
    return num_1 + num_2;
}

function getMultiply(num_1, num_2) {
    return num_1 * num_2;
}

function getPow2(num) {
    return num ** 2;
}

function numberToString(num_1, num_2) {
    let string = '';
    if (num_1 < 2) {
        switch(num_2) {
            case 0 : return 'десять';
            case 1 : return 'одинадцать';
            case 2 : return 'двенадцать';
            case 3 : return 'тринадцать';
            case 4 : return 'четырнадцать';
            case 5 : return 'пятнадцать';
            case 6 : return 'шестнадцать';
            case 7 : return 'семьнадцать';
            case 8 : return 'восемнадцать';
            case 9 : return 'девятнадцать';
        }
    }
    switch(num_1) {
        case 2 : string += 'двадцать'; break;
        case 3 : string += 'тридцатьь'; break;
        case 4 : string += 'сорок'; break;
        case 5 : string += 'пятьдесят'; break;
        case 6 : string += 'шестьдесят'; break;
        case 7 : string += 'семьдесят'; break;
        case 8 : string += 'восемьдесят'; break;
        case 9 : string += 'девяносто'; break;
    }
    if (num_2 === 0) return string;
    switch(num_2) {
        case 1 : return string += ' один';
        case 2 : return string += ' два';
        case 3 : return string += ' три';
        case 4 : return string += ' четыре';
        case 5 : return string += ' пять';
        case 6 : return string += ' шесть';
        case 7 : return string += ' семь';
        case 8 : return string += ' восемь';
        case 9 : return string += ' девять';
    }
}