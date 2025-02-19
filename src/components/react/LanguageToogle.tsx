import React, { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { currentLang, setLanguage } from '../../i18n/store';

const LanguageToggleReact = () => {
  const lang = useStore(currentLang);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <button
      id="language-toggle"
      className="z-50 inline-flex items-center justify-center w-10 h-10 p-2 rounded-lg  hover:[color:var(--color-primary)] hover:border-1 transition-colors"
      aria-label="Toggle language"
      onClick={() => setLanguage(lang === 'en' ? 'es' : 'en')}
    >
      {/* Globe icon */}
      <svg className="w-5 h-5 text-text" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="text-sm ml-1 text-text">
        {lang === 'en' ? 'ES' : 'EN'}
      </span>
    </button>
  );
};

export default LanguageToggleReact;