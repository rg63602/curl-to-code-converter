interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_API_URL?: string;
  readonly VITE_ENV?: string;
  readonly VITE_PORT?: string;
  // add other VITE_ variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 