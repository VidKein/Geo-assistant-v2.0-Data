let runInputAplikac = document.querySelector("#runImportAplikac");
runInputAplikac.addEventListener("click",importLispPoint);
async function importLispPoint(e) {
    let type = document.querySelector("#firstSelectInput").value;
    let place = document.querySelector("#secondSelectInput").value;
    //Контроль
    //console.log(type,place);
    

    if (!type && !place) {
        alert("You have not filled in all the fields or the fields were filled in incorrectly.");
         e.preventDefault(); // Останавливаем отправку формы
    } else {
            const formData = new FormData();
            //Передаем файл
            formData.append('file', fileInputList.files[0]);   
            //Передаем информацию о типе и типе/месте работы 
            formData.append('type', type);
            formData.append('place', place);
        try {
          const response = await fetch('/importLispPoint', {
            method: 'POST',
            body: formData
          });

          const data = await response.json();

          if (!response.ok || data.status === false) {
            let msg = `❌ Ошибка импорта.\n\n`;
            if (data.error) msg += `Причина: ${data.error}\n`;
            if (data.total !== undefined) msg += `Всего точек в файле: ${data.total}\n`;
            if (data.added !== undefined) msg += `Добавлено: ${data.added}\n`;
            alert(msg);
          } else {
            let msg = `✅ Файл успешно импортирован!\n\n`;
            msg += `Всего точек в файле: ${data.total}\n`;
            msg += `Добавлено: ${data.added}\n`;
            if (data.addedPoints && data.addedPoints.length > 0) {
              msg += `Добавленные точки: ${data.addedPoints.join(", ")}\n`;
            }
            alert(msg);

            // Перезагрузка + блокировка кнопки
            location.reload();
            document.querySelector("#runImportAplikac").setAttribute('disabled', '');
          }

        } catch (err) {
          alert("❌ Ошибка соединения с сервером!");
          console.error(err);
        }
    }
}