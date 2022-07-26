-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versione server:              8.0.29 - MySQL Community Server - GPL
-- S.O. server:                  Win64
-- HeidiSQL Versione:            12.0.0.6468
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dump della struttura del database common
CREATE DATABASE IF NOT EXISTS `common` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `common`;

-- Dump della struttura di tabella common.localita
CREATE TABLE IF NOT EXISTS `localita` (
  `id` int unsigned NOT NULL,
  `descrizione` mediumtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dump dei dati della tabella common.localita: ~0 rows (circa)
INSERT INTO `localita` (`id`, `descrizione`) VALUES
	(1, 'luino'),
	(2, 'germignaga');


-- Dump della struttura del database test
CREATE DATABASE IF NOT EXISTS `test` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `test`;

-- Dump della struttura di tabella test.anagrafica
CREATE TABLE IF NOT EXISTS `anagrafica` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` mediumtext NOT NULL,
  `cognome` mediumtext NOT NULL,
  `idlocalita` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_anagrafica_common.localita` (`idlocalita`),
  CONSTRAINT `FK_anagrafica_common.localita` FOREIGN KEY (`idlocalita`) REFERENCES `common`.`localita` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dump dei dati della tabella test.anagrafica: ~3 rows (circa)
INSERT INTO `anagrafica` (`id`, `nome`, `cognome`, `idlocalita`) VALUES
	(1, 'danilo', 'pirola', 1),
	(2, 'pippo', 'baudo', 2),
	(3, 'danilo', 'pirola', 1);

-- Dump della struttura di vista test.anagrafica_view
-- Creazione di una tabella temporanea per risolvere gli errori di dipendenza della vista
CREATE TABLE `anagrafica_view` (
	`id` INT(10) NOT NULL,
	`nome` MEDIUMTEXT NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`cognome` MEDIUMTEXT NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`idlocalita` INT(10) UNSIGNED NULL,
	`descrizione` MEDIUMTEXT NOT NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dump della struttura di vista test.anagrafica_view
-- Rimozione temporanea di tabella e creazione della struttura finale della vista
DROP TABLE IF EXISTS `anagrafica_view`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `anagrafica_view` AS select `ana`.`id` AS `id`,`ana`.`nome` AS `nome`,`ana`.`cognome` AS `cognome`,`ana`.`idlocalita` AS `idlocalita`,`loc`.`descrizione` AS `descrizione` from (`anagrafica` `ana` join `common`.`localita` `loc` on((`loc`.`id` = `ana`.`idlocalita`)));

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
