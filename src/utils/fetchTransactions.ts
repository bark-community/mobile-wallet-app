import { Alchemy, Network } from "alchemy-sdk";
import { ethers } from "ethers";

// Load environment variables
const { EXPO_PUBLIC_ENVIRONMENT, EXPO_PUBLIC_ALCHEMY_KEY } = process.env;

// Define the network based on the environment
const network = EXPO_PUBLIC_ENVIRONMENT === "production"
    ? Network.ETH_MAINNET
    : Network.ETH_SEPOLIA;

// Configuration for Alchemy SDK
const config = {
  apiKey: EXPO_PUBLIC_ALCHEMY_KEY,
  network,
};

// Initialize Alchemy SDK
const alchemy = new Alchemy(config);

/**
 * Fetches blockchain transactions for a specific address with pagination.
 * @param {string} fromAddress - The Ethereum address to fetch transactions from.
 * @param {string} pageKey - The page key for pagination, defaulting to the start.
 * @returns {Promise<any>} - A promise that resolves to the transaction data and next page key.
 */
export const fetchTransactions = async (fromAddress: string, pageKey = "0x0") => {
  try {
    // Perform the API call to Alchemy to get asset transfers
    const response = await alchemy.core.getAssetTransfers({
      fromBlock: pageKey,
      fromAddress,
      excludeZeroValue: true,
      category: ["internal", "external", "erc20", "erc721", "erc1155", "specialnft"],
      withMetadata: true,
      maxCount: 50, // Adjust this number based on your needs
    });

    // Optional: format the transaction data for better usability
    const formattedTransfers = response.transfers.map(transfer => ({
      ...transfer,
      value: ethers.utils.formatEther(transfer.value), // Convert Wei to Ether
      timestamp: new Date(transfer.blockTimestamp * 1000).toLocaleString(), // Convert Unix timestamp to readable date
    }));

    // Return formatted transactions and the next page key for pagination
    return {
      transfers: formattedTransfers,
      nextPageKey: response.pageKey
    };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    // Provide more information if it's an HTTP response error
    if (error.response) {
      console.error("HTTP status code:", error.response.status);
      console.error("Response body:", error.response.data);
    }
    throw new Error(`Failed to fetch transactions: ${error.message}`);
  }
};
