import { InputPerson, CanonicalPerson } from './types.js';

/**
 * This file handles transforming input data into the canonical format.
 * 
 * The transformation includes:
 * 1. Mapping field names (firstName -> givenName, familyName -> surname)
 * 2. Transforming date format (YYYY-MM-DD -> "DD Month YYYY")
 */

/**
 * Transforms a date string from YYYY-MM-DD format to "DD Month YYYY" format.
 * 
 * Example: "1988-04-12" becomes "12 April 1988"
 * 
 * @param dateStr - Date in YYYY-MM-DD format (e.g., "1988-04-12")
 * @returns Date in "DD Month YYYY" format (e.g., "12 April 1988")
 */
function transformDate(dateStr: string): string {
  try {
    // Add 'T00:00:00' to avoid timezone issues when parsing the date
    // Without this, the date might shift by a day depending on timezone
    const date = new Date(dateStr + 'T00:00:00');
    
    // Extract the day of the month (1-31)
    const day = date.getDate();
    
    // Array of month names in English
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Get the month name (getMonth() returns 0-11, so we use it as an array index)
    const month = monthNames[date.getMonth()];
    
    // Extract the full year (e.g., 1988)
    const year = date.getFullYear();
    
    // Combine into the desired format: "DD Month YYYY"
    return `${day} ${month} ${year}`;
  } catch (error) {
    // If something goes wrong parsing the date, just return the original string
    // This prevents the whole transformation from failing due to a bad date
    return dateStr;
  }
}

/**
 * Transforms input person data into the canonical format.
 * 
 * This function:
 * 1. Maps field names from input format to canonical format
 * 2. Transforms the date format if a date is present
 * 3. Handles missing fields by using empty strings
 * 
 * @param input - The input person data extracted from HTML
 * @returns The person data in canonical format
 */
export function transformToCanonical(input: InputPerson): CanonicalPerson {
  const warnings: string[] = [];
  
  // Check if Given Name is missing
  if (!input.firstName || input.firstName.trim() === '') {
    warnings.push('Given Name field is missing or could not be parsed from the input.');
  }
  
  // Check if Surname is missing
  if (!input.familyName || input.familyName.trim() === '') {
    warnings.push('Surname field is missing or could not be parsed from the input.');
  }
  
  // Check if DOB is missing
  if (!input.dob || input.dob.trim() === '') {
    warnings.push('Date of birth (DOB) field is missing or could not be parsed from the input.');
  }
  
  return {
    // Map "firstName" from input to "givenName" in canonical format
    givenName: input.firstName || '',
    
    // Map "familyName" from input to "surname" in canonical format
    surname: input.familyName || '',
    
    // Transform the date format if a date exists, otherwise use empty string
    dateOfBirth: input.dob ? transformDate(input.dob) : '',
    
    // Include warnings if any
    warnings: warnings.length > 0 ? warnings : undefined
  };
}

