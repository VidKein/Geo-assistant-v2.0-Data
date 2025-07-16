//Определение языка
const siteLanguage = localStorage.getItem('siteLanguage') || "eng";
//Перевод текста для блока Setting
let langsInfoSetting = {
    "eng": {
        "firstSelectPoint": "Type",
        "secondSelectPoint": "Select type",
        "ErrorLangs":"You haven't selected a language !!!",
        "ErrorEditNamber":"You have not filled in all the fields or the fields were filled in incorrectly !!!",
        "ErrorLoadEdit":"Error loading data !!!",
        "ErrorNamber":"Enter point number !!!",
        "ErrorTypPoint":"Enter point number and type !!!",
        "ConfirmLangs":"Do you want to reset all settings ?",
        "newCod":"Enter code - ",
        "newPlots":"Enter name plots - ",
        "deladCod":"Attention, do you really want to delete - "
    },
    "ua": {
        "firstSelectPoint": "Тип",
        "secondSelectPoint": "Виберіть тип",
        "ErrorLangs":"Ви не вибрали мову !!!",
        "ErrorEditNamber":"Ви не заповнили всі поля або поля були заповнені неправильно !!!",
        "ErrorLoadEdit":"Помилка завантаження даних !!!",
        "ErrorNamber":"Введіть номер пункту !!!",
        "ErrorTypPoint":"Введіть номер і тип точки !!!",
        "ConfirmLangs":"Бажаєте скинути всі налаштування ?",
        "newCod":"Введіть код - ",
        "newPlots":"Введіть назву ділянки - ",
        "deladCod":"Увага, ви справді хочете видалити - "
    },
    "cz": {
        "firstSelectPoint": "Typ",
        "secondSelectPoint": "Vyberte typ",
        "ErrorLangs":"Nevybrali jste jazyk !!!",
        "ErrorEditNamber":"Nevyplnili jste všechna pole nebo byla pole vyplněna nesprávně !!!",
        "ErrorLoadEdit":"Chyba při načítání dat !!!",
        "ErrorNamber":"Zadejte číslo bodu !!!",
        "ErrorTypPoint":"Zadejte číslo bodu a typ !!!",
        "ConfirmLangs":"Chcete obnovit všechna nastavení ?",
        "newCod":"Zadejte kód - ",
        "newPlots":"Zadejte grafy jmen - ",
        "deladCod":"Pozor, opravdu chcete smazat - "
    }
};
//Отображение настроек при нажатии на левые кнопки выбора настроек
        let leftSettingFunctional = document.querySelector(".leftSettingFunctional");
        let blockSetting = leftSettingFunctional.children;     
        for (let i = 0; i < blockSetting.length; i++) {
            blockSetting[i].addEventListener("click", ()=> {
                let rightSettingFunctional = document.querySelector(".rightSettingFunctional").children;
                for (let i = 0; i < rightSettingFunctional.length; i++) {
                  rightSettingFunctional[i].style.display = "none";
                  blockSetting[i].style.backgroundColor = "rgb(242, 242, 242)"
                }
                rightSettingFunctional[i].style.display = "block";
                blockSetting[i].style.backgroundColor = "#c3c4c7"
            }); 
        }
//Действия при нажатии на РАБОЧИИ кнопки внутри блок
let settingBlock = document.querySelector(".rightSettingFunctional").children;
let settingBlockFull = document.querySelector("#settingBlock");
//Тип и Вид работы при Создании, Редоктировании и Удаления точки
let runTypeAndJobsPoint = document.querySelector(".runTypeAndJobsPoint");
let runPlasePoint = document.querySelector(".runPlasePoint");
//Тип и Вид работы при Импорте точки
let runTypeAndJobsPointImport = document.querySelector(".runTypeAndJobsPointImport");
let runPlasePointImport = document.querySelector(".runPlasePointImport");
//Тип и Вид работы при Экспорте точки
let runTypeAndJobsPointEmport = document.querySelector(".runTypeAndJobsPointExport");
let runPlasePointEmport = document.querySelector(".runPlasePointExport");
// Слушаем сообщение от другого скрипта о тип работы
document.addEventListener("typeJobsArray", (type) => {
    let typeJobsArray = type.detail;
    preparationInfoEditPoint(runTypeAndJobsPoint, runPlasePoint, typeJobsArray, "Point");
    preparationInfoEditPoint(runTypeAndJobsPointImport, runPlasePointImport, typeJobsArray, "Input");
    preparationInfoEditPoint(runTypeAndJobsPointEmport, runPlasePointEmport, typeJobsArray, "Emport");
});
for (let i = 0; i < settingBlock.length; i++) {
    settingBlock[i].addEventListener("click",(e)=>{
        if (settingBlock[i].style.display == "block") { 
            //Номер точки
            let namePointAddEditDelat = document.querySelector("#namePointAddEditDelat").value.trim();
            //Работаем с языком
            if (e.target.id == "runLangAplikac") {
                    let lang = document.querySelector("#lang");
                    const currentName = lang.options[lang.selectedIndex].text;
                    const currentValue = lang.options[lang.selectedIndex].value;
                    // Проверяем, соответствует ли введённое значение одному из доступных вариантов
                    if(currentValue !== "Select") {
                        console.log("Выбран язык "+currentName);
                        //LocalStorage - сохраняем язык сайта
                        localStorage.setItem('siteLanguage', currentValue);
                        location.reload(); // Перезагрузка страницы для сброса значений
                    }else{alert(langsInfoSetting[siteLanguage].ErrorLangs)} 
            }
            //Отображаем/не отображаем наименование точки на карте       
            if (e.target.id == "nameDisplay") {
                //LocalStorage - сохраняем язык сайта
                const showPoints = e.target.checked;
                localStorage.setItem('namePointDisplay', showPoints);
                location.reload(); // Перезагрузка страницы для сброса значений
                console.log("namePointDisplay - "+showPoints);
            }
            //Работаем с загрузкой выгрузкой файла
            if (e.target.id == "fileInput") {
                let fileName = document.getElementById('fileName');
                //Загрузка файла
                document.getElementById('fileInput').addEventListener('change', function () {
                    let nameOpenFile = this.files.length ? this.files[0].name : 'File not selected';
                    let status = document.querySelector("#status");
                    status.textContent = "";
                    status.style.display = "none";
                    fileName.textContent = nameOpenFile;
                    if (this.files[0].name == "Jobs_kalendar.xlsx") {
                        document.querySelector("#runCalendAplikac").removeAttribute("disabled");
                        fileName.style.color = "green";
                        status.style.display = "block";
                        status.style.color = "green";
                        status.textContent = "Size : "+(this.files[0].size/1024000).toFixed(3)+"MB. Date : "+this.files[0].lastModifiedDate;
                    } else {
                        document.querySelector("#runCalendAplikac").setAttribute('disabled', '');
                        fileName.style.color = "red";
                        status.style.display = "block";
                        status.style.color = "red";
                        status.textContent = "OPENING: Please select a file with the name: Jobs_kalendar.xlsx";
                    }
                });
            }
            //Добовляем планы участков работы
             if (e.target.className == "newBase" || e.target.className == "newpoligons") {
                document.querySelector("#funktionalNewPlots").style.display = "block"; 
                //Открываем окно
                settingBlockFull.style.display = "none";
                document.querySelector("#infoWindows").style.display = "block";
                //Создание блока
                let textDelat = document.createElement('p');
                textDelat.innerText = langsInfoSetting[siteLanguage].newPlots+e.target.getAttribute('data-typ');
                let input = document.createElement('input');
                input.id = "nameCod";
                input.type = "text";
                input.setAttribute("data-typ", e.target.getAttribute('data-typ'));// typ кода
                document.querySelector(".textWindows").appendChild(textDelat);  
                textDelat.appendChild(input);  
                  //Закрытие изменений
                  document.querySelector(".close-infoWindows").addEventListener("click", ()=>{
                    //Удаление блока
                    textDelat.remove();
                    settingBlockFull.style.display = "block";
                    document.querySelector("#infoWindows").style.display = "none";
                    document.querySelector("#funktionalNewPlots").style.display = "none";
                  });
             }
            //Удаляем планы участков работы
             if (e.target.className == "delatBase" || e.target.className == "delatpoligons") {
                document.querySelector("#funktionalDelatPlots").style.display = "block";
                //Открываем окно
                settingBlockFull.style.display = "none";
                document.querySelector("#infoWindows").style.display = "block";
                //Создание блока
                let textDelat = document.createElement('p');
                textDelat.innerText = langsInfoSetting[siteLanguage].deladCod;
                let span = document.createElement('span');
                span.style = "color:red";
                span.id = "delateNameCod";
                span.setAttribute("data-id", e.target.getAttribute('data-id'));// id кода
                span.setAttribute("data-typ", e.target.getAttribute('data-typ'));// typ кода
                span.innerText = e.target.getAttribute('data-name');    
                document.querySelector(".textWindows").appendChild(textDelat);  
                textDelat.appendChild(span);  
                  //Закрытие изменений
                  document.querySelector(".close-infoWindows").addEventListener("click", ()=>{
                    //Удаление блока
                    textDelat.remove();
                    settingBlockFull.style.display = "block";
                    document.querySelector("#infoWindows").style.display = "none";
                    document.querySelector("#funktionalDelatPlots").style.display = "none";
                });
            }
            //Работаем с загрузкой, редоктированием и удалением информации о точки
            let namePointInfo = document.querySelector(".namePoint");
            //Тип и Вид работы
            let typeAndJobsPoint = document.querySelector(".typeAndJobsPoint");
            //Название Участка работы
            let plasePoint = document.querySelector(".plasePoint");
            //Edit
            if (e.target.id == "runPointEdit") {
                    if (Number(namePointAddEditDelat)) {
                        //Запoлняем дополнительную информацию по точкам
                        //Создаем новые атрибуты
                        let type = document.querySelector("#firstSelectPoint");
                        let place = document.querySelector("#secondSelectPoint");
                        let dataName = type.value;//имя тип точек Рабочии Базовые
                        let dataJobsPlase = place.value;//имя участка работы SOD-11/Нив Тах 
                        typeAndJobsPoint.innerText = type.value;
                        plasePoint.innerText = place.value;
                        infoPoint(dataName ,dataJobsPlase, namePointAddEditDelat);
                        //Передача информации для получения информации
                        async function infoPoint(dataName ,dataJobsPlase, id) {
                            if (!id || !dataName) {
                            alert(langsInfoSetting[siteLanguage].ErrorEditNamber);
                            e.preventDefault(); // Останавливаем отправку формы
                            } else {
                                try {
                                    //Извликаем информацию из файла с КОДами по id
                                    async function loadOptionSelekt(nameSelekt, value) {
                                        const jsonFileKod = './kod/kod.json'; // Укажите URL-адрес json файла
                                        const response = await fetch(jsonFileKod); // Загружаем JSON
                                        const jsonData = await response.json(); // Преобразуем в объект
                                            for (const item of jsonData[siteLanguage][nameSelekt]) {
                                                if (item.id === value) {
                                                    document.getElementById(nameSelekt).value = item.id; // Нашли → возвращаем нащзвание
                                                }
                                            }
                                    }   
                                     const API_URL = `http://localhost:4000/pointDat/${dataName}/${dataJobsPlase}/${id}`;
                                     const response = await fetch(API_URL);
                                     const data = await response.json();
                                     if (response.ok) {
                                        //Открываем окно для внесения информации
                                        settingBlockFull.style.display = "none";
                                        document.querySelector("#import").style.display = "block";
                                        document.querySelector("#funktionalAdd").style.display = "none";
                                        namePointInfo.innerText = namePointAddEditDelat;
                                        document.querySelector(".close-import").id ='editPoint';
                                        //Запoлняем дополнительную информацию по точкам
                                        //Создаем новые атрибуты
                                        let type = document.querySelector("#firstSelectPoint");
                                        let place = document.querySelector("#secondSelectPoint");
                                        if (type.value =="Base") {
                                            namePointInfo.setAttribute("data-name", type.value);//имя тип точек Базовые
                                            namePointInfo.setAttribute("data-jobs", place.value);//Тип сьемки Нив Тах
                                            namePointInfo.removeAttribute("place");
                                            typeAndJobsPoint.innerText = type.value;
                                            plasePoint.innerText = place.value;
                                        }else{
                                            namePointInfo.setAttribute("data-name", type.value);//имя тип точек Рабочии...
                                            namePointInfo.setAttribute("place", place.value);//имя участка работы SOD-11
                                            namePointInfo.removeAttribute("data-jobs");
                                            typeAndJobsPoint.innerText = type.value;
                                            plasePoint.innerText = place.value;
                                        }
                                        //Выводим информацию
                                         document.getElementById("position X").value = data.position[0];
                                         document.getElementById("position Y").value = data.position[1];
                                         document.getElementById("vycka").value = data.vycka;
                                         document.getElementById("date").value = data.date; 
                                         loadOptionSelekt("coordinateSystem" , data.systemCoordinates);
                                         loadOptionSelekt("positionType" , data.positionType);
                
                                         //Закрытие изменений
                                        document.querySelector("#editPoint").addEventListener("click", ()=>{
                                            settingBlockFull.style.display = "block";
                                            document.querySelector("#import").style.display = "none";
                                            document.querySelector(".close-import").removeAttribute("id");
                                            document.querySelector("#funktionalAdd").style.display = "block";
                                        });
                                         
                                     } else {
                                         alert(data.error);
                                     }
                                }catch(error) {
                                    console.error("Errors load file", error);
                                    alert(langsInfoSetting[siteLanguage].ErrorLoadEdit);
                                }
                           }
                         }

                    } else {
                      alert(langsInfoSetting[siteLanguage].ErrorNamber);
                    }
            }
            //Add
            if (e.target.id == "runPointAdd") {
                    if (Number(namePointAddEditDelat && !secondSelectPoint.value == "")) {
                        //Открываем окно для внесения информации
                        settingBlockFull.style.display = "none";
                        document.querySelector("#import").style.display = "block";
                        document.querySelector("#funktionalEdit").style.display = "none";
                        namePointInfo.innerText = namePointAddEditDelat;
                        document.querySelector(".close-import").id ='addPoint';
                        //Запoлняем дополнительную информацию по точкам
                        //Создаем новые атрибуты
                        let type = document.querySelector("#firstSelectPoint");
                        let place = document.querySelector("#secondSelectPoint");
                        if (type.value =="Base") {
                            namePointInfo.setAttribute("data-name", type.value);//имя тип точек Базовые
                            namePointInfo.setAttribute("data-jobs", place.value);//Тип сьемки Нив Тах
                            namePointInfo.removeAttribute("place");
                            typeAndJobsPoint.innerText = type.value;
                            plasePoint.innerText = place.value;
                        }else{
                            namePointInfo.setAttribute("data-name", type.value);//имя тип точек Рабочии...
                            namePointInfo.setAttribute("place", place.value);//имя участка работы SOD-11
                            namePointInfo.removeAttribute("data-jobs");
                            typeAndJobsPoint.innerText = type.value;
                            plasePoint.innerText = place.value;
                        }
                        //Закрытие изменений
                        document.querySelector("#addPoint").addEventListener("click", ()=>{
                            settingBlockFull.style.display = "block";
                            document.querySelector("#import").style.display = "none";
                            document.querySelector(".close-import").removeAttribute("id");
                            document.querySelector("#funktionalEdit").style.display = "block";
                        });
                      } else {
                          alert(langsInfoSetting[siteLanguage].ErrorTypPoint);  
                      }
            }
            //Delat
            if (e.target.id == "runPointDelat") {
                    if (Number(namePointAddEditDelat) && !secondSelectPoint.value == "") {
                        //Открываем окно
                        settingBlockFull.style.display = "none";
                        document.querySelector("#funktionalDelat").style.display = "block"; 
                        document.querySelector("#infoWindows").style.display = "block";
                        //Создание блока
                        let textDelat = document.createElement('p');
                        textDelat.innerText = langsInfoSetting[siteLanguage].deladCod;
                        let span = document.createElement('span');
                        span.style = "color:red";
                        span.id = "delateNamePoin";
                        span.innerText = namePointAddEditDelat;
                        //Тип
                        let typeAndJobsPointDelat = document.createElement('div');
                        typeAndJobsPointDelat.className = "typeAndJobsPointDelat";
                        textDelat.appendChild(typeAndJobsPointDelat);
                        //Вид
                        let plasePointDelat = document.createElement('div');
                        plasePointDelat.className = "plasePointDelat";
                        typeAndJobsPointDelat.after(plasePointDelat);        
                        //Запoлняем дополнительную информацию по точкам
                        //Создаем новые атрибуты
                        let type = document.querySelector("#firstSelectPoint");
                        let place = document.querySelector("#secondSelectPoint");
                        if (type.value =="Base") {
                            span.setAttribute("data-name", type.value);//имя тип точек Базовые
                            span.setAttribute("data-jobs", place.value);//Тип сьемки Нив Тах
                            span.removeAttribute("place");
                            typeAndJobsPointDelat.innerText = type.value;
                            plasePointDelat.innerText = place.value;
                        }else{
                            span.setAttribute("data-name", type.value);//имя тип точек Рабочии...
                            span.setAttribute("place", place.value);//имя участка работы SOD-11
                            span.removeAttribute("data-jobs");
                            typeAndJobsPointDelat.innerText = type.value;
                            plasePointDelat.innerText = place.value;
                        }
                        document.querySelector(".textWindows").appendChild(textDelat);
                        textDelat.appendChild(span);
                        //Закрытие изменений
                        document.querySelector(".close-infoWindows").addEventListener("click", ()=>{
                            //Удаление блока
                            textDelat.remove();
                            settingBlockFull.style.display = "block";
                            document.querySelector("#infoWindows").style.display = "none";
                            document.querySelector("#funktionalDelat").style.display = "none"; 
                        });
                      } else {
                          alert(langsInfoSetting[siteLanguage].ErrorTypPoint);  
                      }
            }
            //Добовляем coordinateSystem/positionType
            if (e.target.className == "newcoordinateSystem" || e.target.className == "newpositionType") {
               document.querySelector("#funktionalNewCod").style.display = "block"; 
              //Открываем окно
              settingBlockFull.style.display = "none";
              document.querySelector("#infoWindows").style.display = "block";
              //Создание блока
              let textDelat = document.createElement('p');
              textDelat.innerText = langsInfoSetting[siteLanguage].newCod+e.target.getAttribute('data-typ');
              let input = document.createElement('input');
              input.id = "nameCod";
              input.type = "text";
              input.setAttribute("data-typ", e.target.getAttribute('data-typ'));// typ кода
              document.querySelector(".textWindows").appendChild(textDelat);  
              textDelat.appendChild(input);  
              //Закрытие изменений
              document.querySelector(".close-infoWindows").addEventListener("click", ()=>{
                //Удаление блока
                textDelat.remove();
                settingBlockFull.style.display = "block";
                document.querySelector("#infoWindows").style.display = "none";
                document.querySelector("#funktionalNewCod").style.display = "none";
              });
            }
            //Удаляем coordinateSystem/positionType
            if (e.target.className == "delatCodecoordinateSystem" || e.target.className == "delatCodepositionType") {
              document.querySelector("#funktionalDelatCod").style.display = "block";
              //Открываем окно
              settingBlockFull.style.display = "none";
              document.querySelector("#infoWindows").style.display = "block";
              //Создание блока
              let textDelat = document.createElement('p');
              textDelat.innerText = langsInfoSetting[siteLanguage].deladCod;
              let span = document.createElement('span');
              span.style = "color:red";
              span.id = "delateNameCod";
              span.setAttribute("data-id", e.target.getAttribute('data-id'));// id кода
              span.setAttribute("data-typ", e.target.getAttribute('data-typ'));// typ кода
              span.innerText = e.target.getAttribute('data-name');    
              document.querySelector(".textWindows").appendChild(textDelat);  
              textDelat.appendChild(span);  
              //Закрытие изменений
              document.querySelector(".close-infoWindows").addEventListener("click", ()=>{
                //Удаление блока
                textDelat.remove();
                settingBlockFull.style.display = "block";
                document.querySelector("#infoWindows").style.display = "none";
                document.querySelector("#funktionalDelatCod").style.display = "none";
              });
            }
            //Import Списком в формате .csv, .txt
            if (e.target.id == "fileInputList") {
                let fileName = document.getElementById('fileNameImport');
                //Загрузка файла
                document.getElementById('fileInputList').addEventListener('change', function () {
                    let nameOpenFile = this.files.length ? this.files[0].name : 'File not selected';
                    let status = document.querySelector("#statusImport");
                    status.textContent = "";
                    status.style.display = "none";
                    fileName.textContent = nameOpenFile;
                    if (this.files[0].type == "text/plain" || this.files[0].type == "text/csv") {
                        document.querySelector("#runImportAplikac").removeAttribute("disabled");
                        fileName.style.color = "green";
                        status.style.display = "block";
                        status.style.color = "green";
                        status.textContent = "Size : "+(this.files[0].size/102400).toFixed(3)+"MB. Date : "+this.files[0].lastModifiedDate;
                    } else {
                        document.querySelector("#runImportAplikac").setAttribute('disabled', '');
                        fileName.style.color = "red";
                        status.style.display = "block";
                        status.style.color = "red";
                        status.textContent = "OPENING: Please select a file with extension: .csv, .txt";
                    }
                })
            }
            //Emport Списком в формате .csv, .txt
            if (e.target.id == "runExportAplikac"){
            let type = document.querySelector("#firstSelectEmport").value;
            let place = document.querySelector("#secondSelectEmport").value;
            let tapeFain = document.querySelector("#tapeFailExport").value;
            let statusExport = document.querySelector("#statusExport");
            statusExport.textContent = "";
            statusExport.style.display = "none";
                if (place == '' || type == '' || tapeFain == '') {
                    statusExport.style.display = "block";
                    statusExport.style.color = "red";
                    statusExport.textContent = "Select type, destination and file format";
                } 
            }
        }
    })
}
//Функция подготовки для информаци в результате работы с точками
function preparationInfoEditPoint(runTypeAndJobsPoint, runPlasePoint, typeJobsArray, nameId) {
                        //Название Участка работы
                        let firstSelectHtml = `
                            <select id="firstSelect`+nameId+`" style="background-color: #cdc4c4; cursor: pointer;">
                                <option value="">`+langsInfoSetting[siteLanguage].firstSelectPoint+`</option>
                            </select>
                        `;
                        runTypeAndJobsPoint.innerHTML = firstSelectHtml;
                        //Название Участка работы
                        let secondSelectHtml =`
                        <select id="secondSelect`+nameId+`"  style="background-color: #0de42b; cursor: pointer;">
                            <option value="">`+langsInfoSetting[siteLanguage].secondSelectPoint+`</option>
                        </select>
                        `;
                        runPlasePoint.innerHTML = secondSelectHtml;

                        // Заполняем первый select (Base, poligons)
                        Object.keys(typeJobsArray).forEach(key => {
                            const option = document.createElement("option");
                            option.value = key;
                            option.textContent = key;
                            document.getElementById("firstSelect"+nameId).appendChild(option);
                        });

                        //Обработчик изменения первого select
                        document.getElementById("firstSelect"+nameId).addEventListener("change", function () {
                            document.getElementById("secondSelect"+nameId).innerHTML = '<option value="">'+langsInfoSetting[siteLanguage].secondSelectPoint+'</option>'; // Очищаем второй select
                            const selectedCategory = this.value;
                            if (selectedCategory) {
                                typeJobsArray[selectedCategory].forEach(subKey => {
                                    const option = document.createElement("option");
                                    option.value = subKey;
                                    option.textContent = subKey;
                                    document.getElementById("secondSelect"+nameId).appendChild(option);
                                });
                            }
                        });
}
//Настройки при загрузке страницы
function loadSettings(){
    // Загружаем язык
    const savedLanguage = localStorage.getItem('siteLanguage');
    if (savedLanguage) {
        document.getElementById('lang').value = savedLanguage;
    }
    // Загружаем настройку отображения точек
    const showPoints = localStorage.getItem('namePointDisplay') === 'true';
    document.getElementById('nameDisplay').checked = showPoints;
}
//Очистка всех настроек
document.getElementById('clearSettings').addEventListener('click', () => {
    if (confirm(langsInfoSetting[siteLanguage].ConfirmLangs)) {
        localStorage.removeItem('namePointDisplay');
        localStorage.removeItem('siteLanguage');
        location.reload(); // Перезагрузка страницы для сброса значений
    }
});
//Заполнение блока Система коорднат-Типы расположения точек
loadCodesOptions("coordinateSystem");
loadCodesOptions("positionType");
async function loadCodesOptions(nameLoad) {
    const jsonFileKod = './kod/kod.json'; // Укажите URL-адрес json файла
    const response = await fetch(jsonFileKod); // Загружаем JSON
    const jsonData = await response.json(); // Преобразуем в объект
    //Заполняем количество
    document.getElementById("leveling"+nameLoad).textContent = " - "+jsonData[siteLanguage][nameLoad].length;
    // Создаем новый div для новых классов
    const loadCodesOptions = document.createElement('div');
    loadCodesOptions.className = "new"+nameLoad; // Добавляем класс
    loadCodesOptions.textContent = "New"; // Устанавливаем текст внутри div
    loadCodesOptions.setAttribute("langs", "New kod");
    loadCodesOptions.setAttribute("data-lang-key", "New kod");
    loadCodesOptions.setAttribute("langs-atr", "title");
    loadCodesOptions.setAttribute("title", "New kod");
    loadCodesOptions.setAttribute("data-typ", nameLoad);// typ кода
    document.getElementById("Level"+nameLoad).appendChild(loadCodesOptions);
        for (const item of jsonData[siteLanguage][nameLoad]) {
            // Создаем новый div заполнения
            const loadOption = document.createElement('div');
            loadOption.className = nameLoad; // Добавляем класс
            loadOption.textContent = item.value; // Устанавливаем текст внутри div
            let delatCode = document.createElement('div');
            delatCode.className = 'delatCode'+nameLoad;
            delatCode.setAttribute("title", "Delat code");
            delatCode.setAttribute("data-name", item.value);// имя кода
            delatCode.setAttribute("data-id", item.id);// id кода
            delatCode.setAttribute("data-typ", nameLoad);// typ кода
            loadOption.appendChild(delatCode);
            document.getElementById("Level"+nameLoad).appendChild(loadOption);
        }
}
//Заполнение блока Участка коорднат - место работы
loadPlotsOptions("Base");
loadPlotsOptions("poligons");
async function loadPlotsOptions(nameLoad){
    //Извлекаем информацию
    const jsonFileKod = './koordinaty/koordinats.json'; // Укажите URL-адрес json файла
    const response = await fetch(jsonFileKod); // Загружаем JSON
    const jsonData = await response.json(); // Преобразуем в объект
    //Извлекаем только ключи второго уровня
    const typeJobs = Object.keys(jsonData).reduce((acc, key) => {
            acc[key] = Object.keys(jsonData[key]); // Берём только ключи второго уровня
            return acc;
    }, {});
    //Заполняем количество  
    document.getElementById("leveling"+nameLoad).textContent = " - "+typeJobs[nameLoad].length;
    // Создаем новый div для новых классов
    const loadNewOption = document.createElement('div');
    loadNewOption.className = "new"+nameLoad; // Добавляем класс
    loadNewOption.textContent = "New"; // Устанавливаем текст внутри div
    loadNewOption.setAttribute("langs", "New plots");
    loadNewOption.setAttribute("data-lang-key", "New plots");
    loadNewOption.setAttribute("langs-atr", "title");
    loadNewOption.setAttribute("title", "New plots");
    loadNewOption.setAttribute("data-typ", nameLoad);// typ кода
    document.getElementById("Level"+nameLoad).appendChild(loadNewOption);
    for (const item of typeJobs[nameLoad]) {
            // Создаем новый div заполнения
            const loadOption = document.createElement('div');
            loadOption.className = nameLoad; // Добавляем класс
            loadOption.textContent = item; // Устанавливаем текст внутри div
            let delatCode = document.createElement('div');
            delatCode.className = 'delat'+nameLoad;
            delatCode.setAttribute("title", "Delat "+nameLoad);
            delatCode.setAttribute("data-name", item);// имя кода
            delatCode.setAttribute("data-id", item);// id кода
            delatCode.setAttribute("data-typ", nameLoad);// typ кода
            loadOption.appendChild(delatCode);
            document.getElementById("Level"+nameLoad).appendChild(loadOption);
    }
}

//Загружаем настройки при загрузке страницы
window.addEventListener('DOMContentLoaded', loadSettings);

//Выход cо страницы geo-assintent.html на страницу аудентификации
document.getElementById('logout').addEventListener('click',()=>{
  localStorage.removeItem('isLoggedIn');
  window.location.href = 'index.html'; // основная страница
});