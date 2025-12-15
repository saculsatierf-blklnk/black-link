// Arquivo: src/js/components/interactiveMap.js (COM O CAMINHO CORRETO)
import { config } from '../config.js';

// Função que cria o mapa na página
function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // Coordenadas para "Rua Videira, 180 - Patriarca, São Paulo"
    const location = { lat: -23.5385, lng: -46.4912 };

    const map = new google.maps.Map(mapContainer, {
        zoom: 16,
        center: location,
        mapId: 'DIINC_MAP_STYLE',
        disableDefaultUI: true,
        zoomControl: true,
    });

    // Adiciona um marcador no local
    new google.maps.Marker({
        position: location,
        map: map,
        title: "Urbano Videira",
    });
}

// Função que carrega o script da API do Google Maps de forma segura
export function loadGoogleMapsScript() {
    if (window.google && window.google.maps) {
        initMap();
        return;
    }
    
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${config.googleMapsApiKey}&callback=initMap&libraries=maps,marker&v=beta`;
    script.async = true;
    script.defer = true;
    
    window.initMap = initMap;
    
    document.body.appendChild(script);
}