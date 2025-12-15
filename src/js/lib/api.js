// Arquivo: src/js/lib/api.js
import { config } from '../config.js';

export async function sendLead(leadData) {
    try {
        const response = await fetch(config.webhookEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(leadData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return { success: true };

    } catch (error) {
        console.error('Failed to send lead:', error);
        return { success: false, error: error.message };
    }
}