import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./index";
import { fetchBarkBalanceFromAPI, fetchBarkTransactionsFromAPI } from "../utils/barkHelpers";

interface CryptoWallet {
  balance: number;
  transactions: Transaction[];
  status: "idle" | "loading" | "failed";
  address: string;
  publicKey: string;
}

export interface WalletState {
  ethereum: CryptoWallet;
  solana: CryptoWallet;
  bark: CryptoWallet;
}

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  date: string;
}

const initialState: WalletState = {
  ethereum: {
    balance: 0,
    transactions: [],
    status: "idle",
    address: "",
    publicKey: "",
  },
  solana: {
    balance: 0,
    transactions: [],
    status: "idle",
    address: "",
    publicKey: "",
  },
  bark: {
    balance: 0,
    transactions: [],
    status: "idle",
    address: "",
    publicKey: "",
  },
};

export const fetchBarkBalance = createAsyncThunk<number, string>(
  "wallet/fetchBarkBalance",
  async (address: string, { rejectWithValue }) => {
    try {
      const balance = await fetchBarkBalanceFromAPI(address);
      return balance;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBarkTransactions = createAsyncThunk<Transaction[], string>(
  "wallet/fetchBarkTransactions",
  async (address: string, { rejectWithValue }) => {
    try {
      const transactions = await fetchBarkTransactionsFromAPI(address);
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
    saveAddress: (state, action: PayloadAction<{ network: string; address: string }>) => {
      const { network, address } = action.payload;
      state[network].address = address;
    },
    savePublicKey: (state, action: PayloadAction<{ network: string; publicKey: string }>) => {
      const { network, publicKey } = action.payload;
      state[network].publicKey = publicKey;
    },
    depositFunds: (state, action: PayloadAction<{ network: string; amount: number }>) => {
      const { network, amount } = action.payload;
      state[network].balance += amount;
    },
    withdrawFunds: (state, action: PayloadAction<{ network: string; amount: number }>) => {
      const { network, amount } = action.payload;
      state[network].balance -= amount;
    },
    addTransaction: (state, action: PayloadAction<{ network: string; transaction: Transaction }>) => {
      const { network, transaction } = action.payload;
      state[network].transactions.push(transaction);
    },
    updateBalance: (state, action: PayloadAction<{ network: string; balance: number }>) => {
      const { network, balance } = action.payload;
      state[network].balance = balance;
    },
  },
  extraReducers: (builder) => {
    // Add extra reducers if needed
  },
});

export const {
  saveAddress,
  savePublicKey,
  depositFunds,
  withdrawFunds,
  addTransaction,
  updateBalance,
} = walletSlice.actions;

export default walletSlice.reducer;
