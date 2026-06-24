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
    const btnCetakThermal = document.getElementById('btn-cetak-thermal');

    if (btnCetakThermal) btnCetakThermal.addEventListener('click', cetakStruk);
    if (inputJumlah) inputJumlah.addEventListener('input', hitungVolume);
    if (inputPembayaran) inputPembayaran.addEventListener('input', hitungKembalian);
    if (btnSimpan) btnSimpan.addEventListener('click', prosesSimpan);
    if (btnKembali) btnKembali.addEventListener('click', kembaliKeInput);
    
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
// =========================================================================
// 7. TOMBOL CETAK STRUK (Jembatan Otomatis Langsung Terbuka ke RawBT)
// =========================================================================
async function cetakStruk() {
    try {
        // Mengambil elemen kertas struk putih murni
        const elemenStruk = document.querySelector('.struk-paper'); 
        if (!elemenStruk) {
            alert("Elemen struk-paper tidak ditemukan!");
            return;
        }
        
        // Memotret area putih .struk-paper menjadi gambar canvas
        const canvas = await html2canvas(elemenStruk, {
            scale: 2, // Agar gambar struk tajam saat dicetak printer thermal
            useCORS: true,
            backgroundColor: "#ffffff"
        });
        
        // Mengubah hasil foto canvas menjadi format teks Base64 DataURL
        const dataGambarBase64 = canvas.toDataURL('image/png');
        
        // Memisahkan header Base64 untuk mengambil teks biner murninya saja
        const dataMurni = dataGambarBase64.split(',')[1];

        // MEMBUAT JEMBATAN INTENT LINK RAWBT
        // Trik ini memaksa Android langsung melempar data gambar ke aplikasi RawBT secara otomatis
        const rawbtIntentUri = `intent:#Intent;` +
            `action=ru.a402d.rawbtprinter.action.PRINT;` +
            `type=image/png;` +
            `S.base64=${encodeURIComponent(dataMurni)};` +
            `end`;

        // Jalankan perintah membuka aplikasi RawBT secara otomatis
        window.location.href = rawbtIntentUri;

    } catch (error) {
        alert("Gagal memproses jembatan cetak gambar RawBT: " + error.message);
    }
}
