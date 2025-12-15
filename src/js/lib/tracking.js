// Arquivo: src/js/lib/tracking.js
export function initDataLayer() {
    window.dataLayer = window.dataLayer || [];
}

export function trackEvent(eventName, eventData) {
    if (!window.dataLayer) {
        initDataLayer();
    }
    window.dataLayer.push({
        event: eventName,
        ...eventData
    });
    console.log(`Tracking Event: ${eventName}`, eventData); // Para depuração
}