-- DropForeignKey
ALTER TABLE "match_history" DROP CONSTRAINT "match_history_loser_id_fkey";

-- DropForeignKey
ALTER TABLE "match_history" DROP CONSTRAINT "match_history_winner_id_fkey";

-- AlterTable
ALTER TABLE "match_history" ALTER COLUMN "winner_id" SET DATA TYPE TEXT,
ALTER COLUMN "loser_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "match_history" ADD CONSTRAINT "match_history_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "User"("login") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_history" ADD CONSTRAINT "match_history_loser_id_fkey" FOREIGN KEY ("loser_id") REFERENCES "User"("login") ON DELETE CASCADE ON UPDATE CASCADE;
