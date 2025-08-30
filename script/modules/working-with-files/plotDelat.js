//Функционал
let funktionalDelatPlotsOk = document.querySelector("#funktionalDelatPlots");
funktionalDelatPlotsOk.addEventListener("click",funktionalDelatPlots)
async function funktionalDelatPlots() {
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
             const API_URL = `http://localhost:4000/delatPlot`;
             const response = await fetch(API_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({namePlot, nameTyp, nameId})
             });
             const data = await response.json();
             if (response.ok) {
               if (data.status === "duplicate") {
                 alert(`⚠️ Такой записи нет : ${namePlot}`);
               }else if (data.status === "connetTabl") {
                 alert(`⚠️ Такая записи : ${namePlot} ${data.message}`);
               } 
               else if (data.status === "success") {
                 alert(`✅ Запись удалена! Название: ${data.id}`);
                 // Перезагрузка страницы
                 location.reload();
               }
             } else {
               alert(`❌ Ошибка: ${data.message}`);
             }
         } catch (err) {
           alert("❌ Ошибка соединения с сервером!");
           console.error(err);
         }
         //Удаление блока
         document.getSelection(".textWindows").remove();
         //обнуление
         document.querySelector("#infoWindows").style.display = "none";
        }
}