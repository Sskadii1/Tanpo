# Tanpopo Academy - Kindergarten Website

## Overview

Tanpopo Academy is a modern kindergarten website built with React and Express.js. The application showcases the kindergarten's programs, facilities, staff, and provides contact and registration functionality. It features a responsive design with a custom color scheme based on the "Tanpopo" theme (green, white, beige) and includes smooth animations using Framer Motion.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development tooling
- **Styling**: Tailwind CSS with custom Tanpopo theme colors and shadcn/ui component library
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **Animations**: Framer Motion for smooth page transitions and scroll animations
- **UI Components**: Radix UI primitives with custom styling via shadcn/ui

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Development**: TSX for TypeScript execution in development
- **Build Process**: ESBuild for server bundling and Vite for client bundling
- **API Design**: RESTful endpoints for registration and contact form submissions
- **Error Handling**: Centralized error handling middleware with proper status codes

### Data Storage Solutions
- **ORM**: Drizzle ORM with PostgreSQL dialect configured
- **Database**: PostgreSQL (configured via DATABASE_URL environment variable)
- **Schema**: User management, registration forms, and contact messages
- **Development Storage**: In-memory storage implementation for development/testing
- **Migrations**: Drizzle Kit for schema migrations

### Authentication and Authorization
- **Current State**: Basic user schema defined but no authentication implemented
- **Planned Features**: User authentication system with username/password
- **Session Management**: Connect-pg-simple configured for PostgreSQL session storage

### Component Structure
- **Layout Components**: TopNav with fixed header, HoverSidebar for navigation, Footer
- **Section Components**: Hero, Programs, Facilities, Staff, Admissions, Contact, Testimonials
- **Form Handling**: React Hook Form with Zod validation for type-safe form submission
- **Responsive Design**: Mobile-first approach with desktop enhancements

### Styling System
- **Theme Colors**: Custom CSS variables for Tanpopo brand colors (green, white, beige)
- **Component Variants**: Class Variance Authority for consistent component styling
- **Typography**: Inter and Poppins fonts with custom font variables
- **Layout**: CSS Grid and Flexbox for responsive layouts

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form
- **Development Tools**: Vite, TypeScript, ESBuild
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer

### UI and Animation Libraries
- **Component Library**: Radix UI primitives (30+ components)
- **Styling Utilities**: clsx, tailwind-merge, class-variance-authority
- **Animations**: Framer Motion for page and component animations
- **Icons**: Lucide React for consistent iconography

### Backend Dependencies
- **Web Framework**: Express.js with TypeScript support
- **Database**: Drizzle ORM, @neondatabase/serverless, connect-pg-simple
- **Validation**: Zod for runtime type checking and validation
- **Utilities**: date-fns for date manipulation

### Development and Build Tools
- **TypeScript**: Full TypeScript support across client and server
- **Build Tools**: Vite for client, ESBuild for server bundling
- **Development**: TSX for TypeScript execution, runtime error overlay
- **Replit Integration**: Replit-specific plugins for development environment

### Database Configuration
- **Provider**: Neon Database (serverless PostgreSQL)
- **Connection**: Environment variable-based configuration
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Development**: In-memory storage fallback for development/testing

### Third-party Services
- **Image Hosting**: Unsplash for placeholder images
- **Fonts**: Google Fonts (Inter, Poppins, Architects Daughter)
- **Development Platform**: Replit-specific optimizations and tooling