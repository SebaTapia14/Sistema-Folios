-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: sistema_folios
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auditlogs`
--

DROP TABLE IF EXISTS `auditlogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditlogs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `action` varchar(255) NOT NULL,
  `folioId` int DEFAULT NULL,
  `details` text,
  `createdAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `folioId` (`folioId`),
  CONSTRAINT `auditlogs_ibfk_301` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `auditlogs_ibfk_302` FOREIGN KEY (`folioId`) REFERENCES `folios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditlogs`
--

LOCK TABLES `auditlogs` WRITE;
/*!40000 ALTER TABLE `auditlogs` DISABLE KEYS */;
INSERT INTO `auditlogs` VALUES (1,1,'Creó el usuario MarcoCalas',NULL,NULL,'2024-11-19 18:32:47'),(2,1,'Creación de Usuario',NULL,'Creó el usuario MarcoCalas con rol oficina de partes direccion','2024-11-19 18:32:48');
/*!40000 ALTER TABLE `auditlogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `directionId` int DEFAULT NULL,
  `code` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `code_2` (`code`),
  UNIQUE KEY `code_3` (`code`),
  UNIQUE KEY `code_4` (`code`),
  UNIQUE KEY `code_5` (`code`),
  UNIQUE KEY `code_6` (`code`),
  UNIQUE KEY `code_7` (`code`),
  UNIQUE KEY `code_8` (`code`),
  UNIQUE KEY `code_9` (`code`),
  UNIQUE KEY `code_10` (`code`),
  UNIQUE KEY `code_11` (`code`),
  UNIQUE KEY `code_12` (`code`),
  UNIQUE KEY `code_13` (`code`),
  UNIQUE KEY `code_14` (`code`),
  UNIQUE KEY `code_15` (`code`),
  UNIQUE KEY `code_16` (`code`),
  UNIQUE KEY `code_17` (`code`),
  UNIQUE KEY `code_18` (`code`),
  UNIQUE KEY `code_19` (`code`),
  UNIQUE KEY `code_20` (`code`),
  UNIQUE KEY `code_21` (`code`),
  UNIQUE KEY `code_22` (`code`),
  UNIQUE KEY `code_23` (`code`),
  UNIQUE KEY `code_24` (`code`),
  UNIQUE KEY `code_25` (`code`),
  UNIQUE KEY `code_26` (`code`),
  UNIQUE KEY `code_27` (`code`),
  UNIQUE KEY `code_28` (`code`),
  UNIQUE KEY `code_29` (`code`),
  UNIQUE KEY `code_30` (`code`),
  UNIQUE KEY `code_31` (`code`),
  UNIQUE KEY `code_32` (`code`),
  UNIQUE KEY `code_33` (`code`),
  UNIQUE KEY `code_34` (`code`),
  UNIQUE KEY `code_35` (`code`),
  UNIQUE KEY `code_36` (`code`),
  UNIQUE KEY `code_37` (`code`),
  UNIQUE KEY `code_38` (`code`),
  UNIQUE KEY `code_39` (`code`),
  UNIQUE KEY `code_40` (`code`),
  UNIQUE KEY `code_41` (`code`),
  UNIQUE KEY `code_42` (`code`),
  UNIQUE KEY `code_43` (`code`),
  UNIQUE KEY `code_44` (`code`),
  UNIQUE KEY `code_45` (`code`),
  UNIQUE KEY `code_46` (`code`),
  UNIQUE KEY `code_47` (`code`),
  UNIQUE KEY `code_48` (`code`),
  UNIQUE KEY `code_49` (`code`),
  UNIQUE KEY `code_50` (`code`),
  UNIQUE KEY `code_51` (`code`),
  UNIQUE KEY `code_52` (`code`),
  UNIQUE KEY `code_53` (`code`),
  UNIQUE KEY `code_54` (`code`),
  KEY `directionId` (`directionId`),
  CONSTRAINT `departments_ibfk_1` FOREIGN KEY (`directionId`) REFERENCES `directions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (34,'Fiscalización',2,'FISC'),(35,'Programas Comunitarios',4,'PCOM'),(36,'Fomento Productivo',5,'FP'),(37,'Asistencia Social',12,'ASOC'),(38,'Gestión Social',NULL,'GSOC'),(39,'Planificación y Gestión Presupuestaria',13,'DPPG'),(40,'Desarrollo Urbano',13,'DURB'),(41,'Desarrollo Urbano e Infraestructura',7,'DURIN'),(42,'Estudios y Proyectos',13,'EYP'),(43,'Ferias',8,'DPF'),(44,'Vigilancia Comunitaria',8,'DVC'),(45,'Acción Comunitaria',12,'DAC'),(46,'Servicios Generales',1,'DSG'),(47,'Gestión y Desarrollo de Personas',1,'DGDP'),(48,'Informática',1,'DINFO'),(49,'Ingreso y Cobranza',14,'DICOB'),(50,'Permisos de Circulación',14,'DPC'),(51,'Patentes Comerciales e Inspecciones',14,'DPCI'),(52,'Ventanilla Única',14,'DVU'),(53,'Adquisiciones',6,'DAQUI'),(54,'Finanzas',6,'DEF'),(55,'Aseo',10,'DAS'),(56,'Salud Ambiental y Bienestar Animal',10,'DSAB'),(57,'Edificación',7,'DE'),(58,'Gestión Urbana y Habitacional',7,'DGUH'),(59,'Catastro y Certificación',7,'DCC'),(60,'Licencias de Conducir',9,'DLC'),(61,'Archivo',9,'DA'),(62,'Ingeniería en Tránsito',9,'DIT'),(63,'Operaciones',15,'DO'),(64,'Emergencias',NULL,'DEM'),(65,'Compras y Control de Gestión',1,'DCCG');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `directions`
--

DROP TABLE IF EXISTS `directions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `directions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_code` (`code`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `code_2` (`code`),
  UNIQUE KEY `code_3` (`code`),
  UNIQUE KEY `code_4` (`code`),
  UNIQUE KEY `code_5` (`code`),
  UNIQUE KEY `code_6` (`code`),
  UNIQUE KEY `code_7` (`code`),
  UNIQUE KEY `code_8` (`code`),
  UNIQUE KEY `code_9` (`code`),
  UNIQUE KEY `code_10` (`code`),
  UNIQUE KEY `code_11` (`code`),
  UNIQUE KEY `code_12` (`code`),
  UNIQUE KEY `code_13` (`code`),
  UNIQUE KEY `code_14` (`code`),
  UNIQUE KEY `code_15` (`code`),
  UNIQUE KEY `code_16` (`code`),
  UNIQUE KEY `code_17` (`code`),
  UNIQUE KEY `code_18` (`code`),
  UNIQUE KEY `code_19` (`code`),
  UNIQUE KEY `code_20` (`code`),
  UNIQUE KEY `code_21` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directions`
--

LOCK TABLES `directions` WRITE;
/*!40000 ALTER TABLE `directions` DISABLE KEYS */;
INSERT INTO `directions` VALUES (1,'Dirección Gestión Administrativa','DGA'),(2,'Dirección de Administración Municipal','ADM'),(3,'Dirección de Control','DCTRL'),(4,'Dirección de Desarrollo Comunitario','DIDECO'),(5,'Dirección Desarrollo Económico Local','DIDEL'),(6,'Dirección de Administración y Finanzas','DAF'),(7,'Dirección de Obras Municipales','DOM'),(8,'Dirección de Seguridad Comunitaria','DSC'),(9,'Dirección de Tránsito y Transporte Público','DTT'),(10,'Dirección Medio Ambiente Aseo y Ornato','DMAO'),(11,'Dirección Jurídica','DJUR'),(12,'Dirección Desarrollo Social','DIDESO'),(13,'Dirección Secretaría de Planificación Comunal','SECPLAN'),(14,'Dirección de Rentas','RENTAS'),(15,'Dirección de Gestión de Riesgos y Desastres','DGRD'),(16,'Juzgado de Policía Local','JPL'),(17,'Secretaría Municipal','SECMU'),(18,'Alcaldía','ALCL'),(19,'Gabinete','GAB');
/*!40000 ALTER TABLE `directions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `document_types`
--

DROP TABLE IF EXISTS `document_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `document_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `name_2` (`name`),
  UNIQUE KEY `code_2` (`code`),
  UNIQUE KEY `name_3` (`name`),
  UNIQUE KEY `code_3` (`code`),
  UNIQUE KEY `name_4` (`name`),
  UNIQUE KEY `code_4` (`code`),
  UNIQUE KEY `name_5` (`name`),
  UNIQUE KEY `code_5` (`code`),
  UNIQUE KEY `name_6` (`name`),
  UNIQUE KEY `code_6` (`code`),
  UNIQUE KEY `name_7` (`name`),
  UNIQUE KEY `code_7` (`code`),
  UNIQUE KEY `name_8` (`name`),
  UNIQUE KEY `code_8` (`code`),
  UNIQUE KEY `name_9` (`name`),
  UNIQUE KEY `code_9` (`code`),
  UNIQUE KEY `name_10` (`name`),
  UNIQUE KEY `code_10` (`code`),
  UNIQUE KEY `name_11` (`name`),
  UNIQUE KEY `code_11` (`code`),
  UNIQUE KEY `name_12` (`name`),
  UNIQUE KEY `code_12` (`code`),
  UNIQUE KEY `name_13` (`name`),
  UNIQUE KEY `code_13` (`code`),
  UNIQUE KEY `name_14` (`name`),
  UNIQUE KEY `code_14` (`code`),
  UNIQUE KEY `name_15` (`name`),
  UNIQUE KEY `code_15` (`code`),
  UNIQUE KEY `name_16` (`name`),
  UNIQUE KEY `code_16` (`code`),
  UNIQUE KEY `name_17` (`name`),
  UNIQUE KEY `code_17` (`code`),
  UNIQUE KEY `name_18` (`name`),
  UNIQUE KEY `code_18` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `document_types`
--

LOCK TABLES `document_types` WRITE;
/*!40000 ALTER TABLE `document_types` DISABLE KEYS */;
INSERT INTO `document_types` VALUES (1,'Memorándum','MEMO'),(2,'Oficio','OFIC'),(3,'Informe','INF'),(4,'Certificado','CERT'),(5,'Decreto','DECR'),(6,'Acta','ACTA'),(7,'Providencia','PROV');
/*!40000 ALTER TABLE `document_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documenttypes`
--

DROP TABLE IF EXISTS `documenttypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documenttypes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `documenttypes_name_code` (`name`,`code`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `name_2` (`name`),
  UNIQUE KEY `code_2` (`code`),
  UNIQUE KEY `name_3` (`name`),
  UNIQUE KEY `code_3` (`code`),
  UNIQUE KEY `name_4` (`name`),
  UNIQUE KEY `code_4` (`code`),
  UNIQUE KEY `name_5` (`name`),
  UNIQUE KEY `code_5` (`code`),
  UNIQUE KEY `name_6` (`name`),
  UNIQUE KEY `code_6` (`code`),
  UNIQUE KEY `name_7` (`name`),
  UNIQUE KEY `code_7` (`code`),
  UNIQUE KEY `name_8` (`name`),
  UNIQUE KEY `code_8` (`code`),
  UNIQUE KEY `name_9` (`name`),
  UNIQUE KEY `code_9` (`code`),
  UNIQUE KEY `name_10` (`name`),
  UNIQUE KEY `code_10` (`code`),
  UNIQUE KEY `name_11` (`name`),
  UNIQUE KEY `code_11` (`code`),
  UNIQUE KEY `name_12` (`name`),
  UNIQUE KEY `code_12` (`code`),
  UNIQUE KEY `name_13` (`name`),
  UNIQUE KEY `code_13` (`code`),
  UNIQUE KEY `name_14` (`name`),
  UNIQUE KEY `code_14` (`code`),
  UNIQUE KEY `name_15` (`name`),
  UNIQUE KEY `code_15` (`code`),
  UNIQUE KEY `name_16` (`name`),
  UNIQUE KEY `code_16` (`code`),
  UNIQUE KEY `name_17` (`name`),
  UNIQUE KEY `code_17` (`code`),
  UNIQUE KEY `name_18` (`name`),
  UNIQUE KEY `code_18` (`code`),
  UNIQUE KEY `name_19` (`name`),
  UNIQUE KEY `code_19` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documenttypes`
--

LOCK TABLES `documenttypes` WRITE;
/*!40000 ALTER TABLE `documenttypes` DISABLE KEYS */;
INSERT INTO `documenttypes` VALUES (23,'Acta','ACTA'),(21,'Certificado','CERT'),(22,'Decreto','DECR'),(20,'Informe','INF'),(18,'Memorándum','MEMO'),(19,'Oficio','OFIC'),(24,'Providencia','PROV');
/*!40000 ALTER TABLE `documenttypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `folios`
--

DROP TABLE IF EXISTS `folios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `folios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `directionId` int DEFAULT NULL,
  `departmentId` int DEFAULT NULL,
  `typeId` int DEFAULT NULL,
  `scope` enum('interno','externo') NOT NULL,
  `correlativo` int NOT NULL,
  `folioNumber` varchar(255) NOT NULL,
  `year` int NOT NULL,
  `topic` varchar(255) NOT NULL,
  `description` text,
  `dateCreated` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `observations` text,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `folioNumber` (`folioNumber`),
  UNIQUE KEY `folioNumber_2` (`folioNumber`),
  UNIQUE KEY `folioNumber_3` (`folioNumber`),
  UNIQUE KEY `folioNumber_4` (`folioNumber`),
  UNIQUE KEY `folioNumber_5` (`folioNumber`),
  UNIQUE KEY `folioNumber_6` (`folioNumber`),
  UNIQUE KEY `folioNumber_7` (`folioNumber`),
  UNIQUE KEY `folioNumber_8` (`folioNumber`),
  UNIQUE KEY `folioNumber_9` (`folioNumber`),
  UNIQUE KEY `folioNumber_10` (`folioNumber`),
  UNIQUE KEY `folioNumber_11` (`folioNumber`),
  UNIQUE KEY `folioNumber_12` (`folioNumber`),
  UNIQUE KEY `folioNumber_13` (`folioNumber`),
  UNIQUE KEY `folioNumber_14` (`folioNumber`),
  UNIQUE KEY `folioNumber_15` (`folioNumber`),
  UNIQUE KEY `folioNumber_16` (`folioNumber`),
  UNIQUE KEY `folioNumber_17` (`folioNumber`),
  UNIQUE KEY `folioNumber_18` (`folioNumber`),
  UNIQUE KEY `folioNumber_19` (`folioNumber`),
  UNIQUE KEY `folioNumber_20` (`folioNumber`),
  UNIQUE KEY `folioNumber_21` (`folioNumber`),
  UNIQUE KEY `folioNumber_22` (`folioNumber`),
  UNIQUE KEY `folioNumber_23` (`folioNumber`),
  UNIQUE KEY `folioNumber_24` (`folioNumber`),
  UNIQUE KEY `folioNumber_25` (`folioNumber`),
  UNIQUE KEY `folioNumber_26` (`folioNumber`),
  UNIQUE KEY `folioNumber_27` (`folioNumber`),
  UNIQUE KEY `folioNumber_28` (`folioNumber`),
  UNIQUE KEY `folioNumber_29` (`folioNumber`),
  UNIQUE KEY `folioNumber_30` (`folioNumber`),
  UNIQUE KEY `folioNumber_31` (`folioNumber`),
  UNIQUE KEY `folioNumber_32` (`folioNumber`),
  UNIQUE KEY `folioNumber_33` (`folioNumber`),
  UNIQUE KEY `folioNumber_34` (`folioNumber`),
  UNIQUE KEY `folioNumber_35` (`folioNumber`),
  UNIQUE KEY `folioNumber_36` (`folioNumber`),
  UNIQUE KEY `folioNumber_37` (`folioNumber`),
  UNIQUE KEY `folioNumber_38` (`folioNumber`),
  UNIQUE KEY `folioNumber_39` (`folioNumber`),
  UNIQUE KEY `folioNumber_40` (`folioNumber`),
  UNIQUE KEY `folioNumber_41` (`folioNumber`),
  UNIQUE KEY `folioNumber_42` (`folioNumber`),
  UNIQUE KEY `folioNumber_43` (`folioNumber`),
  UNIQUE KEY `folioNumber_44` (`folioNumber`),
  UNIQUE KEY `folioNumber_45` (`folioNumber`),
  UNIQUE KEY `folioNumber_46` (`folioNumber`),
  KEY `directionId` (`directionId`),
  KEY `departmentId` (`departmentId`),
  KEY `typeId` (`typeId`),
  KEY `userId` (`userId`),
  CONSTRAINT `folios_ibfk_724` FOREIGN KEY (`directionId`) REFERENCES `directions` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `folios_ibfk_725` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `folios_ibfk_726` FOREIGN KEY (`typeId`) REFERENCES `documenttypes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `folios_ibfk_727` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `folios`
--

LOCK TABLES `folios` WRITE;
/*!40000 ALTER TABLE `folios` DISABLE KEYS */;
/*!40000 ALTER TABLE `folios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `token` varchar(255) NOT NULL,
  `expiresAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `password_reset_tokens_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refreshtokens`
--

DROP TABLE IF EXISTS `refreshtokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refreshtokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` varchar(255) NOT NULL,
  `userId` int NOT NULL,
  `expiresAt` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `refreshtokens_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refreshtokens`
--

LOCK TABLES `refreshtokens` WRITE;
/*!40000 ALTER TABLE `refreshtokens` DISABLE KEYS */;
INSERT INTO `refreshtokens` VALUES (1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTczMjA0MDkzMCwiZXhwIjoxNzMyNjQ1NzMwfQ.ePJeTFNT9LdOxaUgTy6lAWOnHq485gPj38knCi3xvFQ',1,'2024-11-26 18:28:50','2024-11-19 18:28:50','2024-11-19 18:28:50'),(2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTczMjA0MTE0NSwiZXhwIjoxNzMyNjQ1OTQ1fQ.4XL8kpuUxd0UhHSKp0CYQ3Za-tjOKrRdc_5n59d9D8Q',1,'2024-11-26 18:32:25','2024-11-19 18:32:25','2024-11-19 18:32:25'),(3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTczMjA0MTE5NCwiZXhwIjoxNzMyNjQ1OTk0fQ.P4oRR0gug6UrSBU4QS9egLNE_ZS81rbqboThlNdPd1k',2,'2024-11-26 18:33:14','2024-11-19 18:33:14','2024-11-19 18:33:14'),(4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTczMjA0MjQ5OCwiZXhwIjoxNzMyNjQ3Mjk4fQ.cu2ncX9FENYaWx1ZE0yYZr2wrCqYdncgCjk2PQ_VDVY',1,'2024-11-26 18:54:58','2024-11-19 18:54:58','2024-11-19 18:54:58'),(5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTczMjA0MjUxMywiZXhwIjoxNzMyNjQ3MzEzfQ.Hi1L5eXi6lBWqorNFBNFjMt5joD4PGMArUEH3n1BHUY',2,'2024-11-26 18:55:13','2024-11-19 18:55:13','2024-11-19 18:55:13'),(6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTczMjA0MjUzOCwiZXhwIjoxNzMyNjQ3MzM4fQ.z4nhB29QhwFWc0AWMONkd5AYYfkoGkFLHgvRcSRKa7U',2,'2024-11-26 18:55:38','2024-11-19 18:55:38','2024-11-19 18:55:38'),(7,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTczMjA0MzMxNiwiZXhwIjoxNzMyNjQ4MTE2fQ.M1JXImm1j9t7uvMHjyob7xv_DOfVtmuDi__7-sR52Po',1,'2024-11-26 19:08:36','2024-11-19 19:08:36','2024-11-19 19:08:36');
/*!40000 ALTER TABLE `refreshtokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','oficina de partes municipal','oficina de partes direccion') NOT NULL,
  `directionId` int DEFAULT NULL COMMENT 'Solo aplicable para usuarios de oficina de partes direccion',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `username_2` (`username`),
  UNIQUE KEY `username_3` (`username`),
  UNIQUE KEY `username_4` (`username`),
  UNIQUE KEY `username_5` (`username`),
  UNIQUE KEY `username_6` (`username`),
  UNIQUE KEY `username_7` (`username`),
  UNIQUE KEY `username_8` (`username`),
  UNIQUE KEY `username_9` (`username`),
  UNIQUE KEY `username_10` (`username`),
  UNIQUE KEY `username_11` (`username`),
  UNIQUE KEY `username_12` (`username`),
  UNIQUE KEY `username_13` (`username`),
  UNIQUE KEY `username_14` (`username`),
  UNIQUE KEY `username_15` (`username`),
  UNIQUE KEY `username_16` (`username`),
  UNIQUE KEY `username_17` (`username`),
  UNIQUE KEY `username_18` (`username`),
  UNIQUE KEY `username_19` (`username`),
  UNIQUE KEY `username_20` (`username`),
  KEY `directionId` (`directionId`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`directionId`) REFERENCES `directions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','$2a$10$0yNDJ3k2wcKY7h84Z3k0Qu7yPsE.OT5N5bdL/UbKRx/kCaOWIuYb2','admin',NULL,'2024-11-19 15:26:59','2024-11-19 15:26:59'),(2,'MarcoCalas','$2a$10$7s0KMtl9GtNotB1C1cEzquHuiD3ueqFCi2yc2u3ZgBhhO.fcVPbp.','oficina de partes direccion',1,'2024-11-19 18:32:47','2024-11-19 18:32:47');
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

-- Dump completed on 2024-11-21 16:52:18
