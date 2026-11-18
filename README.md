# PrepHub — Collaborative Coding Workspace (Frontend)

PrepHub's frontend is a React application for coding practice and learning workflows. It brings together a Monaco-based editor, collaborative editing integrations, progress-oriented interfaces and API-backed learning features.

## Frontend capabilities

- Monaco Editor integration for code editing
- Collaborative editing foundations using Yjs and WebSocket client libraries
- Learning and practice interfaces backed by the PrepHub API
- Google OAuth client integration
- Data fetching with TanStack Query and local persistence with Dexie
- State management with Zustand
- Syntax highlighting, charts and guided UI interactions

## Stack

- React 18 and Vite 6
- React Router 7
- Monaco Editor and `@monaco-editor/react`
- Yjs, `y-websocket` and Socket.IO client
- TanStack Query, Zustand and Dexie
- Material UI, Emotion and Framer Motion
- Vitest

## Run locally

```bash
git clone https://github.com/Nashid-k/prephub-dev-frontend.git
cd prephub-dev-frontend
npm install
cp .env.example .env
npm run dev
```

## Environment

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Backend API base URL |
| `GOOGLE_CLIENT_ID` | Google OAuth client identifier used by the app configuration |
| `VITE_GA_MEASUREMENT_ID` | Optional Google Analytics measurement ID |

Use local values in `.env`. Do not commit credentials or machine-specific configuration. Vite exposes variables prefixed with `VITE_` to browser code, so those values must never contain private secrets.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the production frontend |
| `npm run preview` | Preview the production build |
| `npm test` | Run Vitest |

## Related repository

[PrepHub backend](https://github.com/Nashid-k/prephub-dev-backend) contains the API, realtime services and code-runner components.
