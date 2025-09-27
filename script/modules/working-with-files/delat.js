//Функционал
let funktionalDelatOk = document.querySelector("#funktionalDelat");
funktionalDelatOk.addEventListener("click",funktionalDelat)
async function funktionalDelat(e) {
    let dataName = document.querySelector("#delateNamePoin").getAttribute('data-name');//имя тип точек Рабочии Базовые
    let dataJobs = document.querySelector("#delateNamePoin").getAttribute('data-jobs');//Тип сьемки Нив Тах
    let id = document.querySelector("#delateNamePoin").textContent;
    // Контроль
    //console.log(dataPlace ,dataName ,dataJobs, id);
    if (!id || !dataName) {
    alert("You have not filled in all the fields or the fields were filled in incorrectly.");
    e.preventDefault(); // Останавливаем отправку формы
    } else {
    try {
        const API_URL = `/delatDat`;
        const response = await fetch(API_URL, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({dataName, dataJobs, id})
        });
        const data = await response.json();
        if (response.ok) {
          if (data.status === false) {
            alert(`⚠️ Ошибка при удалении точки: ${data.error}`);
          }else if (data.status === true) {
            alert(`✅ Точка ${id} из ${dataName} удален !`);
            // Перезагрузка страницы
            location.reload();
            //Удаление блока
            document.querySelector(".textWindows").remove();
            //обнуление
            document.querySelector("#infoWindows").style.display = "none";
          }else if (data.status === "nouPoint") {
            alert(`⚠️ Такой записи нет : ${id}`);
          }
        } else {
          alert(`❌ Ошибка: ${data.message}`);
        }
    } catch (err) {
      alert("❌ Ошибка соединения с сервером!");
      console.error(err);
    }
    }
}