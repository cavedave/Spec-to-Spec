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

## Todo

- [ ] Improve UI styling
- [ ] Add support for additional input formats
- [ ] Add validation for input data
- [ ] Add error handling improvements
- [ ] Add unit tests
- [ ] Wrap this with a desktop application framework like Electron and Tauri. 
