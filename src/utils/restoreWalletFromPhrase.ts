import "react-native-get-random-values";
import "@ethersproject/shims";
import * as ethers from "ethers";
import { mnemonicToSeedSync } from "bip39";
import { Keypair } from "@solana/web3.js";

export function restoreWalletFromPhrase(mnemonicPhrase: string) {
    if (!mnemonicPhrase) {
        throw new Error("Mnemonic phrase cannot be empty.");
    }

    try {
        // Restore Ethereum wallet from mnemonic phrase
        const ethWallet = ethers.Wallet.fromMnemonic(mnemonicPhrase);

        // Use BIP39 to derive a seed from the mnemonic phrase
        const seedBuffer = mnemonicToSeedSync(mnemonicPhrase);
        const seed = new Uint8Array(
            seedBuffer.buffer,
            seedBuffer.byteOffset,
            seedBuffer.byteLength
        ).slice(0, 32);

        // Restore Solana wallet from the derived seed, which will also be used for Bark
        const solanaWallet = Keypair.fromSeed(seed);
        // Since Bark uses the Solana blockchain, we use the same seed for Bark's wallet
        const barkWallet = Keypair.fromSeed(seed);  // This is essentially another Solana wallet, labeled for Bark

        // Log the restored wallets for debug purposes (consider adjusting logging in production)
        console.log("Restored wallets", {
            Ethereum: ethWallet.address,
            Solana: solanaWallet.publicKey.toString(),
            Bark: barkWallet.publicKey.toString()  // This is identical to the Solana wallet public key
        });

        // Return the wallet objects
        return {
            ethereumWallet: ethWallet,
            solanaWallet: solanaWallet,
            barkWallet: barkWallet,
        };
    } catch (error) {
        console.error("Failed to restore wallets:", error);
        throw new Error(
            "Failed to restore wallet from mnemonic: " + (error as Error).message
        );
    }
}
