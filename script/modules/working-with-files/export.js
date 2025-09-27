let runExportAplikac = document.querySelector("#runExportAplikac");
runExportAplikac.addEventListener("click",importLispPoint);
async function importLispPoint(e) {
    let type = document.querySelector("#firstSelectEmport").value;
    let place = document.querySelector("#secondSelectEmport").value;
    let tapeFain = document.querySelector("#tapeFailExport").value;
    //Контроль
    //console.log(type,place);
    try{
        if (!type || !place || !tapeFain) {
        e.preventDefault(); // Останавливаем отправку формы
        }else{
        const API_URL = '/exportLispPoint';
        const response = await fetch(API_URL, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({type, place, tapeFain})
        });

        if (!response.ok) {
            alert("❌ Ошибка экспорта данных!");
            return;
        }
        // 📂 Получаем файл и качаем
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${place}${tapeFain}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        // Перезагрузка страницы
        location.reload();

        //Уведомление
        alert(`✅ Экспорт завершён!\nФайл: ${place}${tapeFain}`);
        }
    } catch (err) {
      alert("❌ Ошибка соединения с сервером!");
      console.error(err);
    }
}