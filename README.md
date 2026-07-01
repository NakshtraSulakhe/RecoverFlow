# RecoverFlow - Debt Recovery Management System

A comprehensive debt recovery management application built with React, TypeScript, Redux Toolkit, and Material-UI.

## Features

- **Dashboard**: Overview of key metrics and statistics
- **Tenant Management**: Multi-tenant support for different organizations
- **User Management**: Role-based access control
- **Customer Management**: Track debtor information and debt history
- **Case Management**: Manage recovery cases and assignments
- **Recovery Actions**: Track recovery attempts and methods
- **Payment Tracking**: Record and monitor payments
- **Reports**: Generate detailed reports and analytics
- **AI Assistant**: AI-powered insights and assistance
- **Settings**: Configure application preferences

## Tech Stack

- **Frontend**: React 18, TypeScript
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **UI Components**: Material-UI (MUI)
- **Build Tool**: Vite
- **Charts**: Recharts
- **Forms**: React Hook Form with Yup validation
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── assets/           # Static assets
├── components/       # Reusable components
│   ├── common/       # Common components
│   ├── layout/       # Layout components
│   ├── forms/        # Form components
│   ├── tables/       # Table components
│   ├── charts/       # Chart components
│   ├── dialogs/      # Dialog components
│   └── ui/           # UI components
├── pages/            # Page components
│   ├── auth/         # Authentication pages
│   ├── dashboard/    # Dashboard
│   ├── tenants/      # Tenant management
│   ├── users/        # User management
│   ├── customers/    # Customer management
│   ├── cases/        # Case management
│   ├── recovery/     # Recovery actions
│   ├── payments/     # Payment tracking
│   ├── reports/      # Reports
│   ├── settings/     # Settings
│   └── ai/           # AI assistant
├── layouts/          # Layout components
├── routes/           # Route configuration
├── redux/            # Redux store and slices
│   ├── store.ts
│   └── slices/       # Redux slices
├── services/         # API services
├── hooks/            # Custom hooks
├── contexts/         # React contexts
├── utils/            # Utility functions
├── constants/        # Application constants
├── types/            # TypeScript types
├── theme/            # Theme configuration
├── App.tsx           # Main app component
└── index.tsx         # Entry point
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000/api
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## License

MIT
