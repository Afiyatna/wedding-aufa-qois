# 🚀 Panduan Deploy ke Vercel

Panduan lengkap untuk mendeploy aplikasi Wedding Invitation ke Vercel.

## 📋 Daftar Isi

1. [Persiapan](#1-persiapan)
2. [Setup Environment Variables di Vercel](#2-setup-environment-variables-di-vercel)
3. [Deploy via Vercel Dashboard](#3-deploy-via-vercel-dashboard)
4. [Deploy via Vercel CLI](#4-deploy-via-vercel-cli)
5. [Troubleshooting](#5-troubleshooting)

---

## 1. Persiapan

### Pastikan Project Siap

Sebelum deploy, pastikan:

- ✅ Project sudah berjalan dengan baik di local (`npm run dev`)
- ✅ Build berhasil tanpa error (`npm run build`)
- ✅ File `.env` sudah ada dan berisi kredensial Supabase
- ✅ Migration database sudah dijalankan di Supabase

### Install Vercel CLI (Opsional)

Jika ingin deploy via CLI:

```bash
npm install -g vercel
```

---

## 2. Setup Environment Variables di Vercel

**⚠️ PENTING:** Ini adalah langkah yang paling penting! Error "Missing Supabase environment variables" terjadi karena environment variables belum di-set di Vercel.

### Langkah-langkah:

#### A. Via Vercel Dashboard (Disarankan)

1. **Login ke Vercel**
   - Buka [https://vercel.com](https://vercel.com)
   - Login dengan GitHub, GitLab, atau Bitbucket

2. **Import Project** (jika belum)
   - Klik **"Add New..."** → **"Project"**
   - Import repository GitHub/GitLab Anda
   - Atau tunggu sampai project sudah di-deploy pertama kali

3. **Setup Environment Variables**
   - Masuk ke project Anda di Vercel Dashboard
   - Klik tab **"Settings"**
   - Di sidebar kiri, klik **"Environment Variables"**
   - Tambahkan 2 variabel berikut:

   **Variabel 1:**
   - **Name:** `VITE_SUPABASE_URL`
   - **Value:** (URL project Supabase Anda, contoh: `https://xxxxx.supabase.co`)
   - **Environment:** Pilih semua (Production, Preview, Development)

   **Variabel 2:**
   - **Name:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** (Anon public key dari Supabase Dashboard)
   - **Environment:** Pilih semua (Production, Preview, Development)

4. **Redeploy**
   - Setelah menambahkan environment variables, klik **"Redeploy"** di tab **"Deployments"**
   - Atau buat deployment baru dengan push ke repository

#### B. Via Vercel CLI

```bash
# Login ke Vercel
vercel login

# Set environment variables
vercel env add VITE_SUPABASE_URL
# (masukkan URL saat diminta)

vercel env add VITE_SUPABASE_ANON_KEY
# (masukkan anon key saat diminta)

# Deploy
vercel --prod
```

---

## 3. Deploy via Vercel Dashboard

### Langkah-langkah:

1. **Push Code ke Repository**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import Project di Vercel**
   - Buka [https://vercel.com/new](https://vercel.com/new)
   - Pilih repository Anda
   - Vercel akan otomatis detect framework (Vite)

3. **Configure Project**
   - **Framework Preset:** Vite (otomatis terdeteksi)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `dist` (default)
   - **Install Command:** `npm install` (default)

4. **Setup Environment Variables**
   - Sebelum klik "Deploy", klik **"Environment Variables"**
   - Tambahkan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`
   - Klik **"Deploy"**

5. **Tunggu Deployment Selesai**
   - Vercel akan build dan deploy project Anda
   - Setelah selesai, Anda akan mendapat URL production

---

## 4. Deploy via Vercel CLI

### Langkah-langkah:

1. **Login ke Vercel**
   ```bash
   vercel login
   ```

2. **Deploy untuk Preview**
   ```bash
   vercel
   ```
   - Ikuti instruksi yang muncul
   - Ini akan membuat preview deployment

3. **Set Environment Variables** (jika belum)
   ```bash
   vercel env add VITE_SUPABASE_URL production
   vercel env add VITE_SUPABASE_ANON_KEY production
   ```

4. **Deploy ke Production**
   ```bash
   vercel --prod
   ```

---

## 5. Troubleshooting

### ❌ Error: "Missing Supabase environment variables"

**Penyebab:** Environment variables belum di-set di Vercel

**Solusi:**
1. Pastikan Anda sudah menambahkan environment variables di Vercel Dashboard
   - Settings → Environment Variables
   - Tambahkan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`
2. Pastikan nama variabel **persis sama** dengan yang di code:
   - `VITE_SUPABASE_URL` (bukan `SUPABASE_URL`)
   - `VITE_SUPABASE_ANON_KEY` (bukan `SUPABASE_ANON_KEY`)
3. **Redeploy** setelah menambahkan environment variables
   - Klik "Redeploy" di deployment terakhir
   - Atau buat deployment baru

### ❌ Error: "Failed to load resource: /vite.svg:1 status of 404"

**Penyebab:** File `vite.svg` tidak ada di folder `public`

**Solusi:**
1. Buat folder `public` di root project (jika belum ada)
2. Buat file `vite.svg` atau hapus referensi di `index.html`
3. Atau ganti dengan favicon yang ada

### ❌ Build Error di Vercel

**Penyebab:** Ada masalah saat build

**Solusi:**
1. Test build di local dulu:
   ```bash
   npm run build
   ```
2. Jika build berhasil di local tapi gagal di Vercel:
   - Cek log build di Vercel Dashboard
   - Pastikan semua dependencies ter-install
   - Pastikan Node.js version sesuai

### ❌ Environment Variables Tidak Terbaca

**Penyebab:** Variabel tidak ter-set dengan benar

**Solusi:**
1. Pastikan variabel di-set untuk environment yang benar:
   - Production
   - Preview
   - Development
2. Pastikan tidak ada typo di nama variabel
3. Pastikan value tidak ada spasi di awal/akhir
4. Redeploy setelah mengubah environment variables

### ❌ CORS Error dari Supabase

**Penyebab:** Domain Vercel belum ditambahkan di Supabase

**Solusi:**
1. Buka Supabase Dashboard
2. Settings → API
3. Scroll ke bagian "CORS"
4. Tambahkan domain Vercel Anda (contoh: `https://your-project.vercel.app`)
5. Atau gunakan wildcard `*` untuk development (tidak disarankan untuk production)

---

## ✅ Checklist Deploy

Gunakan checklist ini sebelum dan sesudah deploy:

**Sebelum Deploy:**
- [ ] Project berjalan baik di local
- [ ] Build berhasil tanpa error (`npm run build`)
- [ ] Environment variables sudah dicatat (URL dan Anon Key)
- [ ] Code sudah di-push ke repository

**Saat Deploy:**
- [ ] Project sudah di-import ke Vercel
- [ ] Environment variables sudah di-set di Vercel Dashboard
- [ ] Build command sudah benar (`npm run build`)
- [ ] Output directory sudah benar (`dist`)

**Setelah Deploy:**
- [ ] Deployment berhasil tanpa error
- [ ] Website bisa diakses di URL Vercel
- [ ] Tidak ada error di browser console
- [ ] Form RSVP bisa di-submit
- [ ] Form Guestbook bisa di-submit
- [ ] Data muncul di Supabase Table Editor

---

## 📝 Catatan Penting

### Environment Variables di Vercel

- Environment variables di Vercel **TIDAK** otomatis ter-copy dari file `.env`
- Anda **HARUS** menambahkan environment variables secara manual di Vercel Dashboard
- Variabel dengan prefix `VITE_` akan di-expose ke client-side
- Jangan pernah commit file `.env` ke repository

### Build Configuration

Vercel biasanya otomatis detect Vite, tapi jika perlu, Anda bisa buat `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Custom Domain

Setelah deploy, Anda bisa:
1. Masuk ke project di Vercel Dashboard
2. Settings → Domains
3. Tambahkan custom domain Anda

---

## 🆘 Butuh Bantuan?

Jika masih mengalami masalah:

1. Cek [Vercel Documentation](https://vercel.com/docs)
2. Cek build logs di Vercel Dashboard
3. Pastikan semua langkah di checklist sudah dilakukan
4. Cek browser console untuk error detail

---

**Selamat! 🎉 Website Anda sudah live di Vercel!**

