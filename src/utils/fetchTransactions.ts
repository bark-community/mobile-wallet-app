import axios, { AxiosResponse, AxiosError } from "axios";

// Define the expiration time for cache (1 minute)
const CACHE_EXPIRATION_TIME = 60000;

// Define a cache object to store transaction data for each blockchain network
let transactionCache: Record<string, { transactions: Transaction[]; nextPageKey: string; timestamp: number }> = {};

// Define an interface for the transaction object
interface Transaction {
  id: string;
  type: string;
  amount: number;
  date: string;
}

/**
 * Fetches blockchain transactions for a specific address with pagination.
 * @param {string} fromAddress - The address to fetch transactions from.
 * @param {string} pageKey - The page key for pagination, defaulting to the start.
 * @param {string} blockchain - The blockchain network (e.g., "ethereum", "solana", "bark").
 * @returns {Promise<{ transactions: Transaction[], nextPageKey: string }>} - A promise that resolves to the transaction data and next page key.
 */
export const fetchTransactions = async (fromAddress: string, pageKey = "0x0", blockchain: string): Promise<{ transactions: Transaction[]; nextPageKey: string }> => {
  try {
    // Check if transaction data is already cached and not expired for the specified blockchain network
    const cachedData = transactionCache[blockchain + fromAddress];
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRATION_TIME) {
      return cachedData;
    }

    // Perform the API call to fetch transactions
    const response: AxiosResponse<{ transactions: Transaction[]; pageKey: string }> = await axios.get(`/api/transactions/${blockchain}/${fromAddress}`, {
      params: {
        pageKey,
      },
    });

    // Update cache with fetched transactions for the specified blockchain network
    cacheTransactions(blockchain + fromAddress, response.data.transactions, response.data.pageKey);

    // Return the fetched transactions and next page key
    return response.data;
  } catch (error) {
    handleFetchError(error);
    throw new Error("Failed to fetch transactions. Please try again later.");
  }
};

/**
 * Handles errors that occur during the fetchTransactions function.
 * @param {any} error - The error object.
 */
const handleFetchError = (error: any): void => {
  console.error("Error fetching transactions:", error);

  if (axios.isAxiosError(error)) {
    const axiosError: AxiosError = error;
    console.error("HTTP status code:", axiosError.response?.status);
    console.error("Response body:", axiosError.response?.data);
  }
};

/**
 * Retrieves cached transactions for an address and blockchain network if available.
 * @param {string} address - The address to retrieve cached transactions for.
 * @param {string} blockchain - The blockchain network (e.g., "ethereum", "solana", "bark").
 * @returns {Transaction[] | null} - Cached transactions or null if not cached or expired.
 */
const getCachedTransactions = (address: string, blockchain: string): Transaction[] | null => {
  const cachedData = transactionCache[blockchain + address];
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRATION_TIME) {
    return cachedData.transactions;
  }
  return null;
};

/**
 * Caches transactions for an address and blockchain network.
 * @param {string} address - The address to cache transactions for.
 * @param {Transaction[]} transactions - Transactions to cache.
 * @param {string} nextPageKey - The next page key for pagination.
 */
const cacheTransactions = (address: string, transactions: Transaction[], nextPageKey: string): void => {
  transactionCache[address] = { transactions, nextPageKey, timestamp: Date.now() };
};
