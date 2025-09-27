let add = [];
let funktionalAddEdit = document.querySelector("#funktionalEdit");
funktionalAddEdit.addEventListener("click",funktionalEdit)
async function funktionalEdit(e) {
    let dataName = document.querySelector(".namePoint").getAttribute('data-name');//имя тип точек Рабочии Базовые 
    let dataJobs = document.querySelector(".namePoint").getAttribute('data-jobs');//Тип сьемки Нив Тах
    
    let id = document.querySelector(".namePoint").textContent;
    let positionX = document.getElementById("position X").value.trim();
    let positionY = document.getElementById("position Y").value.trim();
    let vyckaPoint = document.getElementById("vycka").value.trim();
    let date = document.getElementById("date").value.trim();
    // Получаем элементы systemCoordinates
    let selektCoordinateSystem = document.getElementById("coordinateSystem");
    let coordinateSystem = Number(selektCoordinateSystem.options[selektCoordinateSystem.selectedIndex].value);
    // Получаем элементы systemCoordinates
    let selektPositionType = document.getElementById("positionType");    
    let positionType = Number(selektPositionType.options[selektPositionType.selectedIndex].value);
    // Контроль 
    /*add.push(`dataName: ${dataName}, dataJobs: ${dataName} / ${id}:{position:[${positionX},${positionY}], vycka: ${vycka}, date: ${date}, systemCoordinates : ${coordinateSystem}, positionType: ${positionType}}`);    
    console.log(add);*/
    
  
   if (!positionX || !positionY || !vyckaPoint || !date || positionType == "" || coordinateSystem == "") {
   alert("You have not filled in all the fields or the fields were filled in incorrectly.");
    e.preventDefault(); // Останавливаем отправку формы
   } else {

try {
    const API_URL = '/editDat';
    const response = await fetch(API_URL, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({dataName, dataJobs, id, positionX, positionY, vyckaPoint, date, coordinateSystem, positionType})
        });
        const data = await response.json();
        if (response.ok) {
          if (data.status === true){
            alert(`✅ Информация о точке ${data.id} в ${data.groupName} тип ${data.type}`);
            // Перезагрузка страницы
            location.reload();
            //обнуление
            document.querySelector("#import").style.display = "none"; 
            add =[];
          }else{
            alert(`❌ Ошибка: ${data.error}`);    
          }
        }
     } catch (err) {
       alert("❌ Ошибка соединения с сервером!");
       console.error(err);
     }
   }
}