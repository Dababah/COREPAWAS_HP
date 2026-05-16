-- Tambah kolom images ke tabel products (yang sebelumnya hilang dari schema)
ALTER TABLE products ADD COLUMN IF NOT EXISTS images jsonb DEFAULT '[]';
