//Функционал
let funktionalNewCodOk = document.querySelector("#funktionalNewCod");
funktionalNewCodOk.addEventListener("click",funktionalDelatCod)
async function funktionalDelatCod(e) {
    let eng = document.querySelector("#eng").value;//name eng
    let ua = document.querySelector("#ua").value;//name ua
    let cz = document.querySelector("#cz").value;//name cz
    let nameTyp = document.querySelector("#eng").getAttribute('data-typ');//name typ
    let siteLanguage = localStorage.getItem('siteLanguage') || "eng";//Определение языка
    //Контроль
    console.log(eng, ua, cz, nameTyp, siteLanguage);
    if (!eng & !ua & !cz) {
        alert("The code was entered incorrectly.");
        e.preventDefault(); // Останавливаем отправку формы
    } else {
     try {
        const API_URL = `http://localhost:4000/newCod`;
        const response = await fetch(API_URL, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({eng, ua, cz, nameTyp, siteLanguage})
        });
              const data = await response.json();
              if (response.ok) {
                if (data.status === "success") {
                  alert(`✅ Запись добавлена! Название: ${data.eng}, ${data.ua} , ${data.cz}`);
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
