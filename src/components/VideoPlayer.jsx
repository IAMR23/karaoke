import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";

export default function VideoPlayer() {
  const playlist = [
    {
      url: "https://www.youtube.com/watch?v=Ys7-6_t7OEQ",
      title: "Canción 1",
    },
    {
      url: "https://www.youtube.com/watch?v=I5EC0Hryn80",
      title: "Canción 2",
    },
    {
      url: "https://www.dropbox.com/scl/fi/0o31070hzrn1gbl9h6vuz/350-PIMPINELA-SE-VA-SE-VA.mp4?rlkey=2m1bbq0ajkxnpddj605dsw0t7&st=f3jm4v2t&dl=1",
      title: "Canción 3",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNextMessage, setShowNextMessage] = useState(false);
  const [nextSongName, setNextSongName] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef();
  const containerRef = useRef();

  const currentVideo = playlist[currentIndex];

  const nextVideo = () => {
    if (currentIndex < playlist.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowNextMessage(false);
    }
  };

  const prevVideo = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setShowNextMessage(false);
    }
  };

  const handleProgress = ({ playedSeconds }) => {
    const duration = playerRef.current?.getDuration?.();
    if (duration && duration - playedSeconds <= 20) {
      const next = playlist[currentIndex + 1];
      if (next) {
        setNextSongName(next.title);
        setShowNextMessage(true);
      }
    } else {
      setShowNextMessage(false);
    }
  };

  // Detección de modo pantalla completa
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fsElement =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;

      setIsFullscreen(!!fsElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Entrar en pantalla completa desde el botón
  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        margin: "auto",
        position: "relative",
        background: "#000",
      }}
    >
      {/* Mensaje administrador */}
      {!isFullscreen && (
        <p style={{ fontWeight: "bold", textAlign: "center", color: "white" }}>
          💡 Mensaje del administrador: ¡Recuerda hidratarte!
        </p>
      )}

      {/* Reproductor y overlays */}
      <div style={{ position: "relative" }}>
        <ReactPlayer
          ref={playerRef}
          url={currentVideo.url}
          controls
          playing
          width="100%"
          height={isFullscreen ? "100vh" : "500px"}
          onProgress={handleProgress}
          onEnded={nextVideo}
          config={{
            youtube: {
              playerVars : {
                fs : 0 , 
              }
            }
          }} 
        />

        {/* Flechas de navegación */}
        <button
          onClick={prevVideo}
          disabled={currentIndex === 0}
          style={{
            position: "absolute",
            top: "50%",
            left: "10px",
            transform: "translateY(-50%)",
            fontSize: "30px",
            background: "rgba(0,0,0,0.5)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            padding: "10px",
            cursor: currentIndex === 0 ? "not-allowed" : "pointer",
          }}
        >
          ‹
        </button>

        <button
          onClick={nextVideo}
          disabled={currentIndex === playlist.length - 1}
          style={{
            position: "absolute",
            top: "50%",
            right: "10px",
            transform: "translateY(-50%)",
            fontSize: "30px",
            background: "rgba(0,0,0,0.5)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            padding: "10px",
            cursor:
              currentIndex === playlist.length - 1 ? "not-allowed" : "pointer",
          }}
        >
          ›
        </button>

        {/* Mensaje de siguiente canción */}
        {showNextMessage && (
          <div
            style={{
              position: "absolute",
              bottom: isFullscreen ? "100px" : "60px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "rgba(0,0,0,0.8)",
              color: "white",
              padding: "12px 20px",
              borderRadius: "12px",
              fontSize: isFullscreen ? "24px" : "18px",
              zIndex: 9999,
            }}
          >
            🎶 Próxima canción: {nextSongName}
          </div>
        )}

        {/* Botón para pantalla completa */}
        <button
          onClick={toggleFullscreen}
          style={{
            position: "absolute",
            top: "40px",
            right: "10px",
            background: "rgba(255,255,255,0.2)",
            color: "white",
            border: "none",
            padding: "8px 14px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          {isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
        </button>
      </div>
    </div>
  );
}
