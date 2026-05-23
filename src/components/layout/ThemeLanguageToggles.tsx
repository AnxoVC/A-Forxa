'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Moon, Sun, Globe } from 'lucide-react';

export default function ThemeLanguageToggles() {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState('dark');
  const [locale, setLocale] = useState('es');

  useEffect(() => {
    // Check initial theme from document or localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Extract locale from pathname
    const currentLocale = pathname.split('/')[1] || 'es';
    if (['es', 'en', 'gl'].includes(currentLocale)) {
      setLocale(currentLocale);
    }
  }, [pathname]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const cycleLanguage = () => {
    const locales = ['es', 'gl', 'en'];
    const currentIndex = locales.indexOf(locale);
    const nextLocale = locales[(currentIndex + 1) % locales.length];
    
    const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
    router.push(newPath);
  };

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <button 
        onClick={toggleTheme}
        style={{ 
          width: '36px', height: '36px', 
          borderRadius: '50%', 
          background: 'var(--bg-card)', 
          border: '1px solid var(--border)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-2)',
          transition: 'all 0.2s'
        }}
        aria-label="Alternar tema"
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <button 
        onClick={cycleLanguage}
        style={{ 
          width: '36px', height: '36px', 
          borderRadius: '50%', 
          background: 'var(--bg-card)', 
          border: '1px solid var(--border)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-2)',
          transition: 'all 0.2s',
          fontSize: '12px',
          fontWeight: 700,
          textTransform: 'uppercase'
        }}
        title="Cambiar idioma"
      >
        <span style={{ position: 'absolute', opacity: 0 }}><Globe size={18} /></span>
        {locale}
      </button>
    </div>
  );
}
