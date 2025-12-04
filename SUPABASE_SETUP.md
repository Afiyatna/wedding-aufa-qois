# 📘 Panduan Setup Supabase untuk Wedding Invitation

Panduan lengkap untuk menyambungkan aplikasi Wedding Invitation dengan Supabase.

## 📋 Daftar Isi

1. [Membuat Akun Supabase](#1-membuat-akun-supabase)
2. [Membuat Project Baru](#2-membuat-project-baru)
3. [Mendapatkan API Keys](#3-mendapatkan-api-keys)
4. [Setup Environment Variables](#4-setup-environment-variables)
5. [Menjalankan Database Migration](#5-menjalankan-database-migration)
6. [Verifikasi Koneksi](#6-verifikasi-koneksi)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Membuat Akun Supabase

1. Buka browser dan kunjungi [https://supabase.com](https://supabase.com)
2. Klik tombol **"Start your project"** atau **"Sign Up"**
3. Pilih metode pendaftaran:
   - **GitHub** (disarankan untuk developer)
   - **Email** (alternatif)
4. Lengkapi proses registrasi sesuai metode yang dipilih

---

## 2. Membuat Project Baru

1. Setelah login, klik tombol **"New Project"** di dashboard
2. Isi informasi project:
   - **Name**: `wedding-invitation` (atau nama lain sesuai preferensi)
   - **Database Password**: Buat password yang kuat (⚠️ **SIMPAN PASSWORD INI!**)
   - **Region**: Pilih region terdekat (misalnya: `Southeast Asia (Singapore)`)
   - **Pricing Plan**: Pilih **Free** untuk mulai (cukup untuk development)
3. Klik **"Create new project"**
4. Tunggu beberapa menit hingga project selesai dibuat (biasanya 1-2 menit)

---

## 3. Mendapatkan API Keys

1. Setelah project selesai dibuat, masuk ke dashboard project
2. Di sidebar kiri, klik **"Settings"** (ikon gear ⚙️)
3. Pilih **"API"** dari menu Settings
4. Di halaman API, Anda akan melihat:
   - **Project URL**: URL project Anda (contoh: `https://xxxxx.supabase.co`)
   - **anon/public key**: API key untuk client-side (ini yang kita butuhkan)
   - **service_role key**: API key untuk server-side (⚠️ **JANGAN gunakan di client!**)

### 📝 Catat Informasi Berikut:
- **Project URL** → akan digunakan sebagai `VITE_SUPABASE_URL`
- **anon public key** → akan digunakan sebagai `VITE_SUPABASE_ANON_KEY`

---

## 4. Setup Environment Variables

### Langkah 1: Buat File `.env`

Di root folder project (sama level dengan `package.json`), buat file baru bernama `.env`

### Langkah 2: Isi File `.env`

Buka file `.env` dan tambahkan kode berikut:

```env
VITE_SUPABASE_URL=your-project-url-here
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Contoh:**
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNTk1OTkxMSwiZXhwIjoxOTUxNTM1OTExfQ.example
```

### ⚠️ Penting:
- Ganti `your-project-url-here` dengan **Project URL** dari Supabase
- Ganti `your-anon-key-here` dengan **anon public key** dari Supabase
- File `.env` sudah ada di `.gitignore`, jadi tidak akan ter-commit ke Git
- Jangan pernah share API keys Anda ke publik!

---

## 5. Menjalankan Database Migration

Ada dua cara untuk menjalankan migration:

### 🎯 Metode 1: Via Supabase Dashboard (Paling Mudah)

1. Di Supabase Dashboard, klik **"SQL Editor"** di sidebar kiri
2. Klik tombol **"New query"**
3. Buka file migration di project Anda: `supabase/migrations/20250628075045_broad_bridge.sql`
4. Copy **semua isi** file tersebut
5. Paste ke SQL Editor di Supabase Dashboard
6. Klik tombol **"Run"** (atau tekan `Ctrl+Enter` / `Cmd+Enter`)
7. Tunggu hingga muncul pesan sukses: **"Success. No rows returned"**

### 🎯 Metode 2: Via Supabase CLI (Untuk Advanced Users)

Jika Anda sudah install Supabase CLI:

```bash
# Install Supabase CLI (jika belum)
npm install -g supabase

# Login ke Supabase
supabase login

# Link project
supabase link --project-ref your-project-ref

# Jalankan migration
supabase db push
```

---

## 6. Verifikasi Koneksi

### Langkah 1: Restart Development Server

Setelah membuat file `.env`, **restart** development server:

```bash
# Hentikan server yang sedang berjalan (Ctrl+C)
# Kemudian jalankan lagi:
npm run dev
```

### Langkah 2: Test di Browser

1. Buka aplikasi di browser (biasanya `http://localhost:5173`)
2. Buka **Developer Console** (F12 atau Right Click → Inspect)
3. Cek tab **Console** - seharusnya tidak ada error tentang Supabase
4. Coba isi form **RSVP** atau **Guestbook**
5. Jika berhasil, data akan tersimpan di Supabase

### Langkah 3: Verifikasi di Supabase Dashboard

1. Kembali ke Supabase Dashboard
2. Klik **"Table Editor"** di sidebar kiri
3. Anda akan melihat 2 tabel:
   - `rsvp_responses` - untuk data RSVP
   - `guestbook_messages` - untuk pesan guestbook
4. Coba submit data dari aplikasi, lalu refresh Table Editor
5. Data yang baru akan muncul di tabel

---

## 7. Troubleshooting

### ❌ Error: "Missing Supabase environment variables"

**Penyebab:** File `.env` tidak ditemukan atau variabel tidak terdefinisi

**Solusi:**
1. Pastikan file `.env` ada di root folder (sama level dengan `package.json`)
2. Pastikan nama variabel benar: `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`
3. Pastikan tidak ada spasi di sekitar tanda `=`
4. Restart development server setelah membuat/mengubah `.env`

### ❌ Error: "Invalid API key" atau "Invalid URL"

**Penyebab:** API key atau URL yang dimasukkan salah

**Solusi:**
1. Double-check URL dan API key di Supabase Dashboard
2. Pastikan Anda menggunakan **anon public key**, bukan service_role key
3. Pastikan tidak ada spasi atau karakter tambahan saat copy-paste

### ❌ Error: "relation does not exist" atau "table does not exist"

**Penyebab:** Migration belum dijalankan

**Solusi:**
1. Pastikan migration sudah dijalankan (lihat [Langkah 5](#5-menjalankan-database-migration))
2. Cek di Table Editor apakah tabel `rsvp_responses` dan `guestbook_messages` sudah ada

### ❌ Error: "new row violates row-level security policy"

**Penyebab:** Row Level Security (RLS) policy tidak benar

**Solusi:**
1. Pastikan migration sudah dijalankan dengan lengkap
2. Di Supabase Dashboard, buka **"Authentication"** → **"Policies"**
3. Pastikan policy untuk insert dan select sudah ada

### ❌ Data tidak muncul di Table Editor

**Penyebab:** 
- Data belum di-submit dengan benar
- Ada error di console yang tidak terlihat

**Solusi:**
1. Buka Developer Console (F12) dan cek tab Console untuk error
2. Cek tab Network untuk melihat request ke Supabase
3. Pastikan form diisi dengan benar (field required tidak boleh kosong)

---

## ✅ Checklist Setup

Gunakan checklist ini untuk memastikan semua langkah sudah dilakukan:

- [ ] Akun Supabase sudah dibuat
- [ ] Project baru sudah dibuat
- [ ] Project URL sudah dicatat
- [ ] Anon public key sudah dicatat
- [ ] File `.env` sudah dibuat di root folder
- [ ] Variabel `VITE_SUPABASE_URL` sudah diisi
- [ ] Variabel `VITE_SUPABASE_ANON_KEY` sudah diisi
- [ ] Migration sudah dijalankan
- [ ] Development server sudah di-restart
- [ ] Tidak ada error di console browser
- [ ] Data bisa di-submit melalui form RSVP
- [ ] Data bisa di-submit melalui form Guestbook
- [ ] Data muncul di Supabase Table Editor

---

## 📚 Referensi Tambahan

- [Dokumentasi Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🆘 Butuh Bantuan?

Jika masih mengalami masalah setelah mengikuti panduan ini:

1. Cek [Supabase Discord Community](https://discord.supabase.com)
2. Baca [Supabase Documentation](https://supabase.com/docs)
3. Pastikan semua langkah di checklist sudah dilakukan

---

**Selamat! 🎉 Setup Supabase Anda sudah selesai!**



