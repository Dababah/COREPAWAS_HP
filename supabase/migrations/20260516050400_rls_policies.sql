-- ═══════════════════════════════════════════════════════════════
-- COREPAWAS: Row Level Security (RLS) Policies
-- Jalankan SQL ini di Supabase Dashboard > SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- 1. Aktifkan RLS pada semua tabel
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- 2. Products: Siapa saja bisa BACA, hanya admin (authenticated) yang bisa TULIS
CREATE POLICY "products_select_public" ON products
  FOR SELECT USING (true);

CREATE POLICY "products_insert_auth" ON products
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "products_update_auth" ON products
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "products_delete_auth" ON products
  FOR DELETE TO authenticated USING (true);

-- 3. Blog Posts: Siapa saja bisa BACA, hanya admin (authenticated) yang bisa TULIS
CREATE POLICY "blog_select_public" ON blog_posts
  FOR SELECT USING (true);

CREATE POLICY "blog_insert_auth" ON blog_posts
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "blog_update_auth" ON blog_posts
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "blog_delete_auth" ON blog_posts
  FOR DELETE TO authenticated USING (true);

-- 4. Settings: Siapa saja bisa BACA, hanya admin (authenticated) yang bisa TULIS
CREATE POLICY "settings_select_public" ON settings
  FOR SELECT USING (true);

CREATE POLICY "settings_insert_auth" ON settings
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "settings_update_auth" ON settings
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "settings_delete_auth" ON settings
  FOR DELETE TO authenticated USING (true);
