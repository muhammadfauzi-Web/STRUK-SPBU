# STRUK-SPBU (Alat Generator Struk Digital)

Aplikasi kasir berbasis web (*web-based tool*) yang dirancang khusus untuk mempermudah perhitungan, pembuatan pratinjau, dan pencetakan struk transaksi bahan bakar minyak (BBM) secara digital. Aplikasi ini dioptimalkan agar terintegrasi langsung dengan perangkat printer thermal portabel melalui perangkat Android.

---

## 👨‍💻 Kreator / Pengembang

* **Muhammad Fauzi** (Developer Utama & Creator)
  * GitHub: [@muhammadfauzi-Web](https://github.com/muhammadfauzi-Web)

---

## 🚀 Fitur Utama

* **Kalkulator Volume Otomatis:** Menghitung volume liter secara *real-time* berdasarkan nominal uang yang diinput oleh kasir.
* **Kalkulator Kembalian Dinamis:** Membantu kasir menghitung uang kembalian konsumen secara otomatis dan akurat.
* **Otomatisasi Waktu:** Mengisi data tanggal dan jam secara otomatis sesuai waktu transaksi berjalan.
* **Sistem Rendering HD:** Mengonversi pratinjau struk menjadi gambar beresolusi tinggi (*scale 3x*) untuk memastikan hasil cetakan teks tajam dan tidak buram.
* **Jembatan Cetak Universal (Web Share API):** Terintegrasi langsung dengan menu berbagi bawaan Android, memungkinkan struk dikirim langsung ke aplikasi printer Bluetooth (seperti RawBT atau Thermer) maupun dibagikan via WhatsApp.

---

## 📱 Cara Penggunaan Aplikasi

### Langkah 1: Input Data Transaksi
1. Buka aplikasi melalui browser Google Chrome di HP Anda.
2. Isi data operasional yang diperlukan:
   * **No. Transaksi**
   * **Shift** & **Pulau/Pompa**
   * **Nama Operator**
   * **Jenis BBM** (Misal: Pertalite)
3. Masukkan nominal uang pada kolom **Jumlah**. Sistem akan otomatis mengisi estimasi **Volume** liter dan kolom **Pembayaran**.
4. Jika konsumen membayar dengan uang pas, biarkan kolom pembayaran tetap. Jika tidak, sesuaikan isi kolom **Pembayaran** untuk melihat nominal kembalian.
5. Lengkapi data **Kilometer** dan **No. Plat** kendaraan jika diperlukan.

### Langkah 2: Membuat Pratinjau Struk
1. Setelah seluruh data input dirasa benar, klik tombol **SIMPAN**.
2. Aplikasi akan menyembunyikan halaman input dan memunculkan halaman **Pratinjau Struk** (berupa tampilan kertas putih murni khas struk SPBU Pertamina).

### Langkah 3: Proses Pencetakan (Cetak Thermal / Bagikan)
1. Pada halaman pratinjau, klik tombol **PRINT**.
2. Menu lembar **"Berbagi" (Share)** bawaan sistem operasi Android akan otomatis muncul dari bawah layar.
3. **Untuk Mencetak ke Kertas:** Pilih ikon aplikasi printer thermal yang Anda gunakan (seperti *RawBT*, *Cetak*, atau *Thermer*). Aplikasi printer akan terbuka dan Anda bisa langsung menekan aksi cetak pada aplikasi tersebut.
4. **Untuk Mengirim Digital:** Anda juga bisa memilih ikon *WhatsApp* untuk mengirimkan gambar struk HD tersebut langsung ke nomor pelanggan.
5. Jika ingin mengubah data transaksi kembali, cukup klik tombol **KEMBALI** untuk menuju ke halaman input awal.

---

## 🛠️ Informasi Teknis Pengembangan

Aplikasi ini dibangun menggunakan arsitektur web standar tanpa *framework* berat untuk menjaga performa kecepatan di HP berspesifikasi rendah:
* **HTML5** - Struktur form input dan tata letak kertas struk.
* **CSS3** - Manajemen desain antarmuka, mode responsif HP, dan utilitas penyembunyian halaman (`.hidden`).
* **JavaScript (Vanilla)** - Logika kalkulasi matematika, manipulasi DOM, dan otomatisasi waktu objek `Date()`.
* **html2canvas (v1.4.1)** - Pustaka eksternal yang digunakan untuk memotret komponen HTML struk menjadi berkas biner gambar mentah (*Blob PNG*).

---

## ⚠️ Catatan Penting Pengujian
Agar fitur tombol **PRINT** dapat berjalan dengan lancar tanpa kendala pemblokiran keamanan sistem, **pastikan website dibuka menggunakan aplikasi Google Chrome resmi**, bukan melalui browser internal/WebView bawaan aplikasi editor teks.
