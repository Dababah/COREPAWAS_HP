import React, { createContext, useContext, useState } from 'react';
import { defaultProducts, Product } from '../data/products';
import { defaultBlogPosts, BlogPost } from '../data/blog';

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
  const [products, setProductsState] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('corepawas_products');
      return saved ? JSON.parse(saved) : defaultProducts;
    } catch {
      return defaultProducts;
    }
  });

  const [blogPosts, setBlogPostsState] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem('corepawas_blog');
      return saved ? JSON.parse(saved) : defaultBlogPosts;
    } catch {
      return defaultBlogPosts;
    }
  });

  const [waNumber, setWaNumberState] = useState<string>(() => {
    return localStorage.getItem('corepawas_wa') || '6281234567890';
  });

  const [storeAddress, setStoreAddressState] = useState<string>(() => {
    return localStorage.getItem('corepawas_address') || 'Jl. Teknologi No. 88, Jakarta Selatan, DKI Jakarta 12345';
  });

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
