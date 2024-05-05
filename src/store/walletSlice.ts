import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { RootState } from "./index";
import { fetchEthereumTransactions } from "../utils/fetchTransactions";

interface BarkWallet {
  balance: number;
  transactions: Transaction[];
  status: "idle" | "loading" | "failed";
  address: string;
  publicKey: string;
}

interface WalletState {
  ethereum: BarkWallet;
  solana: BarkWallet;
  bark: BarkWallet;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  date: string;
}

const initialState: WalletState = {
  ethereum: { balance: 0, transactions: [], status: "idle", address: "", publicKey: "" },
  solana: { balance: 0, transactions: [], status: "idle", address: "", publicKey: "" },
  bark: { balance: 0, transactions: [], status: "idle", address: "", publicKey: "" },
};

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    updateWalletState: (state, action: PayloadAction<{ walletType: keyof WalletState; key: keyof BarkWallet; value: any }>) => {
      const { walletType, key, value } = action.payload;
      state[walletType][key] = value;
    },
    updateBalance: (state, action: PayloadAction<{ type: keyof WalletState; balance: number }>) => {
      state[action.payload.type].balance = action.payload.balance;
    },
    addTransaction: (state, action: PayloadAction<{ type: keyof WalletState; transaction: Transaction }>) => {
      state[action.payload.type].transactions.push(action.payload.transaction);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEthereumTransactions.pending, (state, action) => {
        state.ethereum.status = "loading";
      })
      .addCase(fetchEthereumTransactions.fulfilled, (state, action) => {
        state.ethereum.transactions = action.payload;
        state.ethereum.status = "idle";
      })
      .addCase(fetchEthereumTransactions.rejected, (state, action) => {
        state.ethereum.status = "failed";
        console.error("Failed to fetch transactions:", action.error.message);
      });
  }
});

export const {
  updateWalletState,
  updateBalance,
  addTransaction
} = walletSlice.actions;

export default walletSlice.reducer;
