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
    updatePrice(state, action: PayloadAction<{ currency: "ethereum" | "solana" | "bark"; value: number }>) {
      const { currency, value } = action.payload;
      state[currency].usd = value;
    },
  },
});

export const { updatePrice } = priceSlice.actions;

// Selectors
export const selectPrice = (state: RootState, currency: "ethereum" | "solana" | "bark") => state.price[currency].usd;

export default priceSlice.reducer;
