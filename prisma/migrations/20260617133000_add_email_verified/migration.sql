-- Add email verification status to users.
ALTER TABLE "User" ADD COLUMN "emailVerified" TIMESTAMP(3);
