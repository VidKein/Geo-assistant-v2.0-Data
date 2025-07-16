//Определение языка
const siteLanguage = localStorage.getItem('siteLanguage') || "eng";
class Cal {
    constructor(divId) {
        //Сохраняем идентификатор div
        this.divId = divId;
        // Дни недели с понедельника
        this.DaysOfWeek = {
            "eng": ['Mon','Tue','Wed','Thu','Eri','Sat','Sun'],
            "ua": ['Пн','Вт','Ср','Чт','Пт','Суб','Вс'],
            "cz": ['Po','Út','St','Čt','Pá','So','Ne']
          };

        // Месяцы начиная с января
        this.Months = {
            "eng":['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            "ua": ['Січень', 'Лютий', 'Березень', 'Квітень', 'Квітень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'],
            "cz": ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec']
          };
        //Устанавливаем текущий месяц, год
        var d = new Date();
        this.currMonth = d.getMonth();
        this.currYear = d.getFullYear();
        this.currDay = d.getDate();
    }
    // Переход к следующему месяцу
    nextMonth() {
        if (this.currMonth == 11) {
            this.currMonth = 0;
            this.currYear = this.currYear + 1;
        }
        else {
            this.currMonth = this.currMonth + 1;
        }
        this.showcurr();
        dateClick()
    }
    // Переход к предыдущему месяцу
    previousMonth() {
        if (this.currMonth == 0) {
            this.currMonth = 11;
            this.currYear = this.currYear - 1;
        }
        else {
            this.currMonth = this.currMonth - 1;
        }
        this.showcurr();
        dateClick();
    }
    // Показать текущий месяц
    showcurr() {
        this.showMonth(this.currYear, this.currMonth);
    }
    // Показать месяц (год, месяц)`
    showMonth(y, m) {
        var d = new Date()
            // Первый день недели в выбранном месяце 
            , firstDayOfMonth = new Date(y, m, 7).getDay()
            // Последний день выбранного месяца
            , lastDateOfMonth = new Date(y, m + 1, 0).getDate()
            // Последний день предыдущего месяца
            , lastDayOfLastMonth = m == 0 ? new Date(y - 1, 11, 0).getDate() : new Date(y, m, 0).getDate();
            
        // Отображаем месец год
        document.querySelector("#montYers").innerHTML = this.Months[siteLanguage][m] + ' ' + y;
        // Запись выбранного месяца и года
        var html = '<table>';
        html += '<thead"><tr>';
        html += '<td colspan="7" id="infoJobs"></td>';
        html += '</tr></thead>';
        // заголовок дней недели
        html += '<tr class="days">';
        for (var i = 0; i < this.DaysOfWeek[siteLanguage].length; i++) {
            html += '<td>' + this.DaysOfWeek[siteLanguage][i] + '</td>';
        }
        html += '</tr>';
        // Записываем дни
        var i = 1;
        do {
            var dow = new Date(y, m, i).getDay();
            // Начать новую строку в понедельник
            if (dow == 1) {
                html += '<tr>';
            }

            // Если первый день недели не понедельник показать последние дни предыдущего месяца
            else if (i == 1) {
                html += '<tr>';
                var k = lastDayOfLastMonth - firstDayOfMonth + 1;
                for (var j = 0; j < firstDayOfMonth; j++) {
                    html += '<td class="not-current">' + k + '</td>';
                    k++;
                }
            }
            // Записываем текущий день в цикл
            var chk = new Date();
            var chkY = chk.getFullYear();
            var chkM = chk.getMonth();
            if (chkY == this.currYear && chkM == this.currMonth && i == this.currDay) {
                html += '<td class="today" date="'+y+'-'+String(m + 1).padStart(2, '0')+'-'+String(i).padStart(2, '0')+'" title="'+y+'-'+String(m + 1).padStart(2, '0')+'-'+String(i).padStart(2, '0')+'" >' + i + '<div langs = "textTodaj" class="textTodaj">Today</div></td>';
            } else {
                html += '<td class="normal" date="'+y+'-'+String(m + 1).padStart(2, '0')+'-'+String(i).padStart(2, '0')+'"   title="'+y+'-'+String(m + 1).padStart(2, '0')+'-'+String(i).padStart(2, '0')+'" >' + i + '</td>';
            }
            // закрыть строку в воскресенье
            if (dow == 0) {
                html += '</tr>';
            }

            // Если последний день месяца не воскресенье, показать первые дни следующего месяца
            else if (i == lastDateOfMonth) {
                var k = 1;
                for (dow; dow < 7; dow++) {
                    html += '<td class="not-current">' + k + '</td>';
                    k++;
                }
            }
            i++;
        } while (i <= lastDateOfMonth);
        // Конец таблицы
        html += '</table>';
        // Записываем HTML в div
        document.getElementById(this.divId).innerHTML = html;
    }
}
// При загрузке окна
window.onload = function() {
  // Начать календарь
  var c = new Cal("divCal");			
  c.showcurr();
  // Привязываем кнопки «Следующий» и «Предыдущий»
  getId('btnNext').onclick = function() {
    c.nextMonth();
    document.querySelector("#infoJobs").textContent = "Select date";
  };
  getId('btnPrev').onclick = function() {
    c.previousMonth();
    document.querySelector("#infoJobs").textContent = "Select date";
  };
  dateClick();
}
// Получить элемент по id
function getId(id) {return document.getElementById(id);    
}

//Функция передачи даты при нажатии на календарь   
function dateClick() {
const dateCalendar = document.getElementsByTagName("table");
dateCalendar[0].addEventListener("click",(e)=>{         
    let date = e.target.getAttribute('date');   
    if (e.target.tagName === "TD") {
        if (e.target.className == "normal") {
            //Изменение при нажатии 
            let normal = document.getElementsByClassName("normal");
            for (let i = 0; i < normal.length; i++) {
                normal[i].className = normal[i].className.replace(" active", "");
            };
            e.target.className += " active";
            let today = document.getElementsByClassName("today");
            if (today.length !== 0) {
                today[0].className = today[0].className.replace(" active", "");
            }
        }
        if (e.target.className == "today") {
            //Изменение при нажатии 
            let normal = document.getElementsByClassName("normal");
            for (let i = 0; i < normal.length; i++) {
                normal[i].className = normal[i].className.replace(" active", "");
            };
            e.target.className += " active";
        }
        //Передача информации до planning-work.js события
        const dataCalendarg = new CustomEvent("infoJDataClik", { detail: date });
        document.dispatchEvent(dataCalendarg);
    }
    if (document.querySelector(".pointJobs").textContent) {document.querySelector(".pointJobs").textContent = "";}
})
}
// Слушаем сообщение от другого скрипта о название участка и количество точек
document.addEventListener("infoJobsPoint", (infoJobs) => {
    let infoJobsPoint = infoJobs.detail;
    if (document.querySelector("#infoJobs")) {document.querySelector("#infoJobs").textContent = "";} 
    infoJobsPointRun(infoJobsPoint); 
});
//Создаем инфрмацию о работе
function infoJobsPointRun(infoJobsPoint){ 
    for (const kej in infoJobsPoint) {
        const infoJob = document.createElement('div');
        infoJob.id = "infoJobsPoint";
        infoJob.textContent = kej+" : "+infoJobsPoint[kej];  
        if (document.querySelector("#infoJobs")) {
          document.querySelector("#infoJobs").appendChild(infoJob);  
        } 
    }
}