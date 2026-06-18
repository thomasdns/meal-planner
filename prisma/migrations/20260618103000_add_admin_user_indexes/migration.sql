CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

CREATE INDEX "User_role_createdAt_idx" ON "User"("role", "createdAt");
