-- CreateEnum
CREATE TYPE "Reality" AS ENUM ('WOKEMOUND', 'WUTONG');

-- CreateTable
CREATE TABLE "PlayerProgression" (
    "id" TEXT NOT NULL,
    "passphrase" TEXT NOT NULL,
    "currentReality" "Reality" NOT NULL DEFAULT 'WUTONG',
    "spiralPoints" INTEGER NOT NULL DEFAULT 0,
    "consciousnessLevel" INTEGER NOT NULL DEFAULT 1,
    "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "wokemoundStats" JSONB,
    "wutongStats" JSONB,
    "storySeeds" JSONB,
    "completedChallenges" JSONB,

    CONSTRAINT "PlayerProgression_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryFragment" (
    "id" TEXT NOT NULL,
    "reality" "Reality" NOT NULL,
    "consciousnessLevel" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "tags" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StoryFragment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlayerProgression_passphrase_key" ON "PlayerProgression"("passphrase");

-- CreateIndex
CREATE INDEX "PlayerProgression_passphrase_currentReality_idx" ON "PlayerProgression"("passphrase", "currentReality");

-- CreateIndex
CREATE INDEX "StoryFragment_reality_consciousnessLevel_idx" ON "StoryFragment"("reality", "consciousnessLevel");
