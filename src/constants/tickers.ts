// Define a type for ticker symbols
export type TickerSymbols = "ETH" | "SOL" | "BARK";

/**
 * TICKERS object containing ticker symbols for different cryptocurrencies.
 */
export const TICKERS: Record<string, TickerSymbols> = {
  // Ethereum ticker symbol
  ethereum: "ETH",

  // Solana ticker symbol
  solana: "SOL",

  // Bark ticker symbol
  bark: "BARK",
};
