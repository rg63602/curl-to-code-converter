
import React from 'react';
import { GitHubIcon, BugIcon, PortfolioIcon, LinkedInIcon } from './Icon';
import { EXTERNAL_LINKS, UI_TEXT } from '../constants';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm flex-shrink-0">
      <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-center sm:text-left">
          &copy; {currentYear} {UI_TEXT.FOOTER_COPYRIGHT_TEXT}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
          <a href={EXTERNAL_LINKS.GITHUB_SOURCE} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
            <GitHubIcon />
            <span>{UI_TEXT.FOOTER_SOURCE_LINK_TEXT}</span>
          </a>
          <a href={EXTERNAL_LINKS.GITHUB_ISSUES} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
            <BugIcon />
            <span>{UI_TEXT.FOOTER_ISSUE_LINK_TEXT}</span>
          </a>
          <a href={EXTERNAL_LINKS.LINKEDIN_PROFILE} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
            <LinkedInIcon />
            <span>{UI_TEXT.FOOTER_DEVELOPER_LINK_TEXT}</span>
          </a>
           <a href={EXTERNAL_LINKS.PORTFOLIO_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
            <PortfolioIcon />
            <span>{UI_TEXT.FOOTER_PORTFOLIO_LINK_TEXT}</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
