-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 15, 2023 at 08:42 AM
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
(1, 2, 'admin a', 'admin a', '2023-04-02 06:37:05'),
(2, 9, 'admin b', 'admin b', '2023-05-15 05:58:41');

--
-- Dumping data for table `bappeda`
--

INSERT INTO `bappeda` (`id_bappeda`, `id_user`, `id_kabupaten`, `nama`, `nisn`, `nama_pj`, `created_by`, `created_at`) VALUES
(1, 5, 1, 'Bpd Cilacap', '111', 'admin a', 'admin a', '2023-04-02 07:03:30'),
(2, 13, 2, 'Bpd Semarang', '222', 'admin a', 'admin b', '2023-05-15 06:00:20');

--
-- Dumping data for table `desa`
--

INSERT INTO `desa` (`id_desa`, `id_kecamatan`, `nama`) VALUES
(1, 1, 'Sidaurip'),
(2, 1, 'Gandrungmanis'),
(3, 2, 'Gandrungmanis'),
(4, 2, 'Sidaurip');

--
-- Dumping data for table `dosen`
--

INSERT INTO `dosen` (`id_dosen`, `id_user`, `nama`, `nip`, `created_at`) VALUES
(1, 6, 'Dosen A', 'dosen a', '2023-04-02 07:06:59'),
(3, 17, 'Dosen b', 'dosen b', '2023-05-15 06:01:32');

--
-- Dumping data for table `kabupaten`
--

INSERT INTO `kabupaten` (`id_kabupaten`, `nama`) VALUES
(1, 'Cilacap'),
(2, 'Semarang');

--
-- Dumping data for table `kecamatan`
--

INSERT INTO `kecamatan` (`id_kecamatan`, `id_kabupaten`, `nama`, `id_tema`, `potensi`, `status`) VALUES
(1, 1, 'Gandrungmangu', 1, 'Banyak UMKM di sekitar lapangan', -1),
(2, 2, 'Gandrungmangu', 2, 'Banyak UMKM di sekitar lapangan', 0);

--
-- Dumping data for table `mahasiswa`
--

INSERT INTO `mahasiswa` (`id_mahasiswa`, `id_user`, `id_tema`, `nama`, `nim`, `created_at`, `prodi`) VALUES
(1, 3, 1, 'Tazki', '240601', '2023-04-02 06:53:23', 'IF'),
(2, 4, 1, 'Dummy', '240602', '2023-04-02 06:53:23', 'IF'),
(3, 18, 1, 'Mhs A', '240603', '2023-05-15 06:40:14', 'IF'),
(4, 19, 1, 'Mhs B', '240604', '2023-05-15 06:40:14', 'IP');

--
-- Dumping data for table `mahasiswa_kecamatan`
--

INSERT INTO `mahasiswa_kecamatan` (`id_mahasiswa_kecamatan`, `id_mahasiswa`, `id_kecamatan`, `status`, `created_at`) VALUES
(1, 1, 1, -1, '2023-05-13 09:23:38'),
(2, 2, 1, 0, '2023-05-15 06:17:48');

--
-- Dumping data for table `tema`
--

INSERT INTO `tema` (`id_tema`, `nama`, `status`) VALUES
(1, 'Tim I 2023', 1),
(2, 'Tim II 2023', 0);

--
-- Dumping data for table `proposal`
--

INSERT INTO `proposal` (`id_proposal`, `id_dosen`, `proposal`, `created_at`, `id_kecamatan`, `status`) VALUES
(1, 1, 'Mengembangkan UMKM yang sesuai dengan kebutuhan Mahasiswa', '2023-05-08 07:10:59', 1, -1);

--
-- Dumping data for table `reviewer`
--

INSERT INTO `reviewer` (`id_reviewer`, `id_user`, `nama`, `nip`, `created_at`) VALUES
(1, 7, 'Reviewer A', 'reviewer a', '2023-05-08 07:43:48'),
(2, 15, 'Reviewer B', 'reviewer b', '2023-05-15 06:01:01');

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id_user`, `username`, `password`, `role`, `created_at`) VALUES
(1, 'admin', '$2b$10$I0yRXLOei2SuSjwzocYXe.NT3G5XOAsTGLnAoYwBfEvMmqEaPLip.', 'SUPERADMIN', '2023-04-02 13:35:26'),
(2, 'admin a', '$2b$10$LJ3NYZI.xFlEIUci7iF1audkAffHRV5Ll60gKAsvOPgPu75RinW1K', 'ADMIN', '2023-04-02 06:37:05'),
(3, '240601', '$2b$10$9tZp7DPHPzWdgFJ3NtvqSuo/EeIl3m6puEvViSewwWHuHz8y/7rTe', 'MAHASISWA', '2023-04-02 06:53:23'),
(4, '240602', '$2b$10$ab1mXijgQ0BfmEVzFSio.uwcb3GWcvMGugiIPWDiWh3c/eUA/5wXC', 'MAHASISWA', '2023-04-02 06:53:23'),
(5, '111', '$2b$10$kX6iS8y1Xeb9Y8fgR4fuVu7QEhCK1nE7j2cMycZZAQlaf2kOYYV.a', 'BAPPEDA', '2023-04-02 07:03:30'),
(6, 'dosen a', '$2b$10$U1QFEeH9NQew8aYJBWYNj.bwt2PVV8zmgvWQnD64egwLxn/DOdcMG', 'DOSEN', '2023-04-02 07:06:59'),
(7, 'reviewer a', '$2b$10$HqY/KeJfGYIqFSgB05LWDervi33r2AWAS6Y1iqC6WHRGyGpWesoDG', 'REVIEWER', '2023-05-08 07:43:48'),
(9, 'admin b', '$2b$10$BoeJ1Y4bWlEyWXdF3tu1ce/AzdD2HOzj6JAZtGNNpUXOJE736VZTu', 'ADMIN', '2023-05-15 05:58:41'),
(13, '222', '$2b$10$.G851nnyHLRHpwCCzwmJ1eAUs5ZkJtKu4hSM3/H3BJNfumOpHwAYS', 'BAPPEDA', '2023-05-15 06:00:20'),
(15, 'reviewer b', '$2b$10$FFQuaDWmJg7U.5r2h8LNzuBbxUsZhJT8aVGV/tIUCqX8Fws9WsVV2', 'REVIEWER', '2023-05-15 06:01:01'),
(17, 'dosen b', '$2b$10$.NvXUg.htfEsjOQdpinu.OVGYGVxXdIr/CDQZ5GR5v6MFjbOpbAc.', 'DOSEN', '2023-05-15 06:01:32'),
(18, '240603', '$2b$10$IUo1AZhsLV/8ihby1JB9KePbvg3KcB4X07KqOCFLAw./O3ZLNjlJe', 'MAHASISWA', '2023-05-15 06:40:14'),
(19, '240604', '$2b$10$ntrqZAb7ZHdVsd/ni.Rb/u9LCqM5ycvfWXVFTotWlAv4.yhm1L71W', 'MAHASISWA', '2023-05-15 06:40:14');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
