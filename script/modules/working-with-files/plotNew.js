//Функционал
let funktionalNewPlotOk = document.querySelector("#funktionalNewPlots");
funktionalNewPlotOk.addEventListener("click",funktionalNewPlot)
async function funktionalNewPlot(e) {
    let namePlot = document.querySelector("#nameCod").value;//name
    let nameTyp = document.querySelector("#nameCod").getAttribute('data-typ');//name typ
    //Контроль
    //console.log(namePlot, nameTyp);
    if (!namePlot) {
        alert("The code was entered incorrectly.");
        e.preventDefault(); // Останавливаем отправку формы
    } else {
        try {
          const API_URL = `http://localhost:4000/newPlot`;
          const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ namePlot, nameTyp })
          });
          const data = await response.json();
          if (response.ok) {
            if (data.status === "duplicate") {
              alert(`⚠️ Такая запись уже существует: ${namePlot}`);
            } else if (data.status === "success") {
              alert(`✅ Запись добавлена! Название: ${data.id}`);
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