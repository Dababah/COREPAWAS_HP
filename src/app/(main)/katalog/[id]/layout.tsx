import type { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Server-side Supabase client for metadata generation
function getSupabase() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const supabase = getSupabase();
    const { data: product } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (!product) {
      return {
        title: 'Produk Tidak Ditemukan | COREPAWAS',
        description: 'Produk yang Anda cari tidak tersedia.',
      };
    }

    const title = `${product.name} - ${formatPrice(product.price)} | COREPAWAS`;
    const description = product.description 
      ? product.description.substring(0, 160) 
      : `Beli ${product.name} ${product.condition} hanya ${formatPrice(product.price)}. Battery Health ${product.battery_health}%, storage ${product.storage}. Inspeksi teknisi, garansi toko.`;

    return {
      title,
      description,
      keywords: `${product.name}, ${product.brand} second, hp bekas ${product.brand}, ${product.brand} ${product.storage}, corepawas`,
      openGraph: {
        title,
        description,
        url: `https://corepawas.vercel.app/katalog/${id}`,
        siteName: 'COREPAWAS',
        images: product.image ? [
          {
            url: product.image,
            width: 800,
            height: 600,
            alt: product.name,
          }
        ] : [],
        locale: 'id_ID',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} | COREPAWAS`,
        description,
        images: product.image ? [product.image] : [],
      },
      other: {
        'product:price:amount': String(product.price),
        'product:price:currency': 'IDR',
        'product:condition': product.condition,
        'product:availability': product.status === 'Ready' ? 'instock' : 'oos',
      },
    };
  } catch {
    return {
      title: 'Katalog | COREPAWAS',
      description: 'Gadget second berkualitas dengan inspeksi teknisi.',
    };
  }
}

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
