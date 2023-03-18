-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 18, 2023 at 01:16 PM
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
-- Dumping data for table `lpk`
--

INSERT INTO `lpk` (`id_lpk`, `id_lrk`, `metode`, `pelaksanaan`, `capaian`, `hambatan`, `kelanjutan`, `created_at`, `id_mahasiswa`) VALUES
(1, 1, 'Langkah awal untuk mengembangkan website ini adalah proses Design Thinking. Semua fungsionalitas aplikasi didata dan dibuatkan diagram untuk membantu memudahkan proses kedepannya. Kemudian setelah didapatkan desain sistem yang diinginkan, selanjutnya adalah proses pengembangan aplikasi sampai jadi. Setelah dirasa sesuai, website akan dihosting ke cloud. Jika sudah berhasil dan tidak ada masalah, maka website akan diisi data NIB yang sesuai.', 'Program ini dilaksanakan pada:\r\nHari/Tanggal : 14 Januari – 6 Februari 2023\r\nWaktu : 08.00 – 20.00\r\nProgram “Pengembangan Website E-Katalog UMKM Desa Tlogoharjo” merupakan program kerja bertema teknologi berwujud pembuatan website untuk pendataan UMKM penduduk Desa Tlogoharjo. Dengan aplikasi ini, dapat mempermudah masyarakat untuk mengetahui ada UMKM apa saja di Desa Tlogoharjo.\r\nKeberhasilan dari program ini dapat dilihat dari kemudahan Operator Desa menggunakan website ini. Semua fitur utama dalam website ini dapat dicoba dan mendapatkan feedback yang sesuai.\r\nOutput yang direncanakan adalah\r\n• Publikasi Rutin Media Sosial\r\n• Prototype produk\r\n• Reportase Media Berita', 'Tercapai dengan tepat waktu, website sudah mempunyai fitur yang dibutuhkan namun masih belum bisa digunakan karena belum di hosting', '- Pembuatan aplikasi membutuhkan waktu yang cukup\r\n- Untuk menghosting website juga membutuhkan biaya', 'Keberlanjutan program Pengembangan Website E-Katalog UMKM Desa Tlogoharjo ini dapat dilakukan oleh operator Desa Progowati yang nantinya diberi amanah untuk mengelola website E-Katalog UMKM Desa Tlogoharjo tersebut.', '2023-03-02 06:10:17', 1),
(2, 2, 'Langkah awal untuk mengembangkan website ini adalah proses Design Thinking. Semua fungsionalitas aplikasi didata dan dibuatkan diagram untuk membantu memudahkan proses kedepannya. Kemudian setelah didapatkan desain sistem yang diinginkan, selanjutnya adalah proses pengembangan aplikasi sampai jadi. Setelah dirasa sesuai, website akan dihosting ke cloud. Jika sudah berhasil dan tidak ada masalah, maka website akan diisi data NIB yang sesuai.', 'Program ini dilaksanakan pada: Hari/Tanggal : 14 Januari – 6 Februari 2023 Waktu : 08.00 – 20.00 Program “Pengembangan Website E-Katalog UMKM Desa Tlogoharjo” merupakan program kerja bertema teknologi berwujud pembuatan website untuk pendataan UMKM penduduk Desa Tlogoharjo. Dengan aplikasi ini, dapat mempermudah masyarakat untuk mengetahui ada UMKM apa saja di Desa Tlogoharjo. Keberhasilan dari program ini dapat dilihat dari kemudahan Operator Desa menggunakan website ini. Semua fitur utama dalam website ini dapat dicoba dan mendapatkan feedback yang sesuai. Output yang direncanakan adalah • Publikasi Rutin Media Sosial • Prototype produk • Reportase Media Berita', 'Tercapai dengan tepat waktu, website sudah mempunyai fitur yang dibutuhkan namun masih belum bisa digunakan karena belum di hosting', '- Pembuatan aplikasi membutuhkan waktu yang cukup - Untuk menghosting website juga membutuhkan biaya', 'Keberlanjutan program Pengembangan Website E-Katalog UMKM Desa Tlogoharjo ini dapat dilakukan oleh operator Desa Progowati yang nantinya diberi amanah untuk mengelola website E-Katalog UMKM Desa Tlogoharjo tersebut.', '2023-03-03 06:50:28', 2);

--
-- Dumping data for table `lrk`
--

INSERT INTO `lrk` (`id_lrk`, `id_mahasiswa`, `potensi`, `program`, `sasaran`, `metode`, `luaran`, `created_at`) VALUES
(1, 1, 'Di Desa Tlogoharjo ada banyak pelaku UMKM. Namun, informasi terkait data UMKM Desa Tlogoharjo masih sangat susah dicari. Oleh karena itu diperlukan suatu media yang mudah diakses, yaitu website untuk menampung informasi terkait UMKM Desa Tlogoharjo. Dengan adanya website ini, diharapkan nantinya dapat meningkatkan taraf hidup masyarakat.', 'Pengembangan Website E-Katalog UMKM Desa Tlogoharjo', 'Seluruh masyarakat Desa Tlogoharjo', 'Pertama adalah proses pembuatan website e-katalog. Setelah dirasa sesuai, website akan dihosting ke cloud. Jika sudah berhasil dan tidak ada masalah, maka website akan diisi data NIB yang sesuai.', '1. Leaflet\r\n2. Modul PPT\r\n3. Reportase Media Berita (Elektronik)', '2023-03-02 04:21:36'),
(2, 2, 'Di Desa Tlogoharjo ada banyak pelaku UMKM. Namun, informasi terkait data UMKM Desa Tlogoharjo masih sangat susah dicari. Oleh karena itu diperlukan suatu media yang mudah diakses, yaitu website untuk menampung informasi terkait UMKM Desa Tlogoharjo. Dengan adanya website ini, diharapkan nantinya dapat meningkatkan taraf hidup masyarakat.', 'Pengembangan Website E-Katalog UMKM Desa Tlogoharjo', 'Seluruh masyarakat Desa Tlogoharjo', 'Pertama adalah proses pembuatan website e-katalog. Setelah dirasa sesuai, website akan dihosting ke cloud. Jika sudah berhasil dan tidak ada masalah, maka website akan diisi data NIB yang sesuai.', '1. Leaflet\r\n2. Modul PPT\r\n3. Reportase Media Berita (Elektronik)', '2023-03-03 06:48:04');

--
-- Dumping data for table `mahasiswa`
--

INSERT INTO `mahasiswa` (`id_mahasiswa`, `created_at`, `id_user`, `nama`, `nim`, `jurusan`, `id_periode`) VALUES
(1, '2023-03-01 10:47:23', 2, 'Tazki H. A.', '240601', 'IF', 1),
(2, '2023-03-03 06:46:43', 3, 'Dummy 1', '240602', 'IP', 1),
(3, '2023-03-18 11:53:04', 4, 'Dummy 2', '240603', 'IP', 1);

--
-- Dumping data for table `periode`
--

INSERT INTO `periode` (`id_periode`, `nama`) VALUES
(1, 'Tim I 2023');

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id_user`, `username`, `password`, `created_at`, `tipe`) VALUES
(1, 'admin', '$2b$10$I0yRXLOei2SuSjwzocYXe.NT3G5XOAsTGLnAoYwBfEvMmqEaPLip.', '2023-03-01 13:56:11', 0),
(2, '240601', '$2b$10$mOG71y2Bx7/SEwiNdeuCdOOYNx60CAYgvB1a82OhPTo7ALkpJzxGO', '2023-03-01 10:47:23', 1),
(3, '240602', '$2b$10$hSOXfFk76M53/UiyRYSUiuFGHmwGkLYAEvVWJMidDEmAYBeIRpID6', '2023-03-03 06:46:43', 1),
(4, '240603', '$2b$10$WGztxYQT36.4mO8K4oCb9.1T0XdW92w6QnTB9Wmt04E.Wb0Qu3BT6', '2023-03-18 11:53:04', 1);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
