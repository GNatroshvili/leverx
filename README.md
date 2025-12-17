# LeverX Employee Services

## Overview

LeverX Employee Services is a robust and modern web application designed to serve as an employee directory and address book. It provides a seamless interface for employees to view their colleagues' contact information, organizational details, and more. The application features a secure authentication system, role-based access control, and a responsive design that works across devices.

## Features

### UI & User Experience

- **Authentication System:**
  - **Sign In:** Secure login with email and password. Includes "Remember Me" functionality.
  - **Sign Up:** New user registration with validation for email, password strength, and required fields.
  - **Auth Tabs:** Smooth switching between Sign In and Sign Up forms.
- **Employee Directory (Main Page):**
  - **Employee Cards:** Visually appealing cards displaying key employee info (Avatar, Name, Role, Department).
  - **Search Functionality:**
    - **Basic Search:** Quick search by name or keyword.
    - **Advanced Search:** Filter by specific criteria (Department, Location, etc.).
  - **Responsive Layout:** Grid layout that adapts to different screen sizes.
- **Employee Details:**
  - **Comprehensive View:** Detailed profile page for each employee showing contact info, organizational hierarchy, and personal details.
  - **Navigation:** Easy navigation back to the main list.
- **Settings / Admin Panel:**
  - **Role Management:** Admins can view all users and update their roles (e.g., promote to Admin).
  - **User Search:** Dedicated search within the settings panel to find specific users to manage.
- **Dark Mode Support:** The application includes styles that adapt to the user's system color scheme preference.

### Technical Features

- **Single Page Application (SPA):** Built with React and React Router for smooth client-side transitions.
- **State Management:** Utilizes **Redux Toolkit** for efficient global state management.
- **API Integration:** Uses **RTK Query** for powerful data fetching, caching, and synchronization with the backend.
- **Type Safety:** Fully written in **TypeScript** to ensure code reliability and maintainability.
- **Custom Styling:** Styled using **SCSS** (Sass) with a mix of global styles and CSS Modules for component-scoped styling.
- **Protected Routes:** Implements `PrivateRoute` and `AdminRoute` components to restrict access to authorized users.

## Technologies Used

### Frontend

- **React:** UI library for building the interface.
- **TypeScript:** Static typing for JavaScript.
- **Redux Toolkit:** State management and data fetching (RTK Query).
- **React Router:** Client-side routing.
- **SCSS (Sass):** CSS pre-processor for advanced styling.
- **Webpack:** Module bundler for compiling assets.
- **Babel:** JavaScript compiler.
- **ESLint:** Code linting tool.

### Backend

- **Node.js:** JavaScript runtime environment.
- **Express:** Web framework for Node.js.
- **SQLite (better-sqlite3):** Lightweight, serverless relational database.
- **Bcrypt:** Library for hashing passwords.
- **UUID:** For generating unique identifiers.
- **CORS:** Middleware for enabling Cross-Origin Resource Sharing.

## Backend Implementation

The backend is a Node.js application using the Express framework. It serves as a RESTful API for the frontend.

- **Database:** It uses **SQLite** (`users.db`) to store user and employee data. This ensures the application is easy to set up without needing a separate database server.
- **Data Models:**
  - `users`: Stores authentication credentials (email, hashed password) and basic profile info.
  - `employees`: Stores detailed employee records.
- **Data Seeding:** On startup, if the `employees` table is empty, the server automatically seeds it with data from `employees.json`.
- **API Endpoints:**
  - `POST /sign-in`: Authenticates users and returns user details.
  - `POST /sign-up`: Registers new users.
  - `GET /users`: Retrieves a list of employees (supports search query).
  - `GET /users/:id`: Retrieves details for a specific employee.
  - `PUT /users/:id`: Updates user information.
  - `PUT /users/:id/role`: Updates a user's role and admin status (Admin only).

## Project Structure and Architecture

The project follows a standard Client-Server architecture.

```
root/
├── package.json          # Frontend dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── webpack.config.js     # Webpack configuration
├── server/               # Backend Code
│   ├── server.js         # Main Express server file
│   ├── employees.json    # Seed data
│   └── package.json      # Backend dependencies
├── src/                  # Frontend Source Code
│   ├── components/       # Reusable UI components (Header, Auth, etc.)
│   ├── pages/            # Main application pages (AuthPage, MainPage, etc.)
│   ├── store/            # Redux store setup (slices, API definition)
│   ├── utils/            # Utility functions (auth helpers, etc.)
│   ├── assets/           # Static assets (images, fonts)
│   ├── App.tsx           # Main App component
│   └── index.tsx         # Entry point
└── public/               # Static files served by Webpack
```

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

- **Node.js** (v14 or higher recommended)
- **npm** (Node Package Manager)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://frontend-course-2025-gitlab.codelx.dev/fe/gigi-natroshvili
    cd gigi-natroshvili
    ```

2.  **Install Frontend Dependencies:**

    ```bash
    npm install
    ```

3.  **Install Backend Dependencies:**
    Navigate to the server directory and install dependencies.
    ```bash
    cd server
    npm install
    ```

### Running the Project

You need to run both the backend server and the frontend development server.

1.  **Start the Backend Server:**
    Open a terminal, navigate to the `server` directory, and start the server.

    ```bash
    cd server
    npm run dev or npm start
    # The server will run on http://localhost:3000
    ```

2.  **Start the Frontend Application:**
    Open a new terminal window (in the root directory) and start the React app.
    ```bash
    npm run dev
    # The application will open in your browser at http://localhost:8080 (or similar)
    ```

### Building for Production

To build the frontend for production:

```bash
npm run build
```

This will create a `dist` folder with the compiled assets.
