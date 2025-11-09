<?php
include 'database.php';

if (isset($_POST['sign-up-btn'])) {
    $nama_lengkap = $_POST['nama_lengkap'];
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    $query = "INSERT INTO pelanggan (nama_pelanggan, username, email, password)
              VALUES ('$nama_lengkap', '$username', '$email', '$password')";
    if (mysqli_query($db, $query)) {
        echo "<script>
                alert('Akun berhasil dibuat! Silakan login.');
                window.location.href = 'index.html';
              </script>";
    } else {
        echo "<script>
                alert('Gagal membuat akun.');
                window.history.back();
              </script>";
    }
}
?>