/*
  Warnings:

  - You are about to drop the column `first_name` on the `Author` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `Author` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `Author` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Author` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Author` 
    RENAME COLUMN `first_name` TO `firstName`,
    RENAME COLUMN `last_name` TO `lastName`;
