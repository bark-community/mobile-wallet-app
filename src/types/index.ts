export interface AssetTransfer {
  asset: string;
  blockNum: string;
  category: "external" | "internal" | "erc20" | "erc721" | "erc1155" | "specialnft";
  erc1155Metadata: Record<string, unknown> | null;  // Prefer using Record for type safety over any
  erc721TokenId: string | null;
  from: string;
  hash: string;
  rawContract: Record<string, unknown>;  // Define more specific types if possible
  to: string;
  tokenId: string | null;
  uniqueId: string;
  value: number;
}

export interface AssetTransfersWithMetadataResponse {
  transfers: AssetTransfer[];
  pageKey?: string;  // Consider adding pagination properties if applicable
}

export interface ErrorResponse {
  errorMessage: string;
  errorDetails?: Record<string, unknown>; // Optional detailed error information
}

export enum Chains {
  Ethereum = "ethereum",
  Solana = "solana",
  Bark = "bark",
}