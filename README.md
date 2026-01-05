# Canonical Model Transformation Architecture

## Intro

This application transforms html from an input HTML format to a canonical (standardised) format. Users can upload HTML files containing a record, and the application will parse, transform, and generate output HTML files in the canonical format.

## File Structure

```
transcribe/
├── assets/
│   ├── input_example.html    # Example input file format
│   └── output_example.html   # Example output file format
├── dist/                     # Compiled JavaScript (generated)
├── src/                      # TypeScript source files
│   ├── types.ts              # Type definitions
│   ├── parser.ts             # HTML parsing logic
│   ├── transformer.ts        # Data transformation logic
│   ├── generator.ts          # Output HTML generation
│   └── main.ts               # Main application and UI
├── index.html                # Main web page
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

## Building and Running

### Development (with server)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Start a local server:
   ```bash
   npm run serve
   # or
   python3 -m http.server 8000
   ```

4. Open `http://localhost:8000` in your browser

### Standalone Version (No Server Required)

To create a standalone version that works without a server (just double-click the HTML file):

```bash
npm run build:standalone
```

This creates a `standalone/` directory containing:
- `index.html` - All JavaScript and CSS inlined (works offline)
- `assets/` - Logos and favicon folder

**To distribute:** Simply zip the `standalone/` folder and share it. Users can:
- Double-click `index.html` to open it in their browser
- Or open it directly from the file system (no server needed!)

## Todo

- [x] Improve UI styling
- [ ] Add support for additional input formats
- [ ] Add validation for input data
- [ ] Add error handling improvements
- [ ] Add unit tests 
