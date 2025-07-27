# curl-to-code-converter

A web application that converts cURL commands into code snippets in various programming languages using AI (Gemini API). This tool helps developers quickly translate cURL requests into ready-to-use code for their projects.

## Features

- Convert cURL commands to code in multiple languages (e.g., Python, JavaScript, etc.)
- Clean, modern UI with light/dark mode support
- Copy code and console output easily
- Responsive and user-friendly interface
- Powered by Gemini AI for accurate code generation

## Demo

[![Watch the Demo Video](https://img.youtube.com/vi/gVKddAblvug/hqdefault.jpg)](https://www.youtube.com/shorts/gVKddAblvug)

[Watch the demo video on YouTube Shorts](https://www.youtube.com/shorts/gVKddAblvug)

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- Gemini API Key (for AI-powered code generation)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/curl-to-code-converter.git
   cd curl-to-code-converter
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the root directory.
   - Add your Gemini API key and (optionally) the port:
     ```
     VITE_GEMINI_API_KEY=your_gemini_api_key_here
     VITE_PORT=4200 # or any port you prefer (default is 5173)
     ```

4. **Run the app locally:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Visit [http://localhost:4200](http://localhost:4200) (or the port you set in your `.env` file, or the one shown in your terminal).

## Usage

1. Paste your cURL command into the input form.
2. Select the target programming language.
3. Click "Convert" to generate the code.
4. Copy the generated code or view the console output.

## Project Structure

```
curl-to-code-converter/
├── src/
│   ├── components/         # React components (UI)
│   ├── services/           # API and Gemini service logic
│   ├── utils/              # Utility functions (e.g., syntax highlighting)
│   ├── App.tsx             # Main application component
│   ├── constants.ts        # App-wide constants
│   ├── types.ts            # TypeScript types
│   └── index.tsx           # App entry point
├── vite.config.ts          # Vite configuration
└── ...
```

## Contributing

Contributions are welcome! Please open issues or submit pull requests for new features, bug fixes, or improvements.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

## License

> _Specify your license here (e.g., MIT, Apache 2.0)._
