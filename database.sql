-- ==============================================================
-- SISTEM INVENTARIS & PEMINJAMAN BARANG LABORATORIUM RPL
-- SMK NEGERI 1 BERINGIN
-- Database: db_inventaris_rpl
-- Kompatibel: MySQL 5.7+ / MariaDB 10.x / phpMyAdmin XAMPP
-- ==============================================================

CREATE DATABASE IF NOT EXISTS `db_inventaris_rpl` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `db_inventaris_rpl`;

-- --------------------------------------------------------
-- Tabel 1: `barang` (Daftar Inventaris Laboratorium RPL)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `peminjaman`;
DROP TABLE IF EXISTS `barang`;

CREATE TABLE `barang` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `kode_barang` VARCHAR(50) NOT NULL UNIQUE,
  `nama_barang` VARCHAR(255) NOT NULL,
  `kategori` VARCHAR(100) NOT NULL,
  `total_stok` INT NOT NULL DEFAULT 1,
  `kondisi` ENUM('Baik', 'Rusak Ringan', 'Rusak Berat') NOT NULL DEFAULT 'Baik',
  `lokasi` VARCHAR(150) NOT NULL,
  `spesifikasi` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Data Awal untuk Tabel `barang` (Alat & Perangkat Lab RPL)
-- --------------------------------------------------------
INSERT INTO `barang` (`id`, `kode_barang`, `nama_barang`, `kategori`, `total_stok`, `kondisi`, `lokasi`, `spesifikasi`) VALUES
(1, 'RPL-TAB-01', 'Drawing Tablet Huion Inspiroy H640P', 'Desain & Multimedia', 10, 'Baik', 'Lemari A - Rak 1 (Multimedia)', '8192 Levels Pen Pressure, Battery-free Stylus, Desain UI/UX & Animasi'),
(2, 'RPL-VRH-01', 'VR Headset Oculus Quest 2 128GB', 'Desain & Multimedia', 2, 'Baik', 'Lemari Khusus Lab RPL', 'All-in-One VR System, Dual Controller, Praktik Pemrograman Game / Virtual Reality'),
(3, 'RPL-IOT-01', 'Microcontroller ESP32 NodeMCU IoT Starter Kit', 'Perangkat IoT & Embedded', 15, 'Baik', 'Box Komponen IoT Meja 1', 'Wi-Fi & Bluetooth SoC, Breadboard, Sensor DHT11, Modul Relay 4-Ch & Jumper'),
(4, 'RPL-LPT-01', 'Laptop Lenovo ThinkPad L14 Core i5', 'Komputer & Laptop Lab', 6, 'Baik', 'Lemari Laptop Lab RPL', 'Intel Core i5 Gen 11, RAM 16GB, SSD 512GB, Dual Boot Linux Ubuntu & Windows 11'),
(5, 'RPL-MON-01', 'Monitor LED LG 24MP400 IPS 24 Inch', 'Periferal & Aksesoris', 8, 'Baik', 'Meja Praktik Coding A & B', 'Full HD 1080p, 75Hz, HDMI & VGA, untuk Dual-Screen Coding & Debugging'),
(6, 'RPL-SWT-01', 'Switch Gigabit D-Link 24-Port DGS-1024D', 'Jaringan & Server Lab', 3, 'Baik', 'Rack Server Lab RPL', '24-Port 10/100/1000Mbps Gigabit Unmanaged Switch untuk Jaringan Lab'),
(7, 'RPL-HDD-01', 'Harddisk Eksternal Seagate One Touch 2TB', 'Media Penyimpanan', 4, 'Baik', 'Brankas Data Lab RPL', 'USB 3.0, Enkripsi Hardware, Backup Master Repository Git dan VM Praktik'),
(8, 'RPL-ARD-01', 'Arduino Uno R3 Ultimate Starter Kit Sensor', 'Perangkat IoT & Embedded', 12, 'Baik', 'Box Komponen IoT Meja 2', 'Board ATmega328P, Modul RFID, Ultrasonic Sensor HC-SR04, Servo SG90, LCD 16x2'),
(9, 'RPL-TLS-01', 'Toolkit Crimping RJ45 & Cable Tester Digital', 'Periferal & Aksesoris', 8, 'Baik', 'Toolbox Jaringan Lab RPL', 'Modular Crimper Cat5e/Cat6, Wire Stripper, Digital Cable Tester RJ45/RJ11'),
(10, 'RPL-PRJ-01', 'Proyektor Epson EB-E500 3300 Lumens HDMI', 'Desain & Multimedia', 2, 'Baik', 'Ruang Presentasi Lab RPL', '3LCD Technology, Input HDMI & VGA, Presentasi Proyek & Sidang UKK RPL');

-- --------------------------------------------------------
-- Tabel 2: `peminjaman` (Transaksi Peminjaman Alat Lab RPL)
-- --------------------------------------------------------
CREATE TABLE `peminjaman` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `no_transaksi` VARCHAR(50) NOT NULL UNIQUE,
  `nis_nip` VARCHAR(50) NULL DEFAULT '-',
  `nama_peminjam` VARCHAR(150) NOT NULL,
  `kelas_instansi` VARCHAR(100) NOT NULL,
  `kontak` VARCHAR(50) NULL DEFAULT '-',
  `barang_id` INT NOT NULL,
  `jumlah` INT NOT NULL DEFAULT 1,
  `tgl_pinjam` DATE NOT NULL,
  `tgl_kembali_rencana` DATE NOT NULL,
  `tgl_kembali_aktual` DATE NULL,
  `keperluan` TEXT NOT NULL,
  `status` ENUM('Dipinjam', 'Dikembalikan') NOT NULL DEFAULT 'Dipinjam',
  `kondisi_kembali` ENUM('-', 'Baik', 'Rusak Ringan', 'Rusak Berat', 'Hilang') NOT NULL DEFAULT '-',
  `catatan_kembali` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_peminjaman_barang` FOREIGN KEY (`barang_id`) REFERENCES `barang` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Data Awal untuk Tabel `peminjaman` (Data Contoh Realistis)
-- --------------------------------------------------------
INSERT INTO `peminjaman` (`no_transaksi`, `nis_nip`, `nama_peminjam`, `kelas_instansi`, `kontak`, `barang_id`, `jumlah`, `tgl_pinjam`, `tgl_kembali_rencana`, `tgl_kembali_aktual`, `keperluan`, `status`, `kondisi_kembali`, `catatan_kembali`) VALUES
('PJ-20261112-001', '220101', 'Muhammad Rizky', 'XII RPL 1', '081234567890', 1, 1, DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 1 DAY), NULL, 'Praktik Pembuatan Mockup UI/UX Aplikasi E-Commerce UKK', 'Dipinjam', '-', ''),
('PJ-20261113-002', '220145', 'Siti Aisyah', 'XII RPL 2', '082198765432', 3, 2, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 2 DAY), NULL, 'Praktik Pemrograman Smart Home IoT berbasis ESP32 & MQTT', 'Dipinjam', '-', ''),
('PJ-20261109-001', 'GURU-RPL-02', 'Pak Bayu Setiawan, S.Kom', 'Guru Produktif RPL', '085211223344', 10, 1, DATE_SUB(CURDATE(), INTERVAL 4 DAY), DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'Presentasi Project Showcase Web Programming Kelas XI RPL', 'Dikembalikan', 'Baik', 'Kabel power, remote, dan tas proyektor lengkap');

-- --------------------------------------------------------
-- Tabel 3: `petugas` (Pengelola Laboratorium RPL)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `petugas`;
CREATE TABLE `petugas` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `nama_petugas` VARCHAR(150) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'Laboran RPL',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `petugas` (`username`, `password`, `nama_petugas`, `role`) VALUES
('admin_rpl', MD5('admin123'), 'Petugas Lab RPL SMK N 1 Beringin', 'Kepala Laboratorium RPL');
