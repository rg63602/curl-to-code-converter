
import { GoogleGenAI } from "@google/genai";
import { Language, Framework } from '../types';
import { CLIENT_LIBRARIES, API, UI_TEXT } from '../constants';


console.log('import.meta.env:', import.meta.env);
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey || typeof apiKey !== 'string') {
    throw new Error("VITE_GEMINI_API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: apiKey as string });

const getPrompt = (curlCommand: string, language: Language, framework: Framework): string => {
  const isClientLibrary = CLIENT_LIBRARIES.includes(framework);

  if (isClientLibrary) {
    return `
      You are an expert code generator. Your task is to convert the following cURL command into a functional, production-ready code snippet that uses the specified client-side library.

      cURL Command:
      \`\`\`bash
      ${curlCommand}
      \`\`\`

      Target Language: ${language}
      Target Library: ${framework}

      Requirements for the generated code:
      1.  The code must be a complete, runnable client-side snippet that executes the HTTP request. It will be run inside an \`async\` function.
      2.  It must accurately replicate the HTTP method, URL, headers, and body from the cURL command.
      3.  Include robust error handling (e.g., try/catch) and report errors by throwing them.
      4.  Use idiomatic patterns and best practices for the chosen library (e.g., use async/await for Fetch/Axios).
      5.  At the top of the snippet, extract key configurable values into constants (URL, body, auth tokens).
      6.  The output must be ONLY the raw code. Do not include any introductory text, explanations, or markdown fences (like \`\`\`python ... \`\`\`).
      7.  **CRITICAL RETURN REQUIREMENT:** The snippet MUST return the final response object from the library's execution. For example, if the variable holding the response is named \`response\`, the last line should be \`return response;\`. This return value will be captured and processed by the host application.
      8.  **File Uploads:** If the cURL command includes a file upload (e.g., using \`-F\` or \`--form\`), the generated code must correctly handle \`multipart/form-data\` requests.
    `;
  } else {
    // This is a server-side framework
    return `
      You are an expert backend developer. Your task is to create a server-side route handler based on the provided cURL command, which represents an incoming HTTP request.

      cURL Command (describes the incoming request):
      \`\`\`bash
      ${curlCommand}
      \`\`\`

      Target Language: ${language}
      Target Framework: ${framework}

      Requirements for the generated code:
      1.  The code must be a complete, runnable route handler for the specified framework.
      2.  It must correctly handle the HTTP method, URL path, headers, and body described in the cURL command. For path parameters in the URL (e.g., /users/123), create a route that captures them.
      3.  The handler should demonstrate how to access the request body and headers.
      4.  For frameworks like FastAPI or Spring Boot, include necessary data model classes (e.g., Pydantic models, Java DTOs) to represent the JSON body.
      5.  Include a mock success response (e.g., return a simple JSON object like \`{"status": "received"}\`).
      6.  Add concise comments explaining key parts of the code, especially how to parse the request.
      7.  The output must be ONLY the raw code. Do not include any introductory text, explanations, or markdown fences (like \`\`\`python ... \`\`\`).
      8.  **Configuration Variables:** At the very top of the generated snippet, declare any necessary constants or configuration.
    `;
  }
};

export const generateCodeFromCurl = async (
  curlCommand: string,
  language: Language,
  framework: Framework
): Promise<string> => {
  const model = API.GEMINI_MODEL;
  const prompt = getPrompt(curlCommand, language, framework);

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    if (!response.text) {
      throw new Error("No response text from Gemini API");
    }
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`${UI_TEXT.ERROR_GEMINI_API} ${error.message}`);
    }
    throw new Error(UI_TEXT.ERROR_GEMINI_UNEXPECTED);
  }
};

export const formatCurlCommand = async (curlCommand: string): Promise<string> => {
  const model = API.GEMINI_MODEL;

  const prompt = `
    You are an expert cURL command formatter.
    Your task is to reformat the provided cURL command to be clean, readable, and follow best practices for documentation and sharing.

    cURL Command to Format:
    \`\`\`bash
    ${curlCommand}
    \`\`\`

    Formatting Rules:
    1.  Use backslashes ( \\ ) to break long commands into multiple lines for readability.
    2.  Place each header (-H) on its own line.
    3.  Place the data payload (-d, --data, --data-raw) on its own line.
    4.  If the data payload is JSON, pretty-print it with an indentation of 2 spaces.
    5.  Ensure the final output is a single, valid, and runnable bash command.
    6.  The output must be ONLY the raw, formatted cURL command. Do not include any introductory text, explanations, or markdown fences (like \`\`\`bash ... \`\`\`).
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: API.GEMINI_FORMATTING_TEMPERATURE,
      }
    });
    if (!response.text) {
      throw new Error("No response text from Gemini API (formatting)");
    }
    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API for formatting:", error);
    if (error instanceof Error) {
        throw new Error(`${UI_TEXT.ERROR_GEMINI_API} during formatting: ${error.message}`);
    }
    throw new Error(UI_TEXT.ERROR_GEMINI_FORMATTING_UNEXPECTED);
  }
};