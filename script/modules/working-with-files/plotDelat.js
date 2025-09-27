//Функционал
let funktionalDelatPlotsOk = document.querySelector("#funktionalDelatPlots");
funktionalDelatPlotsOk.addEventListener("click",funktionalDelatPlots)
async function funktionalDelatPlots(e) {
    let namePlot = document.querySelector("#delateNameCod").innerHTML;//name
    let nameTyp = document.querySelector("#delateNameCod").getAttribute('data-typ');//name typ
    let nameId = document.querySelector("#delateNameCod").getAttribute('data-id');//name id
    //Контроль
    //console.log(namePlot, nameTyp);    
        if (!namePlot) {
        alert("The code was entered incorrectly.");
        e.preventDefault(); // Останавливаем отправку формы
        } else {
        try {
             const API_URL = `/delatPlot`;
             const response = await fetch(API_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({namePlot, nameTyp, nameId})
             });
             const data = await response.json();
             if (response.ok) {
               if (data.status === "nouCod") {
                 alert(`⚠️ Такой записи нет : ${namePlot}`);
               }else if (data.status === "connetTabl") {
                 alert(`⚠️ Такая записи : ${namePlot} ${data.message}`);
               } 
               else if (data.status === "success") {
                 alert(`✅ Запись удалена! Название: ${data.id}`);
                 // Перезагрузка страницы
                 location.reload();
                  //Удаление блока
                  document.querySelector(".textWindows").remove();
                  //обнуление
                  document.querySelector("#infoWindows").style.display = "none";
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