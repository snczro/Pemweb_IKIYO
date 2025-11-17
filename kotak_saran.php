<?php
include 'database.php';

if (isset($_POST['btn-simpan'])) {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $tgl_saran = $_POST['tgl_saran'];
    $kotak_saran = $_POST['kotak_saran'];

    // Cari id_pelanggan
    $query = "SELECT id_pelanggan FROM pelanggan WHERE username_pelanggan = ? AND email = ?";
    $stmt = $db->prepare($query); 
    if(!$stmt){
        die("Gagal prepare statement: " . $db->error);
    }
    $stmt->bind_param("ss", $username, $email);
    $stmt->execute();
    $result = $stmt->get_result();
    if($row = $result->fetch_assoc()){
        $id_pelanggan = $row['id_pelanggan'];
    } else {
        die("Pelanggan tidak ditemukan");
    }

    $status_saran = 'pending';

    // Insert ke tabel saran
    $query_insert = "INSERT INTO kotak_saran (id_pelanggan, tgl_saran, kotak_saran, status_saran) VALUES (?, ?, ?, ?)";
    $stmt_insert = $db->prepare($query_insert); // ganti $conn jadi $db
    if(!$stmt_insert){
        die("Gagal prepare statement insert: " . $db->error);
    }
    $stmt_insert->bind_param("isss", $id_pelanggan, $tgl_saran, $kotak_saran, $status_saran);
    $stmt_insert->execute();

    if($stmt_insert->affected_rows > 0){
        echo "<script>
                alert('Saran terkirim!');
                window.location.href = 'Kotak-saran.html';
              </script>";
    } else {
        echo "Gagal mengirim saran";
    }
}
?>