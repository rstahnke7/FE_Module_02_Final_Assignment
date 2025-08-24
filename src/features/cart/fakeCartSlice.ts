// src/features/cart/fakeCartSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface FakeCartState {
  items: string[];
}

const initialState: FakeCartState = {
  items: ["Apples", "Bananas", "Cherries"],
};

const fakeCartSlice = createSlice({
  name: "fakeCart",
  initialState,
  reducers: {},
});

export default fakeCartSlice.reducer;