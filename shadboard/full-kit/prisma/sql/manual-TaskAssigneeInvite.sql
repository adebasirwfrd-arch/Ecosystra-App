-- Manual create for EcoTaskAssigneeInvite when `pnpm db:push` hangs on the pooler.
-- Run in Supabase: SQL Editor → New query → paste → Run.
-- Table/column names match Prisma @@map("TaskAssigneeInvite") and multi-schema "public".

-- Idempotent: skip if already applied (checks information_schema).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'TaskAssigneeInvite'
  ) THEN
    RAISE NOTICE 'Table public."TaskAssigneeInvite" already exists; skipping.';
    RETURN;
  END IF;

  CREATE TABLE public."TaskAssigneeInvite" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "invitedByUserId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),
    "acceptedUserId" TEXT,

    CONSTRAINT "TaskAssigneeInvite_pkey" PRIMARY KEY ("id")
  );

  -- FKs (Prisma onDelete: Cascade on Item, User, Workspace)
  ALTER TABLE public."TaskAssigneeInvite"
    ADD CONSTRAINT "TaskAssigneeInvite_itemId_fkey"
    FOREIGN KEY ("itemId") REFERENCES public."Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

  ALTER TABLE public."TaskAssigneeInvite"
    ADD CONSTRAINT "TaskAssigneeInvite_invitedByUserId_fkey"
    FOREIGN KEY ("invitedByUserId") REFERENCES public."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

  ALTER TABLE public."TaskAssigneeInvite"
    ADD CONSTRAINT "TaskAssigneeInvite_workspaceId_fkey"
    FOREIGN KEY ("workspaceId") REFERENCES public."Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

  CREATE UNIQUE INDEX "TaskAssigneeInvite_token_key" ON public."TaskAssigneeInvite"("token");
  CREATE UNIQUE INDEX "TaskAssigneeInvite_itemId_email_key" ON public."TaskAssigneeInvite"("itemId", "email");
  CREATE INDEX "TaskAssigneeInvite_workspaceId_idx" ON public."TaskAssigneeInvite"("workspaceId");
END $$;
