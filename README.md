# SMK Prima Unggul Online Exam

Aplikasi ujian online berbasis web untuk siswa SMK Prima Unggul dengan materi TKJ.

## Teknologi
- **Frontend**: Next.js 15 (App Router)
- **Backend/Database**: Supabase
- **Styling**: Tailwind CSS
- **Animasi**: Motion

## Persiapan Database (Supabase)
1. Buat proyek baru di [Supabase Console](https://app.supabase.com/).
2. Buka menu **SQL Editor**.
3. Salin isi dari file `schema.sql` dan jalankan (Run).
4. Buka menu **Project Settings** > **API**.
5. Salin `Project URL` dan `anon public key`.

## Konfigurasi Environment
Buat file `.env.local` dan isi dengan data dari Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Cara Menjalankan Lokal
1. `npm install`
2. `npm run dev`
3. Buka `http://localhost:3000`

## Panduan Deploy ke Vercel
1. Push kode Anda ke GitHub/GitLab/Bitbucket.
2. Masuk ke [Vercel](https://vercel.com/).
3. Klik **New Project** dan pilih repositori Anda.
4. Di bagian **Environment Variables**, masukkan:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Klik **Deploy**.

## Catatan Role
- User pertama yang mendaftar melalui halaman login akan otomatis menjadi **Admin**.
- User selanjutnya akan menjadi **Siswa**.
- Admin dapat mengelola soal dan melihat hasil semua siswa.
- Siswa dapat mengerjakan ujian dan melihat hasil mereka sendiri.
