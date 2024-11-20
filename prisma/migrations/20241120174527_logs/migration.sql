-- CreateEnum
CREATE TYPE "LogLevel" AS ENUM ('INFO', 'ERROR');

-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "level" "LogLevel" NOT NULL,
    "message" TEXT NOT NULL,
    "stackTrace" TEXT,
    "context" TEXT,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);
