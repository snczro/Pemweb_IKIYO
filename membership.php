<?php
include 'database.php';

if (isset($_POST['btnSimpan'])) {
    $nama_lengkap = $_POST['nama_lengkap'];
    $username = $_POST['username'];
    $email = $_POST['email'];
    $tgl_daftar = date('Y-m-d');

    // kode promo acak
    $kode_voucher = "VHCR" . strtoupper(substr(md5(uniqid(rand(), true)), 0, 6));

    // masa aktif 1 tahun dari tanggal daftar
    $tgl_berakhir = date('Y-m-d', strtotime('+1 year', strtotime($tgl_daftar)));

    // simpan ke tabel membership (pastikan kolomnya sesuai)
    $query = "INSERT INTO membership (nama_lengkap, username, email, kode_voucher, tgl_daftar, tgl_berakhir)
              VALUES ('$nama_lengkap', '$username', '$email', '$kode_voucher', '$tgl_daftar', '$tgl_berakhir')";
    $result = mysqli_query($db, $query);

    if ($result) {
        // simpan kode voucher ke localStorage via JS
        echo "<script>
                localStorage.setItem('kodePromo', '$kode_voucher');
                alert('Pendaftaran berhasil! Kode promo akan muncul.');
                window.location.href = 'membership.html';
              </script>";
    } else {
        echo '<script>alert("Gagal menyimpan data membership.");</script>';
    }
}
?>