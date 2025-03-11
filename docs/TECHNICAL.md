# Cash Flow Technical Documentation

This document provides detailed technical information about the Cash Flow application's implementation.

## Architecture Overview

The application follows a modern Next.js 14 architecture with the following key principles:

1. **Server Components First**: Maximizing the use of React Server Components for improved performance
2. **Route Groups**: Organizing routes into logical groups (auth, protected)
3. **Server Actions**: Using server-side mutations instead of API routes where possible
4. **Progressive Enhancement**: Supporting JavaScript-disabled environments

## Authentication Implementation

### NextAuth.js Configuration

```typescript
// app/api/auth/[...nextauth]/route.ts
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const prisma = new PrismaClient()

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      // Credentials implementation
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signUp: "/register",
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

### Protected Routes

Protected routes are implemented using route middleware and session checks:

```typescript
// Example protected route
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function ProtectedPage() {
  const session = await getServerSession()
  if (!session) {
    redirect("/login")
  }
  // Protected content
}
```

## Database Layer

### Prisma Schema

```prisma
// prisma/schema.prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String        @id @default(cuid())
  name          String?
  email         String        @unique
  password      String
  transactions  Transaction[]
  categories    Category[]
}

model Transaction {
  id          String    @id @default(cuid())
  amount      Float
  type        TransactionType
  description String
  date        DateTime
  category    Category  @relation(fields: [categoryId], references: [id])
  categoryId  String
  user        User      @relation(fields: [userId], references: [id])
  userId      String
}

model Category {
  id           String        @id @default(cuid())
  name         String
  type         TransactionType
  color        String?
  transactions Transaction[]
  user         User          @relation(fields: [userId], references: [id])
  userId       String
}

enum TransactionType {
  INCOME
  EXPENSE
}
```

### Database Access Patterns

Server Actions are used for database operations:

```typescript
// app/actions/transactions.ts
"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"

export async function getTransactions() {
  const session = await getServerSession()
  if (!session?.user?.email) return []

  return prisma.transaction.findMany({
    where: {
      user: {
        email: session.user.email
      }
    },
    include: {
      category: true
    },
    orderBy: {
      date: 'desc'
    }
  })
}
```

## Component Architecture

### Component Hierarchy

```
Layout (Root)
├── AuthLayout
│   ├── LoginPage
│   └── RegisterPage
└── ProtectedLayout
    ├── DashboardPage
    │   ├── Header
    │   ├── FinancialSummary
    │   ├── TransactionList
    │   └── CategoryList
    └── SettingsPage
        ├── Header
        ├── ProfileSettings
        └── ThemeSettings
```

### State Management

1. **Server State**: Handled through Server Components and Actions
2. **Form State**: Managed with React Hook Form
3. **Theme State**: Managed with next-themes
4. **Auth State**: Handled by NextAuth.js

## UI Implementation

### Shadcn UI Integration

Components are imported from the UI library and customized:

```typescript
// components/ui/button.tsx
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        // ... other variants
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

### Theme Implementation

Theme switching is implemented using next-themes:

```typescript
// components/theme-provider.tsx
"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
```

## Error Handling

### Global Error Handling

```typescript
// app/error.tsx
"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </div>
    </div>
  )
}
```

### API Error Handling

```typescript
// lib/api-error.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
    public errors?: Record<string, string[]>
  ) {
    super(message)
    this.name = "ApiError"
  }
}

// Usage in Server Action
export async function createTransaction(data: TransactionFormData) {
  try {
    // Validation
    if (!data.amount) {
      throw new ApiError("Amount is required", 400)
    }
    // Process transaction
  } catch (error) {
    // Error handling
  }
}
```

## Performance Optimization

1. **Server Components**: Used for data fetching and static content
2. **Dynamic Imports**: Used for client-side components when needed
3. **Image Optimization**: Next.js Image component with proper sizing
4. **Route Segmentation**: Proper use of loading.tsx and error.tsx

## Security Measures

1. **Authentication**: NextAuth.js with JWT strategy
2. **Password Hashing**: bcrypt for password storage
3. **CSRF Protection**: Built into Next.js
4. **Input Validation**: Server-side validation for all inputs
5. **Rate Limiting**: Implemented on authentication routes

## Testing Strategy

1. **Unit Tests**: Component and utility function testing
2. **Integration Tests**: API and database interaction testing
3. **E2E Tests**: Full user flow testing

Example test setup:

```typescript
// __tests__/components/ThemeToggle.test.tsx
import { render, fireEvent } from "@testing-library/react"
import { ThemeToggle } from "@/components/theme-toggle"

describe("ThemeToggle", () => {
  it("toggles theme when clicked", () => {
    const { getByRole } = render(<ThemeToggle />)
    const button = getByRole("button")
    fireEvent.click(button)
    // Assert theme change
  })
})
```

## Deployment

### Environment Variables

Required environment variables:
```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

### Build Process

```bash
# Production build
npm run build

# Start production server
npm start
```

### Database Migrations

```bash
# Generate migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy
```

## Monitoring and Logging

1. **Error Tracking**: Integration with error tracking service
2. **Performance Monitoring**: Web Vitals tracking
3. **User Analytics**: Basic usage analytics
4. **Server Monitoring**: Health checks and metrics

## Maintenance

### Regular Tasks

1. Dependencies update
2. Security patches
3. Database backups
4. Performance monitoring
5. User feedback collection

### Troubleshooting

Common issues and solutions:
1. Authentication errors
2. Database connection issues
3. Rate limiting problems
4. Theme switching bugs

## API Documentation

### Authentication Endpoints

```typescript
POST /api/auth/register
Body: {
  email: string
  password: string
  name: string
}

POST /api/auth/login
Body: {
  email: string
  password: string
}
```

### Transaction Endpoints

```typescript
GET /api/transactions
Query: {
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
}

POST /api/transactions
Body: {
  amount: number
  type: "INCOME" | "EXPENSE"
  description: string
  categoryId: string
  date: string
}
```

## Future Technical Considerations

1. **Real-time Updates**
   - WebSocket integration
   - Optimistic updates

2. **Performance**
   - Implement caching strategy
   - Add pagination
   - Optimize bundle size

3. **Features**
   - File attachments
   - Export functionality
   - Advanced analytics

4. **Infrastructure**
   - Container support
   - CI/CD pipeline
   - Automated testing
``` 