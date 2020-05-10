-- phpMyAdmin SQL Dump
-- version 4.4.15.9
-- https://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: May 10, 2020 at 01:32 PM
-- Server version: 5.6.37
-- PHP Version: 5.6.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `photoWebApp`
--

-- --------------------------------------------------------

--
-- Table structure for table `comentarii`
--

CREATE TABLE IF NOT EXISTS `comentarii` (
  `comid` varchar(30) NOT NULL,
  `userid` varchar(30) NOT NULL,
  `pozaid` varchar(30) NOT NULL,
  `text` varchar(500) NOT NULL,
  `data` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `likeuri`
--

CREATE TABLE IF NOT EXISTS `likeuri` (
  `userid` varchar(30) NOT NULL,
  `pozaid` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `poze`
--

CREATE TABLE IF NOT EXISTS `poze` (
  `pozaid` varchar(30) NOT NULL,
  `userid` varchar(30) NOT NULL,
  `data` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `calepoza` varchar(100) NOT NULL,
  `titlu` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `userid` varchar(30) NOT NULL,
  `uname` varchar(30) NOT NULL,
  `passwd` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userid`, `uname`, `passwd`) VALUES
('1000', 'administrator', 'administrator');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comentarii`
--
ALTER TABLE `comentarii`
  ADD PRIMARY KEY (`comid`),
  ADD KEY `userid` (`userid`,`pozaid`),
  ADD KEY `pozaid` (`pozaid`);

--
-- Indexes for table `likeuri`
--
ALTER TABLE `likeuri`
  ADD PRIMARY KEY (`userid`,`pozaid`),
  ADD KEY `userid` (`userid`),
  ADD KEY `pozaid` (`pozaid`),
  ADD KEY `userid_2` (`userid`),
  ADD KEY `pozaid_2` (`pozaid`);

--
-- Indexes for table `poze`
--
ALTER TABLE `poze`
  ADD PRIMARY KEY (`pozaid`),
  ADD KEY `userid` (`userid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userid`),
  ADD UNIQUE KEY `userid_2` (`userid`),
  ADD KEY `userid` (`userid`),
  ADD KEY `userid_3` (`userid`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comentarii`
--
ALTER TABLE `comentarii`
  ADD CONSTRAINT `comentarii_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comentarii_ibfk_2` FOREIGN KEY (`pozaid`) REFERENCES `poze` (`pozaid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `likeuri`
--
ALTER TABLE `likeuri`
  ADD CONSTRAINT `likeuri_ibfk_1` FOREIGN KEY (`pozaid`) REFERENCES `poze` (`pozaid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likeuri_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `poze`
--
ALTER TABLE `poze`
  ADD CONSTRAINT `poze_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
