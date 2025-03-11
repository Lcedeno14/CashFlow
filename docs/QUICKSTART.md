# Cash Flow Quick Start Guide

This guide will help you get the Cash Flow application up and running quickly for development.

## Prerequisites

1. Node.js 18.x or later
2. Git
3. npm or yarn
4. A code editor (VS Code recommended)

## Setup Steps

### 1. Clone and Install

```bash
# Clone the repository
git clone [repository-url]
cd cash-flow

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy the example env file
cp .env.example .env
```

Edit `.env` and add the following variables:
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Database Setup

```bash
# Run migrations
npx prisma migrate dev

# (Optional) Seed the database
npx prisma db seed
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Common Development Tasks

### Create a New Component

1. Create a new file in the appropriate directory:
   ```bash
   touch app/components/your-component/your-component.tsx
   ```

2. Basic component template:
   ```tsx
   import { FC } from "react"

   interface YourComponentProps {
     // Props here
   }

   export const YourComponent: FC<YourComponentProps> = (props) => {
     return (
       // JSX here
     )
   }
   ```

### Add a New Route

1. Create a new directory in `app/(protected)` or `app/(auth)`:
   ```bash
   mkdir app/(protected)/your-route
   touch app/(protected)/your-route/page.tsx
   ```

2. Basic route template:
   ```tsx
   import { getServerSession } from "next-auth"
   import { redirect } from "next/navigation"

   export default async function YourRoute() {
     const session = await getServerSession()
     if (!session) {
       redirect("/login")
     }

     return (
       // Your page content
     )
   }
   ```

### Create a New Server Action

1. Add to existing actions file or create new one:
   ```bash
   touch app/actions/your-action.ts
   ```

2. Basic server action template:
   ```typescript
   "use server"

   import { getServerSession } from "next-auth"
   import { prisma } from "@/lib/prisma"

   export async function yourAction() {
     const session = await getServerSession()
     if (!session?.user?.email) return null

     // Your action logic here
   }
   ```

### Add a New Database Model

1. Edit `prisma/schema.prisma`:
   ```prisma
   model YourModel {
     id        String   @id @default(cuid())
     // Add fields
     user      User     @relation(fields: [userId], references: [id])
     userId    String
   }
   ```

2. Create and run migration:
   ```bash
   npx prisma migrate dev --name add_your_model
   ```

## Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make Changes**
   - Write code
   - Follow TypeScript types
   - Use Shadcn UI components
   - Add tests if needed

3. **Test Changes**
   ```bash
   # Run type checking
   npm run type-check

   # Run tests
   npm run test
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

## Troubleshooting

### Database Issues

1. **Reset Database**
   ```bash
   npx prisma migrate reset
   ```

2. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

### Next.js Issues

1. **Clear Cache**
   ```bash
   rm -rf .next
   npm run dev
   ```

2. **Check Types**
   ```bash
   npm run type-check
   ```

### Authentication Issues

1. Check `.env` variables
2. Ensure database is running
3. Clear browser cookies/local storage

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types
- `npm run test` - Run tests
- `npm run prisma:studio` - Open Prisma Studio

## VS Code Setup

Recommended extensions:
- Prisma
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

Settings (`settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Getting Help

1. Check the technical documentation in `docs/TECHNICAL.md`
2. Review the codebase README
3. Check commit history for similar changes
4. Review Next.js and Prisma documentation

## Next Steps

1. Review the codebase structure
2. Understand the authentication flow
3. Explore the dashboard implementation
4. Try creating a new feature

## Development Tips

1. Use Server Components by default
2. Add proper TypeScript types
3. Follow the existing code style
4. Test your changes
5. Update documentation when needed 