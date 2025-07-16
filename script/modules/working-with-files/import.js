let runInputAplikac = document.querySelector("#runImportAplikac");
runInputAplikac.addEventListener("click",importLispPoint);
async function importLispPoint(e) {
    let type = document.querySelector("#firstSelectInput").value;
    let place = document.querySelector("#secondSelectInput").value;
    //Контроль
    //console.log(type,place);
    
    try{
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
    
                const response = await fetch('http://localhost:4000/importLispPoint', {
                    method: 'POST',
                    body: formData
                });
                //Выводим информацию
                const result = await response.json();
                if (!response.ok) {
                  alert('Error: \n' + (result.errors ? result.errors.join(', \n') : result.error));
                } else {
                  alert(result.message+'\nNamber import - '+result.addedPoints);
                }
        }

    } catch (error) {
        alert('Server error.');
    }

    // Перезагрузка страницы
    location.reload();
    document.querySelector("#runImportAplikac").setAttribute('disabled', '');
}