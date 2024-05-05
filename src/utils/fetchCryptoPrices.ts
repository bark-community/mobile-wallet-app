import axios, { AxiosResponse, AxiosError } from "axios";

// Define the expiration time for cache (5 minutes)
const CACHE_EXPIRATION_TIME = 5 * 60 * 1000;

// Define a cache object to store balance data
let balanceCache: Record<string, { data: any; timestamp: number }> = {};

// Define an interface for the API response to enhance type safety
interface CryptoPrices {
  [key: string]: {
    usd: number;
    [key: string]: number; // Allow other currencies besides USD
  };
}

// Define a type for the function's parameters to allow flexibility in currencies
interface FetchCryptoPricesParams {
  ids?: string[];
  baseCurrency?: string;
}

/**
 * Fetches cryptocurrency prices from the CoinGecko API.
 * @param {FetchCryptoPricesParams} params - Parameters for fetching prices.
 * @returns {Promise<CryptoPrices | null>} - A promise resolving to cryptocurrency prices or null if an error occurs.
 */
export const fetchCryptoPrices = async ({
  ids = ["bitcoin", "solana", "usdc", "bark", "ethereum"],
  baseCurrency = "usd",
}: FetchCryptoPricesParams = {}): Promise<CryptoPrices | null> => {
  try {
    const cachedPrices = getCachedPrices();
    if (cachedPrices) {
      return cachedPrices;
    }

    // Construct the API URL and query parameters
    const response: AxiosResponse<CryptoPrices> = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: {
          ids: ids.join(","),
          vs_currencies: baseCurrency,
        },
      }
    );

    const prices = response.data;
    cachePrices(prices);
    return prices;
  } catch (error) {
    handleFetchError(error);
    return null;
  }
};

/**
 * Handles errors that occur during the fetchCryptoPrices function.
 * @param {any} error - The error object.
 */
const handleFetchError = (error: any): void => {
  console.error("Error fetching cryptocurrency prices:", error);

  if (axios.isAxiosError(error)) {
    const axiosError: AxiosError = error;
    console.error("Axios error response:", axiosError.response?.data);
  }
};

/**
 * Retrieves cached cryptocurrency prices if available.
 * @returns {CryptoPrices | null} - Cached cryptocurrency prices or null if not cached or expired.
 */
const getCachedPrices = (): CryptoPrices | null => {
  // Check if cached data exists and is not expired
  const cachedData = balanceCache["cryptoPrices"];
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRATION_TIME) {
    return cachedData.data;
  }
  return null;
};

/**
 * Caches cryptocurrency prices for future use.
 * @param {CryptoPrices} prices - Cryptocurrency prices to cache.
 */
const cachePrices = (prices: CryptoPrices): void => {
  // Update cache with fetched prices
  balanceCache["cryptoPrices"] = { data: prices, timestamp: Date.now() };
};
