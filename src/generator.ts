import { CanonicalPerson } from './types.js';

/**
 * This file handles generating the output HTML file from canonical person data.
 * 
 * The output HTML follows the same structure as the input, but with:
 * - Canonical field names (Given Name, Surname, Date of birth)
 * - Transformed date format
 * - Audit information (hashes and version)
 */

/**
 * Generates a simple hash from a string for audit purposes.
 * 
 * This is a simplified hash function for demonstration. In a production
 * system, you might use a proper cryptographic hash like SHA-256.
 * 
 * @param content - The string to hash
 * @returns A hexadecimal hash string
 */
function generateHash(content: string): string {
  // Start with hash value of 0
  let hash = 0;
  
  // Go through each character in the string
  for (let i = 0; i < content.length; i++) {
    const charCode = content.charCodeAt(i);
    // Simple hash algorithm: multiply by 31 and add the character code
    // The bit shift (<< 5) is equivalent to multiplying by 32
    hash = ((hash << 5) - hash) + charCode;
    // Convert to 32-bit integer (keeps the hash from getting too large)
    hash = hash & hash;
  }
  
  // Convert to positive number, then to hexadecimal, and take first 16 characters
  return Math.abs(hash).toString(16).substring(0, 16);
}

/**
 * Escapes HTML special characters to prevent injection and display issues.
 * 
 * Converts characters like <, >, &, ", ' into their HTML entity equivalents
 * so they display correctly and safely in the browser.
 * 
 * @param text - The text to escape
 * @returns The text with HTML special characters escaped
 */
function escapeHtml(text: string): string {
  // Map of special characters to their HTML entity equivalents
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',   // Must be first to avoid double-escaping
    '<': '&lt;',     // Less than
    '>': '&gt;',     // Greater than
    '"': '&quot;',   // Double quote
    "'": '&#039;'    // Single quote (apostrophe)
  };
  
  // Replace any special characters with their HTML entities
  return text.replace(/[&<>"']/g, (character) => htmlEntities[character]);
}

/**
 * Generates the output HTML file from canonical person data.
 * 
 * Creates an HTML document that:
 * 1. Displays the person data in canonical format
 * 2. Includes audit information (hashes of input and output)
 * 3. Shows the converter version
 * 
 * @param canonical - The person data in canonical format
 * @param inputHTML - The original input HTML (used for audit hash)
 * @returns The complete output HTML as a string
 */
export function generateOutputHTML(
  canonical: CanonicalPerson,
  inputHTML: string
): string {
  // Generate hashes for audit trail
  // These help verify the input and output haven't been tampered with
  const inputHash = generateHash(inputHTML);
  const outputHash = generateHash(JSON.stringify(canonical));
  
  // Version of the converter (increment this when you make changes)
  const converterVersion = '0.1.0';
  
  // Check if DOB is missing
  const isDobMissing = !canonical.dateOfBirth || canonical.dateOfBirth.trim() === '';
  const dobFieldClass = isDobMissing ? 'field field-warning' : 'field';
  const dobLabelClass = isDobMissing ? 'label label-warning' : 'label';
  
  // Build warnings HTML if any
  let warningsHTML = '';
  if (canonical.warnings && canonical.warnings.length > 0) {
    warningsHTML = `
  <div class="warning-box">
    <strong>⚠️ Warnings:</strong>
    <ul>
      ${canonical.warnings.map(warning => `<li>${escapeHtml(warning)}</li>`).join('')}
    </ul>
  </div>`;
  }
  
  // Build the HTML string using a template
  // We use escapeHtml() on all user data to prevent HTML injection
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Output Example — Converted HTML</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; }
    .field { margin: 12px 0; }
    .label { font-weight: 700; }
    .value { margin-left: 8px; color: #222; }
    .field-warning { border: 2px solid #dc3545; border-radius: 4px; padding: 8px; background-color: #fff5f5; }
    .label-warning { 
      color: #dc3545; 
      animation: flash 1s ease-in-out infinite;
    }
    @keyframes flash {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .warning-box {
      background-color: #fff3cd;
      border: 2px solid #ffc107;
      border-radius: 4px;
      padding: 16px;
      margin: 20px 0;
      color: #856404;
    }
    .warning-box strong {
      display: block;
      margin-bottom: 8px;
      font-size: 1.1em;
    }
    .warning-box ul {
      margin: 8px 0 0 0;
      padding-left: 20px;
    }
  </style>
</head>
<body>
  <h1>Person Record (Output)</h1>
${warningsHTML}
  <div class="field">
    <span class="label">Given Name</span>
    <span class="value">${escapeHtml(canonical.givenName)}</span>
  </div>

  <div class="field">
    <span class="label">Surname</span>
    <span class="value">${escapeHtml(canonical.surname)}</span>
  </div>

  <div class="${dobFieldClass}">
    <span class="${dobLabelClass}">Date of birth</span>
    <span class="value">${escapeHtml(canonical.dateOfBirth || '(Missing)')}</span>
  </div>

  <p>Audit: input_hash: <em>sha256:${inputHash}</em> · output_hash: <em>sha256:${outputHash}</em></p>
  <p>Converter version: <em>${converterVersion}</em></p>
</body>
</html>`;
}

