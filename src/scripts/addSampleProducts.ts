import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBPR3nVftIwmADVORs6w5Q_d5X34VfoO64",
  authDomain: "ecommerce-firebase-6227a.firebaseapp.com",
  projectId: "ecommerce-firebase-6227a",
  storageBucket: "ecommerce-firebase-6227a.firebasestorage.app",
  messagingSenderId: "573778208571",
  appId: "1:573778208571:web:5e740a8dd1c324c548791e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleProducts = [
  {
    title: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
    price: 89.99,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    rating: { rate: 4.5, count: 245 }
  },
  {
    title: "Smart Fitness Watch",
    description: "Track your health and fitness with this waterproof smartwatch featuring heart rate monitoring and GPS.",
    price: 199.99,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&h=500&fit=crop",
    rating: { rate: 4.7, count: 189 }
  },
  {
    title: "Organic Cotton T-Shirt",
    description: "Comfortable and sustainable organic cotton t-shirt available in multiple colors. Perfect for casual wear.",
    price: 29.99,
    category: "men's clothing",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
    rating: { rate: 4.3, count: 156 }
  },
  {
    title: "Leather Crossbody Bag",
    description: "Elegant genuine leather crossbody bag perfect for work or casual outings. Features multiple compartments.",
    price: 79.99,
    category: "women's clothing",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
    rating: { rate: 4.6, count: 98 }
  },
  {
    title: "Stainless Steel Coffee Mug",
    description: "Double-walled stainless steel travel mug that keeps drinks hot for hours. Spill-proof lid included.",
    price: 24.99,
    category: "home",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=500&h=500&fit=crop",
    rating: { rate: 4.4, count: 203 }
  },
  {
    title: "Yoga Exercise Mat",
    description: "Non-slip premium yoga mat with excellent cushioning. Perfect for yoga, pilates, and general fitness.",
    price: 39.99,
    category: "sports",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop",
    rating: { rate: 4.5, count: 127 }
  },
  {
    title: "Wireless Phone Charger",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices. LED indicator shows charging status.",
    price: 34.99,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=500&h=500&fit=crop",
    rating: { rate: 4.2, count: 87 }
  },
  {
    title: "Classic Denim Jacket",
    description: "Timeless denim jacket made from premium cotton. Perfect layering piece for any season.",
    price: 69.99,
    category: "men's clothing",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop",
    rating: { rate: 4.4, count: 76 }
  },
  {
    title: "Ceramic Dinner Plate Set",
    description: "Beautiful ceramic dinner plates set of 4. Microwave and dishwasher safe with elegant design.",
    price: 45.99,
    category: "home",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop",
    rating: { rate: 4.6, count: 145 }
  },
  {
    title: "Running Shoes",
    description: "Lightweight running shoes with superior cushioning and breathable mesh upper. Perfect for daily runs.",
    price: 119.99,
    category: "sports",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
    rating: { rate: 4.8, count: 234 }
  }
];

async function addSampleProducts() {
  console.log('Adding sample products to Firestore...');
  
  try {
    const promises = sampleProducts.map(product => 
      addDoc(collection(db, 'products'), {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    );
    
    await Promise.all(promises);
    console.log('✅ Successfully added', sampleProducts.length, 'sample products!');
    console.log('You can now test the shopping cart and checkout functionality.');
    
  } catch (error) {
    console.error('❌ Error adding products:', error);
  }
}

addSampleProducts();