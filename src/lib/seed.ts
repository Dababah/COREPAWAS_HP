import { supabase } from './supabase';
import { defaultProducts } from '../data/products';
import { defaultBlogPosts } from '../data/blog';

export async function seedDatabase() {
  console.log('Memulai proses pemindahan data ke Supabase...');

  try {
    // 1. Sync Products
    const mappedProducts = defaultProducts.map(p => ({
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

    const { error: pError } = await supabase.from('products').upsert(mappedProducts);
    if (pError) throw new Error(`Produk: ${pError.message}`);
    console.log('✓ Produk berhasil dipindah');

    // 2. Sync Blog
    const { error: bError } = await supabase.from('blog_posts').upsert(defaultBlogPosts);
    if (bError) throw new Error(`Blog: ${bError.message}`);
    console.log('✓ Blog berhasil dipindah');

    // 3. Sync Settings
    const settings = [
      { key: 'wa_number', value: '6282342309890' },
      { key: 'store_address', value: 'Jalan Brawijaya No 172, Tegalwangi Rt 04, Geblagan, Tamantirto, Kec. Kasihan, YOGYAKARTA, Daerah Istimewa Yogyakarta 55183, Indonesia' },
      { key: 'google_maps_url', value: 'https://maps.app.goo.gl/TbLjY3wXDjm5VHuv7' },
      { key: 'google_maps_embed_url', value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.8297076823324!2d110.32227837357968!3d-7.807844992212534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7af9401f5c9481%3A0x92e4e47d9c0be6ba!2sCOREPAWAS_HP!5e0!3m2!1sen!2sus!4v1776598485909!5m2!1sen!2sus' } 
    ];
    
    const { error: sError } = await supabase.from('settings').upsert(settings);
    if (sError) throw new Error(`Pengaturan: ${sError.message}`);
    console.log('✓ Pengaturan berhasil dipindah');

    return { success: true };
  } catch (error: any) {
    console.error('Seed error:', error.message);
    return { success: false, error: error.message };
  }
}
