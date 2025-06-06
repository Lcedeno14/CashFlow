import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login - Cash Flow",
  description: "Login to your account",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 