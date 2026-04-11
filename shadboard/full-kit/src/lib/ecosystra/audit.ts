import type { Prisma } from "@/generated/prisma";

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
  await tx.ecoTaskAuditLog.create({
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
