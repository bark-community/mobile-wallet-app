import { Connection, PublicKey, clusterApiUrl, ConfirmedSignatureInfo } from "@solana/web3.js";

// Initialize Solana connection
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

/**
 * Retrieves Bark balance for a specific address on the Solana blockchain.
 * @param {string} publicKeyString - The public key string of the address.
 * @returns {Promise<number>} - A promise that resolves to the Bark balance.
 */
export const getSolanaBarkBalance = async (publicKeyString: string): Promise<number> => {
  try {
    const publicKey = new PublicKey(publicKeyString);
    const balance = await connection.getBalance(publicKey);
    const barkBalance = balance / 1e9; // Convert lamports to Bark
    return barkBalance;
  } catch (error) {
    console.error("Error fetching Bark balance:", error);
    throw error;
  }
};

/**
 * Retrieves transactions for a specific Solana wallet address.
 * @param {string} walletAddress - The Solana wallet address.
 * @returns {Promise<ConfirmedSignatureInfo | null>} - A promise that resolves to the first confirmed signature info.
 */
export const getSolanaTransactionsByWallet = async (walletAddress: string): Promise<ConfirmedSignatureInfo | null> => {
  const publicKey = new PublicKey(walletAddress);

  try {
    const signatures = await connection.getConfirmedSignaturesForAddress2(publicKey);
    const signature = signatures.map((signature) => signature.signature)[0];

    if (!signature) {
      return null;
    }

    const response = await connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    });

    console.log("Response from Solana getTransactionsByWallet:", response);
    return response;
  } catch (error) {
    console.error("Failed to fetch Solana transactions:", error);
    return null;
  }
};
