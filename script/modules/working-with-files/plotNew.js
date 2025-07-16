//Функционал
let funktionalNewPlotOk = document.querySelector("#funktionalNewPlots");
funktionalNewPlotOk.addEventListener("click",funktionalNewPlot)
async function funktionalNewPlot(e) {
    let namePlot = document.querySelector("#nameCod").value;//name
    let nameTyp = document.querySelector("#nameCod").getAttribute('data-typ');//name typ
    //Контроль
    console.log(namePlot, nameTyp);
    if (!namePlot) {
        alert("The code was entered incorrectly.");
        e.preventDefault(); // Останавливаем отправку формы
    } else {
    const API_URL = `http://localhost:4000/newPlot`;
    const response = await fetch(API_URL, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({namePlot, nameTyp})
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