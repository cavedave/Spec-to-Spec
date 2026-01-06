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

// Convert images to base64 data URIs
function imageToBase64(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);
  const ext = path.extname(imagePath).toLowerCase();
  let mimeType;
  
  switch(ext) {
    case '.png':
      mimeType = 'image/png';
      break;
    case '.jpg':
    case '.jpeg':
      mimeType = 'image/jpeg';
      break;
    case '.gif':
      mimeType = 'image/gif';
      break;
    case '.svg':
      mimeType = 'image/svg+xml';
      break;
    case '.ico':
      mimeType = 'image/x-icon';
      break;
    default:
      mimeType = 'image/png';
  }
  
  return `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
}

// Convert favicon and logo to base64
const faviconBase64 = imageToBase64(path.join(assetsDir, 'favicon.ico'));
const hopliteLogoBase64 = imageToBase64(path.join(assetsDir, 'logos', 'Hoplite_logo_unoffical.png'));

// Create standalone HTML with everything inlined
const standaloneHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Report Converter</title>
  <link rel="icon" type="image/x-icon" href="${faviconBase64}">
  <style>
${css}
  </style>
</head>
<body>
  <div class="container">
    <header class="header">
      <div class="logo-container">
        <img src="${hopliteLogoBase64}" alt="Hoplite Logo" class="header-logo">
      </div>
      <div class="header-content">
        <h1 class="header-title">Report Converter</h1>
        <p class="header-subtitle">Transform HTML records from input format to canonical format</p>
      </div>
    </header>
    
    <div class="upload-section custom-card">
      <h2>Select Input File</h2>
      <input type="file" id="fileInput" accept=".html,.htm">
      <div style="margin-top: var(--spacing-md);">
        <button id="downloadButton" class="btn-success" style="display: none;">Download Output</button>
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

// Write standalone HTML (single file, no assets folder needed)
fs.writeFileSync(path.join(standaloneDir, 'index.html'), standaloneHtml);

console.log('✅ Standalone version built successfully!');
console.log(`📁 Output directory: ${standaloneDir}`);
console.log('\nTo use:');
console.log('  1. Open standalone/index.html in your browser');
console.log('  2. Or double-click index.html (works on most systems)');
console.log('\nThe standalone version is a SINGLE FILE:');
console.log('  - index.html (all code, CSS, images, and favicon inlined as base64)');
console.log('  - No additional files or folders needed!');

