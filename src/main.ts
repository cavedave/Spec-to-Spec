import { parseInputHTML } from './parser.js';
import { transformToCanonical } from './transformer.js';
import { generateOutputHTML } from './generator.js';

/**
 * This is the main application file that:
 * 1. Orchestrates the transformation process (parse -> transform -> generate)
 * 2. Handles the user interface (file upload, display, download)
 */

/**
 * Processes an input HTML file through the complete transformation pipeline.
 * 
 * The pipeline consists of three steps:
 * 1. Parse: Extract data from the input HTML
 * 2. Transform: Convert to canonical format
 * 3. Generate: Create the output HTML
 * 
 * @param fileContent - The HTML content of the input file
 * @returns The transformed HTML content ready to be saved
 */
export function processInputFile(fileContent: string): string {
  // Step 1: Parse the input HTML to extract person data
  const inputData = parseInputHTML(fileContent);
  
  // Step 2: Transform the input data into canonical format
  const canonicalData = transformToCanonical(inputData);
  
  // Step 3: Generate the output HTML from the canonical data
  const outputHTML = generateOutputHTML(canonicalData, fileContent);
  
  return outputHTML;
}

/**
 * Initializes the application when the page loads.
 * 
 * Sets up all the UI event handlers and connects them to the transformation logic.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Get references to all the HTML elements we need
  const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  const uploadButton = document.getElementById('uploadButton') as HTMLButtonElement;
  const outputDiv = document.getElementById('output') as HTMLDivElement;
  const errorDiv = document.getElementById('error') as HTMLDivElement;
  const downloadButton = document.getElementById('downloadButton') as HTMLButtonElement;
  
  // Store the current output HTML so we can download it later
  let currentOutputHTML = '';
  
  // Set up the file upload button
  uploadButton.addEventListener('click', () => {
    // Get the file that the user selected
    const selectedFile = fileInput.files?.[0];
    
    // Check if a file was actually selected
    if (!selectedFile) {
      errorDiv.textContent = 'Please select a file';
      errorDiv.style.display = 'block';
      return;
    }
    
    // Create a FileReader to read the file contents
    // FileReader is a browser API that lets us read files asynchronously
    const fileReader = new FileReader();
    
    // This runs when the file has been successfully read
    fileReader.onload = (event) => {
      try {
        // Get the file content as a string
        const fileContent = event.target?.result as string;
        
        // Process the file through our transformation pipeline
        // This does: parse -> transform -> generate
        const outputHTML = processInputFile(fileContent);
        
        // Store the output HTML so we can download it later
        currentOutputHTML = outputHTML;
        
        // Display the output in an iframe so the user can preview it
        const previewIframe = document.createElement('iframe');
        previewIframe.style.width = '100%';
        previewIframe.style.height = '600px';
        previewIframe.style.border = '1px solid #ccc';
        
        // Clear any previous output
        outputDiv.innerHTML = '';
        outputDiv.appendChild(previewIframe);
        
        // Set the iframe content to our generated HTML
        // srcdoc lets us set HTML content directly without needing a separate file
        previewIframe.srcdoc = outputHTML;
        
        // Hide any previous errors and show the download button
        errorDiv.style.display = 'none';
        downloadButton.style.display = 'block';
      } catch (error) {
        // If something goes wrong, show an error message
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errorDiv.textContent = `Error processing file: ${errorMessage}`;
        errorDiv.style.display = 'block';
        outputDiv.innerHTML = '';
        downloadButton.style.display = 'none';
      }
    };
    
    // This runs if there's an error reading the file
    fileReader.onerror = () => {
      errorDiv.textContent = 'Error reading file';
      errorDiv.style.display = 'block';
    };
    
    // Start reading the file as text
    // This is asynchronous - the onload callback will run when it's done
    fileReader.readAsText(selectedFile);
  });
  
  // Set up the download button
  downloadButton.addEventListener('click', () => {
    // Don't do anything if there's no output to download
    if (!currentOutputHTML) {
      return;
    }
    
    // Create a Blob (Binary Large Object) containing the HTML
    // A Blob represents file-like data in memory
    const htmlBlob = new Blob([currentOutputHTML], { type: 'text/html' });
    
    // Create a temporary URL that points to the blob
    // This URL can be used like a regular file URL
    const blobUrl = URL.createObjectURL(htmlBlob);
    
    // Create a temporary link element that will trigger the download
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = 'output.html'; // This tells the browser to download instead of navigate
    
    // Add the link to the page, click it (triggers download), then remove it
    // This is a common technique to trigger file downloads programmatically
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Clean up the blob URL to free memory
    // Important: always revoke blob URLs when you're done with them
    URL.revokeObjectURL(blobUrl);
  });
});

