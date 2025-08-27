# Firebase E-Commerce Store

A complete Firebase-powered e-commerce application built with React, TypeScript, Redux Toolkit, and Firebase. Features full user authentication, product management, shopping cart functionality, and order tracking.

## ✨ Features

### 🔐 User Authentication
- **User Registration**: Create new accounts with email/password
- **User Login/Logout**: Secure authentication with Firebase Auth
- **Profile Management**: Edit user information (name, address, phone)
- **Account Deletion**: Users can delete their accounts with confirmation

### 🛍️ Product Management
- **Product CRUD Operations**: Create, read, update, and delete products
- **Category Filtering**: Filter products by category
- **Search Functionality**: Search products by title and description
- **Product Details**: Title, description, price, category, images, and ratings
- **Authentication Required**: Products only visible to logged-in users

### 🛒 Shopping Cart
- **Redux State Management**: Centralized cart state with persistence
- **Session Storage**: Cart contents persist across browser sessions
- **Quantity Management**: Add multiple quantities and manage items
- **Real-time Calculations**: Live total calculations for items and pricing
- **Checkout Process**: Save orders to Firebase with user authentication

### 📦 Order Management
- **Order History**: View complete order history with details
- **Order Details**: Detailed view of individual orders
- **Order Tracking**: Orders stored with timestamps and status
- **User-Specific Orders**: Each user sees only their own orders

### 🎨 User Interface
- **Responsive Design**: Mobile-friendly interface
- **Navigation**: Clean navigation between products, profile, and orders
- **Loading States**: Visual feedback during async operations
- **Error Handling**: Comprehensive error messages and validation

## 🛠️ Tech Stack

- **Frontend**: React 19 with TypeScript
- **State Management**: Redux Toolkit
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Data Fetching**: TanStack React Query
- **Styling**: CSS with responsive design
- **Build Tool**: Vite
- **Package Manager**: npm

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm
- Firebase account

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

3. **Firebase Setup**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Get your Firebase config values

4. **Environment Configuration**
   Update `.env.local` with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

5. **Firestore Security Rules**
   Set up your Firestore rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /products/{productId} {
         allow read, write: if request.auth != null;
       }
       match /orders/{orderId} {
         allow read, write: if request.auth != null && 
           (resource == null || resource.data.userId == request.auth.uid);
       }
     }
   }
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:5173/`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (includes TypeScript compilation)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## 📱 How to Use

### Getting Started
1. **Sign Up**: Create a new account with email and password
2. **Login**: Access your account (auto-redirects to products after login)

### Managing Products
1. **View Products**: Browse all available products (authentication required)
2. **Add Products**: Click "Add New Product" to create inventory
3. **Edit Products**: Click "Edit" on any product card
4. **Delete Products**: Click "Delete" with confirmation dialog
5. **Search & Filter**: Use search bar and category filter

### Shopping
1. **Add to Cart**: Click "Add to Cart" on any product
2. **View Cart**: Click the cart icon to see selected items
3. **Manage Cart**: Adjust quantities or remove items
4. **Checkout**: Click "Checkout" to place order (requires login)

### Order Tracking
1. **Order History**: Click "Orders" to view past purchases
2. **Order Details**: Click "View Details" on any order
3. **Order Information**: See items, quantities, prices, and timestamps

### Profile Management
1. **Edit Profile**: Update name, address, and phone number
2. **View Account**: Access user information and settings
3. **Delete Account**: Remove account and all associated data

## 🏗️ Architecture

### Database Structure
```
firestore/
├── users/
│   └── {userId}/
│       ├── email: string
│       ├── name: string
│       ├── address?: string
│       ├── phone?: string
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
├── products/
│   └── {productId}/
│       ├── title: string
│       ├── description: string
│       ├── price: number
│       ├── category: string
│       ├── image: string
│       ├── rating: {rate: number, count: number}
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
└── orders/
    └── {orderId}/
        ├── userId: string
        ├── items: CartItem[]
        ├── totalAmount: number
        ├── status: string
        ├── createdAt: timestamp
        └── updatedAt: timestamp
```

### Component Structure
```
src/
├── components/
│   ├── Auth/
│   │   ├── LoginForm.tsx      # Login/signup form
│   │   ├── AuthProvider.tsx   # Auth state provider
│   │   └── UserProfile.tsx    # User profile display
│   ├── Products/
│   │   ├── ProductList.tsx    # Product grid with search/filter
│   │   ├── ProductCard.tsx    # Individual product display
│   │   └── ProductForm.tsx    # Add/edit product modal
│   ├── Orders/
│   │   ├── OrderHistory.tsx   # Order list view
│   │   └── OrderDetails.tsx   # Individual order modal
│   ├── User/
│   │   └── UserProfile.tsx    # Profile management
│   └── ShoppingCart.tsx       # Cart overlay
├── features/
│   ├── auth/authSlice.ts      # Auth Redux slice
│   └── cart/cartSlice.ts      # Cart Redux slice
├── lib/
│   ├── firebase.ts            # Firebase configuration
│   └── firestore.ts           # Firestore CRUD operations
└── types/index.ts             # TypeScript interfaces
```

### State Management
- **Redux Toolkit**: Cart state and user authentication
- **Firebase Auth**: Automatic user state synchronization
- **Session Storage**: Cart persistence across sessions
- **React Query**: API state management and caching

## 🔧 Development

### Code Quality
- **TypeScript**: Full type safety throughout the application
- **ESLint**: Code linting with React and TypeScript rules
- **Type-only imports**: Proper TypeScript import patterns

### Security
- **Firebase Security Rules**: User-specific data access controls
- **Authentication Guards**: Protected routes and operations
- **Input Validation**: Form validation and error handling

## 🌐 Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase Hosting** (optional)
   ```bash
   npm install -g firebase-tools
   firebase init hosting
   firebase deploy
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is for educational purposes demonstrating Firebase integration with React and e-commerce functionality.

## 🆘 Troubleshooting

### Common Issues

1. **"Missing or insufficient permissions"**
   - Check Firestore security rules
   - Ensure user is authenticated
   - Verify correct Firebase project

2. **Products not loading**
   - Check authentication status
   - Verify Firestore rules allow read access
   - Check browser console for errors

3. **Cart not persisting**
   - Ensure session storage is enabled
   - Check browser privacy settings

4. **Firebase configuration errors**
   - Verify all environment variables are set
   - Check Firebase project settings match `.env.local`

For more help, check the browser console for detailed error messages.