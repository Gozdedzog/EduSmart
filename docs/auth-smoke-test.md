# Auth Smoke Test

Bu doküman, Smart Learn uygulamasındaki kimlik doğrulama sisteminin manuel test adımlarını içerir.

## Ön Gereksinimler

1. Supabase projesi oluşturulmuş olmalı
2. `.env.local` dosyası yapılandırılmış olmalı:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ADMIN_EMAILS=admin@example.com,admin2@example.com
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

## Test Senaryoları

### 1. Kullanıcı Kaydı (Signup)

**Adımlar:**
1. `http://localhost:3000/auth/signup` adresine gidin
2. Geçerli bir e-posta adresi girin
3. En az 6 karakterli bir şifre girin
4. Şifre tekrarını girin
5. "Kayıt Ol" butonuna tıklayın

**Beklenen Sonuç:**
- Başarı mesajı görüntülenir
- E-posta doğrulama bağlantısı gönderilir
- Kullanıcı e-postasını kontrol etmelidir

### 2. Kullanıcı Girişi (Login)

**Adımlar:**
1. `http://localhost:3000/auth/login` adresine gidin
2. Kayıtlı e-posta adresini girin
3. Şifreyi girin
4. "Giriş Yap" butonuna tıklayın

**Beklenen Sonuç:**
- Başarılı giriş yapılır
- Dashboard sayfasına yönlendirilir
- Navbar'da kullanıcı e-postası görüntülenir

### 3. Şifre Sıfırlama (Reset Password)

**Adımlar:**
1. `http://localhost:3000/auth/reset` adresine gidin
2. Kayıtlı e-posta adresini girin
3. "Şifre Sıfırlama Bağlantısı Gönder" butonuna tıklayın

**Beklenen Sonuç:**
- Başarı mesajı görüntülenir
- Şifre sıfırlama e-postası gönderilir

### 4. Admin Erişimi

**Adımlar:**
1. Admin e-postası ile giriş yapın (ADMIN_EMAILS'de tanımlı)
2. `http://localhost:3000/admin` adresine gidin

**Beklenen Sonuç:**
- Admin paneli açılır
- Kullanıcı listesi görüntülenir
- Admin rolü navbar'da görüntülenir

### 5. Admin Erişimi Engelleme

**Adımlar:**
1. Normal kullanıcı (admin olmayan) ile giriş yapın
2. `http://localhost:3000/admin` adresine gidin

**Beklenen Sonuç:**
- Ana sayfaya yönlendirilir
- Admin paneline erişim engellenir

### 6. Oturum Kalıcılığı

**Adımlar:**
1. Giriş yapın
2. Tarayıcıyı kapatın
3. Tekrar açın ve `http://localhost:3000` adresine gidin

**Beklenen Sonuç:**
- Kullanıcı oturumu korunur
- Tekrar giriş yapmaya gerek yoktur

### 7. Çıkış Yapma (Logout)

**Adımlar:**
1. Giriş yapın
2. Navbar'daki "Çıkış" butonuna tıklayın

**Beklenen Sonuç:**
- Oturum sonlandırılır
- Ana sayfaya yönlendirilir
- Navbar'da giriş/kayıt butonları görüntülenir

### 8. Korumalı Sayfa Erişimi

**Adımlar:**
1. Çıkış yapın
2. `http://localhost:3000/dashboard` adresine gidin

**Beklenen Sonuç:**
- Login sayfasına yönlendirilir
- Dashboard'a erişim engellenir

## Hata Senaryoları

### 1. Geçersiz Giriş Bilgileri
- Yanlış e-posta veya şifre ile giriş denemesi
- Hata mesajı görüntülenmeli

### 2. Eksik Form Alanları
- Boş e-posta veya şifre ile form gönderimi
- Form validasyonu çalışmalı

### 3. Şifre Uyumsuzluğu
- Kayıt sırasında farklı şifreler girme
- Uyumsuzluk hatası görüntülenmeli

## Güvenlik Kontrolleri

1. **Client-Side Role Kontrolü:** Admin paneline erişim sadece client-side değil, server-side da kontrol edilir
2. **Session Güvenliği:** Oturum bilgileri güvenli şekilde saklanır
3. **CSRF Koruması:** Supabase tarafından sağlanır
4. **XSS Koruması:** React ve Next.js tarafından sağlanır

## Notlar

- Tüm testler manuel olarak yapılmalıdır
- Her test senaryosu bağımsız olarak çalıştırılmalıdır
- Hata durumlarında console logları kontrol edilmelidir
- Supabase dashboard'unda kullanıcı aktiviteleri izlenebilir
