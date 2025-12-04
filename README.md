# 💍 Digital Wedding Invitation

Aplikasi undangan pernikahan digital yang dibuat dengan React, TypeScript, dan Supabase.

## 🚀 Quick Start

### Instalasi

```bash
npm install
```

### Menjalankan Development Server

```bash
npm run dev
```

### Build untuk Production

```bash
npm run build
```

## 📚 Setup Supabase

**Penting:** Aplikasi ini membutuhkan koneksi ke Supabase untuk fitur RSVP dan Guestbook.

📖 **Lihat panduan lengkap:** [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

### Quick Setup:

1. Buat akun di [Supabase](https://supabase.com)
2. Buat project baru
3. Copy file `env.example` menjadi `.env`
4. Isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` dengan kredensial dari Supabase Dashboard
5. Jalankan migration SQL dari folder `supabase/migrations/`
6. Restart development server

## 🚀 Deploy ke Vercel

**Penting:** Setelah deploy ke Vercel, jangan lupa setup environment variables!

📖 **Lihat panduan lengkap:** [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)

### Quick Deploy:

1. Push code ke GitHub/GitLab
2. Import project ke [Vercel](https://vercel.com)
3. **Tambahkan Environment Variables:**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

## ✨ Fitur

- 🎨 Beautiful UI dengan Tailwind CSS
- 🌓 Dark/Light Mode
- 📸 Gallery Foto
- ⏰ Countdown Timer
- 📝 RSVP Form (tersimpan di Supabase)
- 💬 Guestbook (tersimpan di Supabase)
- 🎵 Music Player
- 📱 Responsive Design
- 👤 Personalisasi nama tamu via URL

## 🛠️ Teknologi

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- Lucide React Icons

## 📝 License

Private project
