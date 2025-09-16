-- DropForeignKey
ALTER TABLE `appointments` DROP FOREIGN KEY `appointments_patientId_fkey`;

-- AlterTable
ALTER TABLE `appointments` ADD COLUMN `firstName` VARCHAR(191) NULL,
    ADD COLUMN `lastName` VARCHAR(191) NULL,
    MODIFY `patientId` VARCHAR(191) NULL,
    MODIFY `time` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `doctors` ADD COLUMN `availableDays` VARCHAR(191) NULL,
    ADD COLUMN `availableEndTime` VARCHAR(191) NULL,
    ADD COLUMN `availableStartTime` VARCHAR(191) NULL,
    ADD COLUMN `awards` TEXT NULL,
    ADD COLUMN `biography` TEXT NULL,
    ADD COLUMN `bloodGroup` VARCHAR(191) NULL,
    ADD COLUMN `boardCertification` VARCHAR(191) NULL,
    ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `country` VARCHAR(191) NULL DEFAULT 'USA',
    ADD COLUMN `dateOfBirth` DATETIME(3) NULL,
    ADD COLUMN `department` VARCHAR(191) NULL,
    ADD COLUMN `designation` VARCHAR(191) NULL,
    ADD COLUMN `emergencyContactName` VARCHAR(191) NULL,
    ADD COLUMN `emergencyContactPhone` VARCHAR(191) NULL,
    ADD COLUMN `emergencyContactRelationship` VARCHAR(191) NULL,
    ADD COLUMN `fellowships` VARCHAR(191) NULL,
    ADD COLUMN `hospitalAffiliations` TEXT NULL,
    ADD COLUMN `insuranceAccepted` TEXT NULL,
    ADD COLUMN `joiningDate` DATETIME(3) NULL,
    ADD COLUMN `languages` VARCHAR(191) NULL,
    ADD COLUMN `licenseExpiryDate` DATETIME(3) NULL,
    ADD COLUMN `medicalDegree` VARCHAR(191) NULL,
    ADD COLUMN `publications` TEXT NULL,
    ADD COLUMN `state` VARCHAR(191) NULL,
    ADD COLUMN `zipCode` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `patients` ADD COLUMN `admitDate` DATETIME(3) NULL,
    ADD COLUMN `admitTime` VARCHAR(191) NULL,
    ADD COLUMN `advanceAmount` VARCHAR(191) NULL,
    ADD COLUMN `bloodPressure` VARCHAR(191) NULL,
    ADD COLUMN `currentMedication` TEXT NULL,
    ADD COLUMN `diabetes` VARCHAR(191) NULL,
    ADD COLUMN `diagnosis` TEXT NULL,
    ADD COLUMN `doctorId` VARCHAR(191) NULL,
    ADD COLUMN `doctorNotes` TEXT NULL,
    ADD COLUMN `hasInsurance` VARCHAR(191) NULL,
    ADD COLUMN `insuranceNumber` VARCHAR(191) NULL,
    ADD COLUMN `labReports` TEXT NULL,
    ADD COLUMN `notes` TEXT NULL,
    ADD COLUMN `pastMedicationHistory` TEXT NULL,
    ADD COLUMN `paymentOption` VARCHAR(191) NULL,
    ADD COLUMN `problem` TEXT NULL,
    ADD COLUMN `sugarLevel` VARCHAR(191) NULL,
    ADD COLUMN `sugarStatus` VARCHAR(191) NULL,
    ADD COLUMN `treatmentPlan` TEXT NULL,
    ADD COLUMN `wardNumber` VARCHAR(191) NULL,
    ADD COLUMN `weight` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `patients`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
