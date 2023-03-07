'use strict';

const currentDate = new Date();
let year, month, date, day, hh, mm, ss, ms;
year = currentDate.getFullYear();
month = currentDate.getMonth();
date = currentDate.getDate();
day = currentDate.getDay();
hh = currentDate.getHours();
mm = currentDate.getMinutes();
ss = currentDate.getSeconds();

let monthText;
switch(month) {
    case  0 : monthText = 'Январь'; break;
    case  1 : monthText = 'Февраль'; break;
    case  2 : monthText = 'Март'; break;
    case  3 : monthText = 'Апрель'; break;
    case  4 : monthText = 'Май'; break;
    case  5 : monthText = 'Июнь'; break;
    case  6 : monthText = 'Июль'; break;
    case  7 : monthText = 'Август'; break;
    case  8 : monthText = 'Сентябрь'; break;
    case  9 : monthText = 'Октябрь'; break;
    case 10 : monthText = 'Ноябрь'; break;
    case 11 : monthText = 'Декабрь'; break;
}

let dayText;
switch(day) {
    case 1 : dayText = 'Понедельник'; break;
    case 2 : dayText = 'Вторник'; break;
    case 3 : dayText = 'Среда'; break;
    case 4 : dayText = 'Четверг'; break;
    case 5 : dayText = 'Пятница'; break;
    case 6 : dayText = 'Суббота'; break;
    case 7 : dayText = 'Воскресение'; break;
}

let dateMessage = `Сегодня ${date} ${monthText}, ${year} года (${dayText})
${hh<10?'0'+hh:hh}:${mm<10?'0'+mm:mm}:${ss<10?'0'+ss:ss} - Отличное время сыграть в игру!`;

alert(dateMessage);

let randomNumber = Math.ceil( Math.random() * 100 ) // 1....100
let startTime = Date.now();
let userNumber = +prompt('Я загадал число от 1 до 100.\nУгадай что это за число:');
while (userNumber !== randomNumber && userNumber !== 0) {
    if ( isNaN(userNumber) ) {
        userNumber = +prompt('Я загадал число от 1 до 100.\nВы ввели не число, попробуйте снова:');
    } 
    else if ( userNumber < randomNumber) {
        userNumber = +prompt('Моё число больше ' + userNumber + '.\nПопробуйте снова:');
    } 
    else {
        userNumber = +prompt('Моё число меньше ' + userNumber + '.\nПопробуйте снова:');
    }
}
if (userNumber !== 0) {
    let finishTime = Date.now();
    let resultTime = ((finishTime - startTime) / 1000).toFixed(1);
    alert('Всё правильно, загаданное число ' + randomNumber + '\nНа отгадывание у вас ушло ' + resultTime + ' c');
} else {
    alert('Жаль что вы сдаётесь.\nПравильный ответ был ' + randomNumber + '\n( Обновите страницу чтобы перезапустить игру )');
}