<?php
include 'database.php';

if (isset($_POST['login-btn'])) {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    $query = "SELECT * FROM pelanggan WHERE username='$username' AND email='$email' AND password='$password'";
    $result = mysqli_query($db, $query);

    if (mysqli_num_rows($result) > 0) {
        $user = mysqli_fetch_assoc($result);
        $nama = $user['username'];

        echo "<script>
                alert('Login berhasil! Selamat datang, $nama');
                window.location.href = 'index.html';
              </script>";
    } else {
        echo "<script>
                alert('Username atau password salah!');
                window.history.back();
              </script>";
    }
}
?>