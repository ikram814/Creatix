'use client';

import { useEffect, useState } from 'react';

const ThemeVideo = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    // Vérifier le thème initial
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('black-theme');
      setIsDarkTheme(isDark);
    };

    // Vérifier le thème au chargement
    checkTheme();

    // Observer les changements de classe sur documentElement
    const observer = new MutationObserver(() => {
      checkTheme();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
      subtree: false,
    });

    // Ajouter un écouteur d'événements pour les changements de thème
    window.addEventListener('themeChange', checkTheme);

    // Nettoyer
    return () => {
      observer.disconnect();
      window.removeEventListener('themeChange', checkTheme);
    };
  }, []);

  // Forcer le rechargement de la vidéo lors du changement de thème
  const videoSrc = isDarkTheme 
    ? "/assets/videos/darkvideo (1).mp4" 
    : "/assets/videos/lightvideo (1).mp4";

  return (
    <video
      key={isDarkTheme ? 'dark' : 'light'} // Force le remontage du composant
      src={videoSrc}
      autoPlay
      loop
      muted
      playsInline
      className="rounded-2xl shadow-lg w-full max-w-5xl aspect-[5/2] blue-shadow"
      style={{ objectFit: "cover" }}
    />
  );
};

export default ThemeVideo; 