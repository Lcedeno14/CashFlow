"use client"

import { useSearchParams } from "next/navigation"
import { LoginForm } from "@/app/components/auth/login-form"
import { AuthMarketingPanel } from "@/app/components/auth/auth-marketing-panel"

export function LoginContent() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  return (
    <div className="relative grid min-h-screen w-full lg:grid-cols-2">
      <AuthMarketingPanel />

      <div className="flex flex-col justify-center px-6 py-12 sm:px-8 lg:p-12">
        <div className="mb-10 flex items-center gap-2 lg:hidden">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-950 text-emerald-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </span>
          <span className="font-[family-name:var(--font-auth-display)] text-xl tracking-tight">
            CashFlow
          </span>
        </div>

        <div className="mx-auto w-full max-w-[380px] space-y-6">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="font-[family-name:var(--font-auth-display)] text-3xl tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to pick up where you left off with your budget, categories,
              and spending trends.
            </p>
          </div>
          <LoginForm callbackUrl={callbackUrl} />
          <p className="px-2 text-center text-sm text-muted-foreground lg:text-left">
            By continuing, you agree to our{" "}
            <a
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
