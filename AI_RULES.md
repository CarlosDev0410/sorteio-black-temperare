# AI Development Rules

This document outlines the tech stack and development rules for this project to ensure consistency and maintainability.

## Tech Stack

- **Framework**: React (v19) with Vite for a fast development experience.
- **Language**: TypeScript for type safety and improved developer experience.
- **Backend**: Hono, a lightweight web framework running on Cloudflare Workers for serverless API endpoints.
- **Database**: Cloudflare D1, a serverless SQL database.
- **Styling**: Tailwind CSS for a utility-first styling approach.
- **Routing**: React Router for client-side navigation.
- **Schema Validation**: Zod for defining and validating data schemas on both the client and server.
- **Icons**: Lucide React for a comprehensive and consistent set of icons.

## Development Guidelines

- **UI Components**: Prioritize creating small, reusable components. For common UI patterns, use pre-built, accessible components like those from shadcn/ui if they are added to the project.
- **Styling**: All styling must be done using Tailwind CSS utility classes. Avoid writing custom CSS files or using inline `style` attributes.
- **State Management**: Use React's built-in hooks (`useState`, `useEffect`, `useContext`) for managing component state.
- **Forms**: Handle form state with React hooks. Use Zod on the client-side for validation to provide immediate feedback to the user, matching the backend validation schema in `src/shared/types.ts`.
- **API Communication**: Use the native `fetch` API for all requests to the backend API endpoints defined in `src/worker/index.ts`.
- **Icons**: Only use icons from the `lucide-react` library to maintain visual consistency.
- **File Structure**:
    - **Pages**: Place page-level components in `src/react-app/pages/`.
    - **Components**: Place reusable UI components in `src/react-app/components/`.
    - **Hooks**: Place custom React hooks in `src/react-app/hooks/`.
    - **Shared Types**: Define shared types and schemas between the frontend and backend in `src/shared/`.
    - **Backend Logic**: All server-side code resides in `src/worker/`.