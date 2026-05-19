-- Tabel Trade In Models (Harga Pasar & Buyback)
CREATE TABLE IF NOT EXISTS trade_in_models (
  id text PRIMARY KEY,
  brand text NOT NULL,
  model text NOT NULL,
  market_sell numeric NOT NULL,
  max_buyback numeric NOT NULL,
  floor_buyback numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Tabel COD To-Do List (Inspeksi Unit)
CREATE TABLE IF NOT EXISTS cod_todos (
  id text PRIMARY KEY,
  category text NOT NULL,
  task text NOT NULL,
  is_critical boolean DEFAULT false,
  order_index int DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Data Awal (Seed) untuk COD To-Do List
INSERT INTO cod_todos (id, category, task, is_critical, order_index) VALUES 
('cod_1', 'Fisik & Visual', 'Cek kemulusan layar utama (goresan/retak)', true, 1),
('cod_2', 'Fisik & Visual', 'Cek bezel dan backdoor belakang', false, 2),
('cod_3', 'Fungsionalitas', 'Sentuhan layar (Touchscreen) seluruh area', true, 3),
('cod_4', 'Fungsionalitas', 'Face ID / Touch ID / Fingerprint', true, 4),
('cod_5', 'Fungsionalitas', 'Kamera Depan, Belakang, Ultrawide, Flash', true, 5),
('cod_6', 'Fungsionalitas', 'Speaker Atas dan Bawah (Suara pecah/tidak)', true, 6),
('cod_7', 'Sistem & Baterai', 'Cek Battery Health (Persentase)', true, 7),
('cod_8', 'Sistem & Baterai', 'TrueTone aktif (Khusus Apple)', false, 8),
('cod_9', 'Sistem & Baterai', 'Sinyal Operator (Cek pancingan SIM Card)', true, 9),
('cod_10', 'Administrasi', 'iCloud/Google Account sudah log out', true, 10),
('cod_11', 'Administrasi', 'Kesesuaian IMEI mesin dengan Dusbox', false, 11)
ON CONFLICT (id) DO NOTHING;
