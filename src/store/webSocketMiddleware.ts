import { createSlice, PayloadAction, createAsyncThunk, Middleware } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { RootState } from "./index";
import { fetchTransactions } from "../utils/fetchTransactions";

const { EXPO_PUBLIC_ALCHEMY_KEY, EXPO_PUBLIC_ALCHEMY_URL } = process.env;
const ethereumUrl = `${EXPO_PUBLIC_ALCHEMY_URL}${EXPO_PUBLIC_ALCHEMY_KEY}`;
const provider = new ethers.JsonRpcProvider(ethereumUrl);

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

export const fetchEthereumTransactions = createAsyncThunk(
  "wallet/fetchEthereumTransactions",
  async (address: string, { rejectWithValue }): Promise<Transaction[]> => {
    try {
      const transactions = await fetchTransactions(address);
      return transactions;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

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
      .addCase(fetchEthereumTransactions.pending, (state) => {
        state.ethereum.status = "loading";
      })
      .addCase(fetchEthereumTransactions.fulfilled, (state, action) => {
        state.ethereum.transactions = action.payload;
        state.ethereum.status = "idle";
      })
      .addCase(fetchEthereumTransactions.rejected, (state, action) => {
        state.ethereum.status = "failed";
        console.error("Failed to fetch transactions:", action.payload);
      });
  }
});

export const {
  updateWalletState,
  updateBalance,
  addTransaction
} = walletSlice.actions;

export default walletSlice.reducer;

export const webSocketMiddleware: Middleware =
  (store) =>
  (next) =>
  async (action) => {
    next(action);

    if (action.type === "wallet/saveAddress") {
      const state = store.getState() as RootState;
      const { ethereum } = state.wallet;

      try {
        const balance = await provider.getBalance(ethereum.address);
        store.dispatch(updateBalance({ type: "ethereum", balance: parseFloat(ethers.utils.formatEther(balance)) }));
      } catch (error) {
        console.error("Failed to fetch balance:", error.message);
      }
    }
  };
