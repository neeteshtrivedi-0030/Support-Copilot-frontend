# Support Copilot - Frontend Application

Enterprise AI Knowledge & Support Copilot web client built with **React.js**, **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Redux Toolkit**, **TanStack React Query**, and **Joi validation**.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript
- **Styling**: Tailwind CSS + Lucide React Icons
- **Global Client State**: Redux Toolkit (`@reduxjs/toolkit` + `react-redux`)
- **Server State & Caching**: TanStack React Query v5 (`@tanstack/react-query`)
- **Form & Input Validation**: Joi (`joi`) with custom `useJoiValidation` hook
- **HTTP Client**: Axios with automatic JWT injection & refresh token rotation
- **Streaming**: Native Fetch API / Server-Sent Events (SSE) for real-time LLM token generation
- **Route Protection**: Next.js Edge Middleware (`middleware.ts`) with Role-Based Access Control (RBAC)

---

## 📁 Project Structure (PDF Specification)

```
frontend/
├── app/
│   ├── login/
│   │   └── page.tsx                      # User authentication login
│   ├── register/
│   │   └── page.tsx                      # Registration with department & role
│   ├── dashboard/
│   │   └── page.tsx                      # Overview metrics & quick AI query
│   ├── chat/
│   │   ├── page.tsx                      # Live AI copilot workspace
│   │   └── [conversationId]/
│   │       └── page.tsx                  # Dedicated conversation thread
│   ├── documents/
│   │   ├── page.tsx                      # Knowledge documents repository
│   │   └── [id]/
│   │       └── page.tsx                  # Document metadata, chunks & retry
│   ├── admin/
│   │   ├── layout.tsx                    # RBAC guard for administrators
│   │   ├── page.tsx                      # Admin redirect
│   │   ├── users/
│   │   │   └── page.tsx                  # User management table & roles
│   │   ├── documents/
│   │   │   └── page.tsx                  # Document governance & retry queue
│   │   └── analytics/
│   │       └── page.tsx                  # RAG evaluation, queries & metrics
│   ├── profile/
│   │   └── page.tsx                      # User identity & session details
│   ├── layout.tsx                        # Root layout
│   ├── page.tsx                          # Entry redirector
│   ├── globals.css                       # Tailwind directives & styles
│   └── providers.tsx                     # Redux & React Query providers
│
├── components/
│   ├── ui/                               # Button, Input, Modal, Badge, Card
│   ├── layout/                           # Navbar, Sidebar, AppShell
│   ├── chat/                             # ChatContainer, SourceCitations, StreamingCursor
│   ├── documents/                        # DocumentUploadModal, DocumentTable
│   ├── admin/                            # AnalyticsStatCards
│   └── common/                           # ToastContainer
│
├── hooks/
│   ├── useAuth.ts                        # Redux authentication & role methods
│   ├── useChatStream.ts                  # SSE live stream reader for LLM tokens
│   ├── useJoiValidation.ts               # Custom reusable Joi form validation
│   ├── useConversations.ts               # React Query hook for chat threads
│   ├── useDocuments.ts                   # React Query hook for documents & polling
│   └── useDebounce.ts                    # Debounce search utility
│
├── services/
│   ├── api.ts                            # Axios instance with interceptors
│   ├── auth.service.ts                   # Login, register, logout, refresh
│   ├── chat.service.ts                   # Chat REST & SSE, semantic search
│   ├── document.service.ts               # Upload, list, retry, download, delete
│   └── admin.service.ts                  # Analytics, user directory
│
├── store/
│   ├── index.ts                          # Redux store
│   ├── hooks.ts                          # Typed useAppDispatch & useAppSelector
│   └── slices/
│       ├── authSlice.ts                  # User, token, role state
│       ├── chatSlice.ts                  # Streaming state, conversation ID
│       └── uiSlice.ts                    # Sidebar, modal, toast messages
│
├── utils/
│   ├── validation/                       # Joi schemas (auth, document, chat)
│   ├── constants.ts                      # API URL, departments, file limits
│   ├── formatters.ts                     # File size, date-time formatters
│   └── storage.ts                        # Cookie & localStorage sync
│
├── types/                                # TypeScript type definitions
├── middleware.ts                         # Edge route security & RBAC
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
└── package.json
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Verify `.env.local` is configured with the backend API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_API_PREFIX=/api/v1
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Code Quality & Build Scripts

```bash
# Type check all TypeScript files
npm run typecheck

# Lint all files with zero-warning threshold
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Verify formatting without modifying files
npm run format:check

# Run full commit checks (typecheck + lint + build)
npm run check:commit

# Run full push checks (check:commit + test)
npm run check:push

# Build for production
npm run build

# Start production server
npm start
```

---

## 🛡️ Code Quality & Git Hooks (Husky)

This project has strict automated checks configured via **Husky** and **lint-staged**:

### Pre-commit Hook (`.husky/pre-commit`)

Triggers automatically whenever you run `git commit`:

1. `npm run typecheck` - Verifies full TypeScript type safety.
2. `npm run lint` - Runs Next.js ESLint with `--max-warnings=0`. Any warning or error will halt the commit.
3. `npm run build` - Validates that the Next.js production build succeeds without issues.
4. `npx lint-staged` - Runs ESLint auto-fix and Prettier formatting on staged files.

### Pre-push Hook (`.husky/pre-push`)

Triggers automatically whenever you run `git push`:

1. Full validation suite (`check:commit`): Typecheck + zero-warning Lint + Production Build.
2. `npm test` - Runs test verification.
   If any check or test fails, the push is aborted.

---

## 🔗 Git Remote

- **Repository**: `https://github.com/neeteshtrivedi-0030/Support-Copilot-frontend.git`
- **Branch**: `main`
- **Author**: Neetesh Trivedi (`neetesh.trivedi@programming.com`)
