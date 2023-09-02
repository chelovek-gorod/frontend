'use strict';

// ИНТЕРФЕЙС

const connectionDiv = document.getElementById('connection');
const containerDiv = document.getElementById('container');

const user = {nickName: '', avatar: ''};

let messageListDiv;

/* доступные аватарки и ник-неймы для них по умолчанию */
let avatarImgPath = 'src/avatars/';
let charactersArr = [
    {imageName: 'antman.png', nickName: 'Человек-Муравей'},
    {imageName: 'captan.png', nickName: 'Капитан Америка'},
    {imageName: 'dragonfly.png', nickName: 'Стрекоза'},
    {imageName: 'draks.png', nickName: 'Дракс'},
    {imageName: 'falcon.png', nickName: 'Сокол'},
    {imageName: 'hawkeye.png', nickName: 'Ястребиный глаз'},
    {imageName: 'gamora.png', nickName: 'Гамора'},
    {imageName: 'groot.png', nickName: 'Грут'},
    {imageName: 'halk.png', nickName: 'Халк'},
    {imageName: 'ironman.png', nickName: 'Тони Старк'},
    {imageName: 'loki.png', nickName: 'Локи'},
    {imageName: 'mantis.png', nickName: 'Мантис'},
    {imageName: 'marvel.png', nickName: 'Капитан Марвел'},
    {imageName: 'mech.png', nickName: 'Альтрон'},
    {imageName: 'mercury.png', nickName: 'Ртуть'},
    {imageName: 'nebula.png', nickName: 'Небула'},
    {imageName: 'panther.png', nickName: 'Черная Пантера'},
    {imageName: 'piter.png', nickName: 'Звездный лорд'},
    {imageName: 'rocket.png', nickName: 'Ракета'},
    {imageName: 'romanov.png', nickName: 'Наташа Романов'},
    {imageName: 'spiderman.png', nickName: 'Человек-Муровей'},
    {imageName: 'strange.png', nickName: 'Доктор Стрендж'},
    {imageName: 'tanas.png', nickName: 'Танас'},
    {imageName: 'thor.png', nickName: 'Тор'},
    {imageName: 'vision.png', nickName: 'Вижен'},
    {imageName: 'wanda.png', nickName: 'Ванда'},
    {imageName: 'yondu.png', nickName: 'Йонду'}
];

function showModalMessage(message) {
	let modalShell = document.createElement("div");
	modalShell.id = 'modalShell';
	modalShell.className = 'full-screen flex-wrapper';
	modalShell.style.zIndex = 3;
	modalShell.onclick = function() {
		this.style.opacity = 0;
		setTimeout(() => this.remove(), 600);
	};

	let modalMessage = document.createElement("div");
	modalMessage.innerHTML = message;
	modalShell.append(modalMessage);

	document.body.append(modalShell);
}

function getDateFromMilliSeconds(ms) {
	let resultHTML;

	let fullDate = new Date(ms);
	let year = fullDate.getFullYear();
	let month = fullDate.getMonth() + 1;
	if (month < 10) month = '0' + month;
	let date = fullDate.getDate();
	resultHTML = [date, month, year].join(' - ');

	let hours = fullDate.getHours();
	let minutes = fullDate.getMinutes();
	resultHTML += `<br><span class="time">${[hours, minutes].join(':')}</span>`;

	let seconds = fullDate.getSeconds();
	resultHTML += `<span class="seconds"> ${seconds > 9 ? seconds : '0'+seconds}</span>`;

	return resultHTML;
}

/* таймер? убирает заставку после запуска приложения и начинает подключения к серверу */
setTimeout(() => {
	document.getElementById('logo').remove();
	connectionDiv.style.display = 'block';
	containerDiv.style.display = 'none';
	setTimeout( connection, 1000 );
}, 6000);

// ПОДКЛЮЧЕНИЕ К СЕРВЕРУ
const socketURL = 'wss://marvel-chat-server-xt0p.onrender.com';
// const socketURL = 'ws://localhost:9000';

/*
НУЖЕН ТОЛЬКО 1 ЗАПУСК ПОПЫТКИ ПОДКЛЮЧЕНИЯ connection()
события socket.onclose и socket.onerror будут вызывать заново connection()
только если он еще не был вызван, что бы не создавать несколько сокетов от одного клиента.
Для этого каждая попытка подключения connectAttempt будет пронумерована глобально,
в функции connection() будет локальная переменная currentConnectAttempt номера текущего подключения.
перед новым вызовам будет сравнение connectAttempt и currentConnectAttempt, и функция connection()
будет запускаться только в случае равенства connectAttempt и currentConnectAttempt.
*/
let connectAttempt = 0;

class Message {
	constructor(nickName, avatar, type, data) {
		this.nickName  = nickName;
		this.avatar = avatar;
		this.type = type;
		this.data = data;
		this.time = Date.now();
	}
};

function connection() {
	connectAttempt++;
	const currentConnectAttempt = connectAttempt;
	console.log(`connection #${connectAttempt}`);
    const socket = new WebSocket(socketURL);

	socket.onopen = function () {
		console.log('connection');
		
		connectionDiv.style.display = 'none';
		containerDiv.style.display = 'block';

        let message = new Message(null, null, 'usedAvatars', null);
		socket.send( JSON.stringify(message) );
	};
  
	socket.onmessage = function (data) {
		let message = JSON.parse(data.data);
		console.log('message:', message);
		switch (message.type) {
			case 'usedAvatars'    : getUsedAvatars(socket, message.data); break;
            case 'avatarIsUsed'   : showModalMessage('Аватарка уже занята'); break;
            case 'nickNameIsUsed' : showModalMessage('Ник-нейм уже занят'); break;
			case 'registrationSuccess' : getRegistration(socket, message); break;
			default : getNewMessage(message);
		}
	};

	socket.onclose = function(event) {
		console.log('connection close:', event);
        connectionDiv.style.display = 'block';
		containerDiv.style.display = 'none';
		if (currentConnectAttempt === connectAttempt) connection();
	};
  
	socket.onerror = function(error) {
		console.log('connection error:', error);
        connectionDiv.style.display = 'block';
		containerDiv.style.display = 'none';
		if (currentConnectAttempt === connectAttempt) connection();
	};
}

function getUsedAvatars(socket, usedAvatarsArr) {
	containerDiv.innerHTML = '';

	let chosenAvatarNode;
	let chosenAvatarName;

	let titleDiv = document.createElement("div");
	titleDiv.id = 'avatarsTitle';
	titleDiv.innerText = 'Выберите Аватарку';
	containerDiv.append(titleDiv);

	let avatarsDiv = document.createElement("div");
	avatarsDiv.id = 'avatars';
	containerDiv.append(avatarsDiv);

	let nickNameInput = document.createElement("input");
	nickNameInput.type = 'text';
	nickNameInput.id = 'inputNickName';
	containerDiv.append(nickNameInput);

	let registrationButton = document.createElement("button");
	registrationButton.id = 'registrationButton';
	registrationButton.innerHTML = 'Регистрация';
	registrationButton.onclick = function() {
		let nickName = nickNameInput.value.trim();
		if (!chosenAvatarNode) showModalMessage('Вы не выбрали аватар');
		else if (!nickName) showModalMessage('Пустой ник-нейм');
		else if (nickName.length < 2) showModalMessage('Слишком короткий ник-нейм<br>(нужно от 2х до 20ти символов)');
		else if (nickName.length > 20) showModalMessage('Слишком длинный ник-нейм<br>(нужно от 2х до 20ти символов)');
		else {
			let message = new Message (nickName, chosenAvatarName, 'registration', null);
			socket.send( JSON.stringify(message) );
		}
	};
	containerDiv.append(registrationButton);

	charactersArr.forEach( character => {
		let disable = usedAvatarsArr.indexOf(character.imageName) > -1 ? true : false;
		
		let avatarImg = document.createElement('img');
		avatarImg.src = avatarImgPath + character.imageName;
		if (disable) avatarImg.className = 'disable';
		else avatarImg.onclick = function() {
			if (chosenAvatarNode) chosenAvatarNode.classList.remove('choose');
			chosenAvatarNode = this;
			chosenAvatarName = character.imageName;
			this.classList.add('choose');
			nickNameInput.value = character.nickName;
		};

		avatarsDiv.append(avatarImg);
	});
}

function getRegistration(socket, data) {
	user.nickName = data.nickName;
    user.avatar = data.avatar;

    containerDiv.innerHTML = '';

    messageListDiv = document.createElement("div");
    messageListDiv.id = 'messages';
    containerDiv.append(messageListDiv);

	let messageArr = data.data;
	messageArr.forEach(message => getNewMessage(message));

    let messageInput = document.createElement("textarea");
    messageInput.id = 'messageInput';
    containerDiv.append(messageInput);

    const inputFile = document.getElementById("inputFile");
    inputFile.onchange = function(event) {
        console.log('--open--', event.target.files.length);
        if (!event.target.files.length) return;
        const reader = new FileReader();
        reader.onload = function(event) {
            let imageData = event.target.result;
            let message = new Message(user.nickName, user.avatar, 'image', imageData);
            socket.send( JSON.stringify(message) );
            messageInput.focus();
        };
        reader.readAsDataURL(event.target.files[0]);
    }

    let sendBoard = document.createElement("div");
    sendBoard.id ="sendBoard";
    containerDiv.append(sendBoard);

    let imageButton = document.createElement("button");
    imageButton.id = 'imageButton';
    imageButton.onclick = function() { inputFile.click() };
    sendBoard.append(imageButton);

    let sendButton = document.createElement("button");
    sendButton.id = 'sendButton';
    sendButton.innerHTML = 'Отправить';
    sendButton.onclick = function() {
        let messageText = messageInput.value.trim();
        if (!messageText) return;

        let message = new Message(user.nickName, user.avatar, 'text', messageText);
        messageInput.value = '';
        socket.send( JSON.stringify(message) );
        messageInput.focus();
    };
    sendBoard.append(sendButton);
}

function getNewMessage(message) {
	let messageDiv = document.createElement("div");

	if(message.type === 'newRegistration' || message.type === 'disconnection') {
		// Служебные сообщения
		messageDiv.className = 'notification';

		let messageImg = document.createElement("img");
		messageImg.src = avatarImgPath + message.avatar;
		messageDiv.append(messageImg);

		let messageTxt = document.createElement("span");
		let messageSystemText = (message.type === 'newRegistration') ? 'теперь в чате' : 'покинул(а) чат';

		messageTxt.innerHTML = `<span class="nick-name">${message.nickName}</span> ${messageSystemText}`;
		messageDiv.append(messageTxt);

	} else {
		// Сообщения от пользователей чата
		messageDiv.className = 'message';
		let messageAuthorAvatar = document.createElement("img");
		messageAuthorAvatar.src = avatarImgPath + message.avatar;
		messageAuthorAvatar.className = 'avatar';
		messageDiv.append(messageAuthorAvatar);

		let messageAuthorNickName = document.createElement("div");
		messageAuthorNickName.innerText = message.nickName;
		messageAuthorNickName.className = 'nick-name';
		messageDiv.append(messageAuthorNickName);

		let messageContent = document.createElement("div");
		if (message.type === 'image') {
            messageContent.innerHTML = `<img src="${message.data}" >`;
        } else {
            messageContent.innerText = message.data;
        }
		messageContent.className = 'message-text';
		messageDiv.append(messageContent);

		let messageTime = document.createElement("div");
		messageTime.innerHTML = getDateFromMilliSeconds(message.time);
		messageTime.className = 'message-date';
		messageDiv.append(messageTime);
	}

	messageListDiv.append(messageDiv);
	messageListDiv.scrollTop = messageListDiv.scrollHeight - messageListDiv.clientHeight;
}
