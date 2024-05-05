// Define a more specific type for ERC1155 metadata
export interface ERC1155Metadata {
  [key: string]: unknown;
}

export interface AssetTransfer {
  asset: string;
  blockNum: string;
  category: "external" | "internal" | "erc20" | "erc721" | "erc1155" | "specialnft";
  erc1155Metadata: ERC1155Metadata | null;
  erc721TokenId: string | null;
  from: string;
  hash: string;
  rawContract: Record<string, unknown>;
  to: string;
  tokenId: string | null;
  uniqueId: string;
  value: number;
}

export interface AssetTransfersWithMetadataResponse {
  transfers: AssetTransfer[];
  pageKey?: string;
}

export interface ErrorResponse {
  errorMessage: string;
  errorDetails?: Record<string, unknown>;
}

export enum Chains {
  Ethereum = "ethereum",
  Solana = "solana",
  Bark = "bark",
}
