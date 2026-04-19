# 🚀 Production-Ready Node.js Backend Starter Template

A highly modular, type-safe, and production-ready starter template for building scalable backends with Node.js, Express, and MongoDB. This template follows clean architecture principles and comes pre-configured with essential tools and dual-authentication modes.

## ✨ Key Features

-   **🛡️ Dual Authentication System**: Switch between **Passport.js** (Session-based) and **Custom JWT** authentication via a single environment variable.
-   **🔷 TypeScript First**: Full type safety with strict configurations. Zero `any` usage in core logic.
-   **🧩 Modular Architecture**: Organized by modules (User, Auth, etc.) for high maintainability.
-   **✅ Data Validation**: Integrated **Zod** for robust request body, query, and param validation.
-   **📧 Professional Email System**: Built-in Nodemailer support with **Type-safe HTML templates** (no legacy EJS required).
-   **🖼️ Media Handling**: Pre-configured **Multer** and **Cloudinary** integration for seamless image uploads.
-   **🚨 Global Error Handling**: Centralized error management for Zod, Mongoose, and Custom App errors.
-   **🌱 Database Seeding**: Automated Super Admin seeding script.
-   **🛠️ Developer Experience**: ESLint, Prettier, and Husky (optional) ready.

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── config/             # Configuration (Passport, Cloudinary, Env, etc.)
│   ├── errorHelpers/       # Error handling utilities
│   ├── interfaces/         # Global types and interfaces
│   ├── middlewares/        # Express middlewares (Auth, Validation, Errors)
│   ├── modules/            # Domain modules (User, Auth, etc.)
│   │   ├── user/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.interface.ts
│   │   │   ├── user.model.ts
│   │   │   ├── user.route.ts
│   │   │   └── user.service.ts
│   │   └── ...
│   ├── routes/             # Central route registry
│   ├── utils/              # Helper functions (JWT, Email, Seeding)
│   └── app.ts              # Express app configuration
├── server.ts               # Server entry point
└── ...
```

---

## 🚀 Getting Started

### 1. Prerequisites
-   Node.js (v16+)
-   MongoDB (Local or Atlas)
-   npm or yarn

### 2. Installation
```bash
# Clone the repository
git clone <your-repo-url>

# Install dependencies
npm install
```

### 3. Environment Setup
Copy the `.env.example` file to `.env` and fill in your credentials.
```bash
cp .env.example .env
```

### 4. Running the Application
```bash
# Development mode
npm run dev

# Build the project
npm run build

# Production mode
npm start
```

---

## ⚙️ Configuration

### Authentication Mode
Toggle between the two systems in your `.env`:
```env
AUTH_SYSTEM=custom   # Uses Custom JWT (Headers)
# OR
AUTH_SYSTEM=passport # Uses Passport.js (Sessions + Google OAuth)
```

---

## 🛠️ Scripts

-   `npm run dev`: Start development server with ts-node-dev.
-   `npm run build`: Compile TypeScript to JavaScript.
-   `npm start`: Run the compiled production build.
-   `npm run lint`: Check for linting errors.
-   `npm run fix`: Automatically fix linting errors.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.
