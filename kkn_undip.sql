-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 13, 2023 at 05:42 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.0.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kkn_undip`
--

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id_admin`, `id_user`, `nama`, `nip`, `created_at`) VALUES
(1, 2, 'admin a', 'admin a', '2023-04-02 06:37:05');

--
-- Dumping data for table `bappeda`
--

INSERT INTO `bappeda` (`id_bappeda`, `id_user`, `id_kabupaten`, `nama`, `nisn`, `nama_pj`, `created_by`, `created_at`) VALUES
(1, 5, 1, 'Bpd Cilacap', '111', 'admin a', 'admin a', '2023-04-02 07:03:30');

--
-- Dumping data for table `desa`
--

INSERT INTO `desa` (`id_desa`, `id_kecamatan`, `nama`) VALUES
(1, 1, 'Sidaurip'),
(2, 1, 'Gandrungmanis');

--
-- Dumping data for table `dosen`
--

INSERT INTO `dosen` (`id_dosen`, `id_user`, `nama`, `nip`, `created_at`) VALUES
(1, 6, 'Dosen A', 'dosen a', '2023-04-02 07:06:59');

--
-- Dumping data for table `kabupaten`
--

INSERT INTO `kabupaten` (`id_kabupaten`, `nama`) VALUES
(1, 'Cilacap');

--
-- Dumping data for table `kecamatan`
--

INSERT INTO `kecamatan` (`id_kecamatan`, `id_kabupaten`, `nama`) VALUES
(1, 1, 'Gandrungmangu');

--
-- Dumping data for table `mahasiswa`
--

INSERT INTO `mahasiswa` (`id_mahasiswa`, `id_user`, `id_periode`, `id_prodi`, `nama`, `nim`, `created_at`) VALUES
(1, 3, 1, 'IF', 'Tazki', '240601', '2023-04-02 06:53:23'),
(2, 4, 1, 'IP', 'Dummy', '240602', '2023-04-02 06:53:23');

--
-- Dumping data for table `periode`
--

INSERT INTO `periode` (`id_periode`, `nama`, `status`) VALUES
(1, 'Tim I 2023', 1);

--
-- Dumping data for table `potensi`
--

INSERT INTO `potensi` (`id_potensi`, `id_kecamatan`, `id_periode`, `potensi`, `status`, `created_at`) VALUES
(1, 1, 1, 'Banyak UMKM di sekitar lapangan', 1, '2023-04-02 07:04:31');

--
-- Dumping data for table `prodi`
--

INSERT INTO `prodi` (`id_prodi`, `nama`) VALUES
('IF', 'Informatika S1'),
('IP', 'Ilmu Perpustakaan S1');

--
-- Dumping data for table `proposal`
--

INSERT INTO `proposal` (`id_proposal`, `id_potensi`, `id_dosen`, `proposal`, `status`, `created_at`) VALUES
(1, 1, 1, 'Mengembangkan UMKM yang sesuai dengan kebutuhan Mahasiswa', NULL, '2023-04-13 03:39:08');

--
-- Dumping data for table `proposal_prodi`
--

INSERT INTO `proposal_prodi` (`id_proposal_prodi`, `id_proposal`, `id_prodi`, `jumlah`) VALUES
(1, 1, 'IF', 10);

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id_user`, `username`, `password`, `role`, `created_at`) VALUES
(1, 'admin', '$2b$10$I0yRXLOei2SuSjwzocYXe.NT3G5XOAsTGLnAoYwBfEvMmqEaPLip.', 'SUPERADMIN', '2023-04-02 13:35:26'),
(2, 'admin a', '$2b$10$LJ3NYZI.xFlEIUci7iF1audkAffHRV5Ll60gKAsvOPgPu75RinW1K', 'ADMIN', '2023-04-02 06:37:05'),
(3, '240601', '$2b$10$9tZp7DPHPzWdgFJ3NtvqSuo/EeIl3m6puEvViSewwWHuHz8y/7rTe', 'MAHASISWA', '2023-04-02 06:53:23'),
(4, '240602', '$2b$10$ab1mXijgQ0BfmEVzFSio.uwcb3GWcvMGugiIPWDiWh3c/eUA/5wXC', 'MAHASISWA', '2023-04-02 06:53:23'),
(5, '111', '$2b$10$kX6iS8y1Xeb9Y8fgR4fuVu7QEhCK1nE7j2cMycZZAQlaf2kOYYV.a', 'BAPPEDA', '2023-04-02 07:03:30'),
(6, 'dosen a', '$2b$10$U1QFEeH9NQew8aYJBWYNj.bwt2PVV8zmgvWQnD64egwLxn/DOdcMG', 'DOSEN', '2023-04-02 07:06:59');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
