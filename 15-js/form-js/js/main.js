'use strict';

// Удаление всех символов из строки str кроме чисел
const getNumbers = (str) => str.replace(/\D+/g,"");

let userName, surname, age, tel, email;

function changeName(value) {
    userName = value.trim();
}

function changeSurname(value) {
    surname = value.trim();
}

function changeAge(value) {
    age = value.trim();
}

function changeTel(value) {
    tel = value.trim();
}

function changeEmail(value) {
    email = value.trim();
    email = email.toLowerCase();
}

function clickSubmit() {
    // проверка заполненности полей
    if (!userName) {
        alert('Поле с именем не заполнено');
        return;
    }
    if (!surname) {
        alert('Поле с фамилией не заполнено');
        return;
    }
    if (!age) {
        alert('Поле с возрастом не заполнено');
        return;
    }
    if (!tel) {
        alert('Поле с телефоном не заполнено');
        return;
    }
    if (!email) {
        alert("Поле с e-mail'ом не заполнено");
        return;
    }

    // проверка длины имени и фамилии
    if (userName.length < 2) {
        alert('В поле с именем менее 2х символов');
        return;
    }
    if (surname.length < 2) {
        alert('В поле с фамилией менее 2х символов');
        return;
    }

    // проверка возраста
    if (+age < 1 || +age > 130) {
        alert('Возраст должен быть числом от 1 до 130');
        return;
    }

    // проверка телефона
    let telNumbers = getNumbers(tel);
    if ( telNumbers.length < 9 || telNumbers.length > 11) {
        alert("В телефоне должно быть от 9 до 11 цифр (с кодом города или оператора)");
        return;
    }
    let n9FromEnd = telNumbers[telNumbers.length - 9];
    if ( +n9FromEnd === 0) {
        alert("9-я с конца цифр номера телефона не должна быть 0");
        return;
    }

    // проверка email'а
    let emailCharPosition = email.indexOf('@');
    if ( emailCharPosition  === -1) {
        alert("В e-mail'е должен быть символ @");
        return;
    }
    if ( emailCharPosition  === 0 ) {
        alert("В e-mail'е символ @ не должен быть первым");
        return;
    }
    let emailDomain = email.slice(emailCharPosition  + 1);
    let emailDomainDotPosition = emailDomain.indexOf('.');
    if ( emailDomainDotPosition === -1) {
        alert("В домене e-mail'а (тексте, после символа @) должна быть точка");
        return;
    }
    if ( emailDomainDotPosition === 0) {
        alert("В e-mail'е между символом @ и точкой должен быть минимум 1 символ");
        return;
    }
    if ( emailDomainDotPosition + 1 === emailDomain.length) {
        alert("В домене e-mail'а после точкой должен быть минимум 1 символ");
        return;
    }

    let message = `ДАННЫЕ ОТПРАВЛЕНЫ:
    имя - ${userName};
    фамилия - ${surname};
    возраст - ${age};
    телефон - ${tel};
    e-mail - ${email}`
    alert(message);
}
