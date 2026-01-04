/**
 * This file defines the data structures used throughout the application.
 * 
 * The application transforms person data from an input format to a canonical
 * (standardized) format. These types ensure type safety throughout the process.
 */

/**
 * The canonical (standardized) format for person records.
 * This is the target format that all input data gets transformed into.
 * 
 * Example:
 * {
 *   givenName: "Alice",
 *   sirname: "Smith",
 *   dateOfBirth: "12 April 1988"
 * }
 */
export interface CanonicalPerson {
  /** The person's first name */
  givenName: string;
  /** The person's last name (spelled "sirname" in the canonical format) */
  sirname: string;
  /** Date of birth formatted as "DD Month YYYY" (e.g., "12 April 1988") */
  dateOfBirth: string;
}

/**
 * The raw input data extracted from the HTML file.
 * This represents the data as it appears in the input HTML before transformation.
 * 
 * Example:
 * {
 *   firstName: "Alice",
 *   familyName: "Smith",
 *   dob: "1988-04-12"
 * }
 */
export interface InputPerson {
  /** The person's first name from the input */
  firstName?: string;
  /** The person's family/last name from the input */
  familyName?: string;
  /** Date of birth in YYYY-MM-DD format (e.g., "1988-04-12") */
  dob?: string;
}

