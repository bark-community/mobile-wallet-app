import { createSlice, PayloadAction, createAsyncThunk, combineReducers } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { fetchSolanaBalanceFromAPI, fetchSolanaTransactionsFromAPI } from "../utils/solanaHelpers";
import { fetchBarkBalanceFromAPI, fetchBarkTransactionsFromAPI } from "../utils/barkHelpers";

// Interface for a crypto wallet
interface CryptoWallet {
  balance: number;
  transactions: Transaction[];
  status: "idle" | "loading" | "failed";
  address: string;
  publicKey: string;
}

// Interface for a transaction
interface Transaction {
  id: string;
  type: string;
  amount: number;
  date: string;
}

// Initial state for all wallets
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

// Async thunk to fetch Solana balance
export const fetchSolanaBalance = createAsyncThunk<number, string>(
  "wallet/fetchSolanaBalance",
  async (address: string, { rejectWithValue }) => {
    try {
      const balance = await fetchSolanaBalanceFromAPI(address);
      return balance;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch Solana transactions
export const fetchSolanaTransactions = createAsyncThunk<Transaction[], string>(
  "wallet/fetchSolanaTransactions",
  async (address: string, { rejectWithValue }) => {
    try {
      const transactions = await fetchSolanaTransactionsFromAPI(address);
      return transactions;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch Bark balance
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

// Async thunk to fetch Bark transactions
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

// Wallet slice combining reducers for all wallets
export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    // Add reducers for saving address, public key, deposit, withdrawal, and adding transaction
  },
  extraReducers: (builder) => {
    // Add extra reducers for handling async thunks
  }
});

// Selectors for Solana and Bark wallets
export const selectSolanaWallet = (state: RootState) => state.wallet.solana;
export const selectBarkWallet = (state: RootState) => state.wallet.bark;

// Combine all reducers including the wallet reducer
export const rootReducer = combineReducers({
  wallet: walletSlice.reducer,
  // Add other reducers if any
});

// Async middleware for WebSocket and other real-time data
const asyncMiddleware = (store: any) => (next: any) => (action: any) => {
  // Middleware logic here
};

// Configure store with combined reducer and middleware
export const store = configureStore({
  reducer: rootReducer,
  middleware: [asyncMiddleware],
});

// Export action creators
export const { fetchSolanaBalance, fetchSolanaTransactions, fetchBarkBalance, fetchBarkTransactions } = walletSlice.actions;
