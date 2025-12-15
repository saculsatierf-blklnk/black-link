function createModal(imageSrc, title) {
    const modalHTML = `
        <div id="simple-modal" class="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 opacity-0 transition-opacity duration-300">
            <div class="bg-white rounded-lg shadow-2xl p-4 w-full max-w-3xl transform scale-95 transition-transform duration-300 relative">
                <img src="${imageSrc}" alt="${title}" class="w-full h-auto max-h-[80vh] object-contain rounded-md">
                <p class="text-center font-bold text-lg mt-2 text-diinc-dark">${title}</p>
                <button id="close-simple-modal" class="absolute -top-3 -right-3 bg-white text-diinc-red rounded-full p-2 shadow-lg hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('simple-modal');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('div').classList.remove('scale-95');
    }, 10);

    const closeModal = () => {
        modal.classList.add('opacity-0');
        modal.querySelector('div').classList.add('scale-95');
        setTimeout(() => modal.remove(), 300);
    };

    modal.addEventListener('click', (e) => {
        if (e.target.id === 'simple-modal') {
            closeModal();
        }
    });
    document.getElementById('close-simple-modal').addEventListener('click', closeModal);
}

export function initSimpleModal() {
    const galleryItems = document.querySelectorAll('[data-gallery-item]');
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imageSrc = item.dataset.imageSrc;
            const title = item.dataset.title;
            if (imageSrc && title) {
                createModal(imageSrc, title);
            }
        });
    });
}