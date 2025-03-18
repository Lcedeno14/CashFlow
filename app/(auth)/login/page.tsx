import { Suspense } from "react"
import { LoginContent } from "./login-content"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"

export default async function LoginPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
} 