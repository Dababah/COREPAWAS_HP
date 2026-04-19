-- Tabel Produk
CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  name text NOT NULL,
  brand text NOT NULL,
  price numeric NOT NULL,
  original_price numeric,
  condition text NOT NULL,
  battery_health int,
  storage text,
  ram text,
  chipset text,
  color text,
  image text,
  status text DEFAULT 'Ready',
  antutu_score int,
  description text,
  has_ubl boolean DEFAULT false,
  is_rooted boolean DEFAULT false,
  warranty_status text,
  accessories jsonb DEFAULT '[]',
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Tabel Blog
CREATE TABLE IF NOT EXISTS blog_posts (
  id text PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text,
  content text,
  image text,
  date text,
  read_time text,
  category text,
  author text,
  created_at timestamp with time zone DEFAULT now()
);

-- Tabel Pengaturan Toko
CREATE TABLE IF NOT EXISTS settings (
  key text PRIMARY KEY,
  value text NOT NULL
);

-- Contoh Data Awal Pengaturan
INSERT INTO settings (key, value) VALUES 
('wa_number', '6281234567890'),
('store_address', 'Jl. Teknologi No. 88, Jakarta')
ON CONFLICT (key) DO NOTHING;
