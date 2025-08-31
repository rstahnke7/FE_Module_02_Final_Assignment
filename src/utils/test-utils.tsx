import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';
import authReducer from '../features/auth/authSlice';

export function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      cart: cartReducer,
      auth: authReducer,
    },
    preloadedState,
  });
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: {
    preloadedState?: Record<string, unknown>;
    store?: ReturnType<typeof createTestStore>;
  } = {}
) {
  const { preloadedState = {}, store = createTestStore(preloadedState) } = options;

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper }),
  };
}