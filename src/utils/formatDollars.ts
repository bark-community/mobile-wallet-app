/**
 * Converts a number to a formatted dollar amount string.
 * @param amount The number to be formatted. Accepts both integer and floating point.
 * @returns A string representing the formatted dollar amount with currency symbol.
 */
export function formatDollar(amount: number): string {
  // Ensure the function handles undefined or null input gracefully
  if (amount === null || amount === undefined) {
    console.warn('Received invalid amount:', amount);
    return "$0.00";
  }

  // Check for NaN or infinite numbers which can't be formatted correctly
  if (isNaN(amount) || !isFinite(amount)) {
    console.error('Attempted to format non-numeric or infinite value:', amount);
    return "$0.00";
  }

  // Formatter for US currency
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2, // Ensures that there are always two decimal places
    maximumFractionDigits: 2, // Optional: can adjust if precision is needed for smaller cents
  });

  return formatter.format(amount);
}
