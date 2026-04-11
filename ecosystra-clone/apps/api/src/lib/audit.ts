import type { Prisma } from "@prisma/client";

/** Field-level audit rows (Bemi-compatible metadata; upgrade to @bemi-db/prisma when on Prisma 6+). */
export async function logItemFieldChange(
  tx: Prisma.TransactionClient,
  params: {
    itemId: string;
    actorUserId: string | null;
    fieldKey: string;
    oldValue: unknown;
    newValue: unknown;
  }
) {
  await tx.taskAuditLog.create({
    data: {
      itemId: params.itemId,
      actorUserId: params.actorUserId,
      fieldKey: params.fieldKey,
      oldValue:
        params.oldValue === undefined
          ? undefined
          : JSON.parse(JSON.stringify(params.oldValue)),
      newValue:
        params.newValue === undefined
          ? undefined
          : JSON.parse(JSON.stringify(params.newValue)),
    },
  });
}
