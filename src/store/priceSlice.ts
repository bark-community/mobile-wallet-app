import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface PriceState {
  ethereum: { usd: number };
  solana: { usd: number };
  bark: { usd: number };
}

const initialState: PriceState = {
  ethereum: { usd: 0 },
  solana: { usd: 0 },
  bark: { usd: 0 },
};

const priceSlice = createSlice({
  name: "price",
  initialState,
  reducers: {
    updateEthereumPrice(state, action: PayloadAction<number>) {
      state.ethereum.usd = action.payload;
    },
    updateSolanaPrice(state, action: PayloadAction<number>) {
      state.solana.usd = action.payload;
    },
    updateBarkPrice(state, action: PayloadAction<number>) {
      state.bark.usd = action.payload;
    },
  },
});

export const { updateEthereumPrice, updateSolanaPrice, updateBarkPrice } = priceSlice.actions;

// Selectors
export const selectEthereumPrice = (state: RootState) => state.price.ethereum.usd;
export const selectSolanaPrice = (state: RootState) => state.price.solana.usd;
export const selectBarkPrice = (state: RootState) => state.price.bark.usd;

export default priceSlice.reducer;
