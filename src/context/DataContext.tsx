"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultProducts, Product } from '@/data/products';
import { defaultBlogPosts, BlogPost } from '@/data/blog';

interface DataContextType {
  products: Product[];
  setProducts: (products: Product[]) => void;
  blogPosts: BlogPost[];
  setBlogPosts: (posts: BlogPost[]) => void;
  waNumber: string;
  setWaNumber: (num: string) => void;
  storeName: string;
  storeAddress: string;
  setStoreAddress: (addr: string) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [products, setProductsState] = useState<Product[]>(defaultProducts);
  const [blogPosts, setBlogPostsState] = useState<BlogPost[]>(defaultBlogPosts);
  const [waNumber, setWaNumberState] = useState<string>('6281234567890');
  const [storeAddress, setStoreAddressState] = useState<string>('Jl. Teknologi No. 88, Jakarta Selatan, DKI Jakarta 12345');

  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('corepawas_products');
      if (savedProducts) setProductsState(JSON.parse(savedProducts));

      const savedBlog = localStorage.getItem('corepawas_blog');
      if (savedBlog) setBlogPostsState(JSON.parse(savedBlog));

      const savedWa = localStorage.getItem('corepawas_wa');
      if (savedWa) setWaNumberState(savedWa);

      const savedAddress = localStorage.getItem('corepawas_address');
      if (savedAddress) setStoreAddressState(savedAddress);
    } catch (e) {
      console.error('Error loading data from localStorage', e);
    }
  }, []);

  const setProducts = (products: Product[]) => {
    setProductsState(products);
    localStorage.setItem('corepawas_products', JSON.stringify(products));
  };

  const setBlogPosts = (posts: BlogPost[]) => {
    setBlogPostsState(posts);
    localStorage.setItem('corepawas_blog', JSON.stringify(posts));
  };

  const setWaNumber = (num: string) => {
    setWaNumberState(num);
    localStorage.setItem('corepawas_wa', num);
  };

  const setStoreAddress = (addr: string) => {
    setStoreAddressState(addr);
    localStorage.setItem('corepawas_address', addr);
  };

  return (
    <DataContext.Provider
      value={{
        products,
        setProducts,
        blogPosts,
        setBlogPosts,
        waNumber,
        setWaNumber,
        storeName: 'COREPAWAS',
        storeAddress,
        setStoreAddress,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
