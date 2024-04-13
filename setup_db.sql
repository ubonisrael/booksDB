-- prepares a MySQL server for the project

CREATE DATABASE IF NOT EXISTS whatif_test_db;
CREATE USER IF NOT EXISTS 'whatif_test'@'localhost' IDENTIFIED BY 'Whatif_pwd123';
GRANT ALL PRIVILEGES ON `whatif_test_db`.* TO 'whatif_test'@'localhost';
GRANT SELECT ON `performance_schema`.* TO 'whatif_test'@'localhost';
FLUSH PRIVILEGES;
