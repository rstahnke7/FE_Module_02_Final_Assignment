import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../utils/test-utils';
import ProductCard from '../ProductCard';
import type { Product } from '../../../types';

const mockProduct: Product = {
  id: '1',
  title: 'Test Product',
  description: 'This is a test product with a very long description that definitely exceeds one hundred characters and should be truncated when displayed on the card with ellipsis at the end',
  price: 29.99,
  category: 'electronics',
  image: 'https://example.com/image.jpg',
  rating: {
    rate: 4.5,
    count: 120
  },
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01')
};

describe('ProductCard', () => {
  describe('Rendering', () => {
    it('renders product information correctly', () => {
      renderWithProviders(<ProductCard product={mockProduct} />);
      
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('electronics')).toBeInTheDocument();
      expect(screen.getByText('$29.99')).toBeInTheDocument();
      expect(screen.getByText('(120)')).toBeInTheDocument();
      expect(screen.getByAltText('Test Product')).toBeInTheDocument();
    });

    it('truncates long descriptions', () => {
      renderWithProviders(<ProductCard product={mockProduct} />);
      
      const description = screen.getByText(/This is a test product with a very long description that definitely exceeds one hundred/);
      expect(description).toBeInTheDocument();
      expect(description.textContent).toContain('...');
    });

    it('displays star rating correctly', () => {
      renderWithProviders(<ProductCard product={mockProduct} />);
      
      const ratingElement = screen.getByText('★★★★★');
      expect(ratingElement).toBeInTheDocument();
    });

    it('shows Add to Cart button by default', () => {
      renderWithProviders(<ProductCard product={mockProduct} />);
      
      expect(screen.getByText('Add to Cart')).toBeInTheDocument();
    });

    it('shows Edit and Delete buttons when handlers are provided', () => {
      const mockOnEdit = jest.fn();
      const mockOnDelete = jest.fn();
      
      renderWithProviders(
        <ProductCard 
          product={mockProduct} 
          onEdit={mockOnEdit} 
          onDelete={mockOnDelete} 
        />
      );
      
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('does not show Edit and Delete buttons when handlers are not provided', () => {
      renderWithProviders(<ProductCard product={mockProduct} />);
      
      expect(screen.queryByText('Edit')).not.toBeInTheDocument();
      expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('dispatches addToCart action when Add to Cart button is clicked', async () => {
      const user = userEvent.setup();
      const { store } = renderWithProviders(<ProductCard product={mockProduct} />);
      
      const addToCartButton = screen.getByText('Add to Cart');
      await user.click(addToCartButton);
      
      const state = store.getState();
      expect(state.cart.items).toHaveLength(1);
      expect(state.cart.items[0].title).toBe('Test Product');
      expect(state.cart.items[0].price).toBe(29.99);
    });

    it('calls onEdit handler when Edit button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnEdit = jest.fn();
      
      renderWithProviders(
        <ProductCard product={mockProduct} onEdit={mockOnEdit} />
      );
      
      const editButton = screen.getByText('Edit');
      await user.click(editButton);
      
      expect(mockOnEdit).toHaveBeenCalledTimes(1);
    });

    it('calls onDelete handler when Delete button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnDelete = jest.fn();
      
      renderWithProviders(
        <ProductCard product={mockProduct} onDelete={mockOnDelete} />
      );
      
      const deleteButton = screen.getByText('Delete');
      await user.click(deleteButton);
      
      expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });

    it('handles products with numeric string IDs correctly', async () => {
      const user = userEvent.setup();
      const productWithStringId = { ...mockProduct, id: '123' };
      const { store } = renderWithProviders(<ProductCard product={productWithStringId} />);
      
      const addToCartButton = screen.getByText('Add to Cart');
      await user.click(addToCartButton);
      
      const state = store.getState();
      expect(state.cart.items[0].id).toBe(123);
    });

    it('handles products with non-numeric IDs by using random number', async () => {
      const user = userEvent.setup();
      const productWithNonNumericId = { ...mockProduct, id: 'abc123' };
      const { store } = renderWithProviders(<ProductCard product={productWithNonNumericId} />);
      
      const addToCartButton = screen.getByText('Add to Cart');
      await user.click(addToCartButton);
      
      const state = store.getState();
      expect(typeof state.cart.items[0].id).toBe('number');
      expect(state.cart.items[0].id).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('handles products with zero rating', () => {
      const productWithZeroRating = {
        ...mockProduct,
        rating: { rate: 0, count: 0 }
      };
      
      renderWithProviders(<ProductCard product={productWithZeroRating} />);
      
      expect(screen.getByText(/☆☆☆☆☆/)).toBeInTheDocument();
      expect(screen.getByText('(0)')).toBeInTheDocument();
    });

    it('handles products with maximum rating', () => {
      const productWithMaxRating = {
        ...mockProduct,
        rating: { rate: 5, count: 1000 }
      };
      
      renderWithProviders(<ProductCard product={productWithMaxRating} />);
      
      expect(screen.getByText('★★★★★')).toBeInTheDocument();
      expect(screen.getByText('(1000)')).toBeInTheDocument();
    });

    it('handles short descriptions without truncation', () => {
      const productWithShortDescription = {
        ...mockProduct,
        description: 'Short description'
      };
      
      renderWithProviders(<ProductCard product={productWithShortDescription} />);
      
      const description = screen.getByText('Short description');
      expect(description.textContent).not.toContain('...');
    });
  });
});