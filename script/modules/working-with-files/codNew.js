//Функционал
let funktionalNewCodOk = document.querySelector("#funktionalNewCod");
funktionalNewCodOk.addEventListener("click",funktionalDelatCod)
async function funktionalDelatCod(e) {
    let nameCod = document.querySelector("#nameCod").value;//name
    let nameTyp = document.querySelector("#nameCod").getAttribute('data-typ');//name typ
    let siteLanguage = localStorage.getItem('siteLanguage') || "eng";//Определение языка
    //Контроль
    console.log(nameCod, nameTyp);
    if (!nameCod) {
        alert("The code was entered incorrectly.");
        e.preventDefault(); // Останавливаем отправку формы
    } else {
    const API_URL = `http://localhost:4000/newCod`;
    const response = await fetch(API_URL, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({nameCod, nameTyp, siteLanguage})
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
