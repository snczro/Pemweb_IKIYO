<?php
include 'database.php';

if (isset($_POST['btn-simpan'])) {
    $nama_pelanggan = $_POST['nama_pelanggan'];
    $username_pelanggan = $_POST['username_pelanggan'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $tgl_lahir = $_POST['tgl_lahir'];
    $telp = $_POST['telp'];
    $provinsi = $_POST['provinsi'];
    $kabupaten_kota = $_POST['kabupaten_kota'];
    $kecamatan = $_POST['kecamatan'];
    $kode_pos = $_POST['kode_pos'];
    $detail_alamat = $_POST['detail_alamat'];

    $query = "INSERT INTO pelanggan 
(nama_pelanggan, username_pelanggan, email, password, tgl_lahir, telp, provinsi, kabupaten_kota, kecamatan, kode_pos, detail_alamat) 
VALUES 
('$nama_pelanggan', '$username_pelanggan', '$email', '$password', '$tgl_lahir', '$telp', '$provinsi', '$kabupaten_kota', '$kecamatan', '$kode_pos', '$detail_alamat')";
}
    if (mysqli_query($db, $query)) {
        echo "<script>alert('Profil berhasil disimpan!'); window.location.href='profile.html';</script>";
    } else {
        echo "<script>alert('Gagal menyimpan profil: " . mysqli_error($db) . "');</script>";
    }
?>