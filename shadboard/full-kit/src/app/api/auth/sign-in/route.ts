import { NextResponse } from "next/server"

import { userData } from "@/data/user"

import { SignInSchema } from "@/schemas/sign-in-schema"

import { db } from "@/lib/prisma"

export async function POST(req: Request) {
  const body = await req.json()
  const parsedData = SignInSchema.safeParse(body)

  // If validation fails, return an error response with a 400 status
  if (!parsedData.success) {
    return NextResponse.json(parsedData.error, { status: 400 })
  }

  const { email, password } = parsedData.data

  try {
    // Demo fallback credentials from static seed data
    if (userData.email === email && userData.password === password) {
      return NextResponse.json(
        {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar,
          status: userData.status,
        },
        { status: 200 }
      )
    }

    // Database credentials flow (used by register endpoint / OAuth-created users)
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (
      !existingUser ||
      !existingUser.password ||
      existingUser.password !== password
    ) {
      return NextResponse.json(
        { message: "Invalid email or password", email },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        avatar: existingUser.avatar || existingUser.image || null,
        status: existingUser.status,
      },
      { status: 200 }
    )
  } catch (e) {
    console.error("Error signing in:", e)
    return NextResponse.json({ error: "Error signing in" }, { status: 500 })
  }
}
