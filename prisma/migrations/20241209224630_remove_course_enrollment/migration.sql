/*
  Warnings:

  - You are about to drop the `CourseEnrollment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CourseEnrollment" DROP CONSTRAINT "CourseEnrollment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CourseEnrollment" DROP CONSTRAINT "CourseEnrollment_userId_fkey";

-- DropTable
DROP TABLE "CourseEnrollment";
