# E-Commerce FakeStore

A modern React e-commerce application built with TypeScript, Redux Toolkit, and React Query that demonstrates a complete online shopping experience using the FakeStore API.

## Features

### Product Catalog
- **Dynamic Product Display**: Fetches and displays all products from the FakeStore API with title, price, category, description, rating, and images
- **Image Fallback**: Automatically displays placeholder images when API images fail to load (handles 404 errors gracefully)
- **Category Filtering**: Dynamic dropdown that fetches categories from the API and filters products by selected category
- **Add to Cart**: One-click functionality to add products directly from the product listing

### Shopping Cart
- **Redux Toolkit State Management**: Centralized cart state with actions for adding, removing, and clearing items
- **Session Storage Persistence**: Cart contents persist across browser sessions and page refreshes
- **Quantity Management**: Add multiple quantities of the same item - quantities increment automatically
- **Real-time Calculations**: 
  - Total item count (sum of all quantities)
  - Total price (sum of price × quantity for all items)
- **Item Management**: Remove individual items from cart
- **Responsive UI**: Fixed-position cart overlay with scrollable content

### Checkout Process
- **Simulated Checkout**: Complete checkout flow that clears cart and shows success feedback
- **Visual Feedback**: Success modal with celebration message
- **Auto-close**: Checkout success message displays for 2 seconds before closing

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **State Management**: Redux Toolkit for cart state
- **Data Fetching**: TanStack React Query (React Query v5)
- **HTTP Client**: Fetch API for API requests
- **Styling**: Inline CSS with responsive design
- **Build Tool**: Vite
- **Package Manager**: npm

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rstahnke7/ecommerce-fakestore.git
   cd ecommerce-fakestore2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173/`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## How to Use

### Browse Products
1. **View All Products**: The home page displays all available products by default
2. **Filter by Category**: Use the dropdown to filter products by category (electronics, jewelery, men's clothing, women's clothing)
3. **Product Information**: Each product shows:
   - Product image (with fallback for broken links)
   - Title and description
   - Price and category
   - Star rating and review count

### Shopping Cart
1. **Add Items**: Click "Add to Cart" on any product
2. **View Cart**: Click the "Cart (X)" button in the top-right corner to open the cart
3. **Multiple Quantities**: Click "Add to Cart" multiple times on the same product to increase quantity
4. **Remove Items**: Click "Remove" next to any item in the cart
5. **View Totals**: See total item count and total price at the top of the cart

### Checkout
1. **Review Cart**: Ensure your cart contains the desired items
2. **Checkout**: Click the green "Checkout ($X.XX)" button
3. **Success**: See the success message confirming your purchase
4. **Cart Cleared**: Cart automatically empties and closes after checkout

## API Integration

This application integrates with the [FakeStore API](https://fakestoreapi.com/):

- **Products**: `GET /products` - Fetch all products
- **Categories**: `GET /products/categories` - Fetch all categories  
- **Category Products**: `GET /products/category/{category}` - Fetch products by category

## Architecture

### State Management
- **Redux Store**: Centralized cart state management
- **Cart Slice**: Handles add, remove, and clear cart actions
- **Session Storage**: Automatic persistence of cart data

### Component Structure
- **App.tsx**: Main application component with product listing and category filtering
- **ShoppingCart.tsx**: Cart overlay component with checkout functionality
- **cartSlice.ts**: Redux Toolkit slice for cart state management
- **store.ts**: Redux store configuration

### Data Flow
1. React Query fetches data from FakeStore API
2. User interactions dispatch Redux actions
3. Cart state updates trigger UI re-renders
4. Session storage automatically syncs with state changes

## Browser Compatibility

- Modern browsers with ES6+ support
- Session storage support required for cart persistence

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes and uses the free FakeStore API for demonstration.
