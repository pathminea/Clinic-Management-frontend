# Clinic Management System - Frontend

A React + TypeScript + Vite frontend for the Clinic Management System.

## Features

- Authentication (Login/Register)
- Appointment Management
- Doctor Directory
- Patient Management
- Role-based Access Control
- JWT Token-based Authorization
- Integration with Spring Boot Backend

## Project Structure

```
src/
├── api/              # API integration services
├── components/       # Reusable components
├── context/          # React Context for state management
├── pages/            # Page components
├── types/            # TypeScript type definitions
├── App.tsx           # Main app component
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## Setup

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables (`.env`):
```
VITE_API_BASE_URL=http://localhost:8080/api
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

### Build

Create a production build:
```bash
npm run build
```

### Preview

Preview the production build locally:
```bash
npm run preview
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| VITE_API_BASE_URL | http://localhost:8080/api | Backend API base URL |

## API Integration

### Authentication

- **Login**: `/auth/login` - POST
- **Register**: `/auth/register` - POST

### Doctors

- **Get All**: `/doctors` - GET
- **Get By ID**: `/doctors/{id}` - GET
- **Create**: `/doctors` - POST
- **Update**: `/doctors/{id}` - PUT
- **Delete**: `/doctors/{id}` - DELETE

### Patients

- **Get All**: `/patients` - GET
- **Get By ID**: `/patients/{id}` - GET
- **Create**: `/patients` - POST
- **Update**: `/patients/{id}` - PUT
- **Delete**: `/patients/{id}` - DELETE

### Appointments

- **Get All**: `/appointments` - GET
- **Get By ID**: `/appointments/{id}` - GET
- **Create**: `/appointments` - POST
- **Update**: `/appointments/{id}` - PUT
- **Delete**: `/appointments/{id}` - DELETE
- **Update Status**: `/appointments/{id}/status` - PUT

### Prescriptions

- **Get All**: `/prescriptions` - GET
- **Get By ID**: `/prescriptions/{id}` - GET
- **Get By Appointment**: `/prescriptions/appointment/{appointmentId}` - GET
- **Create**: `/prescriptions` - POST
- **Update**: `/prescriptions/{id}` - PUT
- **Delete**: `/prescriptions/{id}` - DELETE

### Treatments

- **Get All**: `/treatments` - GET
- **Get By ID**: `/treatments/{id}` - GET
- **Get By Appointment**: `/treatments/appointment/{appointmentId}` - GET
- **Create**: `/treatments` - POST
- **Update**: `/treatments/{id}` - PUT
- **Delete**: `/treatments/{id}` - DELETE

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run linter
- `npm run preview` - Preview production build

## Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Oxlint** - Linting

## CORS Configuration

Make sure your backend has CORS enabled for `http://localhost:5173` during development.

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
