
import React, { useEffect, useState } from 'react';
import Editor from 'react-simple-code-editor';
import { Language, Framework, ToastType } from '../types';
import { getHighlightJsLanguage } from '../utils/highlighting';
import { CloseIcon, CopyIcon, CheckIcon, DownloadIcon, SpinnerIcon } from '../../assets/Icon';
import { UI_TEXT, CONFIG } from '../constants';

declare const hljs: any;

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  language: Language;
  framework: Framework;
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

export const CodeModal: React.FC<CodeModalProps> = ({ isOpen, onClose, code, language, framework, showToast }: CodeModalProps) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
      setCopied(false);
      setIsDownloading(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), CONFIG.COPY_SUCCESS_TIMEOUT);
    });
  };

  const handleDownload = () => {
    if (!code || isDownloading) return;
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


  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-[95vw] h-[90vh] flex flex-col overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-2 pl-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{UI_TEXT.CODE_MODAL_TITLE}</h2>
          <div className="flex items-center space-x-2">
            <button
                onClick={handleCopy}
                disabled={!code}
                className="flex items-center px-3 py-1 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors disabled:opacity-50"
                aria-label={UI_TEXT.ARIA_LABEL_COPY_CODE}
            >
                {copied ? <CheckIcon /> : <CopyIcon />}
                <span className="ml-1.5">{copied ? UI_TEXT.COPIED_BUTTON_TEXT : UI_TEXT.COPY_BUTTON_TEXT}</span>
            </button>
            <button
                onClick={handleDownload}
                disabled={!code || isDownloading}
                className="flex items-center px-3 py-1 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors disabled:opacity-50"
                aria-label={UI_TEXT.ARIA_LABEL_DOWNLOAD_CODE}
            >
                {isDownloading ? <SpinnerIcon /> : <DownloadIcon />}
                <span className="ml-1.5">{isDownloading ? UI_TEXT.DOWNLOAD_BUTTON_LOADING_TEXT : UI_TEXT.DOWNLOAD_BUTTON_TEXT}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label={UI_TEXT.ARIA_LABEL_CLOSE_MODAL}
            >
              <CloseIcon />
            </button>
          </div>
        </div>
        <div className="w-full flex-grow overflow-auto font-mono text-sm min-h-0">
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
      </div>
    </div>
  );
};
