/* Arquivo: src/js/components/mobileMenu.js */
export function initMobileMenu() {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuLinks = document.querySelectorAll('.mobile-menu-link');

    if (!menuButton || !mobileMenu) {
        console.error("Elementos do menu mobile não encontrados.");
        return;
    }

    // Lógica para abrir/fechar o menu
    menuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Lógica para fechar o menu ao clicar em um link
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
}