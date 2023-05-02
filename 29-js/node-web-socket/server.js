'use strict';

// импортируем web-сокеты
const WebSocket = require('ws');

// создаем константу сномером порта сервера
const usedPort = 9000;

// создаем web-сокет-сервер (используя порт, созданный выше)
const socketServer = new WebSocket.Server({ port: usedPort });

// при подключении к серверу вызывать функцию onConnect
socketServer.on('connection', onConnect);

function onConnect( client ) {
    console.log('get new connection');

    // отправляем клиенту сообщение в формате JSON
    client.send( JSON.stringify({ side: 'SERVER', data: 'Hello from server' }) );

    // при получении сообщения от клиента - запускаем функцию getClientMessage
    client.on('message', getClientMessage);
  
    // при отключении клиента - запускаем функцию clientCloseConnection
    client.on('close', clientCloseConnection);
}

function getClientMessage( data ) {
    // выводим сообщение от клиента в виде JavaScript объекта
    console.log('GET MESSAGE:', JSON.parse(data));
}

function clientCloseConnection( data ) {
    // выводим сведения об отключении клиента от сервера
    console.log('CLOSE CONNECTION:', data)
}

