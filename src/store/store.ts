import { configureStore, Middleware, ThunkAction, Action } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { rootReducer } from "./reducers";
import { webSocketMiddleware } from "./webSocketMiddleware";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Define the type of your custom middleware
type CustomMiddleware = Middleware<{}, RootState>;

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    // Ensure type safety for custom middleware
    const middleware: CustomMiddleware[] = getDefaultMiddleware() as CustomMiddleware[];
    // Add your custom middleware
    middleware.push(webSocketMiddleware);
    return middleware;
  },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
