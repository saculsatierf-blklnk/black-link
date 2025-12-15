import React from 'react';
import ReactDOM from 'react-dom/client';
import VideoSection from './components/VideoSection.jsx'; // Caminho baseado na sua imagem

// Procura a div no HTML
const elementoRaiz = document.getElementById('sessao-videos');

if (elementoRaiz) {
  const root = ReactDOM.createRoot(elementoRaiz);
  root.render(
    <React.StrictMode>
      <VideoSection />
    </React.StrictMode>
  );
} else {
  console.error('ERRO: Não encontrei a div com id "sessao-videos" no HTML');
}