'use strict';

let inputString = prompt('Введите сообщение');

let inputStringTrim = inputString.trimEnd();
alert('Длина введенного сообщения: ' +  inputStringTrim.length);
alert('Сообщение в верхнем регистре: ' +  inputStringTrim.toUpperCase());
alert('Сообщение в нижнем регистре: ' +  inputStringTrim.toLowerCase());
alert('Первый символ сообщения: ' +  inputStringTrim[0]);
alert('Последний символ сообщения: ' +  inputStringTrim[inputStringTrim.length - 1]);
alert('Сообщение без первого символа: ' +  inputStringTrim.slice(1));
alert('Сообщение без последнего символа: ' +  inputStringTrim.slice(0, inputStringTrim.length - 1));
alert('Результат поиска индекса символа пробел в сообщении: ' +  inputStringTrim.indexOf(' '));

let search = prompt('Введите подстроку для поиска в сообщении');
alert('Результат поиска подстроки в сообщении: ' +  inputString.indexOf(search));
alert(search[search.length - 1] + search.slice(1, search.length - 1) + search[0]);