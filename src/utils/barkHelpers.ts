import axios from 'axios';

// Define the expiration time for cache (1 minute)
const CACHE_EXPIRATION_TIME = 60000;

// Define a cache object to store balance data
let balanceCache: { [address: string]: { balance: number; timestamp: number } } = {};

// Simulate fetching Bark balance from a backend or API
export const fetchBarkBalanceFromAPI = async (address: string): Promise<number> => {
    // Check if balance data is already cached and not expired
    const cachedData = balanceCache[address];
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRATION_TIME) {
        return cachedData.balance; // Return cached balance
    }

    try {
        // Fetch balance from the API
        const response = await axios.get<number>(`/api/bark/balance/${address}`);
        const balance = response.data;

        // Update cache with fetched balance
        balanceCache[address] = { balance, timestamp: Date.now() };
        
        // Return fetched balance
        return balance;
    } catch (error) {
        console.error('Failed to fetch Bark balance:', error);
        throw new Error('Failed to fetch Bark balance. Please try again later.');
    }
}

// Simulate fetching Bark transactions from a backend or API
export const fetchBarkTransactionsFromAPI = async (address: string): Promise<Transaction[]> => {
    try {
        // Fetch transactions from the API
        const response = await axios.get<Transaction[]>(`/api/bark/transactions/${address}`);
        return response.data; // Return fetched transactions
    } catch (error) {
        console.error('Failed to fetch Bark transactions:', error);
        throw new Error('Failed to fetch Bark transactions. Please try again later.');
    }
}

// Interface for transaction object
interface Transaction {
    id: string;
    type: string;
    amount: number;
    date: string;
}
