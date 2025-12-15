import '../css/main.css';

/**
 * LÓGICA 1: Animação das seções ao rolar a página.
 * Utiliza IntersectionObserver para adicionar uma classe de visibilidade 
 * de forma performática quando a seção entra na tela.
 */
const setupScrollAnimation = () => {
  const sections = document.querySelectorAll('main > section');
  if (!sections.length) return;

  // Prepara as seções para a animação
  sections.forEach(section => {
    section.classList.add('fade-in-section', 'opacity-0');
  });

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1, // A animação começa quando 10% da seção está visível
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // A animação ocorre apenas uma vez
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });
};

/**
 * LÓGICA 2: Funcionalidade do botão "Voltar ao Topo".
 * O botão aparece após rolar 300px para baixo.
 */
const setupBackToTopButton = () => {
  const backToTopButton = document.getElementById('back-to-top');
  if (!backToTopButton) return; // Não faz nada se o botão não existir

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.remove('hidden');
    } else {
      backToTopButton.classList.add('hidden');
    }
  };

  const scrollToTop = (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  window.addEventListener('scroll', toggleVisibility);
  backToTopButton.addEventListener('click', scrollToTop);
};

/**
 * LÓGICA 3: Lightbox para visualização de imagens.
 * Abre um pop-up para imagens que possuem o atributo [data-lightbox].
 */
const setupLightbox = () => {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return; // Não faz nada se os elementos do lightbox não existirem

  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const links = document.querySelectorAll('[data-lightbox]');

  if (!lightboxImage || !lightboxCaption || !lightboxClose || !links.length) return;

  const openLightbox = (event) => {
    event.preventDefault();
    const link = event.currentTarget;
    const imageUrl = link.getAttribute('href');
    const imageCaption = link.getAttribute('data-title');
    
    lightboxImage.src = imageUrl;
    lightboxCaption.textContent = imageCaption;
    
    // As classes do seu HTML usam opacity e pointer-events, vamos usá-las diretamente
    lightbox.classList.remove('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
  };

  links.forEach(link => {
    link.addEventListener('click', openLightbox);
  });

  lightboxClose.addEventListener('click', closeLightbox);
  
  // Fecha ao clicar no fundo escuro (overlay)
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  // Fecha ao pressionar a tecla 'Escape'
  document.addEventListener('keydown', (event) => {
    const isLightboxVisible = !lightbox.classList.contains('opacity-0');
    if (event.key === 'Escape' && isLightboxVisible) {
      closeLightbox();
    }
  });
};


// --- INICIALIZAÇÃO DE TODAS AS FUNCIONALIDADES ---
// Como estamos usando <script type="module">, o DOM já está pronto.
// Não é necessário usar DOMContentLoaded.
setupScrollAnimation();
setupBackToTopButton();
setupLightbox();