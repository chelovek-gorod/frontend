/*
*** ОПИСАНИЕ РЕАЛИЗОВАННОГО ИГРОВОГО ФУНКЦИОНАЛА ***
(это информационный файл, его не нужно подключать в проект)

*** РАБОТА С ИЗОБРАЖЕНИЯМИ (loader.js) ***
IMG['sprite_images.png'] - получение загруженного изображения по имени файла

*** ОБРАБОТКА СОБЫТИЙ СЕНСОРА, МЫШИ И КЛАВИАТУРЫ (control.js) ***
IS_MOBILE - если true то используется тачскрин, иначе - мышь и клавиатура

if( KEY.keyName ) myFunction() - обработка нажатия клавиш
if(CURSOR.y >= 0 && CURSOR.isClicked) myFunction() - обработка событий мыши или тачпада

*** РАБОТА С ФОНОВОЙ МУЗЫКОЙ И ЗВУКАМИ (music.js) ***
BG_MUSIC.volume = [0...1] - установка громкости фоновой музыки
playBgMusic(['bgm1.mp3', 'bgm2.mp3'], 1) - запустить список файлов музыки начиная со 2-го
playSound('se_explosion.mp3') - проиграть звук указанного файла

*** РАБОТА С ИГРОВОЙ СЦЕНОЙ (render.js) ***
VIEW.width - ширина игрового экрана (в пикселях)
VIEW.height - высота игрового экрана (в пикселях)
VIEW.x - x координата центра игрового экрана (округлена до целого числа)
VIEW.y - y координата центра игрового экрана (округлена до целого числа)

VIEW_DEPENDS_OBJECTS_ARR - массив объектов зависящих от изменений размеров экрана
при изменении размеров экрана у этих объектов будет вызван метод object.resizeScreen()

CONTEXT - контекст для отрисовки графики в canvas

*** ИГРОВЫЕ ФУНКЦИИ И МАТЕМАТИЧЕСКИЕ КОНСТАНТЫ (utils.js) ***
_2PI - 2Пи, удобно при работы с радианами (2Пи радиан = 360 градусов)
_RAD - 1 градус в радианах, удобна для конвертации градусов в радианы (например 90 * _RAD - прямой угол в радианах)

getRandomFloatFromRange(min, max) - Функция возвращает случайное дробное число между min и max
checkObjectVisibility(object) - Функция определяющая находится ли объект object в видимой части экрана (нужно ли его рисовать)
getDistance(object, target) - Функция определения расстояния в пикселях между объектами object и target
moveObject(object, pathSize) - функция перемещения объекта object согласно его направления direction на расстояние pathSize
turnObjectToTarget(object, target, turnAngle) - Функция поворота объекта object к объекту target, на угол turnAngle
moveObjectToTarget(object, target, pathSize) - Функция перемещения объекта object к объекту target на pathSize пикселей
drawLightning(object, target, color=null) - Функция отрисовки электрического разряда между объектами object и target цветом color

*** КЛАССЫ СПРАЙТОВ И ОТРИСОВКИ ТЕКСТА ***
TextSprite(text = '', x = 0, y = 0, options ) - класс для создания текстовых объектов
  let text = new Text('Hi', 10, 100, {color: '#ff0000', size: 32});
  text.render('Win'); - метод для замены текста в объекте
  text.draw(); - метод для отрисовки текста

Sprite(imageName, x, y) - класс для создания статичных спрайтов
  let player = new Sprite('player.png', VIEW.x, VIEW.y);
  player.draw(); - метод для отрисовки спрайта

SpriteSheet(imageName, x, y, frameWidth, frameHeight, frames, fps = 60) - класс для создания анимированных спрайтов
  let fire = new Text('fire.png', VIEW.x, VIEW.y, 64, 96, 12, 60);
  fire.drawWithAnimation(dt); - метод для отрисовки кадров с учетом скорости анимации (dt - время обновления экрана)
  fire.draw(); - метод для отрисовки текущего кадра спрайта (fire.frame) без анимации

TileSprite(tileName, x, y, width, height, horizontalAlign = 'left', verticalAlign = 'top') - класс для создания тайлов
  let background = new Text('tile_32x32px.jpg', 0, 0, 128, 64, 'left', 'top');
  background.draw(); - метод для отрисовки спрайта
*/