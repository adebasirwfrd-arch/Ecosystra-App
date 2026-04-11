#!/usr/bin/env node
/**
 * One-shot: copy NextAuth-related rows from a legacy SQLite file (Shadboard Prisma)
 * into the current Supabase Postgres database (schema `nextauth`).
 *
 * Uses sql.js (WASM) — no native addon build.
 *
 * Usage (from shadboard/full-kit):
 *   pnpm db:migrate-from-sqlite
 *
 * Optional: SQLITE_MIGRATE_SOURCE=/absolute/path/to/auth-dev.db
 */

const fs = require("fs");
const path = require("path");

try {
  require("dotenv").config({ path: path.join(process.cwd(), ".env.local") });
} catch {
  /* optional */
}

const initSqlJs = require("sql.js");
const { PrismaClient } = require("../src/generated/prisma");

function candidates() {
  const env = process.env.SQLITE_MIGRATE_SOURCE;
  return [
    env && path.resolve(env),
    path.join(process.cwd(), "auth-dev.db"),
    path.join(process.cwd(), "dev.db"),
    path.join(process.cwd(), "prisma", "dev.db"),
  ].filter(Boolean);
}

function pickSqlitePath() {
  for (const p of candidates()) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function toDate(v) {
  if (v == null || v === "") return undefined;
  if (v instanceof Date) return v;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

/** @param {import("sql.js").Database} db */
function execAll(db, sql) {
  const res = db.exec(sql);
  if (!res[0]) return [];
  const { columns, values } = res[0];
  return values.map((row) =>
    Object.fromEntries(columns.map((c, i) => [c, row[i]]))
  );
}

/** @param {import("sql.js").Database} db */
function tableExists(db, name) {
  const r = db.exec(
    `SELECT 1 FROM sqlite_master WHERE type='table' AND name='${name.replace(/'/g, "''")}' LIMIT 1`
  );
  return r.length > 0 && r[0].values.length > 0;
}

async function main() {
  const sqlitePath = pickSqlitePath();
  if (!sqlitePath) {
    console.log(
      "[migrate-sqlite-auth] No SQLite file found. Tried:\n  " +
        candidates().join("\n  ") +
        "\nNothing to migrate. App uses DATABASE_URL from .env.local (Supabase)."
    );
    process.exit(0);
  }

  console.log("[migrate-sqlite-auth] Reading:", sqlitePath);
  const SQL = await initSqlJs();
  const fileBuffer = fs.readFileSync(sqlitePath);
  const raw = new SQL.Database(fileBuffer);

  if (!tableExists(raw, "User")) {
    console.log(
      '[migrate-sqlite-auth] No "User" table — file may not be Shadboard auth DB. Abort.'
    );
    raw.close();
    process.exit(0);
  }

  const prisma = new PrismaClient();

  try {
    const users = execAll(raw, "SELECT * FROM User");
    let uOk = 0;
    for (const r of users) {
      try {
        await prisma.user.upsert({
          where: { id: r.id },
          create: {
            id: r.id,
            name: r.name,
            username: r.username ?? undefined,
            email: r.email ?? undefined,
            emailVerifyToken: r.emailVerifyToken ?? undefined,
            emailVerified: toDate(r.emailVerified),
            password: r.password ?? undefined,
            passwordResetToken: r.passwordResetToken ?? undefined,
            passwordResetExpires: toDate(r.passwordResetExpires),
            image: r.image ?? undefined,
            avatar: r.avatar ?? undefined,
            profileBackground: r.profileBackground ?? undefined,
            status: r.status ?? "ONLINE",
            createdAt: toDate(r.createdAt) ?? new Date(),
            updatedAt: toDate(r.updatedAt) ?? new Date(),
          },
          update: {
            name: r.name,
            username: r.username ?? undefined,
            email: r.email ?? undefined,
            emailVerifyToken: r.emailVerifyToken ?? undefined,
            emailVerified: toDate(r.emailVerified),
            password: r.password ?? undefined,
            passwordResetToken: r.passwordResetToken ?? undefined,
            passwordResetExpires: toDate(r.passwordResetExpires),
            image: r.image ?? undefined,
            avatar: r.avatar ?? undefined,
            profileBackground: r.profileBackground ?? undefined,
            status: r.status ?? "ONLINE",
            updatedAt: toDate(r.updatedAt) ?? new Date(),
          },
        });
        uOk++;
      } catch (e) {
        console.warn("[migrate-sqlite-auth] User row skipped:", r.id, e.message);
      }
    }
    console.log("[migrate-sqlite-auth] Users upserted:", uOk, "/", users.length);

    if (tableExists(raw, "UserPreference")) {
      const prefs = execAll(raw, "SELECT * FROM UserPreference");
      let pOk = 0;
      for (const r of prefs) {
        try {
          await prisma.userPreference.upsert({
            where: { id: r.id },
            create: {
              id: r.id,
              theme: r.theme,
              mode: r.mode,
              radius: r.radius,
              layout: r.layout,
              direction: r.direction,
              userId: r.userId ?? undefined,
            },
            update: {
              theme: r.theme,
              mode: r.mode,
              radius: r.radius,
              layout: r.layout,
              direction: r.direction,
              userId: r.userId ?? undefined,
            },
          });
          pOk++;
        } catch (e) {
          console.warn(
            "[migrate-sqlite-auth] UserPreference skipped:",
            r.id,
            e.message
          );
        }
      }
      console.log(
        "[migrate-sqlite-auth] UserPreferences upserted:",
        pOk,
        "/",
        prefs.length
      );
    }

    if (tableExists(raw, "Account")) {
      const accs = execAll(raw, "SELECT * FROM Account");
      let aOk = 0;
      for (const r of accs) {
        try {
          await prisma.account.upsert({
            where: { id: r.id },
            create: {
              id: r.id,
              userId: r.userId,
              type: r.type,
              provider: r.provider,
              providerAccountId: r.providerAccountId,
              refresh_token: r.refresh_token ?? undefined,
              access_token: r.access_token ?? undefined,
              expires_at: r.expires_at ?? undefined,
              token_type: r.token_type ?? undefined,
              scope: r.scope ?? undefined,
              id_token: r.id_token ?? undefined,
              session_state: r.session_state ?? undefined,
              createdAt: toDate(r.createdAt) ?? new Date(),
              updatedAt: toDate(r.updatedAt) ?? new Date(),
            },
            update: {
              refresh_token: r.refresh_token ?? undefined,
              access_token: r.access_token ?? undefined,
              expires_at: r.expires_at ?? undefined,
              token_type: r.token_type ?? undefined,
              scope: r.scope ?? undefined,
              id_token: r.id_token ?? undefined,
              session_state: r.session_state ?? undefined,
              updatedAt: toDate(r.updatedAt) ?? new Date(),
            },
          });
          aOk++;
        } catch (e) {
          console.warn("[migrate-sqlite-auth] Account skipped:", r.id, e.message);
        }
      }
      console.log("[migrate-sqlite-auth] Accounts upserted:", aOk, "/", accs.length);
    }

    if (tableExists(raw, "Session")) {
      const sess = execAll(raw, "SELECT * FROM Session");
      let sOk = 0;
      for (const r of sess) {
        try {
          await prisma.session.upsert({
            where: { id: r.id },
            create: {
              id: r.id,
              sessionToken: r.sessionToken,
              userId: r.userId,
              expires: toDate(r.expires) ?? new Date(),
              createdAt: toDate(r.createdAt) ?? new Date(),
              updatedAt: toDate(r.updatedAt) ?? new Date(),
            },
            update: {
              sessionToken: r.sessionToken,
              userId: r.userId,
              expires: toDate(r.expires) ?? new Date(),
              updatedAt: toDate(r.updatedAt) ?? new Date(),
            },
          });
          sOk++;
        } catch (e) {
          console.warn("[migrate-sqlite-auth] Session skipped:", r.id, e.message);
        }
      }
      console.log("[migrate-sqlite-auth] Sessions upserted:", sOk, "/", sess.length);
    }

    if (tableExists(raw, "VerificationToken")) {
      const vt = execAll(raw, "SELECT * FROM VerificationToken");
      let vOk = 0;
      for (const r of vt) {
        try {
          const existing = await prisma.verificationToken.findFirst({
            where: {
              AND: [
                { identifier: r.identifier },
                { token: r.token },
              ],
            },
          });
          if (existing) continue;
          await prisma.verificationToken.create({
            data: {
              identifier: r.identifier,
              token: r.token,
              expires: toDate(r.expires) ?? new Date(),
            },
          });
          vOk++;
        } catch (e) {
          console.warn(
            "[migrate-sqlite-auth] VerificationToken skipped:",
            r.identifier,
            e.message
          );
        }
      }
      console.log(
        "[migrate-sqlite-auth] VerificationTokens inserted (new):",
        vOk,
        "/",
        vt.length
      );
    }

    console.log(
      "[migrate-sqlite-auth] Done. Delete local SQLite if you no longer need it:",
      sqlitePath
    );
  } finally {
    raw.close();
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
