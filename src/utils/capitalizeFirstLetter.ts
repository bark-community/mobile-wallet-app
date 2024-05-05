/**
 * Capitalizes the first letter of a string.
 * 
 * @param {string} word - The string to capitalize.
 * @returns {string} - The capitalized string.
 */
export function capitalizeFirstLetter(word: string): string {
  if (typeof word !== 'string' || !word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
