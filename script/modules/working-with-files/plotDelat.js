//Функционал
let funktionalDelatPlotsOk = document.querySelector("#funktionalDelatPlots");
funktionalDelatPlotsOk.addEventListener("click",funktionalDelatPlots)
async function funktionalDelatPlots() {
    let namePlot = document.querySelector("#delateNameCod").innerHTML;//name
    let nameTyp = document.querySelector("#delateNameCod").getAttribute('data-typ');//name typ
    //Контроль
    console.log(namePlot, nameTyp);
        if (!namePlot) {
        alert("The code was entered incorrectly.");
        e.preventDefault(); // Останавливаем отправку формы
        } else {
        const API_URL = `http://localhost:4000/delatPlot`;
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