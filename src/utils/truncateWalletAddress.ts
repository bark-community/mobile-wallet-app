/**
 * Truncates a wallet address to show only the first few and last few characters.
 * This is typically used to help users identify addresses without displaying the full address.
 * 
 * @param {string} address - The wallet address to truncate.
 * @returns {string} - The truncated wallet address.
 */
export const truncateWalletAddress = (address: string): string => {
  if (!address) {
    console.warn('Attempted to truncate an empty or undefined address.');
    return '';
  }
  
  // Ensure the address is a string and has a sufficient length to truncate
  if (typeof address !== 'string' || address.length < 9) {
    console.error('Invalid address or address too short to truncate:', address);
    return address;  // Return the original address if it's too short to truncate meaningfully
  }

  // Typically, 4 characters from the start and 4 from the end are shown
  const firstSegment = address.slice(0, 5);
  const lastSegment = address.slice(-4);
  return `${firstSegment}...${lastSegment}`;
};
