const queries = require("./db/queries");

const express = require('express');
const fs = require('fs');
const cors = require('cors'); // Для поддержки запросов с других доменов
const path = require('path');// Абсолютный путь к файлу
const multer = require('multer');//Модуль для загрузки файла

const app = express();
const PORT = process.env.PORT || 4000; // Используется переменная окружения или 4000 по умолчанию
const HOST = "127.0.0.1";
// Раздаём все статики (css, js, index.html и т.д.)
app.use(express.static(path.join(__dirname, "..")));
app.use(express.json());
app.use(cors()); // Разрешаем CORS для всех источников

//Отдаём фронтенд (папку public)
app.use(express.static("public"));

/*Регистрация*/
//Модули шифрование 
const bcrypt = require('bcrypt');
app.post('/loginGeo', async (req, res) => {
    const {email, password} = req.body;
    try{
        const rows = await queries.postLoginGeo(email);

        if (rows && rows.length > 0) {
            const user = rows[0]; // берём первого пользователя
            const valid = await bcrypt.compare(password, user.password_username);
            if (valid) {
                return res.json({ message: true });
            } else {
                return res.json({ message: false , errorScanBD: "pass"});
            }
        } else {
            return res.json({ message: false, errorScanBD: "email" });
        }
    } catch (err) {
    console.error("Ошибка в /loginGeo:", err);
    res.status(500).json({ status: "error", message: "Ошибка сервера" });
    }
});
/*Подгрузка Календаря*/
// Путь к файлу
const UPLOAD_FOLDER = path.join(__dirname, '..','xlsx')
// Загрузка файла
// Настройка Multer (файл загружается в память)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (
            file.originalname !== 'Jobs_kalendar.xlsx' || 
            file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
            return cb(new Error('Error: Only allowed to upload Jobs_kalendar.xlsx!'), false);
        }
        cb(null, true);
    }
});

// Маршрут для загрузки файла
app.post('/uploadFile', (req, res) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'Error: File not loaded!' });
        }
        const filePath = path.join(UPLOAD_FOLDER, 'Jobs_kalendar.xlsx');
        fs.writeFile(filePath, req.file.buffer, (err) => {
            if (err) {return res.status(500).json({ error: 'Error saving file!' });}
            res.json({ message: 'File uploaded successfully!' });
        });
    });
});

/*ТОЧКИ*/
//Считываем и передаем инфррмацию о Всех точках planning-work.js
app.get("/all_points", async (req, res) => {
  const lang = req.query.lang;
  try{
  //Считываем и передаем инфррмацию о Всех точках planning-work.js
  const {siteLanguage } = req.params;  
  const data = await queries.getAllPointsCombined(lang);
  res.json(data);
  } catch (err) {
    console.error("Ошибка в /all_points:", err);
    res.status(500).json({ status: "error", message: "Ошибка сервера" });
  }
});

//Чтение данных о точке
app.get('/pointDat/:dataName/:dataJobsPlase/:id', async (req, res) => {
    const {dataName ,dataJobsPlase, id} = req.params;
    try{
        const rows = await queries.getPointById(dataName, id, dataJobsPlase);
        if (!rows) {return res.status(404).json({ error: `Point ${id} not found in ${dataName}/${dataJobsPlase}` });}
        res.json(rows);
    } catch (err) {
    console.error("Ошибка в /pointDat:", err);
    res.status(500).json({ status: "error", message: "Ошибка сервера" });
    }
});
//add point
// Добавление данных
app.post('/addDat',  async  (req, res) => { 
  try {
    const data = await queries.postAddDat(req.body);
    res.json(data);
  } catch (err) {
    console.error("Ошибка в /newPlot:", err);
    res.status(500).json({ status: "error", message: "Ошибка сервера" });
  }
});
//edit point
//Редоктирование
app.post('/editDat', async (req, res) => {  
  try {
    const data = await queries.postEditDat(req.body);
    res.json(data);
  } catch (err) {
    console.error("Ошибка в /editDat:", err);
    res.status(500).json({ status: "error", message: "Ошибка сервера" });
  }
});  
//delat point
// Удаление данных
app.post('/delatDat',  async (req, res) => {
  const {dataName, dataJobs, id} = req.body;  
  try {
    const data = await queries.postDelatDat(dataName, dataJobs, id);
    res.json(data);
  } catch (err) {
    console.error("Ошибка в /delatDat:", err);
    res.status(500).json({ status: "error", message: "Ошибка сервера" });
  }
});
/*КОДЫ*/
//Считываем и передаем инфррмацию о коде точек и СК main.js
app.get("/kod", async (req, res) => {
  const lang = req.query.lang
  try{
  //Считываем и передаем инфррмацию о Всех точках planning-work.js
  const data = await queries.getKodLoad(lang);  
  res.json(data);
  } catch (err) {
    console.error("Ошибка в /kod:", err);
    res.status(500).json({ status: "error", message: "Ошибка сервера" });
  }
});

//Добавление Места расположения
app.post('/newPlot', async (req, res) => {
  const {namePlot, nameTyp} = req.body;
  try {
    const data = await queries.postNewPlot(namePlot, nameTyp);
    res.json(data);
  } catch (err) {
    console.error("Ошибка в /newPlot:", err);
    res.status(500).json({ status: "error", message: "Ошибка сервера" });
  }
});
//Удаление Места расположения
 app.post('/delatPlot', async (req, res) => {
  const {namePlot, nameTyp, nameId} = req.body;
  try{
    const data = await queries.postDelatPlot(namePlot, nameTyp, nameId);
    res.json(data);
  } catch (err) {
    console.error("Ошибка в /delatPlot:", err);
    res.status(500).json({ status: "error", message: "Ошибка сервера" });
  }
});

//Добавление Cod
app.post('/newCod', async (req, res) => {
  const {eng, ua, cz , nameTyp, siteLanguage} = req.body;
  try{
  const data = await queries.postNewCod(eng, ua, cz, nameTyp, siteLanguage);
  res.json(data);
  } catch (err) {
    console.error("Ошибка в /newCod:", err);
    res.status(500).json({ status: "error", message: "Ошибка сервера" });
  }
});
//Удаление Cod
app.post('/delatCod', async (req, res) => {
  const {idCod, nameCod, nameTyp} = req.body;
  try{
  const data = await queries.postDelatCod(idCod, nameCod, nameTyp);
  res.json(data);
  } catch (err) {
    console.error("Ошибка в /delatCod:", err);
    res.status(500).json({ status: "error", message: "Ошибка сервера" });
  }
});
/*Экспорт/Импорт*/
//Импорт списка точек
const uploadImport = multer({ storage: multer.memoryStorage() }); // Храним в памяти
app.post('/importLispPoint', uploadImport.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).send("The file has not been uploaded.");
  const { type, place } = req.body; // Данные из запроса тип , вид/место работы
  const filePoit = req.file; // Файл
  const ext = path.extname(filePoit.originalname).toLowerCase();
    let dataPoint = [];
    // Обработка CSV или TXT файла
    if (ext === '.csv' || ext === '.txt') {
      const fileContent = req.file.buffer.toString('utf-8');
      const lines = fileContent.split(/\r?\n/).filter(line => line.trim() !== '');
  
      //Проверка содержания файла
      //console.log(lines);
      
      lines.forEach((line) => {
        const values = line.split(';');
        if (values.length >= 7) {
          dataPoint.push({
            point_id: values[0],
            x: parseFloat(values[1]),
            y: parseFloat(values[2]),
            vycka: parseFloat(values[3]),
            date: values[4],
            systemCoordinates_id: parseInt(values[5]),
            positionType_id: parseInt(values[6])
          });
        }
      });
    } else {
      return res.status(400).send('Unsupported file format.');
    }
  try{
    const data = await queries.postImportPoint(type, place, dataPoint);
    res.json(data);
  } catch (err) {
    console.error("Ошибка в /importLispPoint:", err);
    res.status(500).json({ status: "error", message: "Ошибка сервера" });
  }
});

// Экспорт данных
// Путь
const EXPORT_DIR = path.join(__dirname,'..','export');
app.use(express.json()); // вместо body-parser
app.post('/exportLispPoint', async (req, res) => {
  const {type, place, tapeFain} = req.body; 
  try{
    const rows = await queries.postExportPoint(type, place, tapeFain);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "Нет данных для экспорта" });
    }

    const lines = rows.map(
      (obj) =>
        `${obj.point_id};${obj.x};${obj.y};${obj.vycka};${obj.date};${obj.systemCoordinates_id};${obj.positionType_id}`
    );
    const output = lines.join("\n");

    if (!fs.existsSync(EXPORT_DIR)) {
      fs.mkdirSync(EXPORT_DIR, { recursive: true });
    }

    const ext = tapeFain === ".txt" ? ".txt" : ".csv";
    const fileName = `${place}${ext}`;
    const filePath = path.join(EXPORT_DIR, fileName);

    fs.writeFileSync(filePath, output, "utf8");

    res.download(filePath, fileName, (err) => {
      if (!err) fs.unlinkSync(filePath);
    });
  } catch (err) {
    console.error("Ошибка в /exportLispPoint:", err);
    res.status(500).json({ status: "error", message: "Ошибка сервера" });
  }
});

// Запуск сервера
app.listen(PORT, HOST,() => {
    console.log(`Сервер запущен: https://${HOST}:${PORT}`);
});