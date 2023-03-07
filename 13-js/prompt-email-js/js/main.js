'use strict';

let email = prompt('Введите e-mail').trim();
let errorMessage = 'Некорректный e-mail: ';

if(email.length < 7) {
    alert(errorMessage + "Длина e-mail'а должна быть не менее 7 символов");
} else if(email.indexOf(' ') > -1) {
    alert(errorMessage + "E-mail не должен содержать пробелы");
} else if(email.indexOf('@') === -1) {
    alert(errorMessage + "В e-mail'e обязательно должен быть символ @");
} else if(email[0] === '@' || email[email.length - 1] === '@') {
    alert(errorMessage + "E-mail не должен начинаться или заканчиваться символом @");
} else {
    let substring = email.slice(email.indexOf('@'));
    let dotIndex = substring.indexOf('.');
    if (dotIndex === -1) {
        alert(errorMessage + "После символа @ обязательно должна быть подстрока, содержащая точку");
    } else if (dotIndex < 2) {
        alert(errorMessage + "Точка после @ должна быть отделена минимум двумя символоми");
    } else if (dotIndex > substring.length - 3) {
        alert(errorMessage + "После последней точки должно быть минимум два символа");
    } else if (substring.indexOf('@') !== -1) {
        alert(errorMessage + "В e-mail'e должен быть только 1 символ @");
    } else {
        alert("e-mail принят");
    } 
}