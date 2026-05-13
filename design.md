# COREPAWAS UI & Aesthetic Design System

Dokumen ini fokus pada identitas visual, tema, dan panduan antarmuka (UI) premium untuk platform COREPAWAS.

## 1. Design Philosophy: "Premium Technical"
Desain COREPAWAS menggabungkan estetika *High-End Consumer Electronics* dengan transparansi teknis. Penggunaan elemen gelap (dark mode), sudut yang sangat bulat (extreme rounding), dan material kaca (glassmorphism) menciptakan kesan mewah namun fungsional.

---

## 2. Color Palette (The "Navy-Orange" Signature)
Sistem warna dirancang untuk memberikan kontras yang tajam dan fokus pada aksi (CTA).

- **Base Theme**: Deep Dark Mode.
- **Surface Colors**:
  - `Background`: `#001224` (Deep Navy-Black)
  - `Card/Surface`: `#001529` (Navy Dark)
  - `Muted Surface`: `#002d5b` (Navy Blue Deep)
- **Accent Colors**:
  - `Primary Orange`: `#fa8c16` (Brand Identity, Buttons, High Priority)
  - `Orange Light`: `#ffd591` (Highlights, Glows)
- **Functional Colors**:
  - `Ready State`: Emerald Green (`#10b981`)
  - `Sold State`: Slate Gray / Reduced Opacity
  - `Danger/Delete`: Rose Red (`#ff4d4f`)

---

## 3. Typography
Menggunakan font yang bersih dan geometris untuk mendukung kesan teknologi modern.

- **Primary Font**: `Outfit`
- **Heading Styles**: 
  - `Font Black` (900 weight) untuk judul besar.
  - `Tracking Tighter` untuk judul agar terlihat lebih solid dan premium.
- **Sub-heading/Label**:
  - `Uppercase` dengan `Tracking Widest` (0.2em - 0.5em) untuk kesan industrial/minimalis.
  - Font size kecil (10px-11px) untuk meta-data teknis.

---

## 4. Visual Elements & Tokens

### Material & Effects
- **Glass-Premium**: 
  - `Backdrop Blur`: 24px.
  - `Border`: 1px solid putih dengan opacity 10-15%.
  - `Shadow`: Deep soft shadows dengan tint warna Navy.
- **Noise Overlay**: Tekstur butiran halus (film grain) pada background untuk menghilangkan efek color-banding pada layar OLED dan memberikan tekstur premium.
- **Glow Effects**: Radial gradient halus di belakang elemen penting (seperti AI Assistant) untuk memberikan kesan "Neural/Active".

### Shapes & Layout
- **Border Radius**: 
  - `Extra Large (2.5rem)` untuk card utama dan modal.
  - `Full (Capsule)` untuk tombol navigasi dan badge.
- **Bento Grid System**: Pengorganisasian informasi dalam kotak-kotak dengan ukuran yang bervariasi namun tetap harmonis, mengikuti tren desain UI modern (Apple/Stripe style).

---

## 5. Motion & Interaction

### Reveal Animations
Setiap section menggunakan efek *scroll-reveal*:
- `Initial State`: Opacity 0, Translate-Y 30px.
- `Active State`: Opacity 1, Translate-Y 0 (Cubic-bezier transition).

### Micro-Interactions
- **3D Tilt**: Elemen bento-card memiliki efek perspektif saat disentuh/hover.
- **Monochrome-to-Color**: Foto produk dimulai dengan filter grayscale dan bertransisi menjadi berwarna saat di-hover untuk memberikan fokus visual.
- **Magnetic Hover**: Tombol penting memiliki transisi skala (`scale-110`) dan rotasi halus (`rotate-6`).

---

## 6. Brand Asset: The Logo
Logo COREPAWAS menggabungkan simbol smartphone miring (15 derajat) dengan inisial **C** (Navy) dan **P** (Orange).
- **Text Branding**: Kombinasi teks Putih (`CORE`) dan Orange (`PAWAS`) dengan sub-teks "JUAL BELI HP" yang diapit garis separator tipis.

---

## 7. Imagery & Experience Standard
- **Ratio**: Konsisten menggunakan 4:5 untuk katalog produk.
- **Background**: Website menggunakan **Dynamic 3D Mesh Background** sebagai fondasi visual.
  - *Tech Specs*: Kombinasi CSS Blobs (Navy/Orange), Technical Grid, dan High-Fidelity Textures dari Unsplash.
  - *Goal*: Menghindari estetika "AI slop" dengan memberikan tekstur realistik dan kedalaman visual yang responsif.
  - *Recommended Texture Sources*: 
    - [Dark Abstract Tech](https://unsplash.com/s/photos/dark-abstract-technology)
    - [Minimalist Dark Gradients](https://unsplash.com/s/photos/dark-minimalist-gradient)
    - [Industrial Tech Backgrounds](https://unsplash.com/s/photos/dark-tech-texture)
  - Background harus mendukung visibilitas detail fisik gadget tanpa distraksi visual yang berlebihan.
- **Badging**: Badge teknis (BH, Antutu) diletakkan dengan padding yang lega agar tidak menumpuk dengan nama produk.
