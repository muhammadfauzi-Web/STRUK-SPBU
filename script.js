let kailPrinter = null;

const HARGA_PERTALITE = 10000;
const HARGA_PERTAMAX = 16250;
const HARGA_NON_SUBSIDI_PERTALITE = 18040;
const SUBSIDI_PEMERINTAH_PERTALITE = 8040;

document.addEventListener("DOMContentLoaded", () => {
    const inputJumlah = document.getElementById('jumlah');
    const inputPembayaran = document.getElementById('pembayaran');
    const btnSimpan = document.getElementById('btn-simpan');
    const btnKembali = document.getElementById('btn-kembali');
    const inputJenisBBM = document.getElementById('jenis_bbm');
    
    if (inputJenisBBM) inputJenisBBM.addEventListener('change', hitungVolume);
    if (inputJumlah) inputJumlah.addEventListener('input', hitungVolume);
    if (inputPembayaran) inputPembayaran.addEventListener('input', hitungKembalian);
    if (btnSimpan) btnSimpan.addEventListener('click', prosesSimpan);
    if (btnKembali) btnKembali.addEventListener('click', kembaliKeInput);
    
    const inputWaktu = document.getElementById('waktu');
    if (inputWaktu) {
        const sekarang = new Date();
        const tahun = sekarang.getFullYear();
        const bulan = String(sekarang.getMonth() + 1).padStart(2, '0');
        const hari = String(sekarang.getDate()).padStart(2, '0');
        const jam = String(sekarang.getHours()).padStart(2, '0');
        const menit = String(sekarang.getMinutes()).padStart(2, '0');
        const detik = String(sekarang.getSeconds()).padStart(2, '0');
        inputWaktu.value = `${tahun}-${bulan}-${hari}T${jam}:${menit}:${detik}`;
    }
});

function getHargaAktif() {
    const jenis = document.getElementById('jenis_bbm');
    const val = jenis ? jenis.value.toUpperCase() : "PERTALITE";
    return val.includes("PERTAMAX") ? HARGA_PERTAMAX : HARGA_PERTALITE;
}

function hitungVolume() {
    const jumlah = document.getElementById('jumlah').value;
    const volumeField = document.getElementById('volume');
    const pembayaranField = document.getElementById('pembayaran');
    const hargaAktif = getHargaAktif();
    
    if (jumlah) {
        volumeField.value = (parseFloat(jumlah) / hargaAktif).toFixed(2);
        if (pembayaranField) pembayaranField.value = jumlah; 
    } else {
        if (volumeField) volumeField.value = "";
        if (pembayaranField) pembayaranField.value = "";
    }
    hitungKembalian(); 
}

function hitungKembalian() {
    const jumlah = parseInt(document.getElementById('jumlah').value || 0);
    const pembayaran = parseInt(document.getElementById('pembayaran').value || 0);
    const teksKembalian = document.querySelector('.kembalian-text');
    
    if (teksKembalian) {
        if (pembayaran >= jumlah && jumlah > 0) {
            const kembalian = pembayaran - jumlah;
            teksKembalian.innerText = `Kembalian = ${kembalian.toLocaleString('en-US')}`;
        } else {
            teksKembalian.innerText = "Kembalian = 0";
        }
    }
}

function dapatkanFormatWaktu() {
    const waktuRaw = document.getElementById('waktu').value;
    if (!waktuRaw) return "-";
    try {
        const tanggalObjek = new Date(waktuRaw);
        
        const hari = String(tanggalObjek.getDate()).padStart(2, '0');
        const bulan = String(tanggalObjek.getMonth() + 1).padStart(2, '0');
        const tahun = tanggalObjek.getFullYear();
        
        const jam = String(tanggalObjek.getHours()).padStart(2, '0');
        const menit = String(tanggalObjek.getMinutes()).padStart(2, '0');

        let detik = tanggalObjek.getSeconds();
        
        if (detik === 0) {
            detik = new Date().getSeconds();
        }
        
        const detikFormat = String(detik).padStart(2, '0');
        
        return `${hari}/${bulan}/${tahun} ${jam}:${menit}:${detikFormat}`;
    } catch (e) {
        return waktuRaw;
    }
}



function prosesSimpan() {
    const no_trans_raw = document.getElementById('no_trans').value || "-";
    const shift = document.getElementById('shift').value;
    const pompa = document.getElementById('pompa').value;
    const operator = (document.getElementById('operator').value || "-").toUpperCase();
    const jenisBbmEl = document.getElementById('jenis_bbm');
    const jenis_bbm = (jenisBbmEl ? jenisBbmEl.value : "PERTALITE").toUpperCase();
    
    const vol_raw = parseFloat(document.getElementById('volume').value || 0);
    const jumlah_raw = parseInt(document.getElementById('jumlah').value || 0);
    const pembayaran_raw = parseInt(document.getElementById('pembayaran').value || 0);
    const km_raw = document.getElementById('kilometer').value || "-";
    const no_plat = document.getElementById('no_plat').value || "-";

    const volume_format = Number.isInteger(vol_raw) ? vol_raw.toString() : vol_raw.toFixed(2).replace('.', ',');
    const no_trans = no_trans_raw !== "-" ? no_trans_raw.padStart(2, '0') : "-";
    
    const dibayar = jumlah_raw.toLocaleString('en-US');
    const cash = pembayaran_raw.toLocaleString('en-US');
    const hitung_change = pembayaran_raw - jumlah_raw;
    const change = hitung_change > 0 ? hitung_change.toLocaleString('en-US') : "0";
    const waktu_format = dapatkanFormatWaktu();

    if(document.getElementById('out-notrans')) document.getElementById('out-notrans').innerText = no_trans;
    if(document.getElementById('out-shift')) document.getElementById('out-shift').innerText = shift;
    if(document.getElementById('out-waktu')) document.getElementById('out-waktu').innerText = waktu_format;

    const divPertalite = document.getElementById('layout-pertalite');
    const divPertamax = document.getElementById('layout-pertamax');

    if (jenis_bbm.includes("PERTAMAX")) {
        if(divPertalite) divPertalite.style.display = 'none';
        if(divPertamax) divPertamax.style.display = 'block';
        
        if(document.getElementById('out-pompa-pmx')) document.getElementById('out-pompa-pmx').innerText = ": " + pompa;
        if(document.getElementById('out-volume-pmx')) document.getElementById('out-volume-pmx').innerText = ": (L) " + volume_format;
        if(document.getElementById('out-total-pmx')) document.getElementById('out-total-pmx').innerText = ": " + dibayar;
        if(document.getElementById('out-operator-pmx')) document.getElementById('out-operator-pmx').innerText = ": " + operator;
        if(document.getElementById('out-cash-pmx')) document.getElementById('out-cash-pmx').innerText = cash;
        if(document.getElementById('out-odometer-pmx')) document.getElementById('out-odometer-pmx').innerText = ": " + km_raw;
        if(document.getElementById('out-plat-pmx')) document.getElementById('out-plat-pmx').innerText = ": " + no_plat.toUpperCase();
        
    } else {
        if(divPertalite) divPertalite.style.display = 'block';
        if(divPertamax) divPertamax.style.display = 'none';
   
        if(document.getElementById('out-pompa')) document.getElementById('out-pompa').innerText = ": " + pompa;
        if(document.getElementById('out-operator')) document.getElementById('out-operator').innerText = ": " + operator;
        if(document.getElementById('out-bbm')) document.getElementById('out-bbm').innerText = ": " + jenis_bbm;
        if(document.getElementById('out-volume')) document.getElementById('out-volume').innerText = ": " + volume_format + " liter";
        if(document.getElementById('out-dibayar')) document.getElementById('out-dibayar').innerText = " " + dibayar;
        if(document.getElementById('out-cash')) document.getElementById('out-cash').innerText = "" + cash;
        if(document.getElementById('out-change')) document.getElementById('out-change').innerText = "" + change;
        if(document.getElementById('out-kilometer')) document.getElementById('out-kilometer').innerText = ": " + km_raw;
        if(document.getElementById('out-plat')) document.getElementById('out-plat').innerText = ": " + no_plat.toUpperCase();
        
        const t_subsidi = Math.round(vol_raw * HARGA_NON_SUBSIDI_PERTALITE).toLocaleString('en-US');
        const p_subsidi = Math.round(vol_raw * SUBSIDI_PEMERINTAH_PERTALITE).toLocaleString('en-US');
        
        if(document.getElementById('out-tanpasubsidi')) document.getElementById('out-tanpasubsidi').innerText = " " + t_subsidi;
        if(document.getElementById('out-totalsubsidi')) document.getElementById('out-totalsubsidi').innerText = " " + p_subsidi;
        if(document.getElementById('out-teks-subsiditotal')) document.getElementById('out-teks-subsiditotal').innerText = p_subsidi;
    }
    
    document.getElementById('halaman-input').classList.add('hidden');
    document.getElementById('halaman-print').classList.remove('hidden');
    window.scrollTo(0, 0);
}

function kembaliKeInput() {
    document.getElementById('halaman-print').classList.add('hidden');
    document.getElementById('halaman-input').classList.remove('hidden');
}

async function cetakStruk() {
    try {
        if (typeof html2canvas === 'undefined') {
            alert("Error: Pustaka html2canvas belum dimuat di HTML!");
            return;
        }

        const elemenStruk = document.querySelector('.struk-paper'); 
        if (!elemenStruk) return alert("Error: Area struk tidak ditemukan!");
        
        const canvas = await html2canvas(elemenStruk, {
            scale: 3, 
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false
        });
        
        canvas.toBlob(async (blob) => {
            const fileGambar = new File([blob], "Struk_SPBU.png", { type: "image/png" });
            const dataShare = { title: 'Cetak Struk SPBU', files: [fileGambar] };

            if (navigator.canShare && navigator.canShare(dataShare)) {
                try { 
                    await navigator.share(dataShare); 
                } catch (shareError) { 
                    console.log("Membatalkan share atau gagal:", shareError); 
                }
            } else {
                const urlGambar = URL.createObjectURL(blob);
                const linkUnduh = document.createElement('a');
                linkUnduh.href = urlGambar;
                linkUnduh.download = "Struk_SPBU.png";
                
                document.body.appendChild(linkUnduh);
                linkUnduh.click();
                document.body.removeChild(linkUnduh);
                
                URL.revokeObjectURL(urlGambar);
                alert("Berhasil! Gambar struk telah diunduh ke HP Anda. Silakan buka galeri dan cetak dari sana untuk hasil yang bersih.");
            }
        }, 'image/png');

    } catch (error) {
        alert("Kegagalan sistem cetak: " + error.message);
    }
}
