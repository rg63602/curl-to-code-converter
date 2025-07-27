import React, { useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import { Language, Framework, HttpMethod, GenerationMode, ToastType } from '../types';
import { FRAMEWORK_OPTIONS, DEFAULT_CURL_COMMANDS, CLIENT_LIBRARIES, UI_TEXT, CONFIG } from '../constants';
import { ZapIcon, CurlyBracesIcon, CopyIcon, CheckIcon, TrashIcon } from '../../assets/Icon';
import { formatCurlCommand } from '../services/geminiService';

declare const hljs: any;

interface InputFormProps {
  onConvert: (curlCommand: string, language: Language, framework: Framework) => void;
  isLoading: boolean;
  generationMode: GenerationMode;
  onGenerationModeChange: (mode: GenerationMode) => void;
  showToast: (message: string, type: ToastType, duration?: number, description?: string) => void;
}

export const InputForm: React.FC<InputFormProps> = ({ onConvert, isLoading, generationMode, onGenerationModeChange, showToast }: InputFormProps) => {
  const [curlCommand, setCurlCommand] = useState<string>(DEFAULT_CURL_COMMANDS.POST);
  const [activeMethod, setActiveMethod] = useState<HttpMethod>(HttpMethod.POST);
  const [language, setLanguage] = useState<Language>(Language.JAVA);
  const [framework, setFramework] = useState<Framework>(Framework.SPRING_BOOT);
  const [isFormatting, setIsFormatting] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const [isValidCurl, setIsValidCurl] = useState(true);

  const currentFrameworks = FRAMEWORK_OPTIONS[language].filter(fw => {
    const isClient = CLIENT_LIBRARIES.includes(fw);
    return generationMode === GenerationMode.CLIENT ? isClient : !isClient;
  });

  // Effect for validation
  useEffect(() => {
    const isValid = curlCommand.trim() === '' || curlCommand.trim().startsWith('curl ');
    setIsValidCurl(isValid);
  }, [curlCommand]);

  // This effect ensures that when the language or generation mode changes,
  // the framework selection is updated to the new default.
  useEffect(() => {
    const newFrameworks = FRAMEWORK_OPTIONS[language].filter(fw => {
      const isClient = CLIENT_LIBRARIES.includes(fw);
      return generationMode === GenerationMode.CLIENT ? isClient : !isClient;
    });

    if (newFrameworks.length > 0) {
        setFramework(newFrameworks[0]);
    }
  }, [language, generationMode]);

  // This effect detects the HTTP method from the cURL command text
  useEffect(() => {
    const command = curlCommand.trim();
    if (!command) {
      // Do not reset the method if the input is cleared by the user
      return;
    }
    let detectedMethod: HttpMethod | null = null;
    const xMatch = command.match(/-X\s+(GET|POST|PUT|PATCH|DELETE)/i);
    if (xMatch && xMatch[1]) {
      detectedMethod = xMatch[1].toUpperCase() as HttpMethod;
    }
    // Check for data flags to infer POST, but only if no method is explicitly set
    if (!detectedMethod && /\s-(d|F)\s|--data|--form/.test(command)) {
      detectedMethod = HttpMethod.POST;
    }
    // Default to GET if no other method is detected
    if (!detectedMethod) {
      detectedMethod = HttpMethod.GET;
    }
    if (Object.values(HttpMethod).includes(detectedMethod)) {
      setActiveMethod(detectedMethod);
    }
  }, [curlCommand]);

  const handleMethodChange = (method: HttpMethod) => {
    setActiveMethod(method);
    setCurlCommand(DEFAULT_CURL_COMMANDS[method]);
  };

  const handleModeChange = (mode: GenerationMode) => {
    onGenerationModeChange(mode);
    if (mode === GenerationMode.SERVER) {
      handleMethodChange(HttpMethod.POST);
    } else {
      handleMethodChange(HttpMethod.GET);
    }
  };

  const handleFormat = async () => {
    if (!curlCommand.trim() || isFormatting) return;
    setIsFormatting(true);
    try {
      const formatted = await formatCurlCommand(curlCommand);
      setCurlCommand(formatted);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      showToast(UI_TEXT.ERROR_GEMINI_FORMATTING_UNEXPECTED, 'error', undefined, errorMessage);
      console.error("Failed to format cURL command:", error);
    } finally {
      setIsFormatting(false);
    }
  };

  const handleCopy = () => {
    if (!curlCommand.trim()) return;
    navigator.clipboard.writeText(curlCommand).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), CONFIG.COPY_SUCCESS_TIMEOUT);
    });
  };

  const handleClear = () => {
    setCurlCommand('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (framework && isValidCurl) {
      onConvert(curlCommand, language, framework);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg flex flex-col ring-1 ring-slate-200 dark:ring-slate-700">
      <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4 justify-between">
         <div className="flex flex-col gap-2 flex-grow">
            <label className="text-sm font-medium text-slate-500 dark:text-slate-400">{UI_TEXT.GENERATION_GOAL_LABEL}</label>
            <div className="flex space-x-1 rounded-lg bg-slate-200 dark:bg-slate-900/50 p-1">
                {Object.values(GenerationMode).map((mode) => (
                    <button
                    key={mode}
                    type="button"
                    onClick={() => handleModeChange(mode)}
                    className={`w-full rounded-md py-1.5 text-sm font-medium leading-5 transition-colors focus:outline-none focus:ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 ring-sky-500
                        ${generationMode === mode ? 'bg-sky-600 text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-white/[0.12] hover:text-slate-900 dark:hover:text-white'}
                    `}
                    >
                    {mode}
                    </button>
                ))}
            </div>
         </div>
         <div className="flex flex-col gap-2 flex-grow">
            <label className="text-sm font-medium text-slate-500 dark:text-slate-400">{UI_TEXT.HTTP_METHOD_LABEL}</label>
            <div className="flex space-x-1 rounded-lg bg-slate-200 dark:bg-slate-900/50 p-1">
                {Object.values(HttpMethod).map((method) => (
                    <button
                    key={method}
                    type="button"
                    onClick={() => handleMethodChange(method)}
                    className={`w-full rounded-md py-1.5 text-sm font-medium leading-5 transition-colors focus:outline-none focus:ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 ring-sky-500
                        ${activeMethod === method ? 'bg-sky-600 text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-white/[0.12] hover:text-slate-900 dark:hover:text-white'}
                    `}
                    >
                    {method}
                    </button>
                ))}
            </div>
         </div>
      </div>
      <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2 sm:gap-4 flex-wrap justify-between">
         <div className="flex items-center gap-2 sm:gap-4 flex-grow">
            <div className="flex-grow min-w-[120px]">
              <label htmlFor="language" className="sr-only">Language</label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full p-2 bg-slate-100 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
              >
                {Object.values(Language).map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            <div className="flex-grow min-w-[120px]">
              <label htmlFor="framework" className="sr-only">Library/Framework</label>
              <select
                id="framework"
                value={framework}
                onChange={(e) => setFramework(e.target.value as Framework)}
                className="w-full p-2 bg-slate-100 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                disabled={currentFrameworks.length === 0}
              >
                {currentFrameworks.map((lib) => (
                  <option key={lib} value={lib}>{lib}</option>
                ))}
              </select>
            </div>
        </div>
        <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleFormat}
              disabled={isFormatting || isLoading || !curlCommand.trim()}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm hover:bg-slate-200 dark:hover:bg-slate-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={UI_TEXT.ARIA_LABEL_PRETTIFY}
            >
              <CurlyBracesIcon />
              <span className="hidden sm:inline">{isFormatting ? UI_TEXT.PRETTIER_BUTTON_LOADING_TEXT : UI_TEXT.PRETTIER_BUTTON_TEXT}</span>
            </button>
             <button
              type="button"
              onClick={handleCopy}
              disabled={!curlCommand.trim() || isLoading}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm hover:bg-slate-200 dark:hover:bg-slate-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={UI_TEXT.ARIA_LABEL_COPY_CURL}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
              <span className="hidden sm:inline">{copied ? UI_TEXT.COPIED_BUTTON_TEXT : UI_TEXT.COPY_BUTTON_TEXT}</span>
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={!curlCommand.trim() || isLoading}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm hover:bg-red-500/10 dark:hover:bg-red-500/20 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400"
              aria-label={UI_TEXT.ARIA_LABEL_CLEAR_CURL}
            >
              <TrashIcon />
               <span className="hidden sm:inline">{UI_TEXT.CLEAR_BUTTON_TEXT}</span>
            </button>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={`
          font-mono text-sm bg-slate-50 dark:bg-slate-800 transition-all duration-200
          ${!isValidCurl ? 'ring-2 ring-inset ring-red-500/80' : ''}
        `}>
          <Editor
            value={curlCommand}
            onValueChange={code => setCurlCommand(code)}
            highlight={code => hljs.highlight(code, { language: 'bash' }).value}
            padding={16}
            className="react-simple-code-editor-container editor-custom-style"
            textareaId="curl-command"
            placeholder={UI_TEXT.CURL_INPUT_PLACEHOLDER}
            spellCheck="false"
          />
        </div>
        {!isValidCurl && (
            <p className="px-3 pt-2 pb-1 text-xs text-red-600 dark:text-red-400 bg-red-500/5 dark:bg-red-500/10 border-t border-slate-200 dark:border-slate-700">
                {UI_TEXT.ERROR_INVALID_CURL}
            </p>
        )}
        <div className={`p-3 ${!isValidCurl ? '' : 'border-t'} border-slate-200 dark:border-slate-700`}>
          <button
            type="submit"
            disabled={isLoading || isFormatting || !curlCommand.trim() || !framework || !isValidCurl}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:ring-offset-slate-900 focus:ring-sky-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? UI_TEXT.CONVERT_BUTTON_LOADING_TEXT : (
              <>
                <ZapIcon />
                {UI_TEXT.CONVERT_BUTTON_TEXT}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};