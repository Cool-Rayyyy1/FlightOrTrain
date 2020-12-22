/*
 Navicat Premium Data Transfer

 Source Server         : ump-on-k8s
 Source Server Type    : MySQL
 Source Server Version : 50730
 Source Host           : 172.23.26.24:30169
 Source Schema         : traffic

 Target Server Type    : MySQL
 Target Server Version : 50730
 File Encoding         : 65001

 Date: 23/07/2020 21:54:31
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for direct_train_data
-- ----------------------------
DROP TABLE IF EXISTS `direct_train_data`;
CREATE TABLE `direct_train_data` (
  `direct_train_id` varchar(20) NOT NULL,
  `start_date` varchar(10) DEFAULT NULL,
  `trainName` varchar(10) DEFAULT NULL,
  `startStationName` varchar(10) DEFAULT NULL,
  `endStationName` varchar(10) DEFAULT NULL,
  `startTime` varchar(10) DEFAULT NULL,
  `endTime` varchar(10) DEFAULT NULL,
  `second_price` varchar(10) DEFAULT NULL,
  `second_tickets` varchar(10) DEFAULT NULL,
  `first_price` varchar(10) DEFAULT NULL,
  `first_tickets` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`direct_train_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of direct_train_data
-- ----------------------------
BEGIN;
INSERT INTO `direct_train_data` VALUES ('T230', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for passenger
-- ----------------------------
DROP TABLE IF EXISTS `passenger`;
CREATE TABLE `passenger` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `target_city` varchar(255) DEFAULT NULL,
  `prefer_class` varchar(255) DEFAULT NULL,
  `prefer_train_degree` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of passenger
-- ----------------------------
BEGIN;
INSERT INTO `passenger` VALUES (1, 'A', 'CQ', 'CD', 'A', 1);
COMMIT;

-- ----------------------------
-- Table structure for plane_data
-- ----------------------------
DROP TABLE IF EXISTS `plane_data`;
CREATE TABLE `plane_data` (
  `flightId` varchar(50) NOT NULL,
  `airlineName` varchar(10) DEFAULT NULL,
  `flightNumber` varchar(15) DEFAULT NULL,
  `departure_cityName` varchar(10) DEFAULT NULL,
  `departure_airportName` varchar(10) DEFAULT NULL,
  `arrival_cityName` varchar(10) DEFAULT NULL,
  `arrival_airportName` varchar(10) DEFAULT NULL,
  `departureDate` varchar(255) DEFAULT NULL,
  `arrivalDate` varchar(255) DEFAULT NULL,
  `punctualityRate` varchar(10) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `special_price` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`flightId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of plane_data
-- ----------------------------
BEGIN;
INSERT INTO `plane_data` VALUES ('1', 'CA', '3344', 'CQ', 'JB', 'CD', 'SL', '2020-07-23 20:26:17', '2020-07-23 20:26:22', '1', 1200, '1100');
INSERT INTO `plane_data` VALUES ('2', 'CA', '3344', 'CQ', 'JB', 'CD', 'SL', '2020-07-25 20:00:00', '2020-07-25 22:00:00', '1', 1300, '1100');
INSERT INTO `plane_data` VALUES ('4', 'CA', '3344', 'CQ', 'JB', 'CD', 'SL', '2020-07-23 20:00:00', '2020-07-23 22:00:00', '1', 1200, '1100');
COMMIT;

-- ----------------------------
-- Table structure for transfer_train_data
-- ----------------------------
DROP TABLE IF EXISTS `transfer_train_data`;
CREATE TABLE `transfer_train_data` (
  `transfer_train_id` varchar(30) NOT NULL,
  `trainNo` varchar(10) DEFAULT NULL,
  `departTime` varchar(30) DEFAULT NULL,
  `arriveTime` varchar(20) DEFAULT NULL,
  `departStation` varchar(10) DEFAULT NULL,
  `arriveStation` varchar(30) DEFAULT NULL,
  `transferStation` varchar(10) DEFAULT NULL,
  `showPriceText` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`transfer_train_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `comment` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of user
-- ----------------------------
BEGIN;
INSERT INTO `user` VALUES (1, 'admin', 'admin', 'administrator');
INSERT INTO `user` VALUES (8, 'admin', 'admin', 'test');
INSERT INTO `user` VALUES (10, 'admin', 'admin', 'test');
INSERT INTO `user` VALUES (11, 'username', 'password', 'comment');
INSERT INTO `user` VALUES (12, 'username', 'password', 'comment');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
