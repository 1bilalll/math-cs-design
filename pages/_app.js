import '../styles/globals.css';
import { useEffect } from 'react';
import Header from '../components/Header';
import { LanguageProvider } from '../context/LanguageContext';
import { AuthProvider } from '../context/AuthContext';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute(
      'data-theme',
      theme === 'dark' ? 'dark' : 'light'
    );
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        <Header />
        <main className="min-h-screen">
          <Component {...pageProps} />
        </main>
      </AuthProvider>
    </LanguageProvider>
  );
}
