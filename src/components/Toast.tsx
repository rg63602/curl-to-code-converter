
import React, { useEffect } from 'react';
import { CheckIcon, ErrorIcon, CloseIcon } from '../../assets/Icon';
import { ToastInfo } from '../types';
import { CONFIG, UI_TEXT } from '../constants';

interface ToastProps {
  toastInfo: ToastInfo;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toastInfo, onClose }) => {
  const { duration = CONFIG.DEFAULT_TOAST_DURATION } = toastInfo;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const isSuccess = toastInfo.type === 'success';

  // Theme-aware styles
  const baseClasses = 'bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700';
  
  // Icon and text colors based on type
  const iconContainerClasses = isSuccess ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-red-100 dark:bg-red-900/50';
  const iconClasses = isSuccess ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400';
  const Icon = isSuccess ? CheckIcon : ErrorIcon;
  const title = isSuccess ? UI_TEXT.TOAST_SUCCESS_TITLE : UI_TEXT.TOAST_ERROR_TITLE;
  const titleClasses = isSuccess ? 'text-emerald-800 dark:text-emerald-300' : 'text-red-800 dark:text-red-300';

  // Progress bar styles
  const progressBarClasses = isSuccess ? 'bg-emerald-500/70' : 'bg-red-500/70';

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 w-full max-w-sm rounded-lg shadow-2xl overflow-hidden animate-slide-in-right ${baseClasses}`}
      role="alert"
    >
      <div className="p-4 flex gap-4">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${iconContainerClasses}`}>
          <div className={iconClasses}>
            <Icon />
          </div>
        </div>
        <div className="flex-grow">
          <p className={`text-sm font-semibold ${titleClasses}`}>{title}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{toastInfo.message}</p>
          {toastInfo.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{toastInfo.description}</p>
          )}
        </div>
        <div className="flex-shrink-0">
          <button 
            onClick={onClose} 
            aria-label={UI_TEXT.ARIA_LABEL_DISMISS_TOAST} 
            className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 focus:ring-sky-500 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>
      </div>
      <div 
        className={`absolute bottom-0 left-0 h-1 ${progressBarClasses} animate-shrink-width`}
        style={{ animationDuration: `${duration}ms` }}
      ></div>
    </div>
  );
};
