-- CreateTable
CREATE TABLE `User` (
    `username` VARCHAR(255) NOT NULL,
    `uid` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `emailVerified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,
    `type` ENUM('USER', 'MANAGER', 'ADMIN', 'SUPER', 'OWNER', 'UNKNOWN') NULL DEFAULT 'USER',
    `status` ENUM('INACTIVE', 'ACTIVE', 'CLOSED', 'CANCELED', 'DISABLED', 'LOCKED', 'DELETED', 'PAID', 'PENDING', 'FAILED', 'UNCLAIMED') NULL DEFAULT 'ACTIVE',
    `flags` VARCHAR(500) NULL,
    `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_uid_key`(`uid`),
    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `user_id_idx`(`id`),
    INDEX `user_email_idx`(`email`),
    INDEX `user_username_idx`(`username`),
    INDEX `user_uid_idx`(`uid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Profile` (
    `username` VARCHAR(255) NOT NULL,
    `title` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `oneLiner` VARCHAR(255) NULL DEFAULT '',
    `bio` VARCHAR(255) NULL DEFAULT '',
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `elements` JSON NULL,
    `featuredLinks` JSON NULL,
    `flags` VARCHAR(500) NULL,
    `status` ENUM('INACTIVE', 'ACTIVE', 'CLOSED', 'CANCELED', 'DISABLED', 'LOCKED', 'DELETED', 'PAID', 'PENDING', 'FAILED', 'UNCLAIMED') NULL DEFAULT 'ACTIVE',

    UNIQUE INDEX `Profile_username_key`(`username`),
    INDEX `profile_username_idx`(`username`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WalletList` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `type` ENUM('DEVELOPER', 'ARTIST') NOT NULL,
    `cohort` INTEGER NULL DEFAULT 0,
    `wallet` VARCHAR(191) NOT NULL,
    `twitter` VARCHAR(191) NULL,
    `questions` JSON NULL,
    `data` JSON NULL,
    `flags` VARCHAR(500) NULL,
    `status` ENUM('INACTIVE', 'ACTIVE', 'CLOSED', 'CANCELED', 'DISABLED', 'LOCKED', 'DELETED', 'PAID', 'PENDING', 'FAILED', 'UNCLAIMED') NULL DEFAULT 'PENDING',
    `lastCheck` DATETIME(0) NULL,
    `assetId` VARCHAR(191) NULL,

    UNIQUE INDEX `WalletList_id_key`(`id`),
    INDEX `wallet_list_type_idx`(`type`),
    INDEX `wallet_list_type_assetId_idx`(`type`, `assetId`),
    INDEX `wallet_list_user_id_idx`(`userId`),
    INDEX `wallet_list__id_idx`(`wallet`),
    INDEX `wallet_list_twitter_id_idx`(`twitter`),
    UNIQUE INDEX `WalletList_type_wallet_key`(`type`, `wallet`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `refresh_token_expires_in` INTEGER NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,
    `provider_profile` JSON NULL,

    INDEX `provider_account_id_idx`(`providerAccountId`),
    INDEX `provider_user_id_idx`(`userId`),
    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationToken` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationToken_token_key`(`token`),
    UNIQUE INDEX `VerificationToken_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
    INDEX `session_user_id_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
