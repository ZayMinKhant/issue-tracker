-- CreateIndex
CREATE INDEX "Issue_createdAt_idx" ON "Issue"("createdAt");

-- CreateIndex
CREATE INDEX "Issue_status_createdAt_idx" ON "Issue"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Issue_category_createdAt_idx" ON "Issue"("category", "createdAt");
