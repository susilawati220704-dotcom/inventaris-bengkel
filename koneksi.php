<?php
/**
 * SISTEM INVENTARIS & PEMINJAMAN BARANG LAB RPL
 * SMK NEGERI 1 BERINGIN
 * File: koneksi.php - Konfigurasi Koneksi Database MySQL
 */

// Konfigurasi Database XAMPP Default
$db_host = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "db_inventaris_rpl";

// Header JSON untuk API
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$conn = @new mysqli($db_host, $db_user, $db_pass, $db_name);

// Cek koneksi
if ($conn->connect_error) {
    // Jika database belum dibuat / koneksi gagal
    $is_connected = false;
    $db_error_message = $conn->connect_error;
} else {
    $is_connected = true;
    $db_error_message = "";
    $conn->set_charset("utf8mb4");
}
