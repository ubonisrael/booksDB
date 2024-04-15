-- prepares a MySQL server for the project

CREATE DATABASE IF NOT EXISTS whatif_db;
CREATE USER IF NOT EXISTS 'whatif_admin'@'localhost' IDENTIFIED BY 'Password_123';
GRANT CREATE, ALTER, DROP, REFERENCES ON *.* TO 'whatif_admin'@'localhost';
GRANT ALL PRIVILEGES ON `whatif_db`.* TO 'whatif_admin'@'localhost';
GRANT SELECT ON `performance_schema`.* TO 'whatif_admin'@'localhost';
FLUSH PRIVILEGES;
