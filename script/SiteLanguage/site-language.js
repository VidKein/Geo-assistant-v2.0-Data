document.addEventListener("DOMContentLoaded", function() {
    //Определение языка
    const siteLanguage = localStorage.getItem('siteLanguage') || "eng";
    console.log(siteLanguage);
    // Загрузка языка при загрузке страницы
    loadLanguage(siteLanguage);
    // Функция загрузки JSON-файла и перевода страницы
    function loadLanguage(lang) {
        fetch("./language/"+siteLanguage+".json")
            .then(response => response.json())
            .then(data => {
                //Переводим + /geo-assistant.html страницу
                if (location.pathname == "/geo-assistant.html") {
                translatePageLeaflets(data);
                translatePage(data);
                translatePageAtr(data);
                }else{
                translatePage(data);
                translatePageAtr(data);
                }
            })
            .catch(error => console.error("Error loading language file:", error));
    }
    //Перевод элементов Leaflet
    function translatePageLeaflets(data) {
        const leafletControlZoomIn = document.querySelector('.leaflet-control-zoom-in');
        const leafletControlZoomOut = document.querySelector('.leaflet-control-zoom-out');
        const leafletBarPartLeafletBarPartSingle = document.querySelector('.leaflet-bar-part.leaflet-bar-part-single');
        //console.log(leafletControlZoomIn,leafletControlZoomIn,leafletBarPartLeafletBarPartSingle);    
        leafletControlZoomIn.setAttribute("title", data['leaflet-control-zoom-in']);
        leafletControlZoomOut.setAttribute("title", data['leaflet-control-zoom-out']);
        leafletBarPartLeafletBarPartSingle.setAttribute("title", data['leaflet-bar-part leaflet-bar-part-single']);  
    }
    // Функция перевода элементов по Тегам langs
    //langs = "имя ключа в базе"
    function translatePage(data) {
        const elements = document.querySelectorAll('[langs]');
        elements.forEach(element => {
            //console.log(element);
            const key = element.getAttribute('langs');            
            if (data[key]) {               
                element.textContent = data[key]; 
            }
        });
        //Вкрапление tegs->span
        let buttonСhild = document.querySelectorAll('[langs-child]');         
        buttonСhild .forEach(element => {
            //console.log(element);
            const key = element.getAttribute('langs-child');
            const tegs = element.getAttribute('tegs-child');
            if (data[key]) {     
                element.childNodes[tegs].nodeValue = data[key];          
            }
        });
    }
    // Функция перевода элементов по Тегам langs-atr
    //langs-atr="имя изменяемого атрибута" data-lang-key = "имя ключа в базе"
    function translatePageAtr(data) {
        const elementsAtr = document.querySelectorAll('[langs-atr]');
        elementsAtr.forEach(element => {
            //console.log(element);
            const attr = element.getAttribute('langs-atr'); // Какой атрибут нужно изменить (например, placeholder)
            const key = element.getAttribute('data-lang-key'); // Берём ключ из текущего атрибута
            if (data[key]) {      
                element.setAttribute(attr, data[key]);
            }
        });
    }

});