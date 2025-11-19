# AI Development Rules

This document outlines the tech stack and development rules for this project to ensure consistency and maintainability.

## Tech Stack

- **Framework**: React (v19) with Vite for a fast development experience.
- **Language**: TypeScript for type safety and improved developer experience.
- **Backend**: Hono, a lightweight web framework running on Cloudflare Workers for serverless API endpoints.
- **Database**: Cloudflare D1, a serverless SQL database.
- **Styling**: Tailwind CSS for a utility-first styling approach.
- **Routing**: React Router DOM for client-side navigation.
- **Schema Validation**: Zod for defining and validating data schemas on both the client and server.
- **Icons**: Lucide React for a comprehensive and consistent set of icons.

## Development Guidelines

- **UI Components**: Prioritize creating small, reusable components. All components should be placed in `src/react-app/components/`.
- **Styling**: All styling must be done using Tailwind CSS utility classes. Avoid writing custom CSS files or using inline `style` attributes.
- **State Management**: Use React's built-in hooks (`useState`, `useEffect`, `useContext`) for managing component state. Custom hooks should be placed in `src/react-app/hooks/`.
- **Shared Types**: To ensure type safety between the frontend and backend, define shared Zod schemas in `src/shared/`. These schemas should be the single source of truth for data structures.
- **Forms**: Handle form state with React hooks. Use the shared Zod schemas from `src/shared/` for client-side validation to provide immediate feedback to the user, matching the backend validation.
- **API Communication**: Use the native `fetch` API for all requests to the backend API endpoints defined in `src/worker/index.ts`.
- **Icons**: Only use icons from the `lucide-react` library to maintain visual consistency.
- **File Structure**:
    - **Pages**: `src/react-app/pages/`
    - **Components**: `src/react-app/components/`
    - **Hooks**: `src/react-app/hooks/`
    - **Shared Types**: `src/shared/`
    - **Backend Logic**: `src/worker/`