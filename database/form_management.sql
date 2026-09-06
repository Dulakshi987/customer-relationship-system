-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 06, 2026 at 03:32 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `form_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `submissions`
--

CREATE TABLE `submissions` (
  `id` int(11) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `gender` enum('MALE','FEMALE','OTHER') NOT NULL,
  `mobileNumber` varchar(20) NOT NULL,
  `address` varchar(255) NOT NULL,
  `feedback` text DEFAULT NULL,
  `userCreated` int(11) NOT NULL,
  `dateCreated` datetime NOT NULL DEFAULT current_timestamp(),
  `userModified` int(11) DEFAULT NULL,
  `dateModified` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `submissions`
--

INSERT INTO `submissions` (`id`, `firstName`, `lastName`, `email`, `gender`, `mobileNumber`, `address`, `feedback`, `userCreated`, `dateCreated`, `userModified`, `dateModified`) VALUES
(1, 'Abc', 'Efg', 'dulakshikeshani288@gmail.com', 'MALE', '0745862369', 'Minuwangoda', 'not yet', 3, '2026-09-06 11:53:36', 1, '2026-09-06 12:45:13'),
(6, 'Dulakshi', 'Keshani', 'dulakshi_1788696980409@test.com', 'FEMALE', '0771234567', 'Colombo, Sri Lanka', 'Automated test submission', 8, '2026-09-06 12:16:20', 1, '2026-09-06 12:45:08'),
(11, 'Keshani', 'Wasana', 'keshani@gmail.com', 'FEMALE', '0758963642', 'Colombo', 'Check the form', 15, '2026-09-06 12:59:11', NULL, NULL),
(12, 'Tharuki', 'Smanthi', 'tharuki@gmail.com', 'FEMALE', '0745263863', 'Gampaha', 'Pending documents', 15, '2026-09-06 13:00:08', NULL, NULL),
(13, 'Akash', 'Perera', 'akash@gmail.com', 'MALE', '0748526336', 'Matale', 'successfully submission', 15, '2026-09-06 13:00:54', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('CUSTOMER','ADMIN') NOT NULL DEFAULT 'CUSTOMER',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 'admin@gmail.com', '$2b$10$kAirgl/mRdJh/ijuU7MX9O4jEzBXsBUN9M.gRuSBuYqMh4U.Js0n.', 'ADMIN', '2026-09-06 10:05:54', '2026-09-06 10:05:54'),
(2, 'dulakshikeshani288@gmail.com', '$2b$10$WZh0V1OT7qB61jVNMGpNIOJV7pud2McvWe5pXV6OPveQJtwyPDCxO', 'CUSTOMER', '2026-09-06 10:07:24', '2026-09-06 10:07:24'),
(3, 'abc@gmail.com', '$2b$10$glDtGyomWhzNy2HyIx57jeb9FbXHiuhJmq3XW8tKfMl4iciRu4nwK', 'CUSTOMER', '2026-09-06 11:50:37', '2026-09-06 11:50:37'),
(4, 'customer_1788696504353@test.com', '$2b$10$aru5Ee5uCkT4DghrNDgPQeuIVS9CwWOVTqe85cpeoyZs993z/zHDq', 'CUSTOMER', '2026-09-06 12:08:24', '2026-09-06 12:08:24'),
(5, 'customer_1788696715773@test.com', '$2b$10$l61K05UB2iV4B4xDAii9oeEX9BzIPxoqzuGzGTumEDTEQ0.DzTHv.', 'CUSTOMER', '2026-09-06 12:11:55', '2026-09-06 12:11:55'),
(6, 'customer_1788696784174@test.com', '$2b$10$roG30DY3tCVjURSdR3BA3ei.zHJZbJMt7OyUwGdygBAOmH.3GfCpu', 'CUSTOMER', '2026-09-06 12:13:04', '2026-09-06 12:13:04'),
(7, 'customer_1788696826995@test.com', '$2b$10$lXSr7WiiH5MPykCO7V3MjOuv1mVvNLNq850y8VgrzR4elf.pvUC7K', 'CUSTOMER', '2026-09-06 12:13:47', '2026-09-06 12:13:47'),
(8, 'customer_1788696980409@test.com', '$2b$10$yaMyln18jPHAzjSJG0y0MOsKgW7F1b9HPjNJboQbg2.JxUnIP0DV.', 'CUSTOMER', '2026-09-06 12:16:20', '2026-09-06 12:16:20'),
(9, 'admin@test.com', '$2b$10$GZGEnzY61/FV0qxfdwY1J.m/ypFYJtIWta2fHcqti3RHth8RZqD32', 'ADMIN', '2026-09-06 12:16:34', '2026-09-06 12:16:34'),
(10, 'customer_1788696997807@test.com', '$2b$10$Zt3QnIxMIoNY0w/VlcDMI.E5vCRAdHIroBse2UL6eDCjp4OqmdQfW', 'CUSTOMER', '2026-09-06 12:16:38', '2026-09-06 12:16:38'),
(11, 'customer_1788697048004@test.com', '$2b$10$N2zHs9rGomIWqFkl/e2IXeMLAGRvslhp6Opq201olFcjPfCYFT00O', 'CUSTOMER', '2026-09-06 12:17:28', '2026-09-06 12:17:28'),
(12, 'customer_1788697058324@test.com', '$2b$10$8l3kr5bclspV6lTKw9W/zOGMFr3UxNX3L.leihaml3YkL/5a6FYYa', 'CUSTOMER', '2026-09-06 12:17:38', '2026-09-06 12:17:38'),
(13, 'customer_1788697098511@test.com', '$2b$10$/YDrCBlsEh19hcPzVfS6beAYGuCLIl/MnrSCxnI.TowPo6HHJt3Yy', 'CUSTOMER', '2026-09-06 12:18:18', '2026-09-06 12:18:18'),
(14, 'a@gmail.com', '$2b$10$a.KbC8nglLupB.zeJPQQ9OOZAaYpEMMEvK/TxnzQ26qpmfkyIjnjq', 'ADMIN', '2026-09-06 12:23:54', '2026-09-06 12:23:54'),
(15, 'keshani@gmail.com', '$2b$10$Y/8b3PXNOlSTZa0dyFkpIuMScwUlqHxuVZysqHWSX0Z9qDALbyUwC', 'CUSTOMER', '2026-09-06 12:58:21', '2026-09-06 12:58:21');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `submissions`
--
ALTER TABLE `submissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_submissions_user_created` (`userCreated`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `submissions`
--
ALTER TABLE `submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `submissions`
--
ALTER TABLE `submissions`
  ADD CONSTRAINT `fk_submissions_user_created` FOREIGN KEY (`userCreated`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
