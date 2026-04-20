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
  googleMapsApiKey: string;
  setGoogleMapsApiKey: (key: string) => void;
  googleMapsUrl: string;
  setGoogleMapsUrl: (url: string) => void;
  googleMapsEmbedUrl: string;
  setGoogleMapsEmbedUrl: (url: string) => void;
  compareIds: string[];
  toggleCompare: (id: string) => void;
  loading: boolean;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [products, setProductsState] = useState<Product[]>(defaultProducts);
  const [blogPosts, setBlogPostsState] = useState<BlogPost[]>(defaultBlogPosts);
  const [waNumber, setWaNumberState] = useState<string>('6282342309890');
  const [storeAddress, setStoreAddressState] = useState<string>('Jalan Brawijaya No 172, Tegalwangi Rt 04, Geblagan, Tamantirto, Kec. Kasihan, YOGYAKARTA, Daerah Istimewa Yogyakarta 55183, Indonesia');
  const [googleMapsApiKey, setGoogleMapsApiKeyState] = useState<string>('');
  const [googleMapsUrl, setGoogleMapsUrlState] = useState<string>('https://maps.app.goo.gl/TbLjY3wXDjm5VHuv7');
  const [googleMapsEmbedUrl, setGoogleMapsEmbedUrlState] = useState<string>('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.8297076823324!2d110.32227837357968!3d-7.807844992212534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7af9401f5c9481%3A0x92e4e47d9c0be6ba!2sCOREPAWAS_HP!5e0!3m2!1sen!2sus!4v1776598485909!5m2!1sen!2sus');
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const toggleCompare = (id: string) => {
    setCompareIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

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
          const mapKey = dbSettings.find(s => s.key === 'google_maps_api_key')?.value;
          const mapUrl = dbSettings.find(s => s.key === 'google_maps_url')?.value;
          const embedUrl = dbSettings.find(s => s.key === 'google_maps_embed_url')?.value;
          if (wa) setWaNumberState(wa);
          if (addr) setStoreAddressState(addr);
          if (mapKey) setGoogleMapsApiKeyState(mapKey);
          if (mapUrl) setGoogleMapsUrlState(mapUrl);
          if (embedUrl) setGoogleMapsEmbedUrlState(embedUrl);
        } else {
          const savedWa = localStorage.getItem('corepawas_wa');
          if (savedWa) setWaNumberState(savedWa);
          const savedAddress = localStorage.getItem('corepawas_address');
          if (savedAddress) setStoreAddressState(savedAddress);
          const savedMapKey = localStorage.getItem('corepawas_google_maps_api_key');
          if (savedMapKey) setGoogleMapsApiKeyState(savedMapKey);
          const savedMapUrl = localStorage.getItem('corepawas_google_maps_url');
          if (savedMapUrl) setGoogleMapsUrlState(savedMapUrl);
          const savedEmbedUrl = localStorage.getItem('corepawas_google_maps_embed_url');
          if (savedEmbedUrl) setGoogleMapsEmbedUrlState(savedEmbedUrl);
        }
      } catch (e) {
        console.error('Error loading data', e);
      } finally {
        setLoading(false);
      }
    }
    initData();

    // ─── SUPABASE REALTIME LISTENERS ───
    // These listeners ensure the app updates instantly when the DB changes
    
    // 1. Listen for Product changes
    const productChannel = supabase
      .channel('public:products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
        // Re-fetch all products on any change to ensure correct mapping and sorting
        const fetchProducts = async () => {
          const { data } = await supabase.from('products').select('*');
          if (data) {
            const mapped = data.map(p => ({
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
            setProductsState(mapped);
          }
        };
        fetchProducts();
      })
      .subscribe();

    // 2. Listen for Blog changes
    const blogChannel = supabase
      .channel('public:blog_posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blog_posts' }, (payload) => {
        const fetchBlog = async () => {
          const { data } = await supabase.from('blog_posts').select('*');
          if (data) setBlogPostsState(data);
        };
        fetchBlog();
      })
      .subscribe();

    // 3. Listen for Settings changes
    const settingsChannel = supabase
      .channel('public:settings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, (payload) => {
        const fetchSettings = async () => {
          const { data } = await supabase.from('settings').select('*');
          if (data) {
            const wa = data.find(s => s.key === 'wa_number')?.value;
            const addr = data.find(s => s.key === 'store_address')?.value;
            const mapKey = data.find(s => s.key === 'google_maps_api_key')?.value;
            const mapUrl = data.find(s => s.key === 'google_maps_url')?.value;
            const embedUrl = data.find(s => s.key === 'google_maps_embed_url')?.value;
            if (wa) setWaNumberState(wa);
            if (addr) setStoreAddressState(addr);
            if (mapKey) setGoogleMapsApiKeyState(mapKey);
            if (mapUrl) setGoogleMapsUrlState(mapUrl);
            if (embedUrl) setGoogleMapsEmbedUrlState(embedUrl);
          }
        };
        fetchSettings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(productChannel);
      supabase.removeChannel(blogChannel);
      supabase.removeChannel(settingsChannel);
    };
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

  const setGoogleMapsApiKey = async (key: string) => {
    setGoogleMapsApiKeyState(key);
    localStorage.setItem('corepawas_google_maps_api_key', key);
    
    try {
      await supabase.from('settings').upsert({ key: 'google_maps_api_key', value: key });
    } catch (e) {
      console.warn('Supabase sync failed for Google Maps API Key', e);
    }
  };

  const setGoogleMapsUrl = async (url: string) => {
    setGoogleMapsUrlState(url);
    localStorage.setItem('corepawas_google_maps_url', url);
    
    try {
      await supabase.from('settings').upsert({ key: 'google_maps_url', value: url });
    } catch (e) {
      console.warn('Supabase sync failed for Google Maps URL', e);
    }
  };

  const setGoogleMapsEmbedUrl = async (url: string) => {
    setGoogleMapsEmbedUrlState(url);
    localStorage.setItem('corepawas_google_maps_embed_url', url);
    
    try {
      await supabase.from('settings').upsert({ key: 'google_maps_embed_url', value: url });
    } catch (e) {
      console.warn('Supabase sync failed for Google Maps Embed URL', e);
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
        googleMapsApiKey,
        setGoogleMapsApiKey,
        googleMapsUrl,
        setGoogleMapsUrl,
        googleMapsEmbedUrl,
        setGoogleMapsEmbedUrl,
        compareIds,
        toggleCompare,
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
