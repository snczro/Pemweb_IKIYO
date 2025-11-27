<?php
$hostname = "localhost";
$user = "root";
$password = "";
$database_name = "db_ikiyo";

$db = new mysqli($hostname, $user, $password, $database_name);

if ($db->connect_error) {
    echo "<script>alert('Koneksi ke database gagal');</script>";
    die("Error: " . $db->connect_error);
} 
?>
