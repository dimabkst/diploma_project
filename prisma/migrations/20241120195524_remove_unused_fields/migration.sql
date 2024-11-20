/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Manufacturer` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Manufacturer` table. All the data in the column will be lost.
  - You are about to drop the column `depthIndex` on the `ProductCategory` table. All the data in the column will be lost.
  - You are about to drop the column `parentCategoryId` on the `ProductCategory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductCategory" DROP CONSTRAINT "ProductCategory_parentCategoryId_fkey";

-- AlterTable
ALTER TABLE "Manufacturer" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "ProductCategory" DROP COLUMN "depthIndex",
DROP COLUMN "parentCategoryId";
