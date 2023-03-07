'use strict';
/*
Разработчик:
Иванов Иван
*/

const developer = 'Иванов Иван';
const language = 'JavaScript';

let feature = 'best';

console.log('Hi, my name is ' + developer + '!');
console.log(`${language} - is the ${feature} programming language!`);

let userName, age, currentYear;
userName = prompt('Ваше имя:');
age = +prompt(userName + ', сколько вам полных лет?');
currentYear = +prompt(userName + ', какой сейчас год?');

let nextAge = age + (2050 - currentYear);
alert(`${userName}, в 2050-ом году вам будет ${nextAge} лет`);

// Bonus tasks

let year = 1997;
console.log(`${language} was created in ${year}`);

feature = 'amazing';
console.log(language, '- is the', feature, 'programming language!');

let num_1 = +prompt(userName + ', Введите 1-е число:');
let num_2 = +prompt(userName + ', Введите 2-е число:');

alert( num_1 + '/' + num_2 + '=' + (num_1/num_2).toFixed(2) );
alert( num_1 + '^' + num_2 + '=' + num_1**num_2 );
alert( num_1 + '%' + num_2 + '=' + num_1%num_2 );