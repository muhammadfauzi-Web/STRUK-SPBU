// Konfigurasi Parameter SPBU
let kailPrinter = null;
const HARGA_JUAL = 10000;
const HARGA_NON_SUBSIDI = 18040;
const SUBSIDI_PEMERINTAH = 8040;

// 1. Inisialisasi Utama Saat Aplikasi Dibuka
document.addEventListener("DOMContentLoaded", () => {
    const inputJumlah = document.getElementById('jumlah');
    const inputPembayaran = document.getElementById('pembayaran');
    const btnSimpan = document.getElementById('btn-simpan');
    const btnKembali = document.getElementById('btn-kembali');
    const btnBluetooth = document.getElementById('btn-bt');
    const btnCetakThermal = document.getElementById('btn-cetak-thermal');

    if (inputJumlah) inputJumlah.addEventListener('input', hitungVolume);
    if (inputPembayaran) inputPembayaran.addEventListener('input', hitungKembalian);
    
    if (btnSimpan) btnSimpan.addEventListener('click', prosesSimpan);
    if (btnKembali) btnKembali.addEventListener('click', kembaliKeInput);
    if (btnBluetooth) btnBluetooth.addEventListener('click', hubungkanBluetooth);
    if (btnCetakThermal) btnCetakThermal.addEventListener('click', cetakStruk);

    // Otomatisasi Mengisi Tanggal & Jam Sekarang (Bisa Diedit)
    const inputWaktu = document.getElementById('waktu');
    if (inputWaktu) {
        const sekarang = new Date();
        const tahun = sekarang.getFullYear();
        const bulan = String(sekarang.getMonth() + 1).padStart(2, '0');
        const hari = String(sekarang.getDate()).padStart(2, '0');
        const jam = String(sekarang.getHours()).padStart(2, '0');
        const menit = String(sekarang.getMinutes()).padStart(2, '0');
        
        inputWaktu.value = `${tahun}-${bulan}-${hari}T${jam}:${menit}`;
    }
});

// 2. Fungsi Hitung Volume Otomatis & Set Awal Pembayaran
function hitungVolume() {
    const jumlah = document.getElementById('jumlah').value;
    const volumeField = document.getElementById('volume');
    const pembayaranField = document.getElementById('pembayaran');
    
    if (jumlah) {
        if (volumeField) volumeField.value = (parseFloat(jumlah) / HARGA_JUAL).toFixed(2);
        if (pembayaranField) pembayaranField.value = jumlah; 
    } else {
        if (volumeField) volumeField.value = "";
        if (pembayaranField) pembayaranField.value = "";
    }
    hitungKembalian(); 
}

// Fungsi Kalkulasi Kembalian Dinamis
function hitungKembalian() {
    const jumlah = parseInt(document.getElementById('jumlah').value || 0);
    const pembayaran = parseInt(document.getElementById('pembayaran').value || 0);
    const teksKembalian = document.querySelector('.kembalian-text');
    
    if (teksKembalian) {
        if (pembayaran >= jumlah && jumlah > 0) {
            const kembalian = pembayaran - jumlah;
            teksKembalian.innerText = `Kembalian = ${kembalian.toLocaleString('id-ID')}`;
        } else {
            teksKembalian.innerText = "Kembalian = 0";
        }
    }
}

// 3. Fungsi Format Tanggal agar Ramah Tampilan Kasir
function dapatkanFormatWaktu() {
    const waktuRaw = document.getElementById('waktu').value;
    if (!waktuRaw) return "-";
    try {
        const t = waktuRaw.split("T");
        const tgl = t[0].split("-");
        return `${tgl[2]}/${tgl[1]}/${tgl[0]} ${t[1]}`;
    } catch (e) {
        return waktuRaw;
    }
}

// 4. Tombol SIMPAN (Membuat Pratinjau Struk di Layar HP)
function prosesSimpan() {
    const no_trans = document.getElementById('no_trans').value || "-";
    const shift = document.getElementById('shift').value;
    const pompa = document.getElementById('pompa').value;
    const operator = (document.getElementById('operator').value || "-").toUpperCase();
    const jenis_bbm = document.getElementById('jenis_bbm').value;
    const vol_raw = parseFloat(document.getElementById('volume').value || 0);
    const jumlah_raw = parseInt(document.getElementById('jumlah').value || 0);
    const pembayaran_raw = parseInt(document.getElementById('pembayaran').value || 0);
    
    const km_raw = document.getElementById('kilometer').value || "-";
    const no_plat = document.getElementById('no_plat').value || "-";

    const volume_format = vol_raw.toFixed(2).replace('.', ',');
    
    // PERBAIKAN: Menggunakan Math.round() untuk membulatkan nominal rupiah tanpa desimal koma
    const t_subsidi = Math.round(vol_raw * HARGA_NON_SUBSIDI).toLocaleString('id-ID');
    const p_subsidi = Math.round(vol_raw * SUBSIDI_PEMERINTAH).toLocaleString('id-ID');
    
    const dibayar = jumlah_raw.toLocaleString('id-ID');
    const cash = pembayaran_raw.toLocaleString('id-ID');
    
    const hitung_change = pembayaran_raw - jumlah_raw;
    const change = hitung_change > 0 ? hitung_change.toLocaleString('id-ID') : "0";
    
    const waktu_format = dapatkanFormatWaktu();

    // Kirim Teks data ke Elemen HTML Struk Layar
    if(document.getElementById('out-notrans')) document.getElementById('out-notrans').innerText = no_trans;
    if(document.getElementById('out-shift')) document.getElementById('out-shift').innerText = shift;
    if(document.getElementById('out-waktu')) document.getElementById('out-waktu').innerText = waktu_format;
    if(document.getElementById('out-pompa')) document.getElementById('out-pompa').innerText = ": " + pompa;
    if(document.getElementById('out-operator')) document.getElementById('out-operator').innerText = ": " + operator;
    if(document.getElementById('out-bbm')) document.getElementById('out-bbm').innerText = ": " + jenis_bbm;
    if(document.getElementById('out-volume')) document.getElementById('out-volume').innerText = ": " + volume_format + " liter";
    if(document.getElementById('out-tanpasubsidi')) document.getElementById('out-tanpasubsidi').innerText = ": " + t_subsidi;
    if(document.getElementById('out-totalsubsidi')) document.getElementById('out-totalsubsidi').innerText = ": " + p_subsidi;
    if(document.getElementById('out-dibayar')) document.getElementById('out-dibayar').innerText = ": " + dibayar;
    
    if(document.getElementById('out-cash')) document.getElementById('out-cash').innerText = cash;
    if(document.getElementById('out-change')) document.getElementById('out-change').innerText = change;
    
    if(document.getElementById('out-kilometer')) document.getElementById('out-kilometer').innerText = ": " + km_raw;
    if(document.getElementById('out-plat')) document.getElementById('out-plat').innerText = ": " + no_plat.toUpperCase();

    if(document.getElementById('out-teks-subsiditotal')) document.getElementById('out-teks-subsiditotal').innerText = p_subsidi;

    document.getElementById('halaman-input').classList.add('hidden');
    document.getElementById('halaman-print').classList.remove('hidden');
    window.scrollTo(0, 0);
}

// 5. Tombol KEMBALI
function kembaliKeInput() {
    document.getElementById('halaman-print').classList.add('hidden');
    document.getElementById('halaman-input').classList.remove('hidden');
}

// 6. Mengaktifkan Fitur Web Bluetooth
// Fungsi untuk memindai semua perangkat Bluetooth
async function hubungkanBluetooth() {
    try {
        // Mengubah filter agar menampilkan semua perangkat Bluetooth tanpa batasan
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            // Memasukkan UUID printer Anda sebelumnya ke optionalServices agar tetap diizinkan mengirim data cetak
            optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb']
        });
        
        const server = await device.gatt.connect();
        
        // Tetap menggunakan UUID printer Anda untuk mengambil service cetak data
        const service = await server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
        const characteristics = await service.getCharacteristics();
        kailPrinter = characteristics[0];
        
        // Mengubah tampilan tombol lama Anda saat berhasil terhubung
        const btn = document.getElementById('btn-bt');
        if (btn) {
            btn.innerText = "✅ PRINTER TERHUBUNG";
            btn.style.backgroundColor = "#2e7d32";
        }
    } catch (error) {
        alert("Koneksi Bluetooth Gagal: " + error);
    }
}

// Mengikat tombol printer agar menjalankan fungsi cetak saat diklik
document.getElementById('btn-cetak-thermal').addEventListener('click', function() {
    // Panggil nama fungsi cetak struk Anda di sini, contoh:
    cetakStruk(); 
});

async function cetakStruk() {
    if (!kailPrinter) {
        alert("Printer belum terhubung! Klik Hubungkan Bluetooth terlebih dahulu.");
        return;
    }

    try {
        // Mengambil container halaman cetak kertas putih
        const elemenStruk = document.getElementById('halaman-print'); 
        if (!elemenStruk) {
            alert("Elemen halaman cetak tidak ditemukan!");
            return;
        }
        
        // Memotret elemen HTML/CSS menjadi gambar canvas murni
        const canvas = await html2canvas(elemenStruk, {
            scale: 1, 
            useCORS: true,
            backgroundColor: "#ffffff"
        });
        
        const ctx = canvas.getContext('2d');
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        const width = canvas.width;
        const height = canvas.height;
        const rasterWidth = Math.ceil(width / 8);
        
        // Alokasi memori biner printer (ESC/POS bit image mode)
        const bytes = new Uint8Array(8 + rasterWidth * height);
        
        // Perintah inisialisasi mesin printer POS grafis (GS v 0)
        bytes[0] = 0x1D; bytes[1] = 0x76; bytes[2] = 0x30; bytes[3] = 0;
        bytes[4] = rasterWidth & 0xFF; bytes[5] = (rasterWidth >> 8) & 0xFF;
        bytes[6] = height & 0xFF; bytes[7] = (height >> 8) & 0xFF;
        
        let pos = 8;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < rasterWidth; x++) {
                let byte = 0;
                for (let bit = 0; bit < 8; bit++) {
                    const idxX = x * 8 + bit;
                    if (idxX < width) {
                        const idx = (y * width + idxX) * 4;
                        const r = imgData.data[idx];
                        const g = imgData.data[idx + 1];
                        const b = imgData.data[idx + 2];
                        
                        // Menghitung tingkat kegelapan piksel
                        const brightness = (r + g + b) / 3;
                        if (brightness < 128) {
                            byte |= (1 << (7 - bit)); // Menandai sebagai titik hitam di kertas
                        }
                    }
                }
                bytes[pos++] = byte;
            }
        }
        
        // Kirim data potret gambar utuh langsung tanpa dicicil
        await kailPrinter.writeValueWithoutResponse(bytes);
        
        // Berikan perintah dorong kertas otomatis 4 baris agar melewati pisau potong
        const potongKertas = new Uint8Array([0x1B, 0x64, 0x04]);
        await kailPrinter.writeValueWithoutResponse(potongKertas);
        
        alert("Struk Gambar Berhasil Dicetak Sempurna!");
        
    } catch (error) {
        alert("Gagal memproses potret cetak gambar: " + error.message);
    }
}

