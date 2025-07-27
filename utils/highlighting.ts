import { Language } from '../types';

export const getHighlightJsLanguage = (language: Language): string => {
  switch (language) {
    case Language.PYTHON:
      return 'python';
    case Language.JAVASCRIPT:
      return 'javascript';
    case Language.JAVA:
      return 'java';
    default:
      // Fallback for safety, though should not be reached with current setup
      return 'plaintext';
  }
};
