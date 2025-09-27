let add = [];
let funktionalAddEdit = document.querySelector("#funktionalAdd");
funktionalAddEdit.addEventListener("click",funktionalAdd);
async function funktionalAdd(e) {   
    let dataName = document.querySelector(".namePoint").getAttribute('data-name');//имя тип точек Рабочии Базовые 
    let dataJobs = document.querySelector(".namePoint").getAttribute('data-jobs');//Тип сьемки Нив Тах
    
    let id = document.querySelector(".namePoint").textContent;
    let positionX = document.getElementById("position X").value.trim();
    let positionY = document.getElementById("position Y").value.trim();
    let vyckaPoint = document.getElementById("vycka").value.trim();
    let date = document.getElementById("date").value.trim();

    // Получаем элементы systemCoordinates
    let coordinateSystem = Number(document.getElementById("coordinateSystem").value);
    // Получаем элементы systemCoordinates
    let positionType = Number(document.getElementById("positionType").value);
    
    // Контроль
    /*
    add.push(`dataName: ${dataName}, dataJobs: ${dataJobs} / ${id}:{position:[${positionX},${positionY}], vycka: ${vycka}, date: ${date}, systemCoordinates : ${coordinateSystem}, positionType: ${positionType}}`);    
    console.log(add);
    */
  
   if (!positionX || !positionY || !vyckaPoint || !date || positionType == "Select" || coordinateSystem == "Select") {
   alert("You have not filled in all the fields or the fields were filled in incorrectly.");
    e.preventDefault(); // Останавливаем отправку формы
   } else {
     try {
            const API_URL = '/addDat';
            const response = await fetch(API_URL, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({dataJobs, dataName, id, positionX, positionY, vyckaPoint, date, coordinateSystem, positionType})
            });
            const data = await response.json();
            if (response.ok) {
                  if (data.status === "duplicate") {
                    alert(`⚠️ Такая запись № ${data.id} сушествует в раздел ${data.groupName} тип ${data.type}.`);
                  }else if (data.status === "success") {
                    alert(`✅ Запись добавлена! Название: ${data.id}. Раздел ${data.groupName}. Тип ${data.type}.`);
                    // Перезагрузка страницы
                    location.reload();
                  }
                  if (data.status === false) {
                    alert(`⚠️  Ошибка при добавлении точки: ${data.error}.`);
                  }
            } else {
                  alert(`❌ Ошибка: ${data.message}`);
            }
          } catch (err) {
            alert("❌ Ошибка соединения с сервером!");
            console.error(err);
          }
       //обнуление
       document.querySelector("#import").style.display = "none"; 
       add =[];
  }
}