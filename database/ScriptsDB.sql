--CREAR BASE DE DATOS
CREATE DATABASE  IF NOT EXISTS `furniture_inventory`;

--TABLA PRODUCTOS_TERMINADOS
DROP TABLE IF EXISTS `finished_products`;

CREATE TABLE `finished_products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `current_quantity` decimal(10,2) NOT NULL,
  `min_quantity` decimal(10,2) NOT NULL,
  `max_quantity` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`)
);

--TABLA MATERIALES
DROP TABLE IF EXISTS `raw_materials`;

CREATE TABLE `raw_materials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `current_quantity` decimal(10,2) NOT NULL,
  `min_quantity` decimal(10,2) NOT NULL,
  `max_quantity` decimal(10,2) NOT NULL,
  `measurement_unit` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

--TABLA DEBIL MATERIALES-PRODUCTOS
DROP TABLE IF EXISTS `products_materials`;

CREATE TABLE `products_materials` (
  `id_material` int NOT NULL,
  `id_product` int NOT NULL,
  `materials_used` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_material`,`id_product`),
  KEY `id_materials_idx` (`id_material`),
  KEY `id_products` (`id_product`),
  CONSTRAINT `id_materials` FOREIGN KEY (`id_material`) REFERENCES `raw_materials` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `id_products` FOREIGN KEY (`id_product`) REFERENCES `finished_products` (`id`) ON DELETE RESTRICT
);

--TABLA ROLES
DROP TABLE IF EXISTS `roles`;

CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
);

--TABLA USUARIOS
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doc_number` varchar(15) NOT NULL,
  `name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `id_rol` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `doc_number_UNIQUE` (`doc_number`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `id_rol_idx` (`id_rol`),
  CONSTRAINT `id_rol` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id`) ON DELETE CASCADE
);

--TABLA INVENTARIO
DROP TABLE IF EXISTS `inventory_movements`;

CREATE TABLE `inventory_movements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_material` int DEFAULT NULL,
  `id_product` int DEFAULT NULL,
  `movement_type` enum('entry','output','adjust') NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `description` text,
  `id_usuario` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_user_idx` (`id_usuario`),
  KEY `id_material_idx` (`id_material`),
  KEY `id_product_idx` (`id_product`),
  CONSTRAINT `id_material` FOREIGN KEY (`id_material`) REFERENCES `raw_materials` (`id`) ON DELETE CASCADE,
  CONSTRAINT `id_product` FOREIGN KEY (`id_product`) REFERENCES `finished_products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `id_user` FOREIGN KEY (`id_usuario`) REFERENCES `users` (`id`) ON DELETE CASCADE
);