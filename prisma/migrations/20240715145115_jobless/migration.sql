-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `avatar` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `role` VARCHAR(191) NULL,
    `birthday` VARCHAR(191) NULL,
    `gender` VARCHAR(191) NULL,
    `refreshToken` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Seeker` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `summary` TEXT NULL,
    `resume` VARCHAR(191) NULL,
    `coverLetter` TEXT NULL,
    `desireSalary` VARCHAR(191) NULL,
    `startDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Seeker_userId_key`(`userId`),
    INDEX `Seeker_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `License` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `organization` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `seekerId` VARCHAR(191) NOT NULL,

    INDEX `License_seekerId_idx`(`seekerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Skill` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `seekerId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Skill_name_key`(`name`),
    INDEX `Skill_seekerId_idx`(`seekerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Links` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `seekerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Links_name_key`(`name`),
    INDEX `Links_seekerId_idx`(`seekerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Education` (
    `id` VARCHAR(191) NOT NULL,
    `startDate` VARCHAR(191) NOT NULL,
    `endDate` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `institution` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `GPA` DOUBLE NULL,
    `seekerId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Education_seekerId_idx`(`seekerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Experience` (
    `id` VARCHAR(191) NOT NULL,
    `startDate` VARCHAR(191) NOT NULL,
    `endDate` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `responsibilities` TEXT NOT NULL,
    `seekerId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Experience_seekerId_idx`(`seekerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SavedJobs` (
    `id` VARCHAR(191) NOT NULL,
    `seekerId` VARCHAR(191) NOT NULL,
    `jobAdsId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isBookmark` BOOLEAN NOT NULL DEFAULT false,

    INDEX `SavedJobs_jobAdsId_idx`(`jobAdsId`),
    INDEX `SavedJobs_seekerId_idx`(`seekerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Employer` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `accountName` VARCHAR(191) NULL,
    `accountNumber` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Employer_userId_key`(`userId`),
    INDEX `Employer_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JobAds` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `requirements` TEXT NOT NULL,
    `salary` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `location` VARCHAR(191) NULL,
    `workType` VARCHAR(191) NOT NULL,
    `payType` VARCHAR(191) NOT NULL,
    `employerId` VARCHAR(191) NOT NULL,
    `savedJobsIds` VARCHAR(191) NULL,

    INDEX `JobAds_employerId_idx`(`employerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Application` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NOT NULL,
    `seekerId` VARCHAR(191) NOT NULL,
    `jobAdsId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Application_jobAdsId_idx`(`jobAdsId`),
    INDEX `Application_seekerId_idx`(`seekerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Company` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `logo` VARCHAR(191) NULL,
    `header` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `industry` VARCHAR(191) NULL,
    `size` INTEGER NULL,
    `location` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `benefit` VARCHAR(191) NULL,
    `contactInfo` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `employerId` VARCHAR(191) NULL,

    UNIQUE INDEX `Company_employerId_key`(`employerId`),
    INDEX `Company_employerId_idx`(`employerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Address` (
    `id` VARCHAR(191) NOT NULL,
    `street` VARCHAR(191) NULL,
    `province` VARCHAR(191) NULL,
    `regency` VARCHAR(191) NULL,
    `district` VARCHAR(191) NULL,
    `village` VARCHAR(191) NULL,
    `postCode` VARCHAR(191) NULL,
    `companyId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Address_companyId_key`(`companyId`),
    INDEX `Address_companyId_idx`(`companyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
