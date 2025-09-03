import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { User, Product, Order } from '../types';

// User operations
export const createUser = async (userId: string, userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
  const userDoc = {
    ...userData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(doc(db, 'users', userId), userDoc, { merge: true });
  return userId;
};

export const getUser = async (userId: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (!userDoc.exists()) return null;
  
  const data = userDoc.data();
  return {
    id: userDoc.id,
    ...data,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  } as User;
};

export const updateUser = async (userId: string, userData: Partial<Omit<User, 'id' | 'createdAt'>>) => {
  await updateDoc(doc(db, 'users', userId), {
    ...userData,
    updatedAt: serverTimestamp(),
  });
};

export const deleteUser = async (userId: string) => {
  await deleteDoc(doc(db, 'users', userId));
};

// Product operations
export const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
  const docRef = await addDoc(collection(db, 'products'), {
    ...productData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getProducts = async (): Promise<Product[]> => {
  const querySnapshot = await getDocs(collection(db, 'products'));
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as Product;
  });
};

export const getProduct = async (productId: string): Promise<Product | null> => {
  const productDoc = await getDoc(doc(db, 'products', productId));
  if (!productDoc.exists()) return null;
  
  const data = productDoc.data();
  return {
    id: productDoc.id,
    ...data,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  } as Product;
};

export const updateProduct = async (productId: string, productData: Partial<Omit<Product, 'id' | 'createdAt'>>) => {
  await updateDoc(doc(db, 'products', productId), {
    ...productData,
    updatedAt: serverTimestamp(),
  });
};

export const deleteProduct = async (productId: string) => {
  await deleteDoc(doc(db, 'products', productId));
};

// Order operations
export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
  const docRef = await addDoc(collection(db, 'orders'), {
    ...orderData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const q = query(
    collection(db, 'orders'),
    where('userId', '==', userId)
  );
  const querySnapshot = await getDocs(q);
  
  const orders = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as Order;
  });

  // Sort by createdAt on the client side to avoid composite index requirement
  return orders.sort((a, b) => {
    if (!a.createdAt || !b.createdAt) return 0;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
};

export const getOrder = async (orderId: string): Promise<Order | null> => {
  const orderDoc = await getDoc(doc(db, 'orders', orderId));
  if (!orderDoc.exists()) return null;
  
  const data = orderDoc.data();
  return {
    id: orderDoc.id,
    ...data,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  } as Order;
};

export const updateOrder = async (orderId: string, orderData: Partial<Omit<Order, 'id' | 'createdAt'>>) => {
  await updateDoc(doc(db, 'orders', orderId), {
    ...orderData,
    updatedAt: serverTimestamp(),
  });
};