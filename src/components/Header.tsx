
import React from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Theme } from '../types';
import { UI_TEXT } from '../constants';

interface HeaderProps {
    theme: Theme;
    onThemeChange: (theme: Theme) => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, onThemeChange }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 lg:px-6 flex items-center justify-between">
        <div className="text-center py-4 flex-grow">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-sky-400 dark:to-emerald-400">
            {UI_TEXT.HEADER_TITLE}
          </h1>
          <p className="mt-2 text-md text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            {UI_TEXT.HEADER_SUBTITLE}
          </p>
        </div>
        <div className="flex-shrink-0">
          <ThemeSwitcher theme={theme} onThemeChange={onThemeChange} />
        </div>
      </div>
    </header>
  );
};
