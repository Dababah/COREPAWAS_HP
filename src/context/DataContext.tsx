"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultProducts, Product } from '@/data/products';
import { defaultBlogPosts, BlogPost } from '@/data/blog';
import { supabase } from '@/lib/supabase';

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
  loading: boolean;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [products, setProductsState] = useState<Product[]>(defaultProducts);
  const [blogPosts, setBlogPostsState] = useState<BlogPost[]>(defaultBlogPosts);
  const [waNumber, setWaNumberState] = useState<string>('6282342309890');
  const [storeAddress, setStoreAddressState] = useState<string>('Kos putra maruf, Jalan Brawijaya No 172, Tegalwangi Rt 04, Geblagan, Tamantirto, Kec. Kasihan, YOGYAKARTA, Daerah Istimewa Yogyakarta 55183');
  const [loading, setLoading] = useState(true);

  // Initialize data from Supabase or Fallback
  useEffect(() => {
    async function initData() {
      try {
        setLoading(true);
        
        // 1. Try fetching from Supabase
        const { data: dbProducts, error: pError } = await supabase.from('products').select('*');
        const { data: dbBlog, error: bError } = await supabase.from('blog_posts').select('*');
        const { data: dbSettings, error: sError } = await supabase.from('settings').select('*');

        if (!pError && dbProducts && dbProducts.length > 0) {
          // Map snake_case from DB to camelCase for App
          const mappedProducts = dbProducts.map(p => ({
            ...p,
            originalPrice: p.original_price,
            batteryHealth: p.battery_health,
            antutuScore: p.antutu_score,
            hasUBL: p.has_ubl,
            isRooted: p.is_rooted,
            warrantyStatus: p.warranty_status,
            isFeatured: p.is_featured,
            createdAt: p.created_at
          }));
          setProductsState(mappedProducts);
        } else {
          const savedProducts = localStorage.getItem('corepawas_products');
          if (savedProducts) setProductsState(JSON.parse(savedProducts));
        }

        if (!bError && dbBlog && dbBlog.length > 0) {
          setBlogPostsState(dbBlog);
        } else {
          const savedBlog = localStorage.getItem('corepawas_blog');
          if (savedBlog) setBlogPostsState(JSON.parse(savedBlog));
        }

        if (!sError && dbSettings && dbSettings.length > 0) {
          const wa = dbSettings.find(s => s.key === 'wa_number')?.value;
          const addr = dbSettings.find(s => s.key === 'store_address')?.value;
          if (wa) setWaNumberState(wa);
          if (addr) setStoreAddressState(addr);
        } else {
          const savedWa = localStorage.getItem('corepawas_wa');
          if (savedWa) setWaNumberState(savedWa);
          const savedAddress = localStorage.getItem('corepawas_address');
          if (savedAddress) setStoreAddressState(savedAddress);
        }
      } catch (e) {
        console.error('Error loading data', e);
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, []);

  const setProducts = async (newProducts: Product[]) => {
    setProductsState(newProducts);
    localStorage.setItem('corepawas_products', JSON.stringify(newProducts));
    
    try {
      // Map camelCase for App to snake_case for DB
      const mapped = newProducts.map(p => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        price: p.price,
        original_price: p.originalPrice,
        condition: p.condition,
        battery_health: p.batteryHealth,
        storage: p.storage,
        ram: p.ram,
        chipset: p.chipset,
        color: p.color,
        image: p.image,
        status: p.status,
        antutu_score: p.antutuScore,
        description: p.description,
        has_ubl: p.hasUBL,
        is_rooted: p.isRooted,
        warranty_status: p.warrantyStatus,
        accessories: p.accessories,
        is_featured: p.isFeatured,
        created_at: p.createdAt
      }));
      await supabase.from('products').upsert(mapped);
    } catch (e) {
      console.warn('Supabase sync failed for products', e);
    }
  };

  const setBlogPosts = async (posts: BlogPost[]) => {
    setBlogPostsState(posts);
    localStorage.setItem('corepawas_blog', JSON.stringify(posts));
    
    try {
      await supabase.from('blog_posts').upsert(posts);
    } catch (e) {
      console.warn('Supabase sync failed for blog', e);
    }
  };

  const setWaNumber = async (num: string) => {
    setWaNumberState(num);
    localStorage.setItem('corepawas_wa', num);
    
    try {
      await supabase.from('settings').upsert({ key: 'wa_number', value: num });
    } catch (e) {
      console.warn('Supabase sync failed for WA', e);
    }
  };

  const setStoreAddress = async (addr: string) => {
    setStoreAddressState(addr);
    localStorage.setItem('corepawas_address', addr);
    
    try {
      await supabase.from('settings').upsert({ key: 'store_address', value: addr });
    } catch (e) {
      console.warn('Supabase sync failed for address', e);
    }
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
        loading,
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
