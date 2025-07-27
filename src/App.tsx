
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { CodeOutput } from './components/CodeOutput';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { generateCodeFromCurl } from './services/geminiService';
import { Language, Framework, GenerationMode, Theme, ToastInfo, ToastType } from './types';
import { ScrollUpIcon } from '../assets/Icon';
import { UI_TEXT, CONFIG } from './constants';

interface GeneratedSnippet {
  code: string;
  language: Language;
  framework: Framework;
}

const App: React.FC = () => {
  const [snippet, setSnippet] = useState<GeneratedSnippet | null>(null);
  const [generationMode, setGenerationMode] = useState<GenerationMode>(GenerationMode.CLIENT);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [toastInfo, setToastInfo] = useState<ToastInfo | null>(null);
  
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem(CONFIG.THEME_STORAGE_KEY) as Theme;
    if (storedTheme) {
      return storedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.DARK : Theme.LIGHT;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const darkThemeStyle = document.getElementById('hljs-dark-theme') as HTMLLinkElement;
    const lightThemeStyle = document.getElementById('hljs-light-theme') as HTMLLinkElement;

    const isDark = theme === Theme.DARK;

    root.classList.toggle('dark', isDark);
    if (darkThemeStyle) darkThemeStyle.disabled = !isDark;
    if (lightThemeStyle) lightThemeStyle.disabled = isDark;
    
    localStorage.setItem(CONFIG.THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
        if (window.pageYOffset > CONFIG.SCROLL_TOP_VISIBILITY_THRESHOLD) {
            setShowScrollButton(true);
        } else {
            setShowScrollButton(false);
        }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showToast = (message: string, type: ToastType, duration?: number, description?: string) => {
    setToastInfo({ message, type, duration, description });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConvert = useCallback(async (curlCommand: string, language: Language, framework: Framework) => {
    if (!curlCommand.trim()) {
      const errorMessage = UI_TEXT.ERROR_EMPTY_CURL;
      setError(errorMessage);
      showToast(errorMessage, 'error');
      return;
    }
    setIsLoading(true);
    setError(null);
    
    if (snippet) {
      // do nothing to the old snippet
    }
    
    try {
      const code = await generateCodeFromCurl(curlCommand, language, framework);
      setSnippet({ code, language, framework });
      showToast(
        UI_TEXT.TOAST_GENERATION_SUCCESS_MESSAGE,
        'success',
        CONFIG.GENERATION_SUCCESS_TOAST_DURATION,
        UI_TEXT.CODE_TOOLTIP
      );
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`${UI_TEXT.ERROR_GENERATION_FAILED}${errorMessage}`);
      setSnippet(null);
      showToast(UI_TEXT.ERROR_GENERATION_FAILED, 'error', undefined, errorMessage);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [snippet]);

  return (
    <div className="min-h-screen font-sans flex flex-col">
      <Header theme={theme} onThemeChange={setTheme} />
      <main className="container mx-auto p-4 lg:p-6 flex flex-col gap-6 flex-grow">
        <InputForm
          onConvert={handleConvert}
          isLoading={isLoading}
          generationMode={generationMode}
          onGenerationModeChange={setGenerationMode}
          showToast={showToast}
        />
        
        <div className="flex flex-col gap-6 flex-grow">
          <CodeOutput
            snippet={snippet}
            generationMode={generationMode}
            isLoading={isLoading}
            error={error}
            showToast={showToast}
          />
        </div>
      </main>
      <Footer />

       {toastInfo && (
        <Toast toastInfo={toastInfo} onClose={() => setToastInfo(null)} />
      )}

      <button
        type="button"
        onClick={scrollToTop}
        className={`
          fixed bottom-20 right-5 z-40 bg-sky-600 hover:bg-sky-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:ring-offset-slate-900 focus:ring-sky-500
          ${showScrollButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'}
        `}
        aria-label={UI_TEXT.ARIA_LABEL_SCROLL_TOP}
      >
        <ScrollUpIcon />
      </button>
    </div>
  );
};

export default App;
