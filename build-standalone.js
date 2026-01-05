#!/usr/bin/env node

/**
 * Build script to create a standalone version of the application
 * that can run without a server (just double-click the HTML file)
 */

const fs = require('fs');
const path = require('path');

// Read all the necessary files
const distDir = path.join(__dirname, 'dist');
const assetsDir = path.join(__dirname, 'assets');
const standaloneDir = path.join(__dirname, 'standalone');

// Ensure standalone directory exists
if (!fs.existsSync(standaloneDir)) {
  fs.mkdirSync(standaloneDir, { recursive: true });
}

// Read JavaScript files and combine them (removing ES module syntax)
const parserJs = fs.readFileSync(path.join(distDir, 'parser.js'), 'utf8');
const transformerJs = fs.readFileSync(path.join(distDir, 'transformer.js'), 'utf8');
const generatorJs = fs.readFileSync(path.join(distDir, 'generator.js'), 'utf8');
const mainJs = fs.readFileSync(path.join(distDir, 'main.js'), 'utf8');

// Combine all JS into one file, removing import/export statements
const combinedJs = `
// Parser
${parserJs.replace(/export /g, '')}

// Transformer  
${transformerJs.replace(/export /g, '')}

// Generator
${generatorJs.replace(/export /g, '')}

// Main application
${mainJs
  .replace(/import \{ parseInputHTML \} from '\.\/parser\.js';/g, '')
  .replace(/import \{ transformToCanonical \} from '\.\/transformer\.js';/g, '')
  .replace(/import \{ generateOutputHTML \} from '\.\/generator\.js';/g, '')
  .replace(/export /g, '')}
`;

// Read CSS
const css = fs.readFileSync(path.join(distDir, 'styles.css'), 'utf8');

// Read HTML template
const htmlTemplate = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Create standalone HTML with everything inlined
const standaloneHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Canonical Model Transformation</title>
  <link rel="icon" type="image/x-icon" href="assets/favicon.ico">
  <style>
${css}
  </style>
</head>
<body>
  <div class="container">
    <header class="header">
      <div class="logo-container">
        <img src="assets/logos/Hoplite_logo_unoffical.png" alt="Hoplite Logo" class="header-logo">
        <img src="assets/logos/cci.png" alt="CCI Logo" class="header-logo">
      </div>
      <div class="header-content">
        <h1 class="header-title">Report Converter</h1>
        <p class="header-subtitle">Transform HTML records from input format to canonical format</p>
      </div>
    </header>
    
    <div class="upload-section custom-card">
      <h2>Upload Input File</h2>
      <input type="file" id="fileInput" accept=".html,.htm">
      <div style="margin-top: var(--spacing-md);">
        <button id="uploadButton" class="btn-primary">Process File</button>
        <button id="downloadButton" class="btn-success" style="display: none; margin-left: var(--spacing-sm);">Download Output</button>
      </div>
      <div id="error" class="error-message"></div>
    </div>
    
    <div id="output"></div>
  </div>
  
  <script>
${combinedJs}
  </script>
</body>
</html>`;

// Write standalone HTML
fs.writeFileSync(path.join(standaloneDir, 'index.html'), standaloneHtml);

// Copy assets directory (logos and favicon)
const copyRecursiveSync = (src, dest) => {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
};

// Copy assets folder
const standaloneAssetsDir = path.join(standaloneDir, 'assets');
if (fs.existsSync(assetsDir)) {
  copyRecursiveSync(assetsDir, standaloneAssetsDir);
}

console.log('✅ Standalone version built successfully!');
console.log(`📁 Output directory: ${standaloneDir}`);
console.log('\nTo use:');
console.log('  1. Open standalone/index.html in your browser');
console.log('  2. Or double-click index.html (works on most systems)');
console.log('\nThe standalone version includes:');
console.log('  - index.html (all code inlined)');
console.log('  - assets/ folder (logos and favicon)');

