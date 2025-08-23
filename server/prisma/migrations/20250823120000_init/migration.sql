-- Initial Postgres schema migration
CREATE TABLE "User" (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  "earlyAccessApplied" BOOLEAN NOT NULL DEFAULT false,
  "earlyAccessAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "QuizAnswer" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE,
  "questionId" INTEGER NOT NULL,
  "selectedOptions" TEXT NOT NULL
);

CREATE TABLE "Story" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE,
  text TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX "QuizAnswer_userId_idx" ON "QuizAnswer"("userId");
CREATE INDEX "Story_userId_idx" ON "Story"("userId");

-- Trigger to auto-update updatedAt
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_updatedAt
BEFORE UPDATE ON "User"
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();
