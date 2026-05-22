-- Opsional: seed data awal. Run setelah schema.sql
insert into public.products (id, name, description, category, image, affiliate_url, is_active, position)
values
  ('1', 'Sony WH-1000XM5', 'Sepasang headphone ini selalu saya andalkan saat membutuhkan konsentrasi tinggi dalam waktu lama.', 'Work', 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=1200&q=80', 'https://shopee.co.id', true, 1),
  ('2', 'Aeropress Coffee Maker', 'Kopi ini selalu ada di dapur saya karena cepat, mudah dibuat, dan tidak pernah membuat saya berpikir terlalu keras.', 'Home', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80', 'https://tokopedia.com', true, 2),
  ('3', 'Anker Power Bank', 'Cadangan daya andal untuk perjalanan. Saya tidak lagi khawatir kehabisan baterai.', 'Travel', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=1200&q=80', 'https://shopee.co.id', true, 3)
on conflict (id) do nothing;
