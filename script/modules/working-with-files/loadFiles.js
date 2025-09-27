let runCalendAplikac = document.querySelector("#runCalendAplikac");
runCalendAplikac.addEventListener("click",loadFiles);
async function loadFiles() {
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    const response = await fetch('/uploadFile', {
        method: 'POST',
        body: formData
    });
    
    const result = await response.json();
    alert(result.message|| result.error);  
    // Перезагрузка страницы
    location.reload();
    document.querySelector("#runCalendAplikac").setAttribute('disabled', '');
}