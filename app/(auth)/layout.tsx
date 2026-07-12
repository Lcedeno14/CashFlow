import { Space_Grotesk } from "next/font/google"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-auth-display",
})

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${spaceGrotesk.variable} min-h-screen w-full`}>
      {children}
    </div>
  )
}
