
    const API_KEY = 'AIzaSyC3XLRTTYVeZcoR5PKv2gx_t3xqVQSyme8'; 
    const SEARCH_QUERY = 'cadeirantes';
    const videoContainer = document.getElementById('video-container');

    async function fetchVideo() {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(SEARCH_QUERY)}&type=video&order=date&key=${API_KEY}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
          const video = data.items[0];
          const videoId = video.id.videoId;
          const thumbnailUrl = video.snippet.thumbnails.high.url;
          const title = video.snippet.title;

          videoContainer.innerHTML = `
            <h2>${title}</h2>
            <img src="${thumbnailUrl}" alt="Thumbnail do vídeo" />
            <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
          `;

          // Salva o vídeo no localStorage com timestamp
          const now = Date.now();
          localStorage.setItem('videoCache', JSON.stringify({ videoId, thumbnailUrl, title, timestamp: now }));
        } else {
          videoContainer.innerHTML = '<p>Nenhum vídeo encontrado.</p>';
        }
      } catch (error) {
        console.error('Erro ao buscar vídeo:', error);
        videoContainer.innerHTML = '<p>Erro ao carregar vídeo.</p>';
      }
    }

    function loadCachedOrFetch() {
      const cache = localStorage.getItem('videoCache');

      if (cache) {
        const { videoId, thumbnailUrl, title, timestamp } = JSON.parse(cache);
        const oneDay = 24 * 60 * 60 * 1000;
        const now = Date.now();

        if (now - timestamp < oneDay) {
          videoContainer.innerHTML = `
            <h2>${title}</h2>
            <img src="${thumbnailUrl}" alt="Thumbnail do vídeo" />
            <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
          `;
          return;
        }
      }

      // Se não há cache ou ele expirou, busca novo vídeo
      fetchVideo();
    }

    loadCachedOrFetch();

