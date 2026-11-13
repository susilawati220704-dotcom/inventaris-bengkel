/**
 * SISTEM INVENTARIS & PEMINJAMAN BARANG LABORATORIUM RPL
 * SMK NEGERI 1 BERINGIN
 * File: script.js
 */

// Kunci LocalStorage (digunakan saat offline/mode standalone)
const STORAGE_BARANG = 'smkn1_rpl_barang';
const STORAGE_PINJAM = 'smkn1_rpl_peminjaman';

// Status koneksi database backend MySQL
let isBackendConnected = false;

// Sample Data Awal Laboratorium RPL
const defaultDataBarang = [
    {
        id: 1,
        kode: "RPL-TAB-01",
        nama: "Drawing Tablet Huion Inspiroy H640P",
        kategori: "Desain & Multimedia",
        totalStok: 10,
        kondisi: "Baik",
        lokasi: "Lemari A - Rak 1 (Multimedia)",
        spesifikasi: "8192 Levels Pen Pressure, Battery-free Stylus, Desain UI/UX & Animasi"
    },
    {
        id: 2,
        kode: "RPL-VRH-01",
        nama: "VR Headset Oculus Quest 2 128GB",
        kategori: "Desain & Multimedia",
        totalStok: 2,
        kondisi: "Baik",
        lokasi: "Lemari Khusus Lab RPL",
        spesifikasi: "All-in-One VR System, Dual Controller, Praktik Pemrograman Game / Virtual Reality"
    },
    {
        id: 3,
        kode: "RPL-IOT-01",
        nama: "Microcontroller ESP32 NodeMCU IoT Starter Kit",
        kategori: "Perangkat IoT & Embedded",
        totalStok: 15,
        kondisi: "Baik",
        lokasi: "Box Komponen IoT Meja 1",
        spesifikasi: "Wi-Fi & Bluetooth SoC, Breadboard, Sensor DHT11, Modul Relay 4-Ch & Jumper"
    },
    {
        id: 4,
        kode: "RPL-LPT-01",
        nama: "Laptop Lenovo ThinkPad L14 Core i5",
        kategori: "Komputer & Laptop Lab",
        totalStok: 6,
        kondisi: "Baik",
        lokasi: "Lemari Laptop Lab RPL",
        spesifikasi: "Intel Core i5 Gen 11, RAM 16GB, SSD 512GB, Dual Boot Linux Ubuntu & Windows 11"
    },
    {
        id: 5,
        kode: "RPL-MON-01",
        nama: "Monitor LED LG 24MP400 IPS 24 Inch",
        kategori: "Periferal & Aksesoris",
        totalStok: 8,
        kondisi: "Baik",
        lokasi: "Meja Praktik Coding A & B",
        spesifikasi: "Full HD 1080p, 75Hz, HDMI & VGA, untuk Dual-Screen Coding & Debugging"
    },
    {
        id: 6,
        kode: "RPL-SWT-01",
        nama: "Switch Gigabit D-Link 24-Port DGS-1024D",
        kategori: "Jaringan & Server Lab",
        totalStok: 3,
        kondisi: "Baik",
        lokasi: "Rack Server Lab RPL",
        spesifikasi: "24-Port 10/100/1000Mbps Gigabit Unmanaged Switch untuk Jaringan Lab"
    },
    {
        id: 7,
        kode: "RPL-HDD-01",
        nama: "Harddisk Eksternal Seagate One Touch 2TB",
        kategori: "Media Penyimpanan",
        totalStok: 4,
        kondisi: "Baik",
        lokasi: "Brankas Data Lab RPL",
        spesifikasi: "USB 3.0, Enkripsi Hardware, Backup Master Repository Git dan VM Praktik"
    },
    {
        id: 8,
        kode: "RPL-ARD-01",
        nama: "Arduino Uno R3 Ultimate Starter Kit Sensor",
        kategori: "Perangkat IoT & Embedded",
        totalStok: 12,
        kondisi: "Baik",
        lokasi: "Box Komponen IoT Meja 2",
        spesifikasi: "Board ATmega328P, Modul RFID, Ultrasonic Sensor HC-SR04, Servo SG90, LCD 16x2"
    },
    {
        id: 9,
        kode: "RPL-TLS-01",
        nama: "Toolkit Crimping RJ45 & Cable Tester Digital",
        kategori: "Periferal & Aksesoris",
        totalStok: 8,
        kondisi: "Baik",
        lokasi: "Toolbox Jaringan Lab RPL",
        spesifikasi: "Modular Crimper Cat5e/Cat6, Wire Stripper, Digital Cable Tester RJ45/RJ11"
    },
    {
        id: 10,
        kode: "RPL-PRJ-01",
        nama: "Proyektor Epson EB-E500 3300 Lumens HDMI",
        kategori: "Desain & Multimedia",
        totalStok: 2,
        kondisi: "Baik",
        lokasi: "Ruang Presentasi Lab RPL",
        spesifikasi: "3LCD Technology, Input HDMI & VGA, Presentasi Proyek & Sidang UKK RPL"
    }
];

// Helper format tanggal YYYY-MM-DD
function getTodayString(offsetDays = 0) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const defaultDataPeminjaman = [
    {
        id: "PJ-20261112-001",
        idPeminjam: "220101",
        namaPeminjam: "Muhammad Rizky",
        kelas: "XII RPL 1",
        kontak: "081234567890",
        idBarang: 1,
        namaBarang: "Drawing Tablet Huion Inspiroy H640P",
        jumlah: 1,
        tglPinjam: getTodayString(-1),
        tglKembaliRencana: getTodayString(1),
        tglKembaliAktual: null,
        keperluan: "Praktik Pembuatan Mockup UI/UX Aplikasi E-Commerce UKK",
        status: "Dipinjam",
        kondisiKembali: "-",
        catatanKembali: ""
    },
    {
        id: "PJ-20261113-002",
        idPeminjam: "220145",
        namaPeminjam: "Siti Aisyah",
        kelas: "XII RPL 2",
        kontak: "082198765432",
        idBarang: 3,
        namaBarang: "Microcontroller ESP32 NodeMCU IoT Starter Kit",
        jumlah: 2,
        tglPinjam: getTodayString(0),
        tglKembaliRencana: getTodayString(2),
        tglKembaliAktual: null,
        keperluan: "Praktik Pemrograman Smart Home IoT berbasis ESP32 & MQTT",
        status: "Dipinjam",
        kondisiKembali: "-",
        catatanKembali: ""
    },
    {
        id: "PJ-20261109-001",
        idPeminjam: "GURU-RPL-02",
        namaPeminjam: "Pak Bayu Setiawan, S.Kom",
        kelas: "Guru Produktif RPL",
        kontak: "085211223344",
        idBarang: 10,
        namaBarang: "Proyektor Epson EB-E500 3300 Lumens HDMI",
        jumlah: 1,
        tglPinjam: getTodayString(-4),
        tglKembaliRencana: getTodayString(-2),
        tglKembaliAktual: getTodayString(-2),
        keperluan: "Presentasi Project Showcase Web Programming Kelas XI RPL",
        status: "Dikembalikan",
        kondisiKembali: "Baik",
        catatanKembali: "Kabel power, remote, dan tas proyektor lengkap"
    }
];

// =================== LOGIKA PENYIMPANAN ===================
function getBarang() {
    const data = localStorage.getItem(STORAGE_BARANG);
    if (!data) {
        localStorage.setItem(STORAGE_BARANG, JSON.stringify(defaultDataBarang));
        return defaultDataBarang;
    }
    return JSON.parse(data);
}

function saveBarang(data) {
    localStorage.setItem(STORAGE_BARANG, JSON.stringify(data));
}

function getPeminjaman() {
    const data = localStorage.getItem(STORAGE_PINJAM);
    if (!data) {
        localStorage.setItem(STORAGE_PINJAM, JSON.stringify(defaultDataPeminjaman));
        return defaultDataPeminjaman;
    }
    return JSON.parse(data);
}

function savePeminjaman(data) {
    localStorage.setItem(STORAGE_PINJAM, JSON.stringify(data));
}

// Menghitung sisa stok barang tersedia
function hitungStokTersedia(idBarang, barangList = null, pinjamList = null) {
    if (!barangList) barangList = getBarang();
    if (!pinjamList) pinjamList = getPeminjaman();

    const barang = barangList.find(b => String(b.id) === String(idBarang));
    if (!barang) return 0;

    const dipinjam = pinjamList
        .filter(p => String(p.idBarang) === String(idBarang) && p.status === 'Dipinjam')
        .reduce((sum, p) => sum + parseInt(p.jumlah), 0);

    return Math.max(0, parseInt(barang.totalStok) - dipinjam);
}

// =================== CEK KONEKSI MYSQL BACKEND ===================
async function cekKoneksiBackend() {
    const badgeEl = document.getElementById('badgeDbStatus');
    if (!badgeEl) return;

    try {
        const response = await fetch('api.php?action=status');
        const result = await response.json();

        if (result.connected) {
            isBackendConnected = true;
            badgeEl.className = 'badge bg-success text-white px-3 py-2 fw-medium rounded-pill shadow-sm';
            badgeEl.innerHTML = '<i class="bi bi-database-check me-1"></i> MySQL: db_inventaris_rpl (Terkoneksi)';
            
            // Sinkronkan data dari MySQL
            await sinkronDariMySQL();
            return;
        }
    } catch (e) {
        // Berjalan di luar server XAMPP / file:///
    }

    isBackendConnected = false;
    badgeEl.className = 'badge bg-secondary text-white px-3 py-2 fw-medium rounded-pill shadow-sm';
    badgeEl.innerHTML = '<i class="bi bi-hdd-network me-1"></i> Local Storage Mode (XAMPP Offline)';
}

async function sinkronDariMySQL() {
    try {
        const res = await fetch('api.php?action=get_all');
        const data = await res.json();
        if (data.status === 'success') {
            saveBarang(data.barang);
            savePeminjaman(data.peminjaman);
            refreshAllViews();
        }
    } catch (err) {
        console.warn('Gagal sinkron dari MySQL, menggunakan LocalStorage.', err);
    }
}

// =================== INISIALISASI ===================
document.addEventListener('DOMContentLoaded', async () => {
    // Inisialisasi awal
    getBarang();
    getPeminjaman();

    // Set tanggal default
    const inputTglPinjam = document.getElementById('pinjamTglPinjam');
    const inputTglKembali = document.getElementById('pinjamTglKembali');
    if (inputTglPinjam) inputTglPinjam.value = getTodayString(0);
    if (inputTglKembali) inputTglKembali.value = getTodayString(2);

    // Render tampilan
    refreshAllViews();

    // Cek koneksi MySQL backend
    await cekKoneksiBackend();

    // Event listener form barang
    const formBarang = document.getElementById('formBarangModal');
    if (formBarang) {
        formBarang.addEventListener('submit', handleSimpanBarang);
    }

    // Event listener form peminjaman
    const formPinjam = document.getElementById('formPeminjamanBaru');
    if (formPinjam) {
        formPinjam.addEventListener('submit', handleSimpanPeminjaman);
    }

    // Event listener form pengembalian
    const formPengembalian = document.getElementById('formPengembalianModal');
    if (formPengembalian) {
        formPengembalian.addEventListener('submit', handleProsesPengembalian);
    }

    // Event listener dropdown barang form pinjam
    const selectBarang = document.getElementById('pinjamBarangSelect');
    if (selectBarang) {
        selectBarang.addEventListener('change', updateInfoStokPeminjaman);
    }
});

function refreshAllViews() {
    renderDashboard();
    renderTabelBarang();
    renderTabelPeminjamanAktif();
    renderTabelRiwayat();
    populateSelectBarangPeminjaman();
}

// =================== DASHBOARD STATISTIK ===================
function renderDashboard() {
    const barang = getBarang();
    const pinjam = getPeminjaman();

    const totalJenis = barang.length;
    const totalSemuaStok = barang.reduce((acc, b) => acc + parseInt(b.totalStok || 0), 0);
    const aktifPinjam = pinjam.filter(p => p.status === 'Dipinjam');
    const totalUnitDipinjam = aktifPinjam.reduce((acc, p) => acc + parseInt(p.jumlah || 0), 0);
    const totalUnitTersedia = Math.max(0, totalSemuaStok - totalUnitDipinjam);
    const totalSelesai = pinjam.filter(p => p.status === 'Dikembalikan').length;

    const today = getTodayString(0);
    const totalTerlambat = aktifPinjam.filter(p => p.tglKembaliRencana < today).length;

    safeSetText('statTotalBarang', totalJenis);
    safeSetText('statStokTersedia', `${totalUnitTersedia} unit`);
    safeSetText('statSedangDipinjam', `${aktifPinjam.length} transaksi (${totalUnitDipinjam} unit)`);
    safeSetText('statTotalSelesai', `${totalSelesai} transaksi`);

    const elTerlambatBadge = document.getElementById('badgeTerlambatAlert');
    if (elTerlambatBadge) {
        if (totalTerlambat > 0) {
            elTerlambatBadge.classList.remove('d-none');
            elTerlambatBadge.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-1"></i> Perhatian: Terdapat ${totalTerlambat} Peminjaman Alat yang Telah Melewati Batas Waktu Pengembalian!`;
        } else {
            elTerlambatBadge.classList.add('d-none');
        }
    }
}

function safeSetText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

// =================== MODAL & CRUD BARANG ===================
function bukaModalTambahBarang() {
    document.getElementById('modalBarangTitle').textContent = 'Tambah Barang Inventaris Lab RPL';
    document.getElementById('barangEditId').value = '';
    document.getElementById('barangKode').value = 'RPL-' + Math.floor(100 + Math.random() * 900);
    document.getElementById('barangNama').value = '';
    document.getElementById('barangKategori').value = '';
    document.getElementById('barangTotalStok').value = '1';
    document.getElementById('barangKondisi').value = 'Baik';
    document.getElementById('barangLokasi').value = '';
    document.getElementById('barangSpesifikasi').value = '';

    const modal = new bootstrap.Modal(document.getElementById('modalFormBarang'));
    modal.show();
}

function editBarang(id) {
    const barangList = getBarang();
    const item = barangList.find(b => String(b.id) === String(id));
    if (!item) return;

    document.getElementById('modalBarangTitle').textContent = 'Edit Data Barang Lab RPL';
    document.getElementById('barangEditId').value = item.id;
    document.getElementById('barangKode').value = item.kode;
    document.getElementById('barangNama').value = item.nama;
    document.getElementById('barangKategori').value = item.kategori;
    document.getElementById('barangTotalStok').value = item.totalStok;
    document.getElementById('barangKondisi').value = item.kondisi;
    document.getElementById('barangLokasi').value = item.lokasi;
    document.getElementById('barangSpesifikasi').value = item.spesifikasi || '';

    const modal = new bootstrap.Modal(document.getElementById('modalFormBarang'));
    modal.show();
}

async function handleSimpanBarang(e) {
    e.preventDefault();
    const barangList = getBarang();
    const editId = document.getElementById('barangEditId').value;

    const kode = document.getElementById('barangKode').value.trim();
    const nama = document.getElementById('barangNama').value.trim();
    const kategori = document.getElementById('barangKategori').value;
    const totalStok = parseInt(document.getElementById('barangTotalStok').value);
    const kondisi = document.getElementById('barangKondisi').value;
    const lokasi = document.getElementById('barangLokasi').value.trim();
    const spesifikasi = document.getElementById('barangSpesifikasi').value.trim();

    if (editId) {
        const pinjamList = getPeminjaman();
        const sedangDipinjam = pinjamList
            .filter(p => String(p.idBarang) === String(editId) && p.status === 'Dipinjam')
            .reduce((sum, p) => sum + parseInt(p.jumlah), 0);

        if (totalStok < sedangDipinjam) {
            alert(`Gagal! Stok total (${totalStok}) tidak boleh lebih kecil dari jumlah unit yang sedang dipinjam (${sedangDipinjam} unit).`);
            return;
        }

        const index = barangList.findIndex(b => String(b.id) === String(editId));
        if (index !== -1) {
            barangList[index] = {
                ...barangList[index],
                kode,
                nama,
                kategori,
                totalStok,
                kondisi,
                lokasi,
                spesifikasi
            };
        }
        showToast('Sukses', `Data alat "${nama}" berhasil diperbarui!`, 'success');
    } else {
        const newId = barangList.length > 0 ? Math.max(...barangList.map(b => parseInt(b.id) || 0)) + 1 : 1;
        barangList.push({
            id: newId,
            kode,
            nama,
            kategori,
            totalStok,
            kondisi,
            lokasi,
            spesifikasi
        });
        showToast('Sukses', `Alat baru "${nama}" berhasil ditambahkan ke Lab RPL!`, 'success');
    }

    saveBarang(barangList);

    // Jika MySQL terhubung, kirim ke backend
    if (isBackendConnected) {
        try {
            await fetch('api.php?action=save_barang', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ editId, kode, nama, kategori, totalStok, kondisi, lokasi, spesifikasi })
            });
            await sinkronDariMySQL();
        } catch (err) {
            console.error('Error simpan MySQL:', err);
        }
    }

    bootstrap.Modal.getInstance(document.getElementById('modalFormBarang')).hide();
    refreshAllViews();
}

async function konfirmasiHapusBarang(id, nama) {
    const pinjamList = getPeminjaman();
    const sedangDipinjam = pinjamList.some(p => String(p.idBarang) === String(id) && p.status === 'Dipinjam');

    if (sedangDipinjam) {
        alert(`Alat "${nama}" tidak dapat dihapus karena masih ada unit yang SEDANG DIPINJAM! Proses pengembalian terlebih dahulu.`);
        return;
    }

    if (confirm(`Apakah Anda yakin ingin menghapus alat "${nama}" dari inventaris Lab RPL?`)) {
        let barangList = getBarang();
        barangList = barangList.filter(b => String(b.id) !== String(id));
        saveBarang(barangList);

        if (isBackendConnected) {
            try {
                await fetch('api.php?action=delete_barang', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id })
                });
                await sinkronDariMySQL();
            } catch (err) {
                console.error('Error hapus MySQL:', err);
            }
        }

        showToast('Terhapus', `Alat "${nama}" telah dihapus.`, 'warning');
        refreshAllViews();
    }
}

// =================== TABEL BARANG ===================
function renderTabelBarang() {
    const tbody = document.getElementById('tabelBarangBody');
    if (!tbody) return;

    const filterKategori = document.getElementById('filterKategoriBarang')?.value || '';
    const cari = (document.getElementById('cariBarangInput')?.value || '').toLowerCase();

    const barangList = getBarang();
    const pinjamList = getPeminjaman();

    let filtered = barangList.filter(item => {
        const matchKategori = !filterKategori || item.kategori === filterKategori;
        const matchCari = !cari || 
            item.nama.toLowerCase().includes(cari) ||
            item.kode.toLowerCase().includes(cari) ||
            item.lokasi.toLowerCase().includes(cari) ||
            (item.spesifikasi && item.spesifikasi.toLowerCase().includes(cari));
        return matchKategori && matchCari;
    });

    tbody.innerHTML = '';

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="text-center py-4 text-muted"><i class="bi bi-inbox fs-3 d-block mb-2"></i>Tidak ada data alat inventaris yang cocok.</td></tr>`;
        return;
    }

    filtered.forEach((item, index) => {
        const sisa = hitungStokTersedia(item.id, barangList, pinjamList);
        const dipinjam = item.totalStok - sisa;

        let badgeKondisi = 'bg-success';
        if (item.kondisi === 'Rusak Ringan') badgeKondisi = 'bg-warning text-dark';
        if (item.kondisi === 'Rusak Berat') badgeKondisi = 'bg-danger';

        let badgeStok = sisa > 0 ? 'badge-soft-success' : 'badge-soft-danger';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="text-center">${index + 1}</td>
            <td><span class="badge bg-light text-dark border font-monospace">${item.kode}</span></td>
            <td>
                <strong>${item.nama}</strong>
                ${item.spesifikasi ? `<div class="small text-muted"><i class="bi bi-info-circle me-1"></i>${item.spesifikasi}</div>` : ''}
            </td>
            <td><span class="badge badge-soft-primary">${item.kategori}</span></td>
            <td class="text-center">
                <span class="fw-bold">${item.totalStok}</span>
                ${dipinjam > 0 ? `<div class="small text-warning">(${dipinjam} dipinjam)</div>` : ''}
            </td>
            <td class="text-center">
                <span class="badge ${badgeStok} px-2 py-1 fs-6">${sisa}</span>
            </td>
            <td><span class="badge ${badgeKondisi}">${item.kondisi}</span></td>
            <td><i class="bi bi-geo-alt text-danger me-1"></i>${item.lokasi}</td>
            <td class="text-center">
                <div class="btn-group btn-group-sm" role="group">
                    <button class="btn btn-outline-primary" title="Quick Pinjam Alat" onclick="quickPinjamBarang('${item.id}')" ${sisa === 0 ? 'disabled' : ''}>
                        <i class="bi bi-box-arrow-up-right"></i>
                    </button>
                    <button class="btn btn-outline-warning" title="Edit Data" onclick="editBarang('${item.id}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-danger" title="Hapus Data" onclick="konfirmasiHapusBarang('${item.id}', '${escapeQuotes(item.nama)}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function quickPinjamBarang(idBarang) {
    const tabTrigger = document.querySelector('#pills-pinjam-tab');
    if (tabTrigger) {
        const tab = new bootstrap.Tab(tabTrigger);
        tab.show();
    }
    const select = document.getElementById('pinjamBarangSelect');
    if (select) {
        select.value = idBarang;
        updateInfoStokPeminjaman();
    }
}

// =================== FORM PEMINJAMAN ===================
function populateSelectBarangPeminjaman() {
    const select = document.getElementById('pinjamBarangSelect');
    if (!select) return;

    const barangList = getBarang();
    const pinjamList = getPeminjaman();

    const previousValue = select.value;
    select.innerHTML = '<option value="">-- Pilih Alat Lab RPL yang Dipinjam --</option>';

    barangList.forEach(item => {
        const sisa = hitungStokTersedia(item.id, barangList, pinjamList);
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `${item.nama} [${item.kode}] - Tersedia: ${sisa} Unit`;
        if (sisa <= 0) {
            option.disabled = true;
            option.textContent += ' (Stok Habis)';
        }
        select.appendChild(option);
    });

    if (previousValue) select.value = previousValue;
    updateInfoStokPeminjaman();
}

function updateInfoStokPeminjaman() {
    const select = document.getElementById('pinjamBarangSelect');
    const inputJumlah = document.getElementById('pinjamJumlah');
    const badgeInfo = document.getElementById('badgeInfoStokTersedia');

    if (!select || !select.value) {
        if (badgeInfo) badgeInfo.textContent = 'Pilih alat untuk melihat stok tersedia di Lab RPL';
        if (inputJumlah) inputJumlah.max = 1;
        return;
    }

    const sisa = hitungStokTersedia(select.value);
    if (badgeInfo) {
        badgeInfo.innerHTML = `Stok Tersedia di Lab: <strong>${sisa} Unit</strong> (Maksimal pinjam: ${sisa})`;
        badgeInfo.className = sisa > 0 ? 'form-text text-success fw-semibold' : 'form-text text-danger fw-semibold';
    }
    if (inputJumlah) {
        inputJumlah.max = sisa;
        if (parseInt(inputJumlah.value) > sisa) {
            inputJumlah.value = sisa > 0 ? 1 : 0;
        }
    }
}

async function handleSimpanPeminjaman(e) {
    e.preventDefault();

    const idBarang = document.getElementById('pinjamBarangSelect').value;
    if (!idBarang) {
        alert('Silakan pilih alat Lab RPL yang akan dipinjam terlebih dahulu!');
        return;
    }

    const jumlah = parseInt(document.getElementById('pinjamJumlah').value);
    const sisaStok = hitungStokTersedia(idBarang);

    if (jumlah > sisaStok || sisaStok <= 0) {
        alert(`Jumlah pinjam (${jumlah}) melebihi stok yang tersedia (${sisaStok} unit)! Silakan sesuaikan.`);
        return;
    }

    const namaPeminjam = document.getElementById('pinjamNama').value.trim();
    const idPeminjam = document.getElementById('pinjamIdSiswa').value.trim() || '-';
    const kelas = document.getElementById('pinjamKelas').value.trim();
    const kontak = document.getElementById('pinjamKontak').value.trim() || '-';
    const tglPinjam = document.getElementById('pinjamTglPinjam').value;
    const tglKembaliRencana = document.getElementById('pinjamTglKembali').value;
    const keperluan = document.getElementById('pinjamKeperluan').value.trim();

    if (tglKembaliRencana < tglPinjam) {
        alert('Tanggal batas pengembalian tidak boleh lebih awal dari tanggal pinjam!');
        return;
    }

    const barangList = getBarang();
    const targetBarang = barangList.find(b => String(b.id) === String(idBarang));
    const namaBarang = targetBarang ? targetBarang.nama : 'Alat Lab';

    const now = new Date();
    const dateCode = now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0');
    const randomSeq = Math.floor(100 + Math.random() * 900);
    const idTransaksi = `PJ-${dateCode}-${randomSeq}`;

    const newLoan = {
        id: idTransaksi,
        idPeminjam,
        namaPeminjam,
        kelas,
        kontak,
        idBarang: parseInt(idBarang),
        namaBarang,
        jumlah,
        tglPinjam,
        tglKembaliRencana,
        tglKembaliAktual: null,
        keperluan,
        status: "Dipinjam",
        kondisiKembali: "-",
        catatanKembali: ""
    };

    const pinjamList = getPeminjaman();
    pinjamList.unshift(newLoan);
    savePeminjaman(pinjamList);

    // Jika MySQL terhubung, simpan ke database
    if (isBackendConnected) {
        try {
            await fetch('api.php?action=save_pinjam', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idBarang,
                    jumlah,
                    namaPeminjam,
                    idPeminjam,
                    kelas,
                    kontak,
                    tglPinjam,
                    tglKembaliRencana,
                    keperluan
                })
            });
            await sinkronDariMySQL();
        } catch (err) {
            console.error('Error simpan pinjam MySQL:', err);
        }
    }

    // Reset Form
    document.getElementById('formPeminjamanBaru').reset();
    document.getElementById('pinjamTglPinjam').value = getTodayString(0);
    document.getElementById('pinjamTglKembali').value = getTodayString(2);

    showToast('Peminjaman Berhasil', `Transaksi ${idTransaksi} untuk ${namaPeminjam} berhasil dicatat!`, 'success');

    refreshAllViews();

    const tabTrigger = document.querySelector('#pills-aktif-tab');
    if (tabTrigger) {
        const tab = new bootstrap.Tab(tabTrigger);
        tab.show();
    }

    tampilkanBuktiPinjam(newLoan.id);
}

// =================== TABEL PEMINJAMAN AKTIF ===================
function renderTabelPeminjamanAktif() {
    const tbody = document.getElementById('tabelPeminjamanAktifBody');
    if (!tbody) return;

    const cari = (document.getElementById('cariPeminjamanAktifInput')?.value || '').toLowerCase();
    const pinjamList = getPeminjaman();
    const today = getTodayString(0);

    const aktif = pinjamList.filter(p => {
        if (p.status !== 'Dipinjam') return false;
        if (!cari) return true;
        return p.id.toLowerCase().includes(cari) ||
            p.namaPeminjam.toLowerCase().includes(cari) ||
            p.kelas.toLowerCase().includes(cari) ||
            p.namaBarang.toLowerCase().includes(cari);
    });

    tbody.innerHTML = '';

    if (aktif.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-muted"><i class="bi bi-check-circle fs-3 d-block text-success mb-2"></i>Tidak ada peminjaman aktif di Lab RPL. Semua peralatan telah dikembalikan.</td></tr>`;
        return;
    }

    aktif.forEach((item) => {
        const isTerlambat = item.tglKembaliRencana < today;
        const isHariIni = item.tglKembaliRencana === today;

        let badgeStatus = '<span class="badge badge-soft-warning"><i class="bi bi-clock me-1"></i>Dipinjam</span>';
        if (isTerlambat) {
            badgeStatus = '<span class="badge badge-soft-danger"><i class="bi bi-exclamation-triangle-fill me-1"></i>Terlambat!</span>';
        } else if (isHariIni) {
            badgeStatus = '<span class="badge badge-soft-primary"><i class="bi bi-alarm me-1"></i>Batas Hari Ini</span>';
        }

        const tr = document.createElement('tr');
        if (isTerlambat) tr.className = 'table-danger bg-opacity-25';

        tr.innerHTML = `
            <td><strong class="text-primary font-monospace">${item.id}</strong></td>
            <td>
                <div class="fw-bold">${item.namaPeminjam}</div>
                <div class="small text-muted"><i class="bi bi-mortarboard me-1"></i>${item.kelas} ${item.kontak !== '-' ? `| <i class="bi bi-whatsapp me-1"></i>${item.kontak}` : ''}</div>
            </td>
            <td>
                <strong>${item.namaBarang}</strong>
                <div class="small text-muted">${item.keperluan}</div>
            </td>
            <td class="text-center"><span class="badge bg-secondary px-2 py-1 fs-6">${item.jumlah} unit</span></td>
            <td><i class="bi bi-calendar-event me-1 text-muted"></i>${item.tglPinjam}</td>
            <td>
                <span class="${isTerlambat ? 'text-danger fw-bold' : ''}">
                    <i class="bi bi-calendar-check me-1"></i>${item.tglKembaliRencana}
                </span>
            </td>
            <td>${badgeStatus}</td>
            <td class="text-center">
                <div class="btn-group btn-group-sm" role="group">
                    <button class="btn btn-success" title="Proses Pengembalian Alat" onclick="bukaModalPengembalian('${item.id}')">
                        <i class="bi bi-arrow-return-left me-1"></i>Kembalikan
                    </button>
                    <button class="btn btn-outline-secondary" title="Cetak Bukti Pinjam" onclick="tampilkanBuktiPinjam('${item.id}')">
                        <i class="bi bi-printer"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// =================== PENGEMBALIAN BARANG ===================
function bukaModalPengembalian(idTransaksi) {
    const pinjamList = getPeminjaman();
    const trx = pinjamList.find(p => p.id === idTransaksi);
    if (!trx) return;

    document.getElementById('kembaliIdTransaksi').value = trx.id;
    document.getElementById('kembaliNamaPeminjam').textContent = `${trx.namaPeminjam} (${trx.kelas})`;
    document.getElementById('kembaliNamaBarang').textContent = `${trx.namaBarang} - Jumlah: ${trx.jumlah} Unit`;
    document.getElementById('kembaliTglPinjam').textContent = `Tgl Pinjam: ${trx.tglPinjam} | Batas Waktu: ${trx.tglKembaliRencana}`;
    document.getElementById('kembaliTglAktual').value = getTodayString(0);
    document.getElementById('kembaliKondisi').value = 'Baik';
    document.getElementById('kembaliCatatan').value = '';

    const modal = new bootstrap.Modal(document.getElementById('modalPengembalian'));
    modal.show();
}

async function handleProsesPengembalian(e) {
    e.preventDefault();
    const idTransaksi = document.getElementById('kembaliIdTransaksi').value;
    const tglKembaliAktual = document.getElementById('kembaliTglAktual').value;
    const kondisiKembali = document.getElementById('kembaliKondisi').value;
    const catatanKembali = document.getElementById('kembaliCatatan').value.trim();

    let pinjamList = getPeminjaman();
    const index = pinjamList.findIndex(p => p.id === idTransaksi);
    if (index === -1) return;

    pinjamList[index].status = "Dikembalikan";
    pinjamList[index].tglKembaliAktual = tglKembaliAktual;
    pinjamList[index].kondisiKembali = kondisiKembali;
    pinjamList[index].catatanKembali = catatanKembali || 'Dikembalikan dalam kondisi ' + kondisiKembali;

    savePeminjaman(pinjamList);

    if (isBackendConnected) {
        try {
            await fetch('api.php?action=return_pinjam', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idTransaksi,
                    tglAktual: tglKembaliAktual,
                    kondisi: kondisiKembali,
                    catatan: catatanKembali
                })
            });
            await sinkronDariMySQL();
        } catch (err) {
            console.error('Error return MySQL:', err);
        }
    }

    bootstrap.Modal.getInstance(document.getElementById('modalPengembalian')).hide();

    showToast('Pengembalian Selesai', `Alat dari transaksi ${idTransaksi} telah kembali ke Lab RPL!`, 'success');
    refreshAllViews();
}

// =================== TABEL RIWAYAT LENGKAP ===================
function renderTabelRiwayat() {
    const tbody = document.getElementById('tabelRiwayatBody');
    if (!tbody) return;

    const cari = (document.getElementById('cariRiwayatInput')?.value || '').toLowerCase();
    const filterStatus = document.getElementById('filterStatusRiwayat')?.value || '';

    const pinjamList = getPeminjaman();

    let filtered = pinjamList.filter(p => {
        const matchStatus = !filterStatus || p.status === filterStatus;
        const matchCari = !cari ||
            p.id.toLowerCase().includes(cari) ||
            p.namaPeminjam.toLowerCase().includes(cari) ||
            p.kelas.toLowerCase().includes(cari) ||
            p.namaBarang.toLowerCase().includes(cari) ||
            (p.catatanKembali && p.catatanKembali.toLowerCase().includes(cari));
        return matchStatus && matchCari;
    });

    tbody.innerHTML = '';

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="text-center py-4 text-muted"><i class="bi bi-clock-history fs-3 d-block mb-2"></i>Tidak ada data riwayat peminjaman Lab RPL.</td></tr>`;
        return;
    }

    filtered.forEach((item, index) => {
        let badgeStatus = item.status === 'Dikembalikan'
            ? '<span class="badge badge-soft-success"><i class="bi bi-check2-circle me-1"></i>Dikembalikan</span>'
            : '<span class="badge badge-soft-warning"><i class="bi bi-clock me-1"></i>Dipinjam</span>';

        let badgeKondisi = '-';
        if (item.kondisiKembali === 'Baik') badgeKondisi = '<span class="badge bg-success">Baik</span>';
        else if (item.kondisiKembali === 'Rusak Ringan') badgeKondisi = '<span class="badge bg-warning text-dark">Rusak Ringan</span>';
        else if (item.kondisiKembali === 'Rusak Berat') badgeKondisi = '<span class="badge bg-danger">Rusak Berat</span>';
        else if (item.kondisiKembali === 'Hilang') badgeKondisi = '<span class="badge bg-dark">Hilang</span>';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="text-center">${index + 1}</td>
            <td><span class="font-monospace fw-bold text-dark">${item.id}</span></td>
            <td>
                <strong>${item.namaPeminjam}</strong>
                <div class="small text-muted">${item.kelas}</div>
            </td>
            <td>
                ${item.namaBarang}
                <div class="small text-muted">Jml: ${item.jumlah} unit</div>
            </td>
            <td>${item.tglPinjam}</td>
            <td>${item.tglKembaliAktual || item.tglKembaliRencana}</td>
            <td>${badgeStatus}</td>
            <td>${badgeKondisi}</td>
            <td>
                <div class="small text-muted text-truncate" style="max-width: 180px;" title="${item.catatanKembali || item.keperluan}">
                    ${item.catatanKembali || item.keperluan}
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// =================== MODAL CETAK BUKTI PINJAM ===================
function tampilkanBuktiPinjam(idTransaksi) {
    const pinjamList = getPeminjaman();
    const trx = pinjamList.find(p => p.id === idTransaksi);
    if (!trx) return;

    safeSetText('buktiNoTransaksi', trx.id);
    safeSetText('buktiTanggalCetak', getTodayString(0));
    safeSetText('buktiNamaPeminjam', trx.namaPeminjam);
    safeSetText('buktiNisPeminjam', trx.idPeminjam || '-');
    safeSetText('buktiKelasPeminjam', trx.kelas);
    safeSetText('buktiKontakPeminjam', trx.kontak || '-');
    safeSetText('buktiNamaBarang', trx.namaBarang);
    safeSetText('buktiJumlahBarang', `${trx.jumlah} Unit`);
    safeSetText('buktiTglPinjam', trx.tglPinjam);
    safeSetText('buktiTglBatas', trx.tglKembaliRencana);
    safeSetText('buktiKeperluan', trx.keperluan);
    safeSetText('buktiStatus', trx.status);
    safeSetText('buktiTtdPeminjam', `( ${trx.namaPeminjam} )`);

    const modal = new bootstrap.Modal(document.getElementById('modalBuktiPinjam'));
    modal.show();
}

function cetakBuktiSekarang() {
    window.print();
}

// =================== EKSPOR KE CSV / EXCEL ===================
function exportDataPeminjamanCSV() {
    const pinjamList = getPeminjaman();
    if (pinjamList.length === 0) {
        alert('Tidak ada data riwayat untuk diekspor!');
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "No Transaksi,NIS/NIP,Nama Peminjam,Kelas/Instansi,Kontak,Nama Alat Lab RPL,Jumlah,Tgl Pinjam,Batas Kembali,Tgl Kembali Aktual,Status,Kondisi Kembali,Catatan\n";

    pinjamList.forEach(p => {
        const row = [
            `"${p.id}"`,
            `"${p.idPeminjam || '-'}"`,
            `"${p.namaPeminjam}"`,
            `"${p.kelas}"`,
            `"${p.kontak || '-'}"`,
            `"${p.namaBarang}"`,
            p.jumlah,
            `"${p.tglPinjam}"`,
            `"${p.tglKembaliRencana}"`,
            `"${p.tglKembaliAktual || '-'}"`,
            `"${p.status}"`,
            `"${p.kondisiKembali || '-'}"`,
            `"${(p.catatanKembali || p.keperluan || '').replace(/"/g, '""')}"`
        ];
        csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Peminjaman_Lab_RPL_SMKN1_Beringin_${getTodayString(0)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Ekspor Berhasil', 'Laporan Lab RPL berhasil diunduh dalam file CSV.', 'info');
}

// =================== RESET DATA DEMO ===================
function resetKeDataAwal() {
    if (confirm('Kembalikan seluruh data inventaris dan peminjaman ke contoh default Laboratorium RPL SMK N 1 Beringin?')) {
        localStorage.removeItem(STORAGE_BARANG);
        localStorage.removeItem(STORAGE_PINJAM);
        getBarang();
        getPeminjaman();
        refreshAllViews();
        showToast('Reset Selesai', 'Data berhasil dikembalikan ke format awal Laboratorium RPL!', 'info');
    }
}

// =================== TOAST NOTIFIKASI ===================
function showToast(judul, pesan, tipe = 'primary') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        document.body.appendChild(container);
    }

    let bgClass = 'text-bg-primary';
    if (tipe === 'success') bgClass = 'text-bg-success';
    if (tipe === 'warning') bgClass = 'text-bg-warning';
    if (tipe === 'danger') bgClass = 'text-bg-danger';
    if (tipe === 'info') bgClass = 'text-bg-info text-white';

    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center ${bgClass} border-0 shadow`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');

    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <strong>${judul}:</strong> ${pesan}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    container.appendChild(toastEl);
    const toast = new bootstrap.Toast(toastEl, { delay: 3500 });
    toast.show();

    toastEl.addEventListener('hidden.bs.toast', () => {
        toastEl.remove();
    });
}

function escapeQuotes(str) {
    if (!str) return '';
    return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}
