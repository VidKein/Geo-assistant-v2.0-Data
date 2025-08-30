//Определение языка
const siteLanguage = localStorage.getItem('siteLanguage') || "eng";
//Загрузка данных о точках из БД 
async function loadDataAllPoind() {
  const API_URL = `http://localhost:4000/all_points?lang=${siteLanguage}`;
  const res = await fetch(API_URL);
  const data = await res.json();
  return data;
}

//Дата сегодня
const todayDate = new Date();
const year = todayDate.getFullYear();
const month = String(todayDate.getMonth() + 1).padStart(2, '0'); // Добавляет ведущий ноль, если нужно
const day = String(todayDate.getDate()).padStart(2, '0'); // Добавляет ведущий ноль, если нужно
//Принятие информации c calendarg.js события
//Сегоднешняя дата при загрузке + передача информации с БД
loadDataAllPoind().then(data => {//сохраняем в переменную
  planningWork(`${year}-${month}-${day}`, data);
  //Динамически изменяемая дата
  document.addEventListener("infoJDataClik", (dataCalendarg) => {
      planningWork(dataCalendarg.detail, data);
      document.querySelector(".todayDate").innerText = dataCalendarg.detail;
  });
});

//План работы
async function planningWork(dateWorld, jsonData) {    
    //Получаем HTML-элементы индикатора загрузки
    let progressContainer = document.getElementById("progress-container");
    let progressBar = document.getElementById("progress-bar");
    let progressText = document.getElementById("progress-text");
    let progressInterval;

    function showLoader() {
        progressContainer.style.display = "block";
        progressBar.style.width = "0%";
        startProgress();
    }

    function hideLoader() {
    clearInterval(progressInterval);
    progressBar.style.transition = `width 0.5s ease-in-out`;
    progressBar.style.width = "100%";

    setTimeout(() => {
        progressContainer.style.display = "none";
    }, 600);
    }

    function startProgress() {
    let percent = 0;
    let intervalTime = 100 / loadFactor;
    let estimatedTime = 5000 / loadFactor; 
    let step = 100 / (estimatedTime / intervalTime);

    progressInterval = setInterval(() => {
        percent += step;
        if (percent >= 100) {
            clearInterval(progressInterval);
            hideLoader();
        }
        progressBar.style.width = percent + "%";
        progressText.innerText = `${Math.round(percent)}%`;
    }, intervalTime);
    }

    //Определяем скорость интернета и мощность системы
    let netSpeed = navigator.connection ? navigator.connection.downlink || 5 : 5;
    let cpuCores = navigator.hardwareConcurrency || 4;
    let ramSize = navigator.deviceMemory || 4;

    let speedFactor = Math.min(netSpeed / 10, 1);
    let powerFactor = Math.min((cpuCores + ramSize) / 10, 1);
    let loadFactor = Math.max(0.3, (speedFactor + powerFactor) / 2);

    //console.log(`Фактор загрузки: ${loadFactor}`);

    //Показываем лоадер перед началом загрузки
    showLoader();

        const searchDateInput = dateWorld;//${year}-${month}-${day} `2024-11-14`
        //Для контроля
        console.log('Дата:', searchDateInput);
        const fileUrl = './xlsx/Jobs_kalendar.xlsx'; // Укажите URL-адрес Excel файла


        // Функция преобразования даты в формат Excel
        function dateToExcelDate(date) {
            const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // Excel "нулевой день"
            const dayInMilliseconds = 24 * 60 * 60 * 1000;
            return Math.floor((date - excelEpoch) / dayInMilliseconds);
        }

        try {
            // Преобразуем дату в числовой формат Excel
            const searchDate = dateToExcelDate(new Date(searchDateInput));

            // Загружаем файл по URL
            const response = await fetch(fileUrl);
            if (!response.ok) {
                throw new Error('Не удалось загрузить файл');
            }

            const fileData = await response.arrayBuffer();
            const workbook = XLSX.read(fileData, { type: 'array' });


            //Экспортируем информаци по типу и типу роботы
            // Извлекаем только ключи второго уровня
            const typeJobs = Object.keys(jsonData).reduce((acc, key) => {
                acc[key] = Object.keys(jsonData[key]); // Берём только ключи второго уровня
                return acc;
            }, {});
            //Для контроля
            //console.log('JSON данные Базовые:', jsonData.Base, 'JSON данные Рабочие:', jsonData.poligons);

            const results = [];
            const resultsTip = {niv: [], trig: [], nivBase: [], trigBase: []};
            const infoJobsPoint = {};
            //baseNiv
            const resultsTipJobsNivBase = {};
            //baseTrig
             const resultsTipJobsTrigBase = {};
            //planningNiv
            const resultsTipJobsNiv = {}; 
            //planningTrig
            const resultsTipJobsTrig = {};

            // Обрабатываем каждый лист
            for (const sheetName of workbook.SheetNames) {
                const sheet = workbook.Sheets[sheetName];

                // Определяем диапазон данных (!ref)
                const range = XLSX.utils.decode_range(sheet['!ref']);
                //Для контроля
                //console.log(`Диапазон данных на листе "${sheetName}":`, range);

                // Ограничиваем обработку только диапазоном с данными
                const sheetData = [];
                for (let row = range.s.r; row <= range.e.r; row++) {
                    const rowData = [];
                    for (let col = range.s.c; col <= range.e.c; col++) {
                        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
                        const cell = sheet[cellAddress];
                        rowData.push(cell ? cell.v : undefined);
                    }
                    sheetData.push(rowData);
                }

                if (sheetData.length === 0) {
                    results.push(`${sheetName}: Лист пустой`);                
                    continue;
                }

                let columnIndex = -1;
                // Ищем дату в первой строке (заголовке)
                const targetRow = sheetData[0];
                targetRow.forEach((cell, index) => {              
                    if (cell === searchDate) {
                        columnIndex = index;
                    }
                });
                if (columnIndex == -1) {
                    if (sheetName !=="Base") {infoJobsPoint[targetRow[0]] = "0";};
                    targetRow[0]
                }

                if (columnIndex === -1) {
                    results.push(`${sheetName}: Дата не найдена`);
                    continue;
                }

                // Проверяем, есть ли значение "1" в найденном столбце
                const colData = sheetData
                    .slice(2) // Пропускаем заголовок
                    .map(row => row[columnIndex]); // Значения из найденного столбца
                const hasOne = colData.some(value => value === 1);
            
                //Для контроля
                //console.log(hasOne);

                //console.log(`Количество найденных точек на листе "${sheetName}":`, colData[0]);
                //Передаем информацию о количестве рабочих точек в календарь  calendarg.js
                if (sheetName !=="Base") {infoJobsPoint[sheetName] = colData[0];};

                if (hasOne) {
                    // Выводим значения из столбца B и C
                    const columnData = sheetData
                        .slice(2) // Пропускаем заголовок
                        .filter((row,index) => colData[index] === 1) // Берем только строки, где в найденном столбце "1"
                        .map(row => ({
                            B: row[1], // Столбец B
                            C: row[2], // Столбец C
                        }));


                         //Создание обьекта с выброной информацией
                         async function addPlace(data, placeInfo, namberInfo, positionInfo, vyckaInfo, dateInfo, systemCoordinatesInfo, positionTypeInfo) {
                           const i = Object.keys(data).length;
                            data[i] = {
                                place: placeInfo,
                                namber: namberInfo,
                                position: positionInfo === undefined ? undefined : [positionInfo[0], positionInfo[1]],
                                vycka: vyckaInfo,
                                date: dateInfo,
                                systemCoordinates: systemCoordinatesInfo,
                                positionType: positionTypeInfo}
                            }
                        //Для контроля
                       //console.log(columnData);
                        if (sheetName == "Base") {                                
                            //Base
                            columnData.forEach(row => {  
                                if (row.C == 'n') {    
                                    if (jsonData.Base.niv[row.B] !== undefined) {
                                        addPlace(resultsTipJobsNivBase, sheetName, row.B, jsonData.Base.niv[row.B].position, jsonData.Base.niv[row.B].vycka, jsonData.Base.niv[row.B].date, jsonData.Base.niv[row.B].systemCoordinates, jsonData.Base.niv[row.B].positionType);
                                        //Для контроля
                                        resultsTip.nivBase.push(`place: ${sheetName} , namber: ${row.B} , position: ${jsonData.Base.niv[row.B].position} , ${jsonData.Base.niv[row.B].position[1]}, vycka: ${jsonData.Base.niv[row.B].vycka}, date: ${jsonData.Base.niv[row.B].date}, systemCoordinates: ${jsonData.Base.niv[row.B].systemCoordinates}, positionType: ${jsonData.Base.niv[row.B].positionType}`);
                                    }
                                    else{
                                        addPlace(resultsTipJobsNivBase, sheetName, row.B, undefined, undefined, undefined, undefined, undefined);
                                        //Для контроля
                                        resultsTip.nivBase.push(`place: ${sheetName} , namber: ${row.B} , data not found in database`);
                                    }
                                } else {
                                    if (jsonData.Base.trig[row.B] !== undefined) {
                                        addPlace(resultsTipJobsTrigBase, sheetName, row.B, jsonData.Base.trig[row.B].position, jsonData.Base.trig[row.B].vycka, jsonData.Base.trig[row.B].date, jsonData.Base.trig[row.B].systemCoordinates, jsonData.Base.trig[row.B].positionType);
                                        //Для контроля
                                        resultsTip.trigBase.push(`place: ${sheetName} , namber: ${row.B} , position: ${jsonData.Base.trig[row.B].position[0]} , ${jsonData.Base.trig[row.B].position[1]}, vycka: ${jsonData.Base.trig[row.B].vycka}, date: ${jsonData.Base.trig[row.B].date}, systemCoordinates: ${jsonData.Base.trig[row.B].systemCoordinates}, positionType: ${jsonData.Base.trig[row.B].positionType}`);
                                    }
                                    else{  
                                        addPlace(resultsTipJobsTrigBase, sheetName, row.B, undefined, undefined, undefined, undefined, undefined);
                                        //Для контроля
                                        resultsTip.trigBase.push(`place: ${sheetName} , namber: ${row.B} , data not found in database`);
                                    }
                                }
                            });
                            
                            results.push(`${sheetName} (leng ${colData[0]}):\n` + resultsTip.nivBase.join('\n') + resultsTip.trigBase.join('\n'));  
                        } else {//poligons
                            columnData.forEach(row => {  
                                if (row.C == 'n') { 
                                    if (jsonData.poligons[sheetName][row.B] !== undefined) {
                                        addPlace(resultsTipJobsNiv, sheetName, row.B, jsonData.poligons[sheetName][row.B].position, jsonData.poligons[sheetName][row.B].vycka, jsonData.poligons[sheetName][row.B].date, jsonData.poligons[sheetName][row.B].systemCoordinates, jsonData.poligons[sheetName][row.B].positionType);
                                        //Для контроля
                                        resultsTip.niv.push(`place: ${sheetName} , namber: ${row.B} , position: ${jsonData.poligons[sheetName][row.B].position[0]} , ${jsonData.poligons[sheetName][row.B].position[1]}, vycka: ${jsonData.poligons[sheetName][row.B].vycka}, date: ${jsonData.poligons[sheetName][row.B].date}, systemCoordinates: ${jsonData.poligons[sheetName][row.B].systemCoordinates}, positionType: ${jsonData.poligons[sheetName][row.B].positionType}`);
                                    }
                                    else{
                                        addPlace(resultsTipJobsNiv, sheetName, row.B, undefined, undefined, undefined, undefined, undefined);
                                        //Для контроля
                                        resultsTip.niv.push(`place: ${sheetName} , namber: ${row.B} , data not found in database`);
                                    }
                                } else {
                                    if (jsonData.poligons[sheetName][row.B] !== undefined) {
                                        addPlace(resultsTipJobsTrig, sheetName, row.B, jsonData.poligons[sheetName][row.B].position, jsonData.poligons[sheetName][row.B].vycka, jsonData.poligons[sheetName][row.B].date, jsonData.poligons[sheetName][row.B].systemCoordinates, jsonData.poligons[sheetName][row.B].positionType);
                                        //Для контроля
                                        resultsTip.trig.push(`place: ${sheetName} , namber: ${row.B} , position: ${jsonData.poligons[sheetName][row.B].position[0]} , ${jsonData.poligons[sheetName][row.B].position[1]}, vycka: ${jsonData.poligons[sheetName][row.B].vycka}, date: ${jsonData.poligons[sheetName][row.B].date}, systemCoordinates: ${jsonData.poligons[sheetName][row.B].systemCoordinates}, positionType: ${jsonData.poligons[sheetName][row.B].positionType}`);
                                    }
                                    else{
                                        addPlace(resultsTipJobsTrig, sheetName, row.B, undefined, undefined, undefined, undefined, undefined);
                                        //Для контроля
                                        resultsTip.trig.push(`place: ${sheetName} , namber: ${row.B} , data not found in database`);
                                    }
                                }
                            });
                            //Для контроля
                            results.push(`${sheetName} (leng ${colData[0]}):\n` + resultsTip.niv.join('\n') + resultsTip.trig.join('\n')); 
                        }
                } else {
                        //Для контроля
                        results.push(`${sheetName}: В столбце нет значения "1".`); 
                }
            }
            //Для контроля        
            //console.log(results.join('\n\n\n'));
            //console.log(resultsTip.niv.join('\n'));
            //console.log(resultsTip.trig.join('\n'));
        
            ///Создаем и отправляем пользовательское событие с данными
            //План работы в другой скрипт main.js  
            const planning = new CustomEvent("planningWork", { detail: {baseNiv: resultsTipJobsNivBase, baseTrig: resultsTipJobsTrigBase, planningNiv: resultsTipJobsNiv, planningTrig: resultsTipJobsTrig}});
            document.dispatchEvent(planning);

            //Название участка и количество точек в другой скрипт calendarg.js
            const infoJobs = new CustomEvent("infoJobsPoint", { detail: infoJobsPoint });
            document.dispatchEvent(infoJobs);
        } catch (error) {
            console.error('Ошибка при обработке файла:', error);
            alert('Ошибка при обработке файла. Проверьте файл и повторите попытку.');
            setTimeout(() => progressContainer.style.display = "none", 2000);
        }  
        //Скрываем индикатор после завершения загрузки
        hideLoader();
}