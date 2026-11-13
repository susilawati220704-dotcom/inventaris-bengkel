<?php
/**
 * SISTEM INVENTARIS & PEMINJAMAN BARANG LAB RPL
 * SMK NEGERI 1 BERINGIN
 * File: api.php - Backend REST API untuk MySQL & phpMyAdmin
 */

require_once 'koneksi.php';

header('Content-Type: application/json; charset=utf-8');

if (!$is_connected) {
    echo json_encode([
        'status' => 'error',
        'connected' => false,
        'message' => 'Tidak dapat terhubung ke MySQL: ' . $db_error_message . '. Pastikan MySQL di XAMPP sudah di-START dan database `db_inventaris_rpl` sudah diimpor via localhost/phpmyadmin.'
    ]);
    exit;
}

$action = $_GET['action'] ?? $_POST['action'] ?? '';

// Menerima data JSON jika dikirim via payload fetch
$inputJson = json_decode(file_get_contents('php://input'), true);
if (!empty($inputJson)) {
    $_POST = array_merge($_POST, $inputJson);
    if (empty($action) && isset($inputJson['action'])) {
        $action = $inputJson['action'];
    }
}

switch ($action) {
    case 'status':
        echo json_encode([
            'status' => 'success',
            'connected' => true,
            'database' => $db_name
        ]);
        break;

    case 'get_all':
        // Ambil data barang
        $sqlBarang = "SELECT id, kode_barang AS kode, nama_barang AS nama, kategori, total_stok AS totalStok, kondisi, lokasi, COALESCE(spesifikasi, '') AS spesifikasi FROM barang ORDER BY id ASC";
        $resBarang = $conn->query($sqlBarang);
        $barang = [];
        if ($resBarang) {
            while ($row = $resBarang->fetch_assoc()) {
                $row['id'] = (int)$row['id'];
                $row['totalStok'] = (int)$row['totalStok'];
                $barang[] = $row;
            }
        }

        // Ambil data peminjaman
        $sqlPinjam = "SELECT 
                        p.id, 
                        p.no_transaksi, 
                        p.nis_nip AS idPeminjam, 
                        p.nama_peminjam AS namaPeminjam, 
                        p.kelas_instansi AS kelas, 
                        p.kontak, 
                        p.barang_id AS idBarang, 
                        COALESCE(b.nama_barang, 'Barang Dihapus') AS namaBarang, 
                        p.jumlah, 
                        p.tgl_pinjam AS tglPinjam, 
                        p.tgl_kembali_rencana AS tglKembaliRencana, 
                        p.tgl_kembali_aktual AS tglKembaliAktual, 
                        p.keperluan, 
                        p.status, 
                        p.kondisi_kembali AS kondisiKembali, 
                        COALESCE(p.catatan_kembali, '') AS catatanKembali 
                      FROM peminjaman p 
                      LEFT JOIN barang b ON p.barang_id = b.id 
                      ORDER BY p.id DESC";
        $resPinjam = $conn->query($sqlPinjam);
        $peminjaman = [];
        if ($resPinjam) {
            while ($row = $resPinjam->fetch_assoc()) {
                $row['id'] = $row['no_transaksi']; // Menggunakan no_transaksi sebagai ID seragam
                $row['idBarang'] = (int)$row['idBarang'];
                $row['jumlah'] = (int)$row['jumlah'];
                $peminjaman[] = $row;
            }
        }

        echo json_encode([
            'status' => 'success',
            'source' => 'mysql',
            'barang' => $barang,
            'peminjaman' => $peminjaman
        ]);
        break;

    case 'save_barang':
        $editId = $_POST['editId'] ?? '';
        $kode = trim($_POST['kode'] ?? '');
        $nama = trim($_POST['nama'] ?? '');
        $kategori = trim($_POST['kategori'] ?? '');
        $totalStok = (int)($_POST['totalStok'] ?? 1);
        $kondisi = trim($_POST['kondisi'] ?? 'Baik');
        $lokasi = trim($_POST['lokasi'] ?? '');
        $spesifikasi = trim($_POST['spesifikasi'] ?? '');

        if (empty($kode) || empty($nama)) {
            echo json_encode(['status' => 'error', 'message' => 'Kode dan nama barang wajib diisi!']);
            exit;
        }

        if (!empty($editId)) {
            // Edit barang
            $stmt = $conn->prepare("UPDATE barang SET kode_barang = ?, nama_barang = ?, kategori = ?, total_stok = ?, kondisi = ?, lokasi = ?, spesifikasi = ? WHERE id = ?");
            $stmt->bind_param("sssisssi", $kode, $nama, $kategori, $totalStok, $kondisi, $lokasi, $spesifikasi, $editId);
            if ($stmt->execute()) {
                echo json_encode(['status' => 'success', 'message' => 'Data barang berhasil diperbarui di database!']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Gagal update: ' . $stmt->error]);
            }
            $stmt->close();
        } else {
            // Tambah barang baru
            $stmt = $conn->prepare("INSERT INTO barang (kode_barang, nama_barang, kategori, total_stok, kondisi, lokasi, spesifikasi) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("sssisss", $kode, $nama, $kategori, $totalStok, $kondisi, $lokasi, $spesifikasi);
            if ($stmt->execute()) {
                echo json_encode(['status' => 'success', 'message' => 'Barang baru berhasil disimpan ke database!']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Gagal simpan: ' . $stmt->error]);
            }
            $stmt->close();
        }
        break;

    case 'delete_barang':
        $id = (int)($_POST['id'] ?? 0);
        if ($id <= 0) {
            echo json_encode(['status' => 'error', 'message' => 'ID barang tidak valid!']);
            exit;
        }

        // Cek apakah ada peminjaman aktif
        $stmtCheck = $conn->prepare("SELECT COUNT(*) AS total FROM peminjaman WHERE barang_id = ? AND status = 'Dipinjam'");
        $stmtCheck->bind_param("i", $id);
        $stmtCheck->execute();
        $resCheck = $stmtCheck->get_result()->fetch_assoc();
        $stmtCheck->close();

        if ($resCheck['total'] > 0) {
            echo json_encode(['status' => 'error', 'message' => 'Barang tidak dapat dihapus karena masih ada yang sedang dipinjam!']);
            exit;
        }

        $stmtDel = $conn->prepare("DELETE FROM barang WHERE id = ?");
        $stmtDel->bind_param("i", $id);
        if ($stmtDel->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Barang berhasil dihapus dari database!']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Gagal menghapus barang: ' . $stmtDel->error]);
        }
        $stmtDel->close();
        break;

    case 'save_pinjam':
        $idBarang = (int)($_POST['idBarang'] ?? 0);
        $jumlah = (int)($_POST['jumlah'] ?? 1);
        $namaPeminjam = trim($_POST['namaPeminjam'] ?? '');
        $idPeminjam = trim($_POST['idPeminjam'] ?? '-');
        $kelas = trim($_POST['kelas'] ?? '');
        $kontak = trim($_POST['kontak'] ?? '-');
        $tglPinjam = trim($_POST['tglPinjam'] ?? date('Y-m-d'));
        $tglKembaliRencana = trim($_POST['tglKembaliRencana'] ?? date('Y-m-d'));
        $keperluan = trim($_POST['keperluan'] ?? '');

        if ($idBarang <= 0 || empty($namaPeminjam) || empty($kelas)) {
            echo json_encode(['status' => 'error', 'message' => 'Data peminjaman tidak lengkap!']);
            exit;
        }

        // Generate No Transaksi
        $dateCode = date('Ymd');
        $randomSeq = rand(100, 999);
        $noTransaksi = "PJ-{$dateCode}-{$randomSeq}";

        $stmt = $conn->prepare("INSERT INTO peminjaman (no_transaksi, nis_nip, nama_peminjam, kelas_instansi, kontak, barang_id, jumlah, tgl_pinjam, tgl_kembali_rencana, keperluan, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Dipinjam')");
        $stmt->bind_param("sssssiisss", $noTransaksi, $idPeminjam, $namaPeminjam, $kelas, $kontak, $idBarang, $jumlah, $tglPinjam, $tglKembaliRencana, $keperluan);

        if ($stmt->execute()) {
            echo json_encode([
                'status' => 'success',
                'message' => 'Peminjaman berhasil dicatat ke database!',
                'noTransaksi' => $noTransaksi
            ]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Gagal mencatat peminjaman: ' . $stmt->error]);
        }
        $stmt->close();
        break;

    case 'return_pinjam':
        $noTransaksi = trim($_POST['idTransaksi'] ?? '');
        $tglAktual = trim($_POST['tglAktual'] ?? date('Y-m-d'));
        $kondisi = trim($_POST['kondisi'] ?? 'Baik');
        $catatan = trim($_POST['catatan'] ?? '');

        if (empty($noTransaksi)) {
            echo json_encode(['status' => 'error', 'message' => 'Nomor transaksi tidak valid!']);
            exit;
        }

        $stmt = $conn->prepare("UPDATE peminjaman SET status = 'Dikembalikan', tgl_kembali_aktual = ?, kondisi_kembali = ?, catatan_kembali = ? WHERE no_transaksi = ?");
        $stmt->bind_param("ssss", $tglAktual, $kondisi, $catatan, $noTransaksi);

        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Pengembalian barang berhasil diproses!']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Gagal memproses pengembalian: ' . $stmt->error]);
        }
        $stmt->close();
        break;

    default:
        echo json_encode(['status' => 'error', 'message' => 'Aksi tidak dikenal!']);
        break;
}
