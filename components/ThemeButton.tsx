'use client';

import { useState } from 'react';

const ThemeButton = () => {
  const [isBlack, setIsBlack] = useState(false);

  const toggleBlackTheme = () => {
    setIsBlack(!isBlack);
    // Toggle the class on the document element (html)
    document.documentElement.classList.toggle('black-theme');
    // Déclencher un événement personnalisé pour notifier du changement
    window.dispatchEvent(new Event('themeChange'));
  };

  return (
    <button
      onClick={toggleBlackTheme}
      className="fixed top-4 right-4 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg shadow-lg transition-all duration-300 z-50"
    >
      {isBlack ? 'Reset Theme' : 'Black Theme'}
    </button>
  );
};

export default ThemeButton; 