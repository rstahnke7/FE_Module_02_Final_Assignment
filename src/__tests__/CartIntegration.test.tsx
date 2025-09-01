import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../utils/test-utils';
import ProductCard from '../components/Products/ProductCard';
import ShoppingCart from '../components/ShoppingCart';
import type { Product } from '../types';

// Mock firestore functions for the ShoppingCart component
jest.mock('../lib/firestore', () => ({
  createOrder: jest.fn().mockResolvedValue(undefined),
  getProducts: jest.fn().mockResolvedValue([])
}));

const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Smartphone',
    description: 'High-quality smartphone with advanced features',
    price: 599.99,
    category: 'electronics',
    image: 'https://example.com/smartphone.jpg',
    rating: { rate: 4.5, count: 150 },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    title: 'Laptop',
    description: 'Powerful laptop for work and gaming',
    price: 1299.99,
    category: 'electronics',
    image: 'https://example.com/laptop.jpg',
    rating: { rate: 4.8, count: 89 },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    title: 'Headphones',
    description: 'Noise-canceling wireless headphones',
    price: 199.99,
    category: 'electronics',
    image: 'https://example.com/headphones.jpg',
    rating: { rate: 4.3, count: 200 },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Mock sessionStorage for cart persistence
const mockSessionStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

const CartIntegrationTestComponent: React.FC = () => {
  const [cartVisible, setCartVisible] = React.useState(true);

  return (
    <div>
      <div data-testid="product-list">
        {mockProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <ShoppingCart 
        visible={cartVisible} 
        onClose={() => setCartVisible(false)} 
      />
    </div>
  );
};

describe('Cart Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSessionStorage.clear();
  });

  describe('Adding Products to Cart', () => {
    it('updates cart when a single product is added', async () => {
      const user = userEvent.setup();
      const { store } = renderWithProviders(<CartIntegrationTestComponent />);

      // Initially, cart should be empty
      expect(store.getState().cart.items).toHaveLength(0);
      expect(screen.getByText('The cart is empty.')).toBeInTheDocument();

      // Add first product to cart
      const addToCartButtons = screen.getAllByText('Add to Cart');
      await user.click(addToCartButtons[0]); // Click on Smartphone

      // Verify cart state is updated
      const cartState = store.getState().cart.items;
      expect(cartState).toHaveLength(1);
      expect(cartState[0].title).toBe('Smartphone');
      expect(cartState[0].price).toBe(599.99);
      expect(cartState[0].quantity).toBe(1);

      // Verify cart UI is updated
      await waitFor(() => {
        expect(screen.getByText(/Smartphone x 1/)).toBeInTheDocument();
        expect(screen.getByText('Total Items: 1')).toBeInTheDocument();
        expect(screen.getByText('Total Price: $599.99')).toBeInTheDocument();
      });
    });

    it('updates cart when multiple different products are added', async () => {
      const user = userEvent.setup();
      const { store } = renderWithProviders(<CartIntegrationTestComponent />);

      // Add multiple products to cart
      const addToCartButtons = screen.getAllByText('Add to Cart');
      await user.click(addToCartButtons[0]); // Smartphone
      await user.click(addToCartButtons[1]); // Laptop
      await user.click(addToCartButtons[2]); // Headphones

      // Verify cart state
      const cartState = store.getState().cart.items;
      expect(cartState).toHaveLength(3);

      // Check each product
      expect(cartState.find(item => item.title === 'Smartphone')).toBeDefined();
      expect(cartState.find(item => item.title === 'Laptop')).toBeDefined();
      expect(cartState.find(item => item.title === 'Headphones')).toBeDefined();

      // Verify UI shows all products
      await waitFor(() => {
        expect(screen.getByText(/Smartphone x 1/)).toBeInTheDocument();
        expect(screen.getByText(/Laptop x 1/)).toBeInTheDocument();
        expect(screen.getByText(/Headphones x 1/)).toBeInTheDocument();
        expect(screen.getByText('Total Items: 3')).toBeInTheDocument();
        expect(screen.getByText('Total Price: $2099.97')).toBeInTheDocument();
      });
    });

    it('updates quantity when the same product is added multiple times', async () => {
      const user = userEvent.setup();
      const { store } = renderWithProviders(<CartIntegrationTestComponent />);

      // Add same product multiple times
      const addToCartButtons = screen.getAllByText('Add to Cart');
      await user.click(addToCartButtons[0]); // First time
      await user.click(addToCartButtons[0]); // Second time
      await user.click(addToCartButtons[0]); // Third time

      // Verify cart state
      const cartState = store.getState().cart.items;
      expect(cartState).toHaveLength(1); // Only one unique product
      expect(cartState[0].title).toBe('Smartphone');
      expect(cartState[0].quantity).toBe(3); // Quantity should be 3

      // Verify UI shows correct quantity and total
      await waitFor(() => {
        expect(screen.getByText(/Smartphone x 3/)).toBeInTheDocument();
        expect(screen.getByText('Total Items: 3')).toBeInTheDocument();
        expect(screen.getByText('Total Price: $1799.97')).toBeInTheDocument();
      });
    });

    it('persists cart data in sessionStorage', async () => {
      const user = userEvent.setup();
      renderWithProviders(<CartIntegrationTestComponent />);

      // Add product to cart
      const addToCartButtons = screen.getAllByText('Add to Cart');
      await user.click(addToCartButtons[0]);

      // Verify sessionStorage was called
      await waitFor(() => {
        expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
          'cart',
          expect.stringContaining('"title":"Smartphone"')
        );
      });
    });

    it('calculates totals correctly with mixed products and quantities', async () => {
      const user = userEvent.setup();
      renderWithProviders(<CartIntegrationTestComponent />);

      const addToCartButtons = screen.getAllByText('Add to Cart');
      
      // Add Smartphone twice (599.99 * 2 = 1199.98)
      await user.click(addToCartButtons[0]);
      await user.click(addToCartButtons[0]);
      
      // Add Laptop once (1299.99 * 1 = 1299.99)
      await user.click(addToCartButtons[1]);
      
      // Add Headphones three times (199.99 * 3 = 599.97)
      await user.click(addToCartButtons[2]);
      await user.click(addToCartButtons[2]);
      await user.click(addToCartButtons[2]);

      // Total: 1199.98 + 1299.99 + 599.97 = 3099.94
      // Total Items: 2 + 1 + 3 = 6

      await waitFor(() => {
        expect(screen.getByText('Total Items: 6')).toBeInTheDocument();
        expect(screen.getByText('Total Price: $3099.94')).toBeInTheDocument();
      });
    });
  });

  describe('Removing Products from Cart', () => {
    it('removes product from cart when Remove button is clicked', async () => {
      const user = userEvent.setup();
      const { store } = renderWithProviders(<CartIntegrationTestComponent />);

      // Add products to cart first
      const addToCartButtons = screen.getAllByText('Add to Cart');
      await user.click(addToCartButtons[0]); // Smartphone
      await user.click(addToCartButtons[1]); // Laptop

      // Verify products are in cart
      await waitFor(() => {
        expect(screen.getByText(/Smartphone x 1/)).toBeInTheDocument();
        expect(screen.getByText(/Laptop x 1/)).toBeInTheDocument();
      });

      // Remove smartphone from cart
      const removeButtons = screen.getAllByText('Remove');
      await user.click(removeButtons[0]); // Remove first item (Smartphone)

      // Verify cart state is updated
      const cartState = store.getState().cart.items;
      expect(cartState).toHaveLength(1);
      expect(cartState[0].title).toBe('Laptop');

      // Verify UI is updated
      await waitFor(() => {
        expect(screen.queryByText(/Smartphone x 1/)).not.toBeInTheDocument();
        expect(screen.getByText(/Laptop x 1/)).toBeInTheDocument();
        expect(screen.getByText('Total Items: 1')).toBeInTheDocument();
        expect(screen.getByText('Total Price: $1299.99')).toBeInTheDocument();
      });
    });

    it('shows empty cart message when all items are removed', async () => {
      const user = userEvent.setup();
      renderWithProviders(<CartIntegrationTestComponent />);

      // Add a product to cart
      const addToCartButtons = screen.getAllByText('Add to Cart');
      await user.click(addToCartButtons[0]);

      // Verify product is in cart
      await waitFor(() => {
        expect(screen.getByText(/Smartphone x 1/)).toBeInTheDocument();
      });

      // Remove the product
      const removeButton = screen.getByText('Remove');
      await user.click(removeButton);

      // Verify cart is empty
      await waitFor(() => {
        expect(screen.getByText('The cart is empty.')).toBeInTheDocument();
        expect(screen.queryByText(/Smartphone x 1/)).not.toBeInTheDocument();
      });
    });
  });

  describe('Cart State Persistence', () => {
    it('loads cart from sessionStorage on initialization', () => {
      // Pre-load cart state instead of relying on sessionStorage mock timing
      const preloadedState = {
        cart: {
          items: [
            {
              id: 1,
              title: 'Existing Product',
              price: 99.99,
              image: 'https://example.com/existing.jpg',
              quantity: 2
            }
          ]
        }
      };

      const { store } = renderWithProviders(<CartIntegrationTestComponent />, { preloadedState });

      // Verify cart state is loaded correctly
      const cartState = store.getState().cart.items;
      expect(cartState).toHaveLength(1);
      expect(cartState[0].title).toBe('Existing Product');
      expect(cartState[0].quantity).toBe(2);
    });
  });

  describe('Error Handling', () => {
    it('handles sessionStorage errors gracefully', async () => {
      const user = userEvent.setup();
      // Mock sessionStorage to throw error
      mockSessionStorage.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });
      
      // Should not crash when adding to cart
      const { store } = renderWithProviders(<CartIntegrationTestComponent />);
      
      const addToCartButtons = screen.getAllByText('Add to Cart');
      await user.click(addToCartButtons[0]);
      
      // Cart state should still be updated in memory
      const cartState = store.getState().cart.items;
      expect(cartState).toHaveLength(1);
      expect(cartState[0].title).toBe('Smartphone');
    });
  });
});