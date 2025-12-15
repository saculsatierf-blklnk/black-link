// Arquivo: src/js/components/galleryModal.js

import PhotoSwipeLightbox from 'photoswipe/lightbox';

export function initGalleryModal() {
  const galleryButtons = document.querySelectorAll('.gallery-button');
  if (!galleryButtons.length) {
    return;
  }

  galleryButtons.forEach(button => {
    const galleryId = button.dataset.galleryId;
    if (!galleryId) return;

    const lightbox = new PhotoSwipeLightbox({
      gallery: `#${galleryId}`,
      children: 'a',
      pswpModule: () => import('photoswipe'),
    });

    button.addEventListener('click', (event) => {
      event.preventDefault();
      lightbox.init();
      lightbox.loadAndOpen(0);
    });
  });
}