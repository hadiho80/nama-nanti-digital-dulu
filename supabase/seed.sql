insert into public.service_categories (name, slug, description, examples, sort_order)
values
  ('Web', 'web', 'Website, landing page, dashboard, toko online sederhana.', array['Landing page', 'Company profile', 'Katalog produk', 'Dashboard admin'], 1),
  ('Mobile Apps', 'mobile-apps', 'Aplikasi mobile sederhana, prototype, dan integrasi API.', array['Prototype app', 'Android sederhana', 'UI mobile', 'Bug fixing'], 2),
  ('Desktop Apps', 'desktop-apps', 'Aplikasi desktop dan tools lokal.', array['Aplikasi kasir', 'Tools input data', 'Inventory lokal'], 3),
  ('Dokumen & Office', 'office', 'Bantuan Word, Excel, PowerPoint, PDF, dan dokumen kerja.', array['Excel formula', 'PowerPoint deck', 'Rapikan Word', 'Format PDF'], 4),
  ('Automation & Data', 'automation-data', 'Automation, data cleaning, scraping, dan integrasi sederhana.', array['Google Sheets automation', 'Web scraping', 'Auto laporan'], 5),
  ('Desain Digital Ringan', 'desain-digital', 'Desain ringan untuk kebutuhan digital.', array['Banner', 'Poster', 'UI mockup'], 6),
  ('Lainnya', 'lainnya', 'Request lain yang belum masuk kategori.', array['Konsultasi', 'Custom request'], 7)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  examples = excluded.examples,
  sort_order = excluded.sort_order,
  is_active = true;
