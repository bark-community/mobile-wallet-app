import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

// Set up a connection to the Solana devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

/**
 * Retrieves the balance for a Solana public key and converts it from lamports to SOL.
 * @param {string} publicKeyString The public key of the Solana account as a string.
 * @returns {Promise<number>} The balance in SOL.
 */
export const getBarkBalance = async (publicKeyString: string): Promise<number> => {
  try {
    // Convert the string to a PublicKey object
    const publicKey = new PublicKey(publicKeyString);

    // Get the balance in lamports
    const balanceInLamports = await connection.getBalance(publicKey);

    // Convert the balance from lamports to SOL
    const balanceInSol = balanceInLamports / 1e9;

    return balanceInSol;
  } catch (error) {
    console.error("Error fetching BARK balance for public key:", publicKeyString, error);
    throw new Error(`Failed to fetch balance: ${error.message}`);
  }
};
