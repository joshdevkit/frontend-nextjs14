import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // Storage for persistence

// Redux Persist config
const persistConfig = {
  key: "root",
  version: 1,
  storage, // Use localStorage or sessionStorage (via redux-persist)
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authSlice,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
