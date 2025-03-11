import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Welcome to Cash Flow</CardTitle>
          <CardDescription>
            Manage your personal finances with ease
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Link href="/login">
            <Button className="w-full">Login</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" className="w-full">
              Create Account
            </Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  )
}
