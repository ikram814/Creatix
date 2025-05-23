'use client';

import { useState, useEffect } from 'react';

const ThemeButton = ({ className = "" }) => {
  const [isBlack, setIsBlack] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    // Vérifier le thème initial
    const checkTheme = () => {
      setIsDarkTheme(document.documentElement.classList.contains('black-theme'));
    };
    checkTheme();
    window.addEventListener('themeChange', checkTheme);
    return () => window.removeEventListener('themeChange', checkTheme);
  }, []);

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
      className="fixed top-2 right-28  z-50 focus:outline-none"
      style={{ background: 'transparent' }}
    >
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-full border transition-colors duration-300 ${isDarkTheme ? 'bg-black border-white' : 'bg-gray-200 border-gray-300'}`}
        style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}
      >
        {isDarkTheme ? (
          // Moon Icon
          <span className="flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/><circle cx="17.5" cy="6.5" r="1.5" fill="white"/><circle cx="15.5" cy="10.5" r="1" fill="white"/></svg>
          </span>
        ) : (
          // Sun Icon
          <span className="flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="orange" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><g><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></g></svg>
          </span>
        )}
      </div>
    </button>
  );
};

export default ThemeButton;