import { InputPerson } from './types.js';

/**
 * This file handles parsing the input HTML file to extract person data.
 * 
 * The input HTML is expected to have a structure like:
 *   <div class="field">
 *     <span class="label">First name</span>
 *     <span class="value">Alice</span>
 *   </div>
 */

/**
 * Parses an HTML string and extracts person data from it.
 * 
 * Looks for elements with class "field" that contain:
 * - A label element (class "label") that identifies the field
 * - A value element (class "value") that contains the actual data
 * 
 * Maps the labels to our InputPerson structure:
 * - "First name" -> firstName
 * - "Family name" -> familyName
 * - "Dob" -> dob
 * 
 * @param html - The HTML content to parse
 * @returns An InputPerson object with the extracted data
 */
export function parseInputHTML(html: string): InputPerson {
  // Create a parser to convert the HTML string into a DOM document
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Start with an empty person object
  const person: InputPerson = {};
  
  // Find all divs with class "field" - these contain our data
  const fieldDivs = doc.querySelectorAll('.field');
  
  // Go through each field div and extract the label and value
  fieldDivs.forEach(fieldDiv => {
    // Find the label element (tells us what field this is)
    const labelElement = fieldDiv.querySelector('.label');
    // Find the value element (contains the actual data)
    const valueElement = fieldDiv.querySelector('.value');
    
    // Only process if both label and value exist
    if (labelElement && valueElement) {
      // Get the text content and remove extra whitespace
      const labelText = labelElement.textContent?.trim() || '';
      const valueText = valueElement.textContent?.trim() || '';
      
      // Map the label text to our InputPerson fields
      // We use toLowerCase() to handle variations like "First Name" vs "first name"
      if (labelText.toLowerCase() === 'first name') {
        person.firstName = valueText;
      } else if (labelText.toLowerCase() === 'family name') {
        person.familyName = valueText;
      } else if (labelText.toLowerCase() === 'dob') {
        person.dob = valueText;
      }
    }
  });
  
  return person;
}

