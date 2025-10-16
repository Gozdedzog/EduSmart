# Authentication Setup Guide

Bu rehber, Smart Learn uygulamasında kimlik doğrulama sistemini kurmak için gerekli adımları içerir.

## 1. Supabase Projesi Oluşturma

1. [Supabase](https://supabase.com) adresine gidin
2. "Start your project" butonuna tıklayın
3. GitHub ile giriş yapın
4. Yeni bir proje oluşturun
5. Proje adı: `smart-learn-auth`
6. Güçlü bir veritabanı şifresi seçin
7. Bölge olarak en yakın bölgeyi seçin

## 2. Supabase Ayarları

### Authentication Ayarları
1. Supabase dashboard'unda "Authentication" > "Settings" bölümüne gidin
2. "Site URL" olarak `http://localhost:3000` ekleyin
3. "Redirect URLs" bölümüne şunları ekleyin:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/auth/reset`

### Email Templates (Opsiyonel)
1. "Authentication" > "Email Templates" bölümüne gidin
2. Email şablonlarını Türkçe olarak özelleştirebilirsiniz

## 3. Environment Variables

1. `.env.local` dosyası oluşturun:
   ```bash
   cp .env.example .env.local
   ```

2. Supabase dashboard'undan gerekli bilgileri alın:
   - "Settings" > "API" bölümünden:
     - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
     - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

3. `.env.local` dosyasını düzenleyin:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ADMIN_EMAILS=hll.aksngr@hotmail.com
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

## 4. Uygulamayı Başlatma

```bash
# Dependencies'leri yükleyin (zaten yapıldı)
pnpm install

# Development server'ı başlatın
pnpm dev
```

## 5. İlk Admin Kullanıcısı Oluşturma

1. `http://localhost:3000/auth/signup` adresine gidin
2. Admin e-postası ile kayıt olun (ADMIN_EMAILS'de tanımlı e-posta)
3. E-posta doğrulama bağlantısına tıklayın
4. Şifrenizi belirleyin
5. Giriş yapın

## 6. Test Etme

1. `http://localhost:3000/admin` adresine gidin
2. Admin panelinin açıldığını kontrol edin
3. Kullanıcı listesinin görüntülendiğini kontrol edin

## 7. Güvenlik Notları

- `SUPABASE_SERVICE_ROLE_KEY` asla client-side'da kullanılmamalıdır
- Admin e-postaları sadece güvenilir kişilere verilmelidir
- Production'da HTTPS kullanılmalıdır
- Düzenli olarak güvenlik güncellemeleri yapılmalıdır

## Sorun Giderme

### "Invalid API key" Hatası
- Environment variables'ların doğru kopyalandığını kontrol edin
- Supabase projesinin aktif olduğunu kontrol edin

### "Email not confirmed" Hatası
- E-posta doğrulama bağlantısına tıkladığınızdan emin olun
- Spam klasörünü kontrol edin

### Admin Paneline Erişim Sorunu
- E-posta adresinizin ADMIN_EMAILS'de tanımlı olduğunu kontrol edin
- Sayfayı yenileyin ve tekrar deneyin

## Sonraki Adımlar

1. Production ortamı için Supabase projesi oluşturun
2. Custom domain ayarlayın
3. Email templates'leri özelleştirin
4. User management özelliklerini genişletin
5. Audit logging ekleyin
