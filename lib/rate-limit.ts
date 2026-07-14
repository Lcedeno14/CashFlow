import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"

export const LOGIN_RATE_LIMIT = {
  maxAttempts: 10,
  windowMs: 15 * 60 * 1000, // 15 minutes
} as const

export const REGISTER_RATE_LIMIT = {
  maxAttempts: 5,
  windowMs: 60 * 60 * 1000, // 1 hour
} as const

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSeconds: number; error: string }

function formatRetryMessage(retryAfterSeconds: number) {
  const minutes = Math.max(1, Math.ceil(retryAfterSeconds / 60))
  return `Too many attempts. Please try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`
}

export async function getClientIp(): Promise<string> {
  const headerStore = await headers()
  const forwarded = headerStore.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown"
  }
  return headerStore.get("x-real-ip") || "unknown"
}

/**
 * Atomically increments a named bucket. Returns ok:false when over the limit.
 */
export async function hitRateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number
): Promise<RateLimitResult> {
  const now = new Date()
  const expiresAt = new Date(now.getTime() + windowMs)

  const existing = await prisma.rateLimitBucket.findUnique({ where: { key } })

  if (!existing || existing.expiresAt <= now) {
    await prisma.rateLimitBucket.upsert({
      where: { key },
      create: { key, count: 1, expiresAt },
      update: { count: 1, expiresAt },
    })
    return { ok: true }
  }

  if (existing.count >= maxAttempts) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((existing.expiresAt.getTime() - now.getTime()) / 1000)
    )
    return {
      ok: false,
      retryAfterSeconds,
      error: formatRetryMessage(retryAfterSeconds),
    }
  }

  await prisma.rateLimitBucket.update({
    where: { key },
    data: { count: { increment: 1 } },
  })

  return { ok: true }
}

/** Read-only check used by the login UI after a failed NextAuth sign-in. */
export async function isRateLimited(
  key: string,
  maxAttempts: number
): Promise<RateLimitResult> {
  const now = new Date()
  const existing = await prisma.rateLimitBucket.findUnique({ where: { key } })

  if (!existing || existing.expiresAt <= now || existing.count < maxAttempts) {
    return { ok: true }
  }

  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((existing.expiresAt.getTime() - now.getTime()) / 1000)
  )

  return {
    ok: false,
    retryAfterSeconds,
    error: formatRetryMessage(retryAfterSeconds),
  }
}

export function loginIpKey(ip: string) {
  return `login:ip:${ip}`
}

export function loginEmailKey(email: string) {
  return `login:email:${email.trim().toLowerCase()}`
}

export function registerIpKey(ip: string) {
  return `register:ip:${ip}`
}
