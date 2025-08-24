// src/store.ts
import { configureStore } from "@reduxjs/toolkit";
import fakeCartReducer from "./features/cart/fakeCartSlice";

export const store = configureStore({
  reducer: {
    fakeCart: fakeCartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

console.log("🔹 Redux store initialized");