'use strict';

// Ссылки на страницы википедии для задания
const HTML_href = 'https://ru.wikipedia.org/wiki/HTML';
const CSS_href = 'https://ru.wikipedia.org/wiki/CSS';
const JS_href = 'https://ru.wikipedia.org/wiki/JavaScript';

// массив ссылка (для удобства использования ссылок в цикле)
let hrefArr = [HTML_href, CSS_href, JS_href];

/*
функция, создающая и возврящающая ссылку на ресурс href,
а также памещающая элемент box внутрь данной ссылки.
*/
function getTagWrappedByLink( box, href) {
    let a = document.createElement('a');
    a.href = href;
    a.className = 'box-link';
    a.target = '_blank';

    a.append(box);
    return a;
}

const main = document.querySelector('main');
const boxes = main.querySelectorAll('.box');
const footer = document.querySelector('footer h2');

boxes.forEach( (box, i) => {
    box.remove();
    let a = getTagWrappedByLink( box, hrefArr[i] );
    main.append( a );
} )

footer.innerHTML = "Разработал <span>Иван Иванов</span> 2023";

/* переменные для дополнительного задания */
const NodeJS_href = 'https://ru.wikipedia.org/wiki/Node.js';
const NodeJS_img = './src/images/nodeJS-logo.png';
const NodeJS_title = 'Node или Node.js';
const NodeJS_description= 'программная платформа, основанная на движке V8 (компилирующем JavaScript в машинный код).'
                        + ' Node.js добавляет возможность JavaScript взаимодействовать с устройствами ввода-вывода'
                        + ' через свой API, подключать другие внешние библиотеки, написанные на разных языках.'
                        + ' Node.js применяется преимущественно на сервере, выполняя роль веб-сервера, но есть возможность'
                        + ' разрабатывать на Node.js и десктопные оконные приложения и программировать микроконтроллеры.';

let box = document.createElement('div');
box.className = 'box';

let img = document.createElement('img');
img.src = NodeJS_img;

let boxInfo = document.createElement('div');
boxInfo.className = 'box-info';

let h2 = document.createElement('h2');
h2.innerText = NodeJS_title;

let p = document.createElement('p');
p.innerText = NodeJS_description;

boxInfo.append( h2 );
boxInfo.append( p );
box.append( img );
box.append( boxInfo );

let linkBox = getTagWrappedByLink(box, NodeJS_href);
main.append( linkBox );