import { Suspense } from "react"
import { RegisterContent } from "./register-content"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"

export default async function RegisterPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return (
    <Suspense>
      <RegisterContent />
    </Suspense>
  )
} 