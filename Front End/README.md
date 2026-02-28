# Entry Management System - Frontend

A production-ready Next.js 14 application for managing entries with user and manager roles.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Features

### Authentication & Authorization
- 🔐 Secure JWT authentication with NextAuth.js
- 👥 Role-based access control (User & Manager)
- 🔒 Protected routes with automatic redirects
- 🔑 Session persistence across page refreshes

### Entry Management
- ✨ Create, read, update, delete (CRUD) operations
- 📊 Real-time statistics dashboard
- 🔍 Advanced search and filtering
- 📈 Status tracking (pending, approved, rejected)
- 💼 Manager approval workflow

### User Interface
- 🎨 Modern, clean UI with Tailwind CSS & shadcn/ui
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🌙 Dark mode support
- ♿ Accessible components (ARIA labels, keyboard navigation)
- 🎭 Smooth animations and transitions
- 📋 Table and grid view modes

### Developer Experience
- 🚀 Production-ready code
- 📝 TypeScript strict mode
- 🔄 Optimistic UI updates
- 🎯 Form validation with Zod
- 📦 Component-based architecture
- 🧪 Clean, maintainable codebase

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS |
| **UI Components** | shadcn/ui |
| **Forms** | React Hook Form + Zod |
| **API Client** | Axios |
| **Authentication** | NextAuth.js |
| **State Management** | Zustand |
| **Icons** | Lucide React |
| **Notifications** | Sonner |

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository:**

```bash
git clone <repository-url>
cd "Front End"
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```bash
NEXT_PUBLIC_API_URL=https://test-project-for-full-stack-role.onrender.com/api/v1
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
```

4. **Run the development server:**

```bash
npm run dev
```

5. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

### 🧪 Building for Production

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
app/
├── (auth)/              # Unauthenticated routes
│   ├── login/          # Login page
│   └── register/       # User registration
├── (protected)/        # Authenticated routes
│   └── dashboard/      # Main dashboard
│       ├── page.tsx           # Dashboard home
│       ├── create-manager/    # Manager creation (managers only)
│       └── settings/          # User settings
├── api/
│   └── auth/           # NextAuth.js API routes
├── layout.tsx          # Root layout with providers
├── page.tsx            # Home (redirects to login)
├── error.tsx           # Global error boundary
├── loading.tsx         # Global loading state
└── not-found.tsx       # 404 page

components/
├── ui/                 # Base UI components (shadcn/ui)
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── ...
├── layout/
│   ├── navbar.tsx     # Top navigation
│   └── sidebar.tsx    # Side navigation
├── entries/
│   ├── entry-card.tsx
│   ├── entry-table.tsx
│   ├── create-entry-dialog.tsx
│   └── stats-card.tsx
└── forms/              # Reusable form components

lib/
├── api.ts              # Axios instance & API calls
├── auth.ts             # NextAuth configuration
├── utils.ts            # Utility functions
└── validations.ts      # Zod validation schemas

types/
└── index.ts            # TypeScript type definitions

hooks/
├── useAuth.ts          # Authentication hook
└── useEntries.ts       # Entries management hook

store/
└── useEntriesStore.ts  # Zustand state store
```

## 👥 User Roles

### 👤 User Role

Users can:
- ✅ Create new entries
- 📋 View their own entries
- 🗑️ Delete their own entries
- 👀 See entry status (pending, approved, rejected)
- 🔍 Search and filter their entries

### 👔 Manager Role

Managers can:
- 📊 View ALL entries from all users
- ✅ Approve entries
- ❌ Reject entries
- 🔍 Advanced filtering by status and user
- 🔎 Search across all entries
- 👥 Create new manager accounts
- 📈 View comprehensive statistics

## 🔌 API Integration

**Backend URL:** `https://test-project-for-full-stack-role.onrender.com/api/v1`

### Available Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/register/manager` - Register manager (requires manager auth)

#### Entries
- `POST /entries` - Create entry (user)
- `GET /entries/my` - Get user's entries (user)
- `GET /entries` - Get all entries (manager)
- `GET /entries/:id` - Get specific entry
- `PATCH /entries/:id/status` - Update status (manager)
- `DELETE /entries/:id` - Delete entry

All authenticated requests require:
```
Authorization: Bearer <jwt-token>
```

## 🎨 Color Palette

The app uses a professional blue color scheme:

- **Primary:** Blue (#3B82F6)
- **Success:** Green (#10B981)
- **Warning:** Yellow (#F59E0B)
- **Destructive:** Red (#EF4444)
- **Background:** White / Dark Gray
- **Foreground:** Black / Light Gray

## 📚 Documentation

- 📖 [Development Guide](./DEVELOPMENT.md) - Detailed development instructions
- 🚀 [Deployment Guide](./DEPLOYMENT.md) - Production deployment steps
- 🤝 [Contributing Guide](./CONTRIBUTING.md) - How to contribute

## 🔧 Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

## 🧪 Testing

To test the application:

1. **Register a user account** at `/register`
2. **Login** with your credentials
3. **Create entries** from the dashboard
4. **View statistics** and manage entries

For manager testing:
1. Contact an existing manager to create an account
2. Login with manager credentials
3. Access manager-specific features

## 🐛 Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Authentication Issues

- Verify `NEXTAUTH_SECRET` is set in `.env.local`
- Check `NEXTAUTH_URL` matches your domain
- Ensure backend API is accessible

### API Connection Issues

- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings on the backend
- Verify network connectivity

## 🤝 Contributing

Contributions are welcome! Please read the [Contributing Guide](./CONTRIBUTING.md) first.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - The React Framework
- [shadcn/ui](https://ui.shadcn.com) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [NextAuth.js](https://next-auth.js.org) - Authentication for Next.js

## 📞 Support

For issues or questions:
- 📖 Check the documentation guides
- 🐛 Open an issue on GitHub
- 📧 Contact the development team

---

**Built with ❤️ using Next.js 14**
