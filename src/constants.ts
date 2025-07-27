import { Language, Framework, HttpMethod } from './types';

// =================================================================
// API Configuration
// =================================================================
export const API = {
  GEMINI_MODEL: 'gemini-2.5-flash',
  GEMINI_FORMATTING_TEMPERATURE: 0.1,
};

// =================================================================
// Application Configuration
// =================================================================
export const CONFIG = {
  THEME_STORAGE_KEY: 'theme',
  DEFAULT_TOAST_DURATION: 4000,
  GENERATION_SUCCESS_TOAST_DURATION: 10000,
  COPY_SUCCESS_TIMEOUT: 2000,
  DOWNLOAD_STATE_TIMEOUT: 1500,
  FUNKY_LOADER_INTERVAL: 2000,
  SCROLL_TOP_VISIBILITY_THRESHOLD: 400,
};

// =================================================================
// User Interface Text & Labels
// =================================================================
export const UI_TEXT = {
  // Header
  HEADER_TITLE: 'cURL to Code Converter',
  HEADER_SUBTITLE: 'Instantly convert cURL commands into clean, production-ready code snippets for popular backend frameworks.',

  // Input Form
  GENERATION_GOAL_LABEL: 'Generation Goal',
  HTTP_METHOD_LABEL: 'HTTP Method',
  PRETTIER_BUTTON_TEXT: 'Prettier',
  PRETTIER_BUTTON_LOADING_TEXT: 'Formatting...',
  COPY_BUTTON_TEXT: 'Copy',
  COPIED_BUTTON_TEXT: 'Copied!',
  CLEAR_BUTTON_TEXT: 'Clear',
  CONVERT_BUTTON_TEXT: 'Convert to Code',
  CONVERT_BUTTON_LOADING_TEXT: 'Converting...',
  CURL_INPUT_PLACEHOLDER: 'Paste your cURL command here...',

  // Code Output & Modal
  CODE_OUTPUT_TITLE: 'Code Output',
  CODE_MODAL_TITLE: 'Generated Code',
  CODE_TOOLTIP: 'Tip: Copy this snippet to run in an online compiler or your local environment.',
  EXPAND_BUTTON_TEXT: 'Expand',
  DOWNLOAD_BUTTON_TEXT: 'Download',
  DOWNLOAD_BUTTON_LOADING_TEXT: 'Downloading...',
  ERROR_TITLE: 'An Error Occurred',
  PLACEHOLDER_TEXT: 'Your generated code will appear here.',

  // Footer
  FOOTER_COPYRIGHT_TEXT: 'cURL to Code Converter',
  FOOTER_SOURCE_LINK_TEXT: 'Source',
  FOOTER_ISSUE_LINK_TEXT: 'Report Issue',
  FOOTER_DEVELOPER_LINK_TEXT: 'Developer',
  FOOTER_PORTFOLIO_LINK_TEXT: 'Portfolio',
  
  // Toasts
  TOAST_SUCCESS_TITLE: 'Success',
  TOAST_ERROR_TITLE: 'Error',
  TOAST_DOWNLOAD_SUCCESS_MESSAGE: 'Snippet downloaded!',
  TOAST_GENERATION_SUCCESS_MESSAGE: 'Code generated successfully!',

  // Error Messages
  ERROR_EMPTY_CURL: 'Please enter a cURL command.',
  ERROR_INVALID_CURL: "Command must start with 'curl ' to be valid.",
  ERROR_GENERATION_FAILED: 'Failed to generate code. ',
  ERROR_GEMINI_API: 'Gemini API Error:',
  ERROR_GEMINI_UNEXPECTED: 'An unexpected error occurred while communicating with the Gemini API.',
  ERROR_GEMINI_FORMATTING_UNEXPECTED: 'An unexpected error occurred while formatting the command.',
  
  // Aria-labels
  ARIA_LABEL_SCROLL_TOP: 'Scroll to top',
  ARIA_LABEL_THEME_SWITCH_LIGHT: 'Switch to light theme',
  ARIA_LABEL_THEME_SWITCH_DARK: 'Switch to dark theme',
  ARIA_LABEL_PRETTIFY: 'Prettify cURL command',
  ARIA_LABEL_COPY_CURL: 'Copy cURL command',
  ARIA_LABEL_CLEAR_CURL: 'Clear cURL command input',
  ARIA_LABEL_EXPAND_CODE: 'Expand code view',
  ARIA_LABEL_COPY_CODE: 'Copy code to clipboard',
  ARIA_LABEL_DOWNLOAD_CODE: 'Download code snippet',
  ARIA_LABEL_CLOSE_MODAL: 'Close code view',
  ARIA_LABEL_DISMISS_TOAST: 'Dismiss',
};


// =================================================================
// Existing Constants
// =================================================================

export const FRAMEWORK_OPTIONS: Record<Language, Framework[]> = {
  [Language.PYTHON]: [
    Framework.FASTAPI,
    Framework.FLASK,
    Framework.REQUESTS,
    Framework.HTTP_CLIENT,
  ],
  [Language.JAVASCRIPT]: [
    Framework.EXPRESS,
    Framework.FETCH,
    Framework.AXIOS,
    Framework.GOT,
    Framework.KY,
    Framework.NODE_FETCH,
    Framework.SUPERAGENT,
    Framework.JQUERY_AJAX,
    Framework.NODE_HTTP,
    Framework.XHR,
    Framework.REQUEST,
  ],
  [Language.JAVA]: [
    Framework.SPRING_BOOT,
    Framework.OKHTTP,
    Framework.JAVA_HTTP_CLIENT,
    Framework.JSOUP,
    Framework.JAVA_HTTP_URL_CONNECTION,
  ],
};

// A helper constant to identify which frameworks are client-side libraries
export const CLIENT_LIBRARIES = [
    // Python
    Framework.REQUESTS,
    Framework.HTTP_CLIENT,
    // JavaScript
    Framework.FETCH,
    Framework.AXIOS,
    Framework.JQUERY_AJAX,
    Framework.XHR,
    Framework.NODE_FETCH,
    Framework.NODE_HTTP,
    Framework.GOT,
    Framework.KY,
    Framework.SUPERAGENT,
    Framework.REQUEST,
    // Java
    Framework.OKHTTP,
    Framework.JAVA_HTTP_CLIENT,
    Framework.JAVA_HTTP_URL_CONNECTION,
    Framework.JSOUP,
];

export const DEFAULT_CURL_COMMANDS: Record<HttpMethod, string> = {
  [HttpMethod.GET]: `curl "https://jsonplaceholder.typicode.com/posts/1"`,
  [HttpMethod.POST]: `curl -X POST "https://jsonplaceholder.typicode.com/posts" -H "Content-Type: application/json" -d '{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}'`,
  [HttpMethod.PUT]: `curl -X PUT "https://jsonplaceholder.typicode.com/posts/1" -H "Content-Type: application/json" -d '{\n  "id": 1,\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}'`,
  [HttpMethod.PATCH]: `curl -X PATCH "https://jsonplaceholder.typicode.com/posts/1" -H "Content-Type: application/json" -d '{\n  "title": "foo patch"\n}'`,
  [HttpMethod.DELETE]: `curl -X DELETE "https://jsonplaceholder.typicode.com/posts/1"`,
};

export const DEFAULT_CURL = DEFAULT_CURL_COMMANDS[HttpMethod.GET];

export const FUNKY_LOADING_MESSAGES = [
  "Checking the flux capacitor... ⚡",
  "Asking the AI nicely... 🙏",
  "Translating cURL to magic... ✨",
  "Waking up the code spirits... 👻",
  "Don't worry, the computer is doing the work... 🤖",
  "Polishing the pixels... 💎",
  "Engaging the AI... 🧠",
  "Assembling the code blocks... 🧱",
  "Herding some wild semicolons... 😉",
  "Spinning up the hamster wheel... 🐹",
  "Finding the perfect variable names... ✍️",
  "Making the code ✨sparkle✨...",
  "Compiling your thoughts... 🤔",
  "Just a moment, we're on it... 🏃",
  "Your code is on the way... 🚚",
  "Brewing some fresh code... ☕",
  "Letting the AI cook... 🍳",
  "Crafting your digital masterpiece... 🎨",
  "Finalizing the incantation... 🧙",
  "Almost there... 🎉",
];

export const EXTERNAL_LINKS = {
  GITHUB_SOURCE: 'https://github.com/google/generative-ai-docs/tree/main/demos/curl-to-code',
  GITHUB_ISSUES: 'https://github.com/google/generative-ai-docs/issues',
  LINKEDIN_PROFILE: 'https://www.linkedin.com/in/your-profile-here', // Replace with your actual profile
  PORTFOLIO_URL: 'https://your-portfolio.com', // Replace with your portfolio URL
};