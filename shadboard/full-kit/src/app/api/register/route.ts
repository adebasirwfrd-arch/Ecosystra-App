import { NextResponse } from "next/server"

import { RegisterSchema } from "@/schemas/register-schema"

import { db } from "@/lib/prisma"

export async function POST(req: Request) {
  const body = await req.json()
  const parsedData = RegisterSchema.safeParse(body)

  if (!parsedData.success) {
    return NextResponse.json(parsedData.error, { status: 400 })
  }

  const { firstName, lastName, username, email, password } = parsedData.data

  try {
    const [existingByEmail, existingByUsername] = await Promise.all([
      db.user.findUnique({ where: { email } }),
      db.user.findUnique({ where: { username } }),
    ])

    if (existingByEmail) {
      return NextResponse.json(
        { issues: [{ path: ["email"], message: "Email already registered." }] },
        { status: 400 }
      )
    }

    if (existingByUsername) {
      return NextResponse.json(
        {
          issues: [{ path: ["username"], message: "Username already taken." }],
        },
        { status: 400 }
      )
    }

    const name = `${firstName} ${lastName}`.trim()
    const createdUser = await db.user.create({
      data: {
        name,
        username,
        email,
        password,
        status: "ONLINE",
      },
    })

    return NextResponse.json(
      {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        username: createdUser.username,
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Register failed.",
      },
      { status: 500 }
    )
  }
}
