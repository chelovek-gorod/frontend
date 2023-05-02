'use strict';

// подключаемся к порту на локальном ПК
const socketURL = 'ws://localhost:9000';

// создаем Web-сокет по указанному адресу и порту
let socket = new WebSocket(socketURL);

// при открытии соединения с сервером
socket.onopen = function () {
    console.log('socket on open');

    // отпровляем на сервер сообщение в формате JSON
    socket.send( JSON.stringify({ side: 'CLIENT', data: 'Hello from client!' }) );

    socket.onmessage = function (message) {
        // выводим сообщение от сервера в виде JavaScript объекта
        console.log('GET MESSAGE:', JSON.parse(message.data));
    }
    socket.onclose = function(event) {
        // выводим информацию об отключении от сервера
        console.log('connection terminated:', event);
    }
    socket.onerror = function(error) {
        // выводим информацию об ошибках соединения или передаче данных
        console.log('connection error:', error);
    };
};

