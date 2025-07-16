ПОДГОТОВКА:
- Установите зависимости:
npm install express+
npm install express cors+
npm install express multer cors
- Запуск модуля
node server.js
- Установка на сервер без инсталяции модулей noda

НАСТРОЙКА:
---------------
Render (Bekend):
- Содержание package.json
{
  "name": "working-with-files",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}