import React, { useState, useRef, useEffect } from 'react';

const playlist = [
  { title: 'Canción 1', artist: 'Artista A', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { title: 'Canción 2', artist: 'Artista B', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { title: 'Canción 3', artist: 'Artista C', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

const MusicPlayer = () => {
  const [currentIndex, setCurrentIndex] = useState(null);
  const audioRef = useRef(null);

  // Auto reproducir siguiente canción cuando termina la actual
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (currentIndex !== null && currentIndex < playlist.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(null); // Termina la playlist
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [currentIndex]);

  useEffect(() => {
    if (audioRef.current && currentIndex !== null) {
      audioRef.current.load();
      audioRef.current.play();
    }
  }, [currentIndex]);

  const playPlaylist = () => setCurrentIndex(0);
  const playSong = (index) => setCurrentIndex(index);

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">🎵 Reproductor de Música</h2>

      <button
        onClick={playPlaylist}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        ▶️ Reproducir Playlist
      </button>

      <ul className="mb-4">
        {playlist.map((song, index) => (
          <li
            key={index}
            className={`cursor-pointer p-2 rounded hover:bg-gray-100 ${
              currentIndex === index ? 'bg-blue-100 font-bold' : ''
            }`}
            onClick={() => playSong(index)}
          >
            {song.title} - {song.artist}
          </li>
        ))}
      </ul>

      {currentIndex !== null && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Reproduciendo: {playlist[currentIndex].title}
          </p>
          <audio ref={audioRef} controls className="w-full mt-2">
            <source src={playlist[currentIndex].url} type="audio/mpeg" />
            Tu navegador no soporta audio.
          </audio>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
