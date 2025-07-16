//Функционал
let funktionalDelatOk = document.querySelector("#funktionalDelat");
funktionalDelatOk.addEventListener("click",funktionalDelat)
async function funktionalDelat() {
    let dataPlace = document.querySelector("#delateNamePoin").getAttribute('place');//имя участка работы SOD-11
    let dataName = document.querySelector("#delateNamePoin").getAttribute('data-name');//имя тип точек Рабочии Базовые
    let dataJobs = document.querySelector("#delateNamePoin").getAttribute('data-jobs');//Тип сьемки Нив Тах
    let id = document.querySelector("#delateNamePoin").textContent;
    // Контроль
    //console.log(dataPlace ,dataName ,dataJobs, id);
    if (!id || !dataName) {
    alert("You have not filled in all the fields or the fields were filled in incorrectly.");
    e.preventDefault(); // Останавливаем отправку формы
    } else {
    const API_URL = `http://localhost:4000/delatDat`;
    const response = await fetch(API_URL, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({dataPlace, dataName, dataJobs, id})
    });
    const result = await response.json();
    alert(result.message || result.error);    
    // Перезагрузка страницы
    location.reload();
    //Удаление блока
    document.getSelection(".textWindows").remove();
    //обнуление
    document.querySelector("#infoWindows").style.display = "none";
    }
}