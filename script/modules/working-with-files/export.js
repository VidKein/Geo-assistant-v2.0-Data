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
        const API_URL = 'http://localhost:4000/exportLispPoint';
        const response = await fetch(API_URL, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({type, place, tapeFain})
        });

        if (!response.ok) throw new Error('Ошибка сервера');

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${place}${tapeFain}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);

        //Уведомление
        alert(`Information from  - ${type}/${place} transfer to file ${place}${tapeFain}.`);

        // Перезагрузка страницы
        location.reload();
        }
    } catch (error) {alert('Error: ' + error.message);}
}