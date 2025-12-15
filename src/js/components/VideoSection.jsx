export default function VideoSection() {
  return (
    <div className="flex flex-col gap-8">
      
      {/* VÍDEO 1 - Teaser 1 */}
      <div className="video-container">
        <video
          poster="/capa.jpg"       // Caminho absoluto para a imagem na pasta public
          controls                 // Adiciona controles (play/pause/volume)
          playsInline              // Obrigatório para não abrir em tela cheia forçada no iPhone
          preload="none"           // CRUCIAL: O vídeo não baixa nada até o usuário dar play. Isso "despesa" o site.
          className="w-full h-auto rounded-lg shadow-lg"
        >
          <source src="/teaser1.mp4" type="video/mp4" />
          Seu navegador não suporta este vídeo.
        </video>
      </div>

      {/* VÍDEO 2 - Teaser 2 */}
      <div className="video-container">
        <video
          poster="/capa.jpg"       // Usando a mesma capa (ou mude se tiver outra)
          controls
          playsInline
          preload="none"           // CRUCIAL para performance
          className="w-full h-auto rounded-lg shadow-lg"
        >
          <source src="/teaser2.mp4" type="video/mp4" />
          Seu navegador não suporta este vídeo.
        </video>
      </div>

    </div>
  );
}