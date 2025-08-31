//Функционал
let funktionalDelatCodOk = document.querySelector("#funktionalDelatCod");  
funktionalDelatCodOk.addEventListener("click",funktionalDelatCod)
async function funktionalDelatCod(e) {
    let idCod = document.querySelector("#delateNameCod").getAttribute('data-id');//id
    let nameCod = document.querySelector("#delateNameCod").innerHTML;//name
    let nameTyp = document.querySelector("#delateNameCod").getAttribute('data-typ');//name typ
    let siteLanguage = localStorage.getItem('siteLanguage') || "eng";//Определение языка
    //Контроль
    //console.log(nameTyp,nameCod, idCod);
        if (!nameCod) {
        alert("The code was entered incorrectly.");
        e.preventDefault(); // Останавливаем отправку формы
        } else {
        try {
        const API_URL = `http://localhost:4000/delatCod`;
        const response = await fetch(API_URL, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({idCod, nameCod, nameTyp})
        });
             const data = await response.json();
             if (response.ok) {
               if (data.status === "duplicate") {
                 alert(`⚠️ Такой записи нет : ${namePlot}`);
               }else if (data.status === "success") {
                 alert(`✅ Код ${nameCod} из ${nameTyp} удален !`);
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

