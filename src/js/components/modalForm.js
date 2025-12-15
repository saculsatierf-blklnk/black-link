// Arquivo: src/js/components/modalForm.js (VERSÃO FINAL)
import { sendLead } from '../lib/api.js';
import { trackEvent } from '../lib/tracking.js';

function createModalHTML(productInterest) {
    return `
        <div id="lead-modal" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 opacity-0 transition-opacity duration-300">
            <div class="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md transform scale-95 transition-transform duration-300 relative">
                <button id="close-modal-button" class="absolute top-2 right-2 text-gray-400 hover:text-diinc-red p-2 text-2xl leading-none">&times;</button>
                <h3 class="text-2xl font-bold text-diinc-dark mb-2">Demonstre seu Interesse</h3>
                <p class="mb-6 text-gray-600">Preencha seus dados e um de nossos consultores entrará em contato em breve.</p>
                <form id="lead-form">
                    <input type="hidden" name="product_interest" value="${productInterest}">
                    <div class="mb-4">
                        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                        <input type="text" id="name" name="name" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-diinc-red">
                    </div>
                    <div class="mb-4">
                        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                        <input type="email" id="email" name="email" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-diinc-red">
                    </div>
                    <div class="mb-6">
                        <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Telefone (com DDD)</label>
                        <input type="tel" id="phone" name="phone" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-diinc-red">
                    </div>
                    <button type="submit" id="submit-lead-button" class="w-full bg-diinc-red text-white py-3 rounded-md font-bold hover:bg-opacity-80 transition-all">Enviar Interesse</button>
                </form>
                <div id="form-feedback" class="mt-4 text-center"></div>
            </div>
        </div>
    `;
}

function closeModal() {
    const modal = document.getElementById('lead-modal');
    if (modal) {
        modal.classList.add('opacity-0');
        modal.querySelector('div').classList.add('scale-95');
        setTimeout(() => modal.remove(), 300);
    }
}

export function openModal(productInterest) {
    if (document.getElementById('lead-modal')) return;
    trackEvent('open_lead_modal', { modal_source: productInterest });

    document.body.insertAdjacentHTML('beforeend', createModalHTML(productInterest));
    
    const modal = document.getElementById('lead-modal');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('div').classList.remove('scale-95');
    }, 10);

    const form = document.getElementById('lead-form');
    modal.addEventListener('click', (e) => {
        if (e.target.id === 'lead-modal') {
            closeModal();
        }
    });
    document.getElementById('close-modal-button').addEventListener('click', closeModal);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = document.getElementById('submit-lead-button');
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        const formData = new FormData(form);
        const leadData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            interest: formData.get('product_interest'),
            url: window.location.href,
        };

        const result = await sendLead(leadData);

        if (result.success) {
            trackEvent('generate_lead', { product: leadData.interest });
            form.parentElement.innerHTML = `<div class="text-center py-8"><h3 class="text-2xl font-bold text-green-600 mb-2">Obrigado!</h3><p>Recebemos seus dados. Em breve, um consultor entrará em contato.</p></div>`;
            setTimeout(closeModal, 4000);
        } else {
            document.getElementById('form-feedback').innerHTML = `<p class="text-red-500">Ocorreu um erro. Por favor, tente novamente.</p>`;
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar Interesse';
        }
    });
}