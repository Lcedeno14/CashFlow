# Cash Flow - Personal Finance Management Application

Cash Flow is a modern web application built with Next.js 14, designed to help users track their personal finances, manage transactions, and categorize their income and expenses.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Authentication**: NextAuth.js
- **Database**: SQLite with Prisma ORM
- **UI Components**: Shadcn UI
- **Styling**: Tailwind CSS
- **Theme**: Dark/Light mode support with next-themes

## Project Structure

```
app/
├── (auth)/                  # Authentication route group
│   ├── login/              # Login page
│   └── register/           # Registration page
├── (protected)/            # Protected route group (requires auth)
│   ├── dashboard/          # Main dashboard
│   └── settings/          # User settings
├── api/                    # API routes
│   └── auth/              # Auth API endpoints
├── components/            # Reusable components
│   ├── ui/               # Shadcn UI components
│   ├── dashboard/        # Dashboard-specific components
│   ├── transactions/     # Transaction-related components
│   └── categories/       # Category-related components
└── actions/              # Server actions for data mutations
```

## Key Features

1. **Authentication**
   - User registration and login
   - Protected routes with session management
   - Email-based authentication

2. **Financial Management**
   - Transaction tracking (income and expenses)
   - Category management
   - Financial summary with total balance, income, and expenses

3. **User Experience**
   - Responsive design
   - Dark/Light theme support
   - Real-time updates
   - User settings management

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Lcedeno14/CashFlow.git
   cd cash-flow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in the following variables in `.env`:
   ```
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Database Schema

### User
- id: String (UUID)
- name: String
- email: String (unique)
- password: String (hashed)

### Transaction
- id: String (UUID)
- amount: Float
- type: Enum (INCOME, EXPENSE)
- description: String
- date: DateTime
- categoryId: String (foreign key)
- userId: String (foreign key)

### Category
- id: String (UUID)
- name: String
- type: Enum (INCOME, EXPENSE)
- color: String (optional)
- userId: String (foreign key)

## API Routes

### Authentication
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- GET `/api/auth/session` - Get current session

### Transactions
- GET `/api/transactions` - List transactions
- POST `/api/transactions` - Create transaction
- PUT `/api/transactions/:id` - Update transaction
- DELETE `/api/transactions/:id` - Delete transaction

### Categories
- GET `/api/categories` - List categories
- POST `/api/categories` - Create category
- PUT `/api/categories/:id` - Update category
- DELETE `/api/categories/:id` - Delete category

## Server Actions

The application uses Next.js Server Actions for data mutations:

- `actions/transactions.ts`
  - `getTransactions()` - Fetch user transactions
  - `getCategories()` - Fetch user categories
  - `getFinancialSummary()` - Get financial overview
  - `createTransaction()` - Create new transaction
  - `createCategory()` - Create new category

## Component Architecture

### Layout Components
- `app/layout.tsx` - Root layout with theme provider
- `app/(auth)/layout.tsx` - Auth pages layout
- `app/(protected)/layout.tsx` - Protected pages layout

### Core Components
- `Header` - Main navigation and user info
- `ThemeToggle` - Theme switching
- `ActionButtons` - Transaction and category management
- `AddTransactionDialog` - Transaction creation form
- `AddCategoryDialog` - Category creation form

## Authentication Flow

1. User registers/logs in through the auth pages
2. NextAuth.js creates a session
3. Protected routes check session status
4. Unauthenticated users are redirected to login

## Theme System

The application uses `next-themes` for theme management:
- Light mode
- Dark mode
- System preference

Theme toggle is available in:
- Header component
- Settings page

## Development Guidelines

1. **Code Style**
   - Use TypeScript for type safety
   - Follow ESLint configuration
   - Use Prettier for formatting

2. **Component Creation**
   - Place reusable UI components in `components/ui`
   - Feature-specific components go in their respective folders
   - Use Shadcn UI components when possible

3. **Data Fetching**
   - Use Server Components for data fetching
   - Implement Server Actions for mutations
   - Handle loading and error states

4. **State Management**
   - Use React Server Components where possible
   - Implement Client Components only when needed
   - Use form state management for complex forms

## Future Improvements

1. **Features**
   - Recurring transactions
   - Budget planning
   - Financial reports and analytics
   - Multi-currency support
   - Export functionality

2. **Technical**
   - Implement real-time updates
   - Add comprehensive test coverage
   - Optimize performance
   - Add API documentation
   - Implement rate limiting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
