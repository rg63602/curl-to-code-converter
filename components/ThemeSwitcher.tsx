
import React from 'react';
import { Theme } from '../types';
import { SunIcon, MoonIcon } from './Icon';
import { UI_TEXT } from '../constants';

interface ThemeSwitcherProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, onThemeChange }) => {
  const isDark = theme === Theme.DARK;
  
  const toggleTheme = () => {
    onThemeChange(isDark ? Theme.LIGHT : Theme.DARK);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex items-center justify-center w-10 h-10 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 focus:ring-sky-500 transition-colors"
      aria-label={isDark ? UI_TEXT.ARIA_LABEL_THEME_SWITCH_LIGHT : UI_TEXT.ARIA_LABEL_THEME_SWITCH_DARK}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};
