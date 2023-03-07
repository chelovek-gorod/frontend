'use strict';

let num_1, num_2, operation, result;

num_1 = +prompt('Введите первое число', 0);
num_2 = +prompt('Введите второе число', 0);
operation = prompt('Введите математическую операцию ( +, -, *, /)', '+');

if (operation === '+') result = num_1 + num_2;
if (operation === '-') result = num_1 - num_2;
if (operation === '*') result = num_1 * num_2;
if (operation === '/') result = num_1 / num_2;

alert(num_1 + ' ' + operation + ' ' + num_2 + ' = ' + result);