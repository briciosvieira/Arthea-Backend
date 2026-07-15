-- CreateEnum
CREATE TYPE "HeroType" AS ENUM ('VIDEO', 'IMAGE');

-- CreateEnum
CREATE TYPE "SliderSection" AS ENUM ('RECEPCAO', 'CONSULTORIO');

-- CreateTable
CREATE TABLE "HeroMedia" (
    "id" TEXT NOT NULL,
    "type" "HeroType" NOT NULL DEFAULT 'VIDEO',
    "videoPath" TEXT,
    "imagePath" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SliderImage" (
    "id" TEXT NOT NULL,
    "section" "SliderSection" NOT NULL,
    "filePath" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SliderImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuemSomosImage" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "filePath" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuemSomosImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuemSomosImage_position_key" ON "QuemSomosImage"("position");
