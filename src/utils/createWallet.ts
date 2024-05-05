import "react-native-get-random-values";
import "@ethersproject/shims";
import { ethers } from "ethers";
import { mnemonicToSeed } from "bip39";
import { Keypair } from "@solana/web3.js";

// Ensure strong random number generation in the crypto module for node environments if applicable.
import { randomBytes } from 'crypto';

export const createWallet = async () => {
  try {
    // Enhanced randomness for Ethereum wallet creation
    const entropy = randomBytes(32).toString('hex'); // Generate secure random entropy
    const ethereumWallet = ethers.Wallet.createRandom({ extraEntropy: entropy });
    const mnemonic = ethereumWallet.mnemonic.phrase;

    // Convert the mnemonic to a seed asynchronously for better performance
    const seedBuffer = await mnemonicToSeed(mnemonic);
    const seed = new Uint8Array(
      seedBuffer.buffer,
      seedBuffer.byteOffset,
      seedBuffer.byteLength
    ).slice(0, 32);

    // Reuse seed for Solana, ensuring cryptographic security via proper seeding
    const solanaWallet = Keypair.fromSeed(seed);

    return {
      ethereumWallet: {
        address: ethereumWallet.address,
        privateKey: ethereumWallet.privateKey,
        mnemonic: ethereumWallet.mnemonic.phrase
      },
      solanaWallet: {
        publicKey: solanaWallet.publicKey.toString(),
        privateKey: [...solanaWallet.secretKey]  // Convert Uint8Array to Array for easier handling if needed
      }
    };
  } catch (error) {
    console.error("Failed to create wallets due to:", error);
    throw new Error("Wallet creation failed due to a system error. Please try again.");
  }
};

