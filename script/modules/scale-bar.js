// Функция расчета расстояния с использованием формулы гаверсинов
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Радиус Земли в метрах

    const toRadians = (degrees) => (degrees * Math.PI) / 180;

    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Результат в метрах
  }

 // Функция округления длины линейки до кратных 1, 2, 3, 4, 5, 15, 20, 25, 35 и т.д.
 function calculateRoundedLength(distance) {
    const scales = [1, 2, 3, 4, 5, 15, 20, 25, 35, 50, 75, 100, 150, 200, 250, 350, 500, 1000, 2000];
    for (let scale of scales) {
      if (distance <= scale) {
        return scale;
      }
    }
    return Math.ceil(distance / 1000) * 1000; // Для больших расстояний
  }
L.Control.scaleBar = L.Control.extend({
    onAdd: function(map) {
        const scaleBarDiv= L.DomUtil.create('div', 'leaflet-control-scaleBar-map leaflet-control');
        const scaleBarContainer = document.createElement('div');//scaleBarContainer
        scaleBarDiv.appendChild(scaleBarContainer);
        scaleBarContainer.id = 'scaleBarContainer';
        scaleBarContainer.className = 'scale-bar-container';
        const scaleText = document.createElement('div');//scaleText
        scaleText.id = 'scaleText';
        scaleText.className = 'scale-text';
        scaleBarContainer.appendChild(scaleText);
        const scaleBar = document.createElement('div');//scaleBar
        scaleBar.id = 'scaleBar';
        scaleBar.className = 'scale-bar';
        scaleBarContainer.appendChild(scaleBar);

        // Функция для обновления линейки
        function updateScaleBar() {
            // Координаты для расчета расстояния
            const mapSize = map.getSize();
            const point1 = map.containerPointToLatLng([0, mapSize.y / 2]); // Левый край
            const point2 = map.containerPointToLatLng([30, mapSize.y / 2]); // Точка через 50 пикселей
        
            // Расчет расстояния с использованием формулы гаверсинов
            const distance = haversineDistance(
              point1.lat, point1.lng,
              point2.lat, point2.lng
            );
        
            // Округленное значение длины линейки
            const roundedLength = calculateRoundedLength(distance);
        
            // Расчет ширины линейки в пикселях
            const barWidth = (30 / distance) * roundedLength;
        
            // Устанавливаем ширину линейки и обновляем текст
            scaleBar.style.width = `${barWidth}px`;
            if (roundedLength < 1000) {
              scaleText.innerHTML = `${roundedLength} м`;
            } else {
              scaleText.innerHTML = `${(roundedLength / 1000).toFixed(1)} км`;
            }
        }
        // Инициализация линейки
        updateScaleBar();
        // Обновление линейки при изменении масштаба или перемещении карты
        map.on('zoomend moveend', updateScaleBar);
        map.on('baselayerchange', function(e) {
          if (e.name == 'Satelit Map') {
            scaleBar.style.border = '3px solid rgb(255, 255, 255)';
            scaleBar.style.borderTop = 'none';
          }else{
            scaleBar.style.border = '3px solid #202124';
            scaleBar.style.borderTop = 'none';
          }       
        });
        
        return scaleBarDiv;    
    }
});

L.control.scalebar = function(options) {
    return new L.Control.scaleBar(options);
}