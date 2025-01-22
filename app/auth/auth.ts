"use server"

import { cookies } from "next/headers"

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // This is a mock authentication.
  // In a real application, you would validate against a database or auth service.
  if (email === "user@example.com" && password === "password") {
    // Set a cookie to simulate a logged-in state
    cookies().set("auth", "logged-in", { secure: true, httpOnly: true })
    return { success: true }
  }

  // Simulate a delay to mimic server processing time
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return { error: "Invalid email or password" }
}
