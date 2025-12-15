// Arquivo: src/js/components/tabs.js
import { trackEvent } from '../lib/tracking.js';

export function initTabs() {
    const tabContainer = document.getElementById('plantas-tabs');
    if (!tabContainer) return; // Se o container não existir, não faz nada
    
    const tabButtons = tabContainer.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Pega os dados do botão clicado
            const targetId = button.dataset.targetTab;
            const planSize = button.dataset.planSize;

            // Atualiza a aparência dos botões: remove a classe ativa de todos...
            tabButtons.forEach(btn => {
                btn.classList.remove('border-diinc-red', 'text-diinc-red');
                btn.classList.add('border-transparent', 'text-gray-500');
            });
            // ...e adiciona a classe ativa apenas no botão clicado
            button.classList.add('border-diinc-red', 'text-diinc-red');
            button.classList.remove('border-transparent', 'text-gray-500');

            // Esconde todos os conteúdos...
            tabContents.forEach(content => {
                content.classList.add('hidden');
            });
            // ...e mostra apenas o conteúdo alvo
            const targetContent = document.getElementById(targetId);
            if(targetContent) {
                targetContent.classList.remove('hidden');
            }
            
            // Dispara o evento de tracking para o GTM
            trackEvent('view_floor_plan', { plan_size: planSize });
        });
    });
}