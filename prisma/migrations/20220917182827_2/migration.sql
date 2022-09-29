-- DropForeignKey
ALTER TABLE "UserAchiev" DROP CONSTRAINT "UserAchiev_user_id_fkey";

-- AlterTable
ALTER TABLE "UserAchiev" ALTER COLUMN "user_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "UserAchiev" ADD CONSTRAINT "UserAchiev_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("login") ON DELETE CASCADE ON UPDATE CASCADE;
