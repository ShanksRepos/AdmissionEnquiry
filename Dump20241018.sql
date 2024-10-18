CREATE DATABASE  IF NOT EXISTS `testing` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `testing`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: testing
-- ------------------------------------------------------
-- Server version	8.0.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `confirm_admissions`
--

DROP TABLE IF EXISTS `confirm_admissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `confirm_admissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `phone` bigint NOT NULL,
  `parent_phone` bigint DEFAULT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `percentage` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `confirm_admissions_chk_1` CHECK (((`percentage` >= 0) and (`percentage` <= 100)))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `confirm_admissions`
--

LOCK TABLES `confirm_admissions` WRITE;
/*!40000 ALTER TABLE `confirm_admissions` DISABLE KEYS */;
INSERT INTO `confirm_admissions` VALUES (1,'Shankar Gavankar',9518364304,8530888346,'Male',86.90),(2,'Anuj Gopilal Sawant',8767527548,9381746578,'Male',87.00),(3,'Anuj Gopilal Sawant',8767527548,9381746578,'Male',87.00),(4,'Pratik Kumbhar',8275107325,8767527548,'Male',75.00),(5,'Anuj Gopilal Sawant',8767527548,9381746578,'Male',87.00),(6,'Pratik Kumbhar',8275107325,8767527548,'Male',75.00),(7,'Pratik Kumbhar',8275107325,8767527548,'Male',75.00),(8,'Pratik Kumbhar',9123456789,9381746578,'Female',45.50);
/*!40000 ALTER TABLE `confirm_admissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_details`
--

DROP TABLE IF EXISTS `student_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_details` (
  `student_id` int NOT NULL,
  `name` varchar(30) NOT NULL,
  `contact` varchar(15) NOT NULL,
  `parents_contact` varchar(15) NOT NULL,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `contact_UNIQUE` (`contact`),
  UNIQUE KEY `parents_contact_UNIQUE` (`parents_contact`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_details`
--

LOCK TABLES `student_details` WRITE;
/*!40000 ALTER TABLE `student_details` DISABLE KEYS */;
INSERT INTO `student_details` VALUES (1,'Sandeep Singh','+918530888346','+918275107325'),(2,'Shankar Gavankar','+919518364304','+919970431609');
/*!40000 ALTER TABLE `student_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_details3`
--

DROP TABLE IF EXISTS `student_details3`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_details3` (
  `student_id` int NOT NULL,
  `name` varchar(45) NOT NULL,
  `phone` varchar(45) NOT NULL,
  `parent_name` varchar(45) NOT NULL,
  `parent_phone` varchar(45) DEFAULT NULL,
  `gender` varchar(8) NOT NULL,
  `merit_1` int NOT NULL,
  `merit_2` int DEFAULT NULL,
  `merit_3` int DEFAULT NULL,
  `percentage` float DEFAULT NULL,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `phone_UNIQUE` (`phone`),
  UNIQUE KEY `parent's name_UNIQUE` (`parent_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_details3`
--

LOCK TABLES `student_details3` WRITE;
/*!40000 ALTER TABLE `student_details3` DISABLE KEYS */;
INSERT INTO `student_details3` VALUES (1,'Sandeep Singh','8530888346','Anuj','8275107325','Male',1,0,0,69.8),(2,'Sejal Bandekar','9518364304','Nirmit',NULL,'Female',0,0,1,61.56),(4,'Tejas Parab','8767527548','Vighnesh','9420721268','Male',0,0,1,80);
/*!40000 ALTER TABLE `student_details3` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_enquiry`
--

DROP TABLE IF EXISTS `student_enquiry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_enquiry` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `phone` bigint NOT NULL,
  `parent_phone` bigint DEFAULT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `percentage` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `student_enquiry_chk_1` CHECK (((`percentage` >= 0) and (`percentage` <= 100)))
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_enquiry`
--

LOCK TABLES `student_enquiry` WRITE;
/*!40000 ALTER TABLE `student_enquiry` DISABLE KEYS */;
INSERT INTO `student_enquiry` VALUES (1,'Shankar Sandip Gavankar',9518364304,8530888346,'Male',85.50),(2,'Anuj Gopilal Sawant',8275107325,8767527548,'Male',70.50),(3,'Pratik Kumbhar',9123456789,9381746578,'Female',45.50),(6,'Tejas Parab',9123456789,9420721268,'Male',65.00),(7,'Anuj Gopilal Sawant',9123456789,9381746578,'Male',56.00),(8,'Pratik Kumbhar',8275107325,9381746578,'Male',76.00),(9,'Om Ketan Palav',8275107325,9381746578,'Male',67.00);
/*!40000 ALTER TABLE `student_enquiry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students_who_have_filled_admission_form`
--

DROP TABLE IF EXISTS `students_who_have_filled_admission_form`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students_who_have_filled_admission_form` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `phone` bigint NOT NULL,
  `parent_phone` bigint DEFAULT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `percentage` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `students_who_have_filled_admission_form_chk_1` CHECK (((`percentage` >= 0) and (`percentage` <= 100)))
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students_who_have_filled_admission_form`
--

LOCK TABLES `students_who_have_filled_admission_form` WRITE;
/*!40000 ALTER TABLE `students_who_have_filled_admission_form` DISABLE KEYS */;
INSERT INTO `students_who_have_filled_admission_form` VALUES (1,'Pratik Kumbhar',8275107325,8767527548,'Male',75.00),(2,'Anuj Gopilal Sawant',8767527548,9381746578,'Male',87.00),(7,'Om Ketan Palav',8275107325,9381746578,'Male',67.00),(8,'Tejas Parab',9123456789,9420721268,'Male',65.00),(9,'Shankar Sandip Gavankar',9518364304,8530888346,'Male',85.50),(10,'Pratik Kumbhar',9123456789,9381746578,'Female',45.50);
/*!40000 ALTER TABLE `students_who_have_filled_admission_form` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'shankar','gavankarshankar@gmail.com','$2b$10$2LQYHG3Gkyvp5TX1vSI.JuZJWaexFbVLrBwkbNWfYoBIy/WA9aMZ6','2024-10-09 18:26:11');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-18 15:08:47
