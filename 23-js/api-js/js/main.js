'use strict';

const container  = document.getElementById('container');

const inputLatitude  = document.getElementById('inputLatitude');
const inputLongitude = document.getElementById('inputLongitude');
const btnGeolocation = document.getElementById('btnGeolocation');
const btnGetWeather = document.getElementById('btnGetWeather');

btnGeolocation.onclick = getGeolocation;
btnGetWeather.onclick = getWeather;

let geolocation;
function getGeolocation() {
    // попытка определить геолокацию
    if (navigator.geolocation) {
        // метод принимает 2 функции - успешного определения и ошибки определения геолокации
        navigator.geolocation.getCurrentPosition(getGeolocationSuccess, getGeolocationError);
    } else {
        alert("Геолокация не поддерживается браузером");
    }

    // успешное определение геолокации
    function getGeolocationSuccess(position) {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        geolocation =  {lat : lat, lon : lon};
        inputLatitude.value = lat;
        inputLongitude.value = lon;
    }

    // ошибка определения геолокации
    function getGeolocationError(error) {
        alert('Ошибка определения геолокации:', error);
    }
}

function getWeather() {
    if (geolocation) {
        /* INFO: https://github.com/Yeqzids/7timer-issues/wiki/Wiki */
        const URLDomain = 'https://www.7timer.info/bin/astro.php';
        const URLParams = `?lon=${geolocation.lon}&lat=${geolocation.lat}&ac=0&unit=metric&tzshift=0&output=json`;
        fetch( URLDomain + URLParams )
            .then( response => response.json() )
            .then( data => showWeather( data ) );
    } else {
        alert('Геолокация не определена!');
    }
}

// облочность
const cloudCover = {
    '1': '0% - 6%',
    '2': '6% - 19%',
    '3': '19% - 31%',
    '4': '31% - 44%',
    '5': '44% - 56%',
    '6': '56% - 69%',
    '7': '69% - 81%',
    '8': '81% - 94%',
    '9': '94% - 100%'
};

// осадки
const precipitationType = {
    snow: 'Снег',
    rain: 'Дождь',
    frzr: 'Снег с дождем',
    icep: 'Град',
    none: 'Без осадков'
};

// относительная влажность
const relativeHumidity = {
    '-4': '0% - 5%',
    '-3': '5% - 10%',
    '-2': '10% - 15%',
    '-1': '15% - 20%',
    '0': '20% - 25%',
    '1': '25% - 30%',
    '2': '30% - 35%',
    '3': '35% - 40%',
    '4': '40% - 45%',
    '5': '45% - 50%',
    '6': '50% - 55%',
    '7': '55% - 60%',
    '8': '60% - 65%',
    '9': '65% - 70%',
    '10': '70% - 75%',
    '11': '75% - 80%',
    '12': '80% - 85%',
    '13': '85% - 90%',
    '14': '90% - 95%',
    '15': '95% - 99%',
    '16': '100%'
};

// откуда дует ветер
const windDirection = {
    'N': 'Северный',
    'NE': 'Северо-восточный',
    'E': 'Восточный',
    'SE': 'Юго-восточный',
    'S': 'Южный',
    'SW': 'Юго-западный',
    'W': 'Западный',
    'NW': 'Северо-западный'
};

// скорость ветра
const windSpeed = {
    '1': 'Below 0.3 m/s (безветрие)',
    '2': '0.3 - 3.4 m/s (легкий ветер)',
    '3': '3.4 - 8.0 m/s (умеренный ветер)',
    '4': '8.0 - 10.8 m/s (умеренный ветер)',
    '5': '10.8 - 17.2 m/s (сильный ветер)',
    '6': '17.2 - 24.5 m/s (штормовой ветер)',
    '7': '24.5 - 32.6 m/s (сильный штормовой ветер)',
    '8': 'Свыше 32.6 m/s (ураган)'
};

function getStringDateTime( currentDayMilliseconds, addHours ) {
    const monthsList = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Декабря'];
    const countedDate = new Date( currentDayMilliseconds + addHours * 60 * 60 * 1000 );
    return `${countedDate.getDate()} ${monthsList[ countedDate.getMonth() ]} ${countedDate.getHours()}:00`;
}

function showWeather( data ) {
    console.log( data );
    let weatherArr = data.dataseries;

    const currentDate = new Date();
    const currentDayMilliseconds = new Date( currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() ).getTime();
    const timeZone = currentDate.getTimezoneOffset() / -60;

    container.innerHTML = '';

    const table = document.createElement('table');
    table.border = '2px';
    const tHead = document.createElement('thead');
    const tBody = document.createElement('tbody');
    table.append(tHead);
    table.append(tBody);
    container.append(table);

    tHead.innerHTML = `
        <tr>
            <th>ДАТА<br>время</th>
            <th>температура</th>
            <th>влажность</th>
            <th>осадки</th>
            <th>направление<br>ветра</th>
            <th>скорость<br>ветра</th>
            <th>облочность</th>
        </tr>`;

    weatherArr.forEach(data => {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td>' + getStringDateTime( currentDayMilliseconds, (data.timepoint + timeZone) ) + '</td>';
        tr.innerHTML +='<td>' + data.temp2m + '&#8451</td>';
        tr.innerHTML +='<td>' + relativeHumidity[data.rh2m] + '</td>';
        tr.innerHTML +='<td>' + precipitationType[data.prec_type] + '</td>';
        tr.innerHTML +='<td>' + windDirection[data.wind10m.direction] + '</td>';
        tr.innerHTML +='<td>' + windSpeed[data.wind10m.speed] + '</td>';
        tr.innerHTML +='<td>' + cloudCover[data.cloudcover] + '</td>';
        tBody.append(tr);
    });
}