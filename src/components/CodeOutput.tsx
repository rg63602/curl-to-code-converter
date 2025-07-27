
import React, { useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import { Language, Framework, GenerationMode, ToastType } from '../types';
import { CopyIcon, DownloadIcon, CheckIcon, ExpandIcon, InfoIcon, SpinnerIcon } from '../../assets/Icon';
import { Spinner } from './Spinner';
import { CodeModal } from './CodeModal';
import { getHighlightJsLanguage } from '../utils/highlighting';
import { UI_TEXT, CONFIG } from '../constants';

declare const hljs: any;

interface GeneratedSnippet {
  code: string;
  language: Language;
  framework: Framework;
}

interface CodeOutputProps {
  snippet: GeneratedSnippet | null;
  generationMode: GenerationMode;
  isLoading: boolean;
  error: string | null;
  showToast: (message: string, type: ToastType, duration?: number, description?: string) => void;
}

const getFileName = (language: Language, framework: Framework): string => {
  const frameworkName = framework.toLowerCase().replace(/[^a-z0-9]/g, '');
  switch (language) {
    case Language.PYTHON:
      return `${frameworkName}_snippet.py`;
    case Language.JAVASCRIPT:
      return `${frameworkName}_snippet.js`;
    case Language.JAVA:
      const className = framework.charAt(0).toUpperCase() + framework.slice(1).replace(/[^a-zA-Z0-9]/g, '') + 'Snippet';
      return `${className}.java`;
    default:
      return 'snippet.txt';
  }
};

export const CodeOutput: React.FC<CodeOutputProps> = ({ snippet, generationMode, isLoading, error, showToast }: CodeOutputProps) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const code = snippet?.code ?? '';
  const language = snippet?.language;
  const framework = snippet?.framework;

  useEffect(() => {
    if (code) {
      setCopied(false);
    }
  }, [code]);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), CONFIG.COPY_SUCCESS_TIMEOUT);
    });
  };

  const handleDownload = () => {
    if (!code || !language || !framework || isDownloading) return;
    setIsDownloading(true);

    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getFileName(language, framework);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast(UI_TEXT.TOAST_DOWNLOAD_SUCCESS_MESSAGE, 'success');
    
    setTimeout(() => {
      setIsDownloading(false);
    }, CONFIG.DOWNLOAD_STATE_TIMEOUT);
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg flex flex-col min-h-[400px] ring-1 ring-slate-200 dark:ring-slate-700">
        <div className="sticky top-[77px] lg:top-[85px] z-10 flex-shrink-0 flex justify-between items-center p-2 pl-4 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-t-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{language && framework ? `${language} (${framework})` : UI_TEXT.CODE_OUTPUT_TITLE}</span>
            {snippet && (
              <div className="relative group flex items-center">
                <InfoIcon />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2 text-xs text-center text-white bg-slate-700 dark:bg-black rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  {UI_TEXT.CODE_TOOLTIP}
                  <svg className="absolute text-slate-700 dark:text-black h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={!code || isLoading}
                className="flex items-center px-3 py-1 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={UI_TEXT.ARIA_LABEL_EXPAND_CODE}
              >
                <ExpandIcon />
                <span className="ml-1.5 hidden sm:inline">{UI_TEXT.EXPAND_BUTTON_TEXT}</span>
              </button>
              <button
              onClick={handleCopy}
              disabled={!code || isLoading}
              className="flex items-center px-3 py-1 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={UI_TEXT.ARIA_LABEL_COPY_CODE}
              >
              {copied ? <CheckIcon /> : <CopyIcon />}
              <span className="ml-1.5">{copied ? UI_TEXT.COPIED_BUTTON_TEXT : UI_TEXT.COPY_BUTTON_TEXT}</span>
              </button>
              <button
              onClick={handleDownload}
              disabled={!code || isLoading || isDownloading}
              className="flex items-center px-3 py-1 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={UI_TEXT.ARIA_LABEL_DOWNLOAD_CODE}
              >
              {isDownloading ? <SpinnerIcon /> : <DownloadIcon />}
              <span className="ml-1.5">{isDownloading ? UI_TEXT.DOWNLOAD_BUTTON_LOADING_TEXT : UI_TEXT.DOWNLOAD_BUTTON_TEXT}</span>
              </button>
          </div>
        </div>
        <div className="flex-grow relative bg-slate-50 dark:bg-slate-800 rounded-b-lg">
            {code && !isLoading && !error && language && (
                <div className="w-full h-full overflow-auto font-mono text-sm">
                    <Editor
                        value={code}
                        onValueChange={() => {}}
                        highlight={code => hljs.highlight(code, { language: getHighlightJsLanguage(language) }).value}
                        readOnly
                        padding={16}
                        style={undefined}
                        className="react-simple-code-editor-container editor-custom-style"
                    />
                </div>
            )}
            {(isLoading || error || !code) && (
                 <div className="absolute inset-0 flex items-center justify-center text-center p-4">
                     {isLoading && <Spinner />}
                     {!isLoading && error && (
                         <div className="text-red-500 dark:text-red-400">
                             <p className="font-semibold text-lg">{UI_TEXT.ERROR_TITLE}</p>
                             <p className="text-sm mt-1">{error}</p>
                         </div>
                     )}
                     {!isLoading && !error && !snippet && (
                         <div className="text-slate-500 dark:text-slate-500">
                             <p>{UI_TEXT.PLACEHOLDER_TEXT}</p>
                         </div>
                     )}
                 </div>
            )}
        </div>
      </div>
      {snippet && (
        <CodeModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            code={snippet.code}
            language={snippet.language}
            framework={snippet.framework}
            showToast={showToast}
        />
      )}
    </>
  );
};
