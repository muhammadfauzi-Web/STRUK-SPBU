let kailPrinter = null;
const HARGA_JUAL = 10000;
const HARGA_NON_SUBSIDI = 18040;
const SUBSIDI_PEMERINTAH = 8040;

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
    
    const t_subsidi = Math.round(vol_raw * HARGA_NON_SUBSIDI).toLocaleString('id-ID');
    const p_subsidi = Math.round(vol_raw * SUBSIDI_PEMERINTAH).toLocaleString('id-ID');
    
    const dibayar = jumlah_raw.toLocaleString('id-ID');
    const cash = pembayaran_raw.toLocaleString('id-ID');
    
    const hitung_change = pembayaran_raw - jumlah_raw;
    const change = hitung_change > 0 ? hitung_change.toLocaleString('id-ID') : "0";
    
    const waktu_format = dapatkanFormatWaktu();

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
        if (!elemenStruk) {
            alert("Error: Area struk tidak ditemukan!");
            return;
        }
        
        const canvas = await html2canvas(elemenStruk, {
            scale: 2, 
            useCORS: true,
            backgroundColor: "#ffffff"
        });
        
        canvas.toBlob(async (blob) => {
            const fileGambar = new File([blob], "struk-spbu.png", { type: "image/png" });
            const dataShare = {
                title: 'Cetak Struk SPBU',
                files: [fileGambar]
            };

            if (navigator.canShare && navigator.canShare(dataShare)) {
                try {
                    await navigator.share(dataShare);
                    console.log("Berhasil mengirim gambar ke aplikasi Bluetooth.");
                } catch (shareError) {
                    console.log("User membatalkan share atau terjadi kendala: ", shareError);
                }
            } else {
                console.log("Web Share API tidak didukung, menggunakan jalur Intent RawBT...");
                const dataGambarBase64 = canvas.toDataURL('image/png');
                const dataMurni = dataGambarBase64.split(',')[1];
                
                const rawbtIntentUri = `intent:#Intent;` +
                    `action=ru.a402d.rawbtprinter.action.PRINT;` +
                    `type=image/png;` +
                    `S.base64=${encodeURIComponent(dataMurni)};` +
                    `end`;

                window.location.href = rawbtIntentUri;
            }
        }, 'image/png');

    } catch (error) {
        alert("Terjadi kegagalan sistem cetak: " + error.message);
    }
}
