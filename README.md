# WorkTrack (`worktraker`)

WorkTrack adalah platform manajemen produktivitas dan portfolio profesional all-in-one yang dibangun dengan arsitektur modern menggunakan Laravel 13, Inertia.js, React, dan Tailwind CSS.

## 🚀 Fitur Utama

- **Dashboard**: Tinjauan metrik harian, progress proyek, target produktivitas, dan aktivitas terkini.
- **Projects**: Manajemen proyek dengan status progress, timeline, filter kategori, dan modal detail interaktif.
- **Tasks**: Manajemen tugas harian dengan checklist prioritas (High, Medium, Low) dan estimasi waktu.
- **Notes**: Catatan dan dokumentasi koding dengan syntax formatting, kategori tag, dan pencarian cepat.
- **Calendar**: Kalender bulanan dan mingguan dengan penanda jadwal deadline dan acara penting.
- **Archive**: Penyimpanan arsip proyek, riwayat rilis, dan dokumentasi yang telah selesai.
- **Portfolio**: Pusat konfigurasi website portfolio publik (Projects, About, Experience, Skills, Testimonials, Appearance).
- **Settings**: Pengaturan profil lengkap, tautan media sosial, keamanan akun, preferensi sistem, dan integrasi (GitHub, Google Drive, Figma, Notion).

## 💻 Tech Stack

- **Backend**: Laravel 13 (PHP 8.3)
- **Frontend**: Inertia.js + React 19
- **Styling**: Tailwind CSS v4 & Lucide React Icons
- **Bundler**: Vite 8

## 🛠️ Instalasi & Menjalankan Lokal

1. **Clone repositori**:
   ```bash
   git clone https://github.com/Asafik/worktraker.git
   cd worktraker
   ```

2. **Install dependensi PHP & Node**:
   ```bash
   composer install
   npm install
   ```

3. **Konfigurasi Lingkungan**:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Jalankan Aplikasi**:
   ```bash
   # Terminal 1 (Laravel Server)
   php artisan serve

   # Terminal 2 (Vite Server)
   npm run dev
   ```

Buka browser di `http://127.0.0.1:8000`.
