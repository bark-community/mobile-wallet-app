import { createSlice, createAction, createAsyncThunk, Middleware } from "@reduxjs/toolkit";
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

export const fetchEthereumTransactions = createAsyncThunk<Transaction[], string, { rejectValue: string }>(
  "wallet/fetchEthereumTransactions",
  async (address, { rejectWithValue }) => {
    try {
      const transactions = await fetchTransactions(address);
      return transactions;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBalance = createAction<{ type: keyof WalletState; balance: number }>("wallet/updateBalance");
export const updateWalletState = createAction<{ walletType: keyof WalletState; key: keyof BarkWallet; value: any }>("wallet/updateWalletState");
export const addTransaction = createAction<{ type: keyof WalletState; transaction: Transaction }>("wallet/addTransaction");

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {},
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

export const webSocketMiddleware: Middleware<{}, RootState> =
  (store) =>
  (next) =>
  async (action) => {
    next(action);

    if (action.type === fetchEthereumTransactions.pending.toString()) {
      const state = store.getState();
      const { ethereum } = state.wallet;

      try {
        const balance = await provider.getBalance(ethereum.address);
        store.dispatch(updateBalance({ type: "ethereum", balance: parseFloat(ethers.utils.formatEther(balance)) }));
      } catch (error) {
        console.error("Failed to fetch balance:", error.message);
      }
    }
  };

export default walletSlice.reducer;
