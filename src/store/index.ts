import { combineReducers, configureStore, Action, getDefaultMiddleware } from "@reduxjs/toolkit";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import walletReducer from "./walletSlice";
import { ethers } from "ethers";

// Redux persist configuration
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ['wallet'],
};

// Root reducer combining all reducers
const rootReducer = combineReducers({
  wallet: walletReducer,
});

// Persisted reducer using redux-persist
const persistedReducer = persistReducer(persistConfig, rootReducer);

// WebSocket setup function
const setupWebSocket = (ethereumAddress: string) => {
  const ethWebSocketUrl = `${process.env.EXPO_PUBLIC_ALCHEMY_SOCKET_URL}${process.env.EXPO_PUBLIC_ALCHEMY_KEY}`;
  const provider = new ethers.WebSocketProvider(ethWebSocketUrl);

  provider.on("block", async () => {
    try {
      const balance = await provider.getBalance(ethereumAddress);
      store.dispatch({
        type: WalletActionTypes.UPDATE_ETHEREUM_BALANCE,
        payload: ethers.utils.formatEther(balance),
      });
    } catch (error) {
      console.error("Error fetching Ethereum balance:", error);
    }
  });

  return () => provider.removeAllListeners();
};

// WebSocket middleware for real-time Ethereum blockchain data
const webSocketMiddleware: Middleware = store => next => action => {
  next(action);

  if (action.type === WalletActionTypes.SAVE_ETHEREUM_ADDRESS) {
    const ethereumAddress = store.getState().wallet.ethereum.address;

    if (ethereumAddress) {
      const cleanupWebSocket = setupWebSocket(ethereumAddress);
      return cleanupWebSocket;
    }
  }
};

// Configure and create the Redux store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: composeWithDevTools({
    serialize: true, // Ensures that WebSocket middleware is correctly serialized
  })(getDefaultMiddleware().concat(webSocketMiddleware)),
});

// Create the Redux persistor
export const persistor = persistStore(store);

// Define root state, dispatch type, and thunk action types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// Utility function to clear persisted state
export const clearPersistedState = async () => {
  try {
    await persistor.purge();
    console.log('Persisted state cleared successfully.');
  } catch (error) {
    console.error("Failed to purge persistor:", error);
  }
};

// Action type constants
enum WalletActionTypes {
  SAVE_ETHEREUM_ADDRESS = "wallet/saveEthereumAddress",
  UPDATE_ETHEREUM_BALANCE = "wallet/updateEthereumBalance",
}
