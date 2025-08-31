import '@testing-library/jest-dom';

// Mock Firebase
jest.mock('./lib/firebase', () => ({
  auth: {},
  db: {},
}));

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
  deleteUser: jest.fn(),
}));

// Mock Firestore
jest.mock('./lib/firestore', () => ({
  getUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  getProducts: jest.fn(),
  createProduct: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
  createOrder: jest.fn(),
  getUserOrders: jest.fn(),
}));

// Mock window.confirm
global.confirm = jest.fn(() => true);

// Mock sessionStorage
const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});