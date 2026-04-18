export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  readTime: string;
  category: string;
  author: string;
}

export const defaultBlogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'cara-cek-hp-second-tidak-tertipu-rekondisi',
    title: 'Cara Cek HP Second agar Tidak Tertipu Rekondisi',
    excerpt:
      'Panduan lengkap dari teknisi berpengalaman untuk memastikan HP bekas yang kamu beli 100% original dan bukan hasil rekondisi atau refurbish ilegal.',
    image: 'https://images.unsplash.com/photo-1633997011021-0254baa23289?w=800&q=80',
    date: '2025-04-15',
    readTime: '7 menit',
    category: 'Tips & Tricks',
    author: 'Tim COREPAWAS',
    content: `
## Mengapa HP Rekondisi Berbahaya?

HP rekondisi adalah perangkat yang komponen aslinya telah diganti dengan komponen palsu atau bekas berkualitas rendah. Bahayanya, tampilan luar terlihat mulus, namun mesin dalamnya sudah "rombakan".

## 5 Cara Wajib Cek HP Second

### 1. Gunakan Aplikasi 3uTools (untuk iPhone)

3uTools adalah tool wajib untuk cek keaslian iPhone. Aplikasi ini akan menampilkan:
- Status Flash / Genuine Check
- Komponen yang sudah diganti (layar, baterai, kamera)
- Battery health akurat
- IMEI dan aktivasi iCloud

**Red Flag:** Jika 3uTools menunjukkan "Screen Replaced" atau "Non-Genuine Battery", waspada! Minta harga lebih murah atau hindari.

### 2. Cek Status UBL (Unlock Bootloader) untuk Android

Status UBL penting untuk Android. HP dengan UBL aktif berarti pernah di-root atau dimodifikasi secara mendalam. Cara cek:
\`\`\`
Masuk ke Settings > About Phone > Tap Build Number 7x
Buka Developer Options > OEM Unlocking Status
\`\`\`

Atau saat restart, biasanya ada tulisan "Bootloader Unlocked" di layar.

### 3. Stress Test dengan Antutu atau CPU Throttling Test

Jalankan benchmark Antutu dan perhatikan hasilnya. Bandingkan dengan score standar untuk model tersebut. Selisih lebih dari 20% bisa indikasi masalah thermal atau chipset bermasalah.

### 4. Cek Fisik dengan Teliti

- Periksa seri mesin di body menggunakan senter
- Cek IMEI di Settings vs di dus (harus sama persis)
- Cek jahitan bezel layar, apakah rapi atau ada celah
- Cek port charging, apakah ada bekas masalah

### 5. Verifikasi IMEI Online

Masukkan IMEI di situs resmi manufacturer atau **imei.info**. IMEI yang valid akan menampilkan model, region, dan status garansi resmi.

## Kesimpulan

Membeli HP second memang butuh ketelitian ekstra. Gunakan teknisi berpengalaman atau beli dari seller yang transparan seperti COREPAWAS yang menyediakan laporan inspeksi lengkap untuk setiap unit.
    `,
  },
  {
    id: '2',
    slug: 'kenapa-harus-cek-status-ubl-sebelum-beli-android',
    title: 'Kenapa Harus Cek Status UBL Sebelum Beli Android?',
    excerpt:
      'UBL (Unlock Bootloader) sering diabaikan pembeli HP second. Padahal status ini bisa jadi penentu keamanan data dan garansi perangkat kamu.',
    image: 'https://images.unsplash.com/photo-1758272421542-b6bd81729cb5?w=800&q=80',
    date: '2025-04-10',
    readTime: '5 menit',
    category: 'Edukasi Teknis',
    author: 'Tim COREPAWAS',
    content: `
## Apa itu UBL (Unlock Bootloader)?

Bootloader adalah program pertama yang berjalan saat HP dinyalakan. Fungsinya memverifikasi bahwa OS yang dimuat adalah resmi dari pabrikan. Ketika di-unlock, proteksi ini dimatikan.

## Risiko HP dengan UBL Aktif

### 1. Keamanan Data Lemah
HP dengan UBL aktif lebih mudah diserang. Orang dengan akses fisik bisa boot ke custom recovery dan mengakses atau mencuri data kamu bahkan tanpa password.

### 2. Kemungkinan Malware Tersistem
Beberapa HP second yang sudah di-root dan UBL aktif mungkin memiliki custom ROM yang sudah terinfeksi malware tersembunyi (sistem level, tidak bisa dihapus dengan factory reset biasa).

### 3. Garansi Resmi Hangus
Sebagian besar vendor (Samsung, Xiaomi, dll) akan menghanguskan garansi resmi begitu UBL diaktifkan. Ini akan menjadi masalah jika HP bermasalah.

### 4. Update OTA Terganggu
HP dengan custom ROM tidak bisa menerima update resmi dari pabrikan, sehingga rentan terhadap celah keamanan yang sudah di-patch di versi terbaru.

## Cara Cek Status UBL

### Samsung:
Di Samsung, UBL biasanya disebut OEM Unlock:
1. Settings > About Phone > Software Information
2. Tap Build Number 7x untuk aktifkan Developer Options
3. Settings > Developer Options > OEM Unlocking (jika toggle-nya sudah ON = pernah di-unlock)

### Xiaomi:
1. Settings > About Phone > MIUI Version (tap 7x)
2. Settings > Additional Settings > Developer Options
3. Mi Unlock Status

### Cara Mudah: Restart HP
Beberapa HP akan menampilkan pesan "Bootloader Unlocked" atau ikon gembok terbuka saat startup jika UBL aktif.

## Apakah HP UBL Tidak Layak Beli?

Tidak selalu. HP dengan UBL bisa tetap dibeli dengan syarat:
- Harga lebih murah (negosiasi 15-25% off)
- Penjual jujur dan transparan soal statusnya
- Kamu paham risikonya
- Sudah di-relock dan di-flash ROM resmi kembali

Di COREPAWAS, setiap unit kami cantumkan status UBL secara transparan di halaman detail produk.
    `,
  },
  {
    id: '3',
    slug: 'panduan-migrasi-data-hp-lama-ke-hp-baru',
    title: 'Panduan Lengkap Migrasi Data dari HP Lama ke HP Baru',
    excerpt:
      'Ganti HP tapi bingung pindahkan data? Kontak, foto, aplikasi, hingga pesan WhatsApp bisa dipindahkan dengan mudah. Ini panduannya.',
    image: 'https://images.unsplash.com/photo-1561474119-1b76f3a79816?w=800&q=80',
    date: '2025-04-05',
    readTime: '6 menit',
    category: 'Panduan',
    author: 'Tim COREPAWAS',
    content: `
## Persiapan Sebelum Migrasi Data

Sebelum berpindah HP, lakukan langkah ini di HP lama:
1. Backup semua foto ke Google Photos atau iCloud
2. Catat aplikasi penting yang perlu diinstall ulang
3. Catat akun-akun login penting
4. Backup WhatsApp (Settings > Chats > Chat Backup)

## Migrasi Android ke Android

### Metode 1: Google Backup (Termudah)
1. Di HP lama: Settings > Google > Backup > Backup Now
2. Di HP baru: Saat setup, login akun Google yang sama
3. Pilih restore dari backup terbaru
4. Tunggu proses restore selesai

### Metode 2: Samsung Smart Switch (Khusus Samsung)
1. Install Smart Switch di kedua HP
2. Hubungkan dengan kabel USB-C to USB-C atau via WiFi Direct
3. Pilih data yang ingin dipindahkan
4. Transfer bisa mencapai 20-30 menit untuk data besar

## Migrasi iPhone ke iPhone

### Quick Start (iOS 12.4+)
1. Nyalakan iPhone baru, letakkan dekat iPhone lama
2. Ikuti instruksi animasi di layar
3. Masukkan Apple ID dan password
4. Pilih "Transfer from iPhone" 
5. Estimasi waktu akan ditampilkan

## Migrasi WhatsApp (Lintas Platform)

### Android ke iPhone:
1. Download "Move to iOS" di Android
2. Di iPhone baru saat setup, pilih "Move Data from Android"
3. Scan kode QR, pilih WhatsApp dari daftar
4. Tunggu proses transfer

### iPhone ke Android:
1. Update WhatsApp ke versi terbaru di iPhone
2. Buka WhatsApp > Settings > Chats > Move Chats to Android
3. Di HP Android, buka WhatsApp > Restore from iPhone
4. Ikuti instruksi selanjutnya

## Layanan Gratis COREPAWAS

Setiap pembelian HP di COREPAWAS mendapatkan **gratis jasa migrasi data** termasuk:
- Migrasi kontak, foto, dan dokumen
- Backup dan restore WhatsApp
- Setup akun email dan Google/iCloud
- Edukasi penggunaan fitur keamanan dasar

Hubungi kami via WhatsApp untuk konsultasi sebelum ganti HP!
    `,
  },
];
