const express = require('express');
const fs = require('fs');
const cors = require('cors'); // Для поддержки запросов с других доменов
const path = require('path');// Абсолютный путь к файлу
const multer = require('multer');//Модуль для загрузки файла

const app = express();
const PORT = process.env.PORT || 4000; // Используется переменная окружения или 4000 по умолчанию
app.use(express.json());
app.use(cors()); // Разрешаем CORS для всех источников

// Путь к файлу
//Koordinats
const DATA_FILE = path.join(__dirname,  '..','koordinaty', 'koordinats.json');
//Cod
const DATA_COD = path.join(__dirname,  '..','kod', 'kod.json');
//File
const UPLOAD_FOLDER = path.join(__dirname, '..','xlsx');;

//Редоктирование/чтение данных
//Чтение данных и вывод
app.get('/pointDat/:dataName/:dataJobsPlase/:id', (req, res) => {
    const {dataName ,dataJobsPlase, id} = req.params;   
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      try {
          const jsonData = JSON.parse(data);
          const targetPoint = jsonData[dataName]?.[dataJobsPlase]?.[id];
          if (!targetPoint) {
              return res.status(404).json({ error: `Point ${id} not found in ${dataName}/${dataJobsPlase}` });
          }
          res.json(targetPoint);
      } catch {
          res.status(500).json({ error: 'JSON processing error' });
      }
  });
});
//Редоктирование
app.post('/editDat', (req, res) => { 
  const {dataPlace, dataName, dataJobs, id, positionX, positionY, vyckaPoint, date, coordinateSystem, positionType } = req.body;     
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
      if (err) {
          return res.status(500).json({ error: 'Error reading data.' });
      } else {
          const jsonData = JSON.parse(data);
          if (jsonData[id]) {return res.status(400).json({ error: 'An element with this ID already exists.' });}
          //Собираем в массив 
          if (dataName == "poligons") { 
              jsonData[dataName][dataPlace][id] = {
                  position: [Number(positionX),Number(positionY)],
                  vycka: Number(vyckaPoint),
                  date:date,
                  systemCoordinates: coordinateSystem,
                  positionType: positionType
                };
          }
          if (dataName == "Base")  {
              jsonData[dataName][dataJobs][id] = {
                  position: [Number(positionX),Number(positionY)],
                  vycka: Number(vyckaPoint),
                  date:date,
                  systemCoordinates: coordinateSystem,
                  positionType: positionType
                };
          }
          //Вносим иформацию в файл
          fs.writeFile(DATA_FILE, JSON.stringify(jsonData, null, "\t"), (err) => {
              if (err) {
                console.error('JSON write error: ', err);
                return res.status(500).json({ error: 'Error writing JSON file.' });
              }
              res.json({ success: true, message: `Point data ${id} edited.` });
          });
      }
  });
});

// Добавление данных
app.post('/addDat', (req, res) => { 
    const {dataPlace, dataName, dataJobs, id, positionX, positionY, vyckaPoint, date, coordinateSystem, positionType } = req.body;     
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading data.' });
        } else {
            const jsonData = JSON.parse(data);
            if (jsonData[id]) {return res.status(400).json({ error: 'An element with this ID already exists.' });}
            //Собираем в массив 
            if (dataName == "poligons") { 
                jsonData[dataName][dataPlace][id] = {
                    position: [Number(positionX),Number(positionY)],
                    vycka: Number(vyckaPoint),
                    date:date,
                    systemCoordinates: coordinateSystem,
                    positionType: positionType
                  };
            }
            if (dataName == "Base")  {
                jsonData[dataName][dataJobs][id] = {
                    position: [Number(positionX),Number(positionY)],
                    vycka: Number(vyckaPoint),
                    date:date,
                    systemCoordinates: coordinateSystem,
                    positionType: positionType
                  };
            }
            //Вносим иформацию в файл
            fs.writeFile(DATA_FILE, JSON.stringify(jsonData, null, "\t"), (err) => {
                if (err) {
                  console.error('JSON write error:', err);
                  return res.status(500).json({ error: 'Error writing JSON file.' });
                }
                res.json({ success: true, message: `Point data ${id} added.` });
            });
        }
    });
});

// Удаление данных
app.post('/delatDat', (req, res) => {
  const {dataPlace, dataName, dataJobs, id} = req.body;   
  //Считываем файл  
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading JSON:', err);
      return res.status(500).json({ error: 'Error reading JSON file.' });
    }
    //Парсим файл 
    let jsonData = JSON.parse(data);// Преобразуем JSON в объект
    //Base
    if (dataJobs !== null) {
      if (!jsonData[dataName][dataJobs][id]) {
        return res.status(404).json({ error: 'Item not found.' });
      }
      //Удаляем элемент
      delete jsonData[dataName][dataJobs][id]; // Удаляем элемент по ID
    }
    //poligons
    if (dataPlace !== null) {
      if (!jsonData[dataName][dataPlace][id]) {
        return res.status(404).json({ error: 'Item not found.' });
      }
      //Удаляем элемент
      delete jsonData[dataName][dataPlace][id]; // Удаляем элемент по ID
    }
    
    //Перезаписываем файл
    fs.writeFile(DATA_FILE, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error('JSON write error:', err);
        return res.status(500).json({ error: 'Error writing JSON file.' });
      }
      res.json({ success: true, message: `Data for ID ${id} has been removed.` });
    });

  });

});

// Удаление Cod
app.post('/delatCod', (req, res) => {
  const {idCod, nameCod, nameTyp, siteLanguage} = req.body;
  //Считываем файл  
  fs.readFile(DATA_COD, 'utf8', (err, data) => {  
    if (err) {
      console.error('Error reading JSON:', err);
      return res.status(500).json({ error: 'Error reading JSON.' });
    }
    //Парсим файл 
    let jsonCod = JSON.parse(data);// Преобразуем JSON в объект
    
    if (!jsonCod[siteLanguage][nameTyp]) {
      return res.status(400).json({ error: 'Invalid category.' });
    }

    // Найти индекс элемента по id
    const index = jsonCod[siteLanguage][nameTyp].findIndex(item => item.id == idCod);
    if (index === -1) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    // Удаление элемента без перезаписи всего массива
    jsonCod[siteLanguage][nameTyp].splice(index, 1);

    //Перезаписываем файл
    fs.writeFile(DATA_COD, JSON.stringify(jsonCod, null, 2), (err) => {
      if (err) {
        console.error('JSON write error:', err);
        return res.status(500).json({ error: 'JSON write error.' });
      }
      res.json({ success: true, message: `This code - ${nameCod} deleted.` });
    });
    
  });
});

// Добавление Cod
app.post('/newCod', (req, res) => {
  const {nameCod, nameTyp, siteLanguage} = req.body;
  //Считываем файл  
  fs.readFile(DATA_COD, 'utf8', (err, data) => {  
    if (err) {
      console.error('Error reading JSON:', err);
      return res.status(500).json({ error: 'Error reading JSON file.' });
    }
    //Парсим файл 
    let jsonCod = JSON.parse(data);// Преобразуем JSON в объект
    
    if (!jsonCod[siteLanguage][nameTyp]) {
      return res.status(400).json({ error: 'Invalid category.' });
    }

    // Определяем новый ID как последний ID + 1
    const lastId = jsonCod[siteLanguage][nameTyp].length > 0 ? jsonCod[siteLanguage][nameTyp][jsonCod[siteLanguage][nameTyp].length - 1].id : 0;
    const newId = lastId + 1;

    // Добавление нового элемента
    jsonCod[siteLanguage][nameTyp].push({ id: newId, value: nameCod });

    //Перезаписываем файл
    fs.writeFile(DATA_COD, JSON.stringify(jsonCod, null, 2), (err) => {
      if (err) {
        console.error('Error reading JSON:', err);
        return res.status(500).json({ error: 'Error reading JSON file.' });
      }
      res.json({ success: true, message: `This code - ${nameCod} added.` });
    });
  });
});

// Удаление Места расположения
 app.post('/delatPlot', (req, res) => {
  const {namePlot, nameTyp} = req.body;
    //Считываем файл  
  fs.readFile(DATA_FILE, 'utf8', (err, data) => { 
    if (err) {
      console.error('Error reading JSON:', err);
      return res.status(500).json({ error: 'Error reading JSON file.' });
    }
    //Парсим файл 
    let jsonPlot = JSON.parse(data);// Преобразуем JSON в объект
    
    if (!jsonPlot[nameTyp]) {
      return res.status(400).json({ error: 'Invalid category.' });
    }
    if (Object.keys(jsonPlot[nameTyp][namePlot]).length > 0) {
        res.json({ success: true, message: `Cannot delete full array - ${namePlot}.` });
    } else {
      delete jsonPlot[nameTyp][namePlot];
      //Перезаписываем файл
      fs.writeFile(DATA_FILE, JSON.stringify(jsonPlot, null, 2), (err) => {
        if (err) {
          console.error('Error reading JSON:', err);
          return res.status(500).json({ error: 'Error reading JSON file.' });
        }
        res.json({ success: true, message: `This plot - ${namePlot} delat.` });
      });
    }
  });
});
// Добавление Места расположения
app.post('/newPlot', (req, res) => {
  const {namePlot, nameTyp} = req.body;
  //Считываем файл  
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {  
    if (err) {
      console.error('Error reading JSON:', err);
      return res.status(500).json({ error: 'Error reading JSON file.' });
    }
    //Парсим файл 
    let jsonPlot = JSON.parse(data);// Преобразуем JSON в объект
    
    if (!jsonPlot[nameTyp]) {
      return res.status(400).json({ error: 'Invalid category.' });
    }

    // Добавление нового элемента
    jsonPlot[nameTyp][namePlot] = {};

    //Перезаписываем файл
    fs.writeFile(DATA_FILE, JSON.stringify(jsonPlot, null, 2), (err) => {
      if (err) {
        console.error('Error reading JSON:', err);
        return res.status(500).json({ error: 'Error reading JSON file.' });
      }
      res.json({ success: true, message: `This plot - ${namePlot} added.` });
    });
  });
});

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

//Импорт списка точек
const uploadImport = multer({ storage: multer.memoryStorage() }); // Храним в памяти
app.post('/importLispPoint', uploadImport.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("The file has not been uploaded.");
  const { type, place } = req.body; // Данные из запроса тип , вид/место работы
  const filePoit = req.file; // Файл
  const ext = path.extname(req.file.originalname).toLowerCase();
  let data = [];

  // Обработка CSV или TXT файла
  if (ext === '.csv' || ext === '.txt') {
    const fileContent = req.file.buffer.toString('utf-8');
    const lines = fileContent.split(/\r?\n/).filter(line => line.trim() !== '');

    console.log(lines);
    
    lines.forEach((line) => {
      const values = line.split(';');
      if (values.length >= 7) {
        data.push({
          id: values[0],
          X: parseFloat(values[1]),
          Y: parseFloat(values[2]),
          H: parseFloat(values[3]),
          date: values[4],
          systemCoordinates: parseInt(values[5]),
          positionType: parseInt(values[6])
        });
      }
    });

    console.log(data);

    // Чтение существующего JSON файла
    fs.readFile(DATA_FILE, 'utf-8', (err, existingData) => {
      if (err && err.code !== 'ENOENT') {
        return res.status(500).send('Error reading JSON file.');
      }

      let jsonData = {};
      if (existingData) {
        try {
          jsonData = JSON.parse(existingData);
        } catch (e) {
          return res.status(500).send('Error parsing existing JSON data.');
        }
      }

      // Проверка на дублирование номеров точек
      const addedPoints = [];
      let errors = [];
      data.forEach(item => {
        if (jsonData[type][place][item.id]) {
          errors.push(`Point namber ${item.id} already exists`);
        } else {
          jsonData[type][place][item.id] = {
            position: [item.X, item.Y],
            vycka: item.H,
            date: item.date,
            systemCoordinates: item.systemCoordinates,
            positionType: item.positionType
          };
          addedPoints.push(item.id);
        }
      });

      // Если есть ошибки, возвращаем их в ответ
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      // Запись обновленных данных в файл
      fs.writeFile(DATA_FILE, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          return res.status(500).send('Error writing to JSON file.');
        }
        res.json({ message: 'Data successfully uploaded and added to JSON file.',addedPoints });
      });
    });


  } else {
    return res.status(400).send('Unsupported file format.');
  }
});

// Экспорт данных
// Путь
const EXPORT_DIR = path.join(__dirname,'..','export');
app.use(express.json()); // вместо body-parser
app.post('/exportLispPoint', (req, res) => {
  const {type, place, tapeFain} = req.body; 
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      try {
          const jsonData = JSON.parse(data);
          const targetPoint = jsonData[type][place];
          //console.log(targetPoint);
          // Преобразуем в массив строк
          const lines = Object.entries(targetPoint).map(([id, obj]) => {
            const [x, y] = obj.position;
            return `${id};${x};${y};${obj.vycka};${obj.date};${obj.systemCoordinates};${obj.positionType}`;
          });
          const output = lines.join('\n');

          // Создание папки, если нет
          if (!fs.existsSync(EXPORT_DIR)) {
            fs.mkdirSync(EXPORT_DIR, { recursive: true });
          }

          // Запись в CSV и TXT
          const ext = tapeFain === '.txt' ? '.txt' : '.csv';
          const fileName = `${place}${ext}`;
          const filePath = path.join(EXPORT_DIR, fileName);

          fs.writeFileSync(filePath, output, 'utf8');

          res.download(filePath, fileName, err => {
            if (err) {
             console.error('Error:', err);
            } else {
            // Файл можно удалить после отправки, если нужно (опционально)
            fs.unlinkSync(filePath);
            }
          });
      } catch {res.status(500).send('JSON processing error');} 
  });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});