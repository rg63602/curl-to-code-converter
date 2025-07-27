
export enum Language {
  PYTHON = 'Python',
  JAVASCRIPT = 'JavaScript',
  JAVA = 'Java',
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export enum GenerationMode {
  CLIENT = 'Client Snippet',
  SERVER = 'Server Handler',
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export type ToastType = 'success' | 'error';

export interface ToastInfo {
  message: string;
  description?: string;
  type: ToastType;
  duration?: number;
}

export enum Framework {
  // Python
  REQUESTS = 'Requests',
  HTTP_CLIENT = 'http.client',
  FASTAPI = 'FastAPI',
  FLASK = 'Flask',

  // JavaScript (Browser & Node.js)
  FETCH = 'Fetch API',
  AXIOS = 'axios',
  JQUERY_AJAX = 'jQuery.ajax',
  XHR = 'XMLHttpRequest',
  NODE_FETCH = 'node-fetch',
  GOT = 'Got',
  KY = 'Ky',
  SUPERAGENT = 'SuperAgent',
  NODE_HTTP = 'http (Node.js)',
  REQUEST = 'request (Legacy)',
  EXPRESS = 'Express.js',

  // Java
  OKHTTP = 'OkHttp',
  JAVA_HTTP_CLIENT = 'java.net.http.HttpClient',
  JAVA_HTTP_URL_CONNECTION = 'HttpURLConnection',
  JSOUP = 'Jsoup',
  SPRING_BOOT = 'Spring Boot',
}