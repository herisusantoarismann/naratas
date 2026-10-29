<div align="center">

# 🌿 Naratas

**Local-First Block Document Engine powered by Svelte 5 Runes**

[![Svelte 5](https://img.shields.io/badge/Svelte-5_Runes-FF3E00?style=flat&logo=svelte&logoColor=white)](https://svelte.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vitest](https://img.shields.io/badge/Vitest-49%2F49_Passed-6E9F18?style=flat&logo=vitest&logoColor=white)](https://vitest.dev)
[![Playwright](https://img.shields.io/badge/Playwright-E2E_Verified-2EAD33?style=flat&logo=playwright&logoColor=white)](https://playwright.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Cloud_Share-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

_Naratas_ (berasal dari bahasa Sunda yang bermakna **merintis atau membuka jalan**) adalah aplikasi pembuat dokumen berbasis blok (_Notion-style_) yang sangat cepat, bersih, dan aman. Mengutamakan privasi lokal (_Local-First_) dengan penyimpanan otomatis, dukungan format Markdown murni, dan integrasi cloud sharing.

[🚀 Mulai Cepat](#-panduan-memulai-cepat-3-langkah) •
[✨ Fitur Utama](#-fitur-utama) •
[⌨️ Pintasan Keyboard](#️-pintasan-keyboard) •
[📚 26+ Template](#-koleksi-26-starter-templates) •
[☁️ Setup Supabase](#️-opsional-konfigurasi-cloud-share-supabase) •
[🚢 Deploy](#-deploy-ke-vercel)

</div>

---

## ✨ Fitur Utama

- ⚡ **Svelte 5 Runes Architecture:** Reaktivitas instan dan efisien menggunakan `$state.raw` & `$derived` tanpa overhead virtual DOM.
- 💾 **Local-First & Auto-Save:** Setiap ketikan otomatis tersimpan di peramban pengguna (`localStorage`). Tidak perlu takut tulisan hilang saat browser ditutup atau listrik padam.
- ⌨️ **Slash Commands (`/`):** Menu format instan untuk Heading 1, Heading 2, Paragraf, Kotak Catatan (Callout), Blok Kode, dan Pembatas.
- 📥 **Simpan ke Markdown (`Ctrl + S`):** Tekan pintasan standar untuk langsung mengunduh draf sebagai file `.md` asli.
- 🔗 **Berbagi Tautan (Cloud Sharing & Portable Link):**
  - **Supabase Cloud:** Bagikan dokumen melalui tautan publik unik (`/d/:id`).
  - **Portable Hash Link:** Opsi berbagi langsung tanpa database menggunakan kompresi URL.
- 📂 **26+ Cetak Biru (Starter Templates):** Berbagai template siap pakai untuk dokumen teknis, RFC, PRD, README, SOP, dan catatan meeting.
- 🛡️ **Pencegah Timpa Dokumen (_Overwrite Protection_):** Dialog konfirmasi cerdas yang melindungi dokumen aktif agar tidak sengaja tertimpa template baru.
- 🔍 **Live Document Inspector:** Pratinjau live konversi Markdown murni, JSON AST, serta metrik kata dan estimasi waktu baca.

---

## 🚀 Panduan Memulai Cepat (3 Langkah)

Aplikasi ini sangat mudah dijalankan di komputer Anda. Pastikan Anda sudah menginstal **Node.js versi 20 atau lebih baru**.

### 1. Salin Repositori (Clone)

Buka terminal atau command prompt, lalu jalankan:

```bash
git clone https://github.com/herisusantoarismann/naratas.git
cd naratas
```

### 2. Pasang Dependensi

```bash
npm install
```

### 3. Jalankan Aplikasi

```bash
npm run dev
```

Buka browser Anda dan akses tautan:  
👉 **[http://localhost:5173](http://localhost:5173)**

---

## ⌨️ Pintasan Keyboard

| Tombol Pintasan                                | Fungsi                                                 |
| :--------------------------------------------- | :----------------------------------------------------- |
| **`Ctrl + S`** / **`Cmd + S`**                 | Mengunduh dokumen aktif sebagai file Markdown (`.md`)  |
| **`/`**                                        | Membuka menu Slash Commands untuk memilih jenis blok   |
| **`Enter`**                                    | Memecah blok saat ini di posisi kursor (_Split Block_) |
| **`Backspace`** _(di awal baris kosong)_       | Menggabungkan teks ke blok sebelumnya (_Merge Block_)  |
| **`Ctrl + Z`** / **`Cmd + Z`**                 | Membatalkan perubahan terakhir (_Undo_)                |
| **`Ctrl + Shift + Z`** / **`Cmd + Shift + Z`** | Mengulangi perubahan (_Redo_)                          |
| **`Escape`**                                   | Menutup menu floating atau modal aktif                 |

---

## 📚 Koleksi 26+ Starter Templates

Naratas menyediakan cetak biru dokumen siap pakai pada rute `/templates`:

- 🛠️ **Engineering:** _Engineering RFC, REST API Specs, Architecture Decision Records (ADR), Postmortem RCA, Database Migration Plan, Bug Reproduction Guide, Code Review Checklist, Troubleshooting Runbook._
- 🚀 **Product & Agile:** _Sprint 42 Retrospective, Product Requirements Document (PRD), Feature Launch Checklist, User Story & Gherkin AC, Competitive Landscape, Product Launch Press Release._
- ✍️ **Dokumentasi:** _Open Source README, Keep-a-Changelog Release Notes, Developer Quickstart, Technical Blog Draft, SECURITY.md Policy, CONTRIBUTING.md Guide, Design System Token Specs._
- 💡 **Workflow & Manajemen:** _1-on-1 Sync Meeting Agenda, Weekly Standup Notes, Daily DevLog Journal, Company Handbook / SOP, Technical Paper & Book Summary._

---

## ☁️ (Opsional) Konfigurasi Cloud Share (Supabase)

Fitur ekspor `.md` dan _portable link_ langsung berfungsi tanpa perlu database. Namun, jika Anda ingin menggunakan fitur **Supabase Cloud Share**:

1. Buat proyek gratis di [supabase.com](https://supabase.com).
2. Buka tab **SQL Editor** di dashboard Supabase Anda, salin seluruh isi file [`supabase/schema.sql`](supabase/schema.sql), lalu klik **Run**.
3. Buat file `.env` di folder utama proyek (bisa menduplikasi dari `.env.example`):
   ```env
   PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. Jalankan ulang server `npm run dev`. Tombol **Share** kini akan otomatis membuat tautan cloud!

---

## 🚢 Deploy ke Vercel

Aplikasi ini sudah dikonfigurasi dan siap dideploy langsung ke **Vercel**:

1. Unggah kode Anda ke GitHub / GitLab.
2. Buka [Vercel Dashboard](https://vercel.com/dashboard) dan klik **Add New Project**.
3. Pilih repositori **naratas**.
4. _(Opsional)_ Pada bagian **Environment Variables**, tambahkan:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
5. Klik **Deploy** — Vercel akan otomatis mendeteksi SvelteKit dan mem-build aplikasi Anda dalam hitungan detik.

---

## 🧪 Pengujian & Standar Kualitas

Naratas dibangun dengan prinsip ketat **Anti-Slop** dan telah lolos seluruh pintu pengujian otomatis:

```bash
# Menjalankan seluruh pengujian unit & arsitektur (Vitest)
npm run test:unit

# Menjalankan pengujian alur interaksi pengguna (Playwright E2E)
npm run test:e2e

# Memeriksa tipe data TypeScript & Svelte
npm run check

# Memeriksa format kode (ESLint & Prettier)
npm run lint

# Membangun bundle produksi (Production Build)
npm run build
```

---

## 📂 Struktur Direktori Proyek

```text
naratas/
├── e2e/                             # Pengujian End-to-End Playwright
├── src/
│   ├── lib/
│   │   ├── actions/                 # Svelte actions (caret, shortcut, outside click)
│   │   ├── components/ui/           # Komponen UI atomik murni (Button, Badge, Modal)
│   │   ├── features/editor/         # State engine Svelte 5, block renderer, inspector
│   │   ├── features/templates/      # Katalog 26 starter templates
│   │   ├── services/                # Integrasi Supabase client & cloud sharing
│   │   └── utils/                   # Serializer Markdown murni, sanitizer XSS
│   ├── routes/
│   │   ├── +page.svelte             # Dashboard beranda Naratas
│   │   ├── editor/+page.svelte      # Kanvas editor dokumen blok
│   │   ├── templates/+page.svelte   # Katalog starter template
│   │   └── d/[id]/+page.svelte      # Rute pembaca dokumen bersama (Cloud Viewer)
│   └── types/                       # Definisi tipe TypeScript dokumen
├── supabase/
│   └── schema.sql                   # Skrip database & Row Level Security (RLS)
├── tests/                           # Pengujian Vitest (Gate 01 s/d 06)
└── package.json
```

---

## 📄 Lisensi

Didistribusikan di bawah lisensi **MIT**. Bebas digunakan, dipelajari, dan dikembangkan untuk keperluan pribadi maupun komersial.
