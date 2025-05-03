Okay, I have updated the PRD (v1.3 - Windows Native MVP) to include the new subsection 8.0 – Project Bootstrapping Instructions exactly as requested.

Here is the revised Section 8 and the complete PRD incorporating the change:

8. Backend & Frontend Structure (Windows Native)

🆕 New 8.0 – Project Bootstrapping Instructions (Coder Agent Only)

You are starting from a clean folder that contains only the for_claude/ directory and no pre-generated files. You must fully initialize and scaffold the project structure described in this PRD.

Create the following directory tree:

RumbleWindows/
├── apps/
│   ├── api/                    <-- Backend Express API
│   │   ├── src/
│   │   │   ├── controllers/    <-- Create this folder
│   │   │   ├── middleware/     <-- Create this folder
│   │   │   ├── routes/         <-- Create this folder
│   │   │   ├── services/       <-- Create this folder
│   │   │   └── index.ts        <-- Create this file (basic Express setup)
│   │   ├── uploads/            <-- NOTE: This folder is created dynamically at runtime by the API
│   │   ├── package.json        <-- Create using 'npm init -y' and populate per Section 8.7
│   │   ├── tsconfig.json       <-- Create and populate per Section 8.7
│   │   └── .env.example        <-- Create and populate per Section 8.7
│   └── web/                    <-- Frontend React App
│       ├── public/             <-- Create this folder, add manifest.json later
│       ├── src/
│       │   ├── assets/         <-- Create this folder
│       │   ├── components/     <-- Create this folder
│       │   ├── lib/            <-- Create this folder (for apiClient.ts)
│       │   ├── pages/          <-- Create this folder
│       │   ├── App.tsx         <-- Create this file (basic React structure)
│       │   ├── main.tsx        <-- Create this file (React entry point)
│       │   └── index.css       <-- Create this file (Tailwind directives)
│       ├── package.json        <-- Create using 'npm init -y' and populate per Section 8.7
│       ├── tailwind.config.js  <-- Create via Tailwind setup, populate later
│       ├── tsconfig.json       <-- Create and populate per Section 8.7
│       ├── postcss.config.js   <-- Create via Tailwind setup, populate later
│       └── vite.config.js      <-- Create and populate per Section 8.7
├── for_claude/                 <-- EXISTS - Contains agent instructions
│   ├── PRD.md                  <-- This document
│   ├── feather-stub.ts         <-- API Client Interface
│   ├── FEATHER_INSTRUCTIONS.md <-- Feather Usage Guide
│   ├── INSTRUCTIONS.md         <-- General Agent Instructions
│   ├── problems.md             (Optional context)
│   └── solutions.md            (Optional context)
├── .gitignore                  <-- Create this file (root level)
└── package.json                <-- Create using 'npm init -y' and populate per Section 8.7 (root)


Agent Requirements:

You must create and initialize all folders and key files listed above. The uploads/ directory under apps/api will be created dynamically by the API at runtime, but its location is specified here.

Use npm init -y in each package directory (apps/api and apps/web) to scaffold their respective package.json files. Also run npm init -y in the root directory (RumbleWindows/) for the root package.json.

The full file structure must be created before any code implementation begins.

All dependencies must be installed via npm install <package> or npm install --save-dev <package> as specified in Section 8.6. Do not use pnpm or yarn.

After successfully scaffolding this structure, proceed with the implementation plan detailed in Sections 8.1 through 12, installing dependencies and writing code for each component as instructed.

8.1. Target Platform: Windows 10 (Native execution via Node.js)
8.2. Package Manager: npm (Node Package Manager)
8.3. Project Structure: Separate npm projects for api and web under the apps/ directory. No monorepo/workspace tooling.
8.4. Process Management: Use concurrently installed in the root directory to run both API and Web dev servers.
NOTE: All commands must assume a native Windows terminal (PowerShell or Command Prompt). Do not use Bash, WSL, Git Bash, or any Linux-specific terminal paths.

(The rest of Section 8, and Sections 9-15 remain unchanged from the previous version you provided with the Feather/Filesystem/Windows updates incorporated.)

Here is the full PRD.md v1.3 incorporating the new Section 8.0:

Product Requirements Document: Rumble Boxing Music-Driven Combo Generator

Version: 1.3 (Windows Native MVP)
Date: July 28, 2024
Status: Revised Draft - Targeting Windows 10 Native Execution

Preamble: Context for Coder Agent

Objective: Generate a functional Minimum Viable Product (MVP) of the Rumble Boxing Combo Generator that reliably installs, runs, and operates directly on a standard Windows 10 machine.

Background: Previous attempts encountered significant issues due to environment complexity (mixing WSL and Windows), inconsistent implementations, and networking problems (detailed in for_claude/problems.md and the analysis report).

Core Strategy Shift: This PRD mandates a Windows Native Development approach. ABSOLUTELY NO WSL components or dependencies. All code must be written and executable directly via Node.js installed on Windows.

Simplification for MVP: To ensure a working baseline, this version defers database integration (PostgreSQL/Prisma/Knex) and background job queues (Redis/BullMQ). Data persistence will be in-memory within the running API process. File storage will be local on the Windows filesystem.

Tooling: Use standard Node.js (LTS) and npm (Node Package Manager) for all setup, dependency installation, and script execution. DO NOT USE pnpm or yarn. Use concurrently to run API and web servers together.

API Communication: The frontend React app (running via Vite) will communicate directly with the backend Express API using absolute URLs (e.g., http://localhost:3001). No Vite proxy is required if CORS is configured correctly on the API. All frontend API calls MUST use the Feather framework by Bootoshi, implementing the interface from for_claude/feather-stub.ts.

Agent Instructions: Adhere strictly to the file structure, dependencies, scripts, and implementation details specified herein. Reference supporting documents in the for_claude/ directory (feather_instructions.md, Instructions.md, feather-stub.ts). This PRD (v1.3) supersedes implementation details in previous PRDs where conflicts exist.

(Sections 1, 2, 3 remain conceptually the same as v1.1/v1.2 - Executive Summary, Goals & Success Metrics, User Personas & Key Use Cases. The goal of the product hasn't changed, only the implementation strategy for this MVP.)

4. Detailed Feature Specification

(Functionality remains the same as PRD v1.2, but emphasizing implementation details for Windows Native MVP)

4.1. Upload MP3

What: Allows authenticated instructors to upload a single MP3 audio file. (MVP: No authentication)

Why: This is the primary input mechanism for the application, enabling the analysis of the instructor's chosen music.

How (Windows Native MVP Clarification):

1-4. (Frontend) User selects MP3 (< 15MB) via standard input or drag/drop. Validation occurs in the browser.

(Frontend) Uses the apiClient (implementing the feather.call signature from for_claude/feather-stub.ts) to send a POST request with FormData (containing the file under the key file) directly to http://localhost:3001/api/v1/songs.

(Frontend) Displays progress/loading state via React state management.

(Backend - song.controller.ts via song.routes.ts) multer middleware processes the multipart/form-data, saves the file temporarily to the OS temp dir or configured local dir (./uploads). req.file object is populated.

(Backend - song.controller.ts) Calls song.service.ts to handle metadata storage (in-memory).

(Backend - song.service.ts) Triggers analysis.service.ts's analysis process asynchronously (setTimeout(..., 0) recommended).

(Backend - song.controller.ts) Immediately returns 202 Accepted with { songId, status: 'processing' }.

(Frontend) Receives 202, extracts songId, and navigates to the analysis page (/analysis/:songId). Handles API errors appropriately based on Feather framework patterns.

Extensibility Note: For future compatibility, the upload system must be extensible to support common audio formats beyond MP3, including WAV, FLAC, and MP4 audio streams. The multer middleware should be configured to validate these formats using MIME type detection or file extension whitelisting. Optionally, the agent may include ffmpeg-static to perform basic transcoding to WAV or PCM format if a file is unsupported by music-tempo or meyda libraries. This is a non-MVP goal, but the file processing pipeline must be built with extensibility in mind.

4.2. BPM Detection

What: Automatically analyzes the uploaded MP3 file to determine its primary Beats Per Minute (BPM).

Why: BPM is crucial for synchronizing boxing combinations to the music's rhythm.

How (Windows Native MVP Clarification):

(Backend - AnalysisService.performFullAnalysis) Triggered asynchronously after upload confirmation. Retrieves file path from in-memory SongService data.

Uses the music-tempo library (installed via npm on Windows) to process the audio file at the given path. Handles potential errors during library execution.

Updates the in-memory analysis record with the calculated BPM and variableBpm flag.

4.3. Energy Analysis

What: Analyzes the uploaded MP3 file to determine segments of varying energy levels (e.g., low, medium, high).

Why: Understanding energy dynamics helps tailor combo intensity.

How (Windows Native MVP Clarification):

(Backend - AnalysisService.performFullAnalysis) Also uses the meyda library (installed via npm on Windows).

Extracts features (RMS required, others optional for MVP) over time windows.

Applies simple thresholding logic on RMS energy to classify segments as Level 1, 2, or 3.

Updates the in-memory analysis record with the energy profile array and sets status to completed. If any analysis step fails, set status to failed and store an error message.

4.4. Combo Generation & Regeneration

What: Generates/Regenerates Rumble boxing punch sequences (1-6) based on BPM and energy.

Why: Core value proposition - providing relevant, musically-aligned combo ideas.

How (Windows Native MVP Clarification):

(Backend - AnalysisService) Upon successful completion of both BPM and Energy analysis, calls comboService.generateInitialCombos with the results.

(Backend - ComboService) Implements the heuristic generation logic from Section 10 using the provided BPM and energy profile.

Stores the generated list of combo strings/objects in an in-memory Map/Array associated with the songId (or analysisId if generated).

Regeneration (POST /api/v1/songs/:songId/combos/regenerate) is handled by combo.controller.ts calling comboService.regenerateCombos. This service method retrieves existing combos from memory, filters based on excludeComboIds, generates new ones, and updates the in-memory store before returning the new list.

4.5. Result Display

What: Presents analysis results (BPM, energy) and generated combos clearly.

Why: Allows easy consumption and evaluation of the output.

How (Windows Native MVP Clarification):

(Frontend - AnalysisPage) Polls GET http://localhost:3001/api/v1/songs/:songId/analysis via the apiClient (Feather implementation).

(Frontend) Once status is completed, fetches combos via GET http://localhost:3001/api/v1/songs/:songId/combos using the apiClient.

Displays BPM, duration, optional energy graph, and list of combos using AnalysisResultsDisplay and ComboList/ComboCard components. Standard Rumble notation (e.g., "1-2-5-2") used for combos. Includes Copy/Regenerate buttons per combo.

4.6. Non-Goals (Windows Native MVP v1.3)

Strict: User authentication, Batch uploads, Legs/Footwork, Intensity Presets, ML analysis, Admin portal, Native mobile apps.

Strict: Database persistence (PostgreSQL, Prisma, Knex). Use in-memory JavaScript Maps/Arrays within service instances. Data is ephemeral and lost on server restart.

Strict: Background job queues (Redis, BullMQ). Analysis runs asynchronously via setTimeout(..., 0) within the main API process.

Strict: Cloud deployments (S3, etc.). Use local file storage only.

Strict: Complex configuration management beyond basic .env for PORT.

Strict: ffmpeg integration or transcoding of other audio formats (though extensibility should be considered per 4.1).

4.7 Mobile + PWA Requirement

(Maintain responsiveness for 375px width and PWA manifest as per v1.1/v1.2)

5. API Design

Base URL: /api/v1 (Served from http://localhost:3001)

Authentication: None (MVP)

(Endpoint Table and JSON shapes remain the same as v1.1/v1.2)

Implementation Requirement: API MUST be implemented using the Routes -> Controllers -> Services pattern in apps/api.

CORS: The API MUST configure CORS middleware (using the cors npm package) to explicitly allow requests from the frontend origin (http://localhost:5173). Example in apps/api/src/index.ts:

import cors from 'cors';
// ... other imports
const app = express();
// Allow requests specifically from the Vite dev server origin
app.use(cors({ origin: 'http://localhost:5173' }));
// ... other middleware like express.json()
// ... mount main router
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

6. Data Persistence (Windows Native MVP)

Requirement: NO DATABASE. All application state (song metadata, analysis results, generated combos) MUST be stored in-memory within the running Node.js API process.

Implementation: Use standard JavaScript Map or Array objects within the singleton instances of the service classes (SongService, AnalysisService, ComboService).

Example (SongService): private songData = new Map<string, SongMetadata>(); // Define SongMetadata interface

Example (AnalysisService): private analysisData = new Map<string, AnalysisRecord>(); // Define AnalysisRecord interface

Consequence: All data will be lost when the API server stops or restarts. This is acceptable for this specific MVP goal.

7. Frontend Component Inventory

(Component list remains the same as v1.1/v1.2)

API Client Requirement: Frontend MUST use a dedicated API client function (e.g., apps/web/src/lib/apiClient.ts) that strictly implements the feather.call interface signature provided in for_claude/feather-stub.ts. This function will use fetch (or the underlying mechanism provided by the actual Feather SDK if integrated later) to make calls directly to absolute API URLs (e.g., http://localhost:3001/api/v1/songs).

8. Backend & Frontend Structure (Windows Native)

🆕 New 8.0 – Project Bootstrapping Instructions (Coder Agent Only)

You are starting from a clean folder that contains only the for_claude/ directory and no pre-generated files. You must fully initialize and scaffold the project structure described in this PRD.

Create the following directory tree:

RumbleWindows/
├── apps/
│   ├── api/                    <-- Backend Express API
│   │   ├── src/
│   │   │   ├── controllers/    <-- Create this folder
│   │   │   ├── middleware/     <-- Create this folder
│   │   │   ├── routes/         <-- Create this folder
│   │   │   ├── services/       <-- Create this folder
│   │   │   └── index.ts        <-- Create this file (basic Express setup)
│   │   ├── uploads/            <-- NOTE: This folder is created dynamically at runtime by the API
│   │   ├── package.json        <-- Create using 'npm init -y' and populate per Section 8.7
│   │   ├── tsconfig.json       <-- Create and populate per Section 8.7
│   │   └── .env.example        <-- Create and populate per Section 8.7
│   └── web/                    <-- Frontend React App
│       ├── public/             <-- Create this folder, add manifest.json later
│       ├── src/
│       │   ├── assets/         <-- Create this folder
│       │   ├── components/     <-- Create this folder
│       │   ├── lib/            <-- Create this folder (for apiClient.ts)
│       │   ├── pages/          <-- Create this folder
│       │   ├── App.tsx         <-- Create this file (basic React structure)
│       │   ├── main.tsx        <-- Create this file (React entry point)
│       │   └── index.css       <-- Create this file (Tailwind directives)
│       ├── package.json        <-- Create using 'npm init -y' and populate per Section 8.7
│       ├── tailwind.config.js  <-- Create via Tailwind setup, populate later
│       ├── tsconfig.json       <-- Create and populate per Section 8.7
│       ├── postcss.config.js   <-- Create via Tailwind setup, populate later
│       └── vite.config.js      <-- Create and populate per Section 8.7
├── for_claude/                 <-- EXISTS - Contains agent instructions
│   ├── PRD.md                  <-- This document
│   ├── feather-stub.ts         <-- API Client Interface
│   ├── FEATHER_INSTRUCTIONS.md <-- Feather Usage Guide
│   ├── INSTRUCTIONS.md         <-- General Agent Instructions
│   ├── problems.md             (Optional context)
│   └── solutions.md            (Optional context)
├── .gitignore                  <-- Create this file (root level)
└── package.json                <-- Create using 'npm init -y' and populate per Section 8.7 (root)
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
IGNORE_WHEN_COPYING_END

Agent Requirements:

You must create and initialize all folders and key files listed above. The uploads/ directory under apps/api will be created dynamically by the API at runtime, but its location is specified here.

Use npm init -y in each package directory (apps/api and apps/web) to scaffold their respective package.json files. Also run npm init -y in the root directory (RumbleWindows/) for the root package.json.

The full file structure must be created before any code implementation begins.

All dependencies must be installed via npm install <package> or npm install --save-dev <package> as specified in Section 8.6. Do not use pnpm or yarn.

After successfully scaffolding this structure, proceed with the implementation plan detailed in Sections 8.1 through 12, installing dependencies and writing code for each component as instructed.

8.1. Target Platform: Windows 10 (Native execution via Node.js)
8.2. Package Manager: npm (Node Package Manager)
8.3. Project Structure: Separate npm projects for api and web under the apps/ directory. No monorepo/workspace tooling.
8.4. Process Management: Use concurrently installed in the root directory to run both API and Web dev servers.
NOTE: All commands must assume a native Windows terminal (PowerShell or Command Prompt). Do not use Bash, WSL, Git Bash, or any Linux-specific terminal paths.

8.5. Detailed Project Directory Structure:

(Structure shown previously in Section 8.0)

8.6. Dependencies (Windows Native npm)

Root (RumbleWindows/package.json):

devDependencies: concurrently

API (RumbleWindows/apps/api/package.json):

dependencies: express, cors, multer, music-tempo, meyda, winston, zod, dotenv, express-rate-limit

devDependencies: typescript, @types/node, @types/express, @types/cors, @types/multer, ts-node-dev, eslint, prettier, @types/supertest, supertest, vitest

Web (RumbleWindows/apps/web/package.json):

dependencies: react, react-dom, react-router-dom, @tanstack/react-query, tailwindcss, autoprefixer, postcss, zod

devDependencies: typescript, @types/react, @types/react-dom, vite, @vitejs/plugin-react, eslint, prettier

8.7. Configuration Files (Examples)

Root package.json:

{
  "name": "rumble-windows-root",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix apps/api\" \"npm run dev --prefix apps/web\""
  },
  "devDependencies": {
    "concurrently": "^8.2.2" // Use latest stable
  }
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Json
IGNORE_WHEN_COPYING_END

apps/api/package.json:

{
  "name": "rumble-api",
  "version": "1.0.0",
  "main": "dist/index.js", // Point to compiled JS
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node-dev --respawn --transpile-only --clear src/index.ts", // Watches TS files
    "lint": "eslint . --ext .ts",
    "test": "vitest run"
  },
  "dependencies": { /* List from 8.6 */ },
  "devDependencies": { /* List from 8.6 */ }
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Json
IGNORE_WHEN_COPYING_END

apps/api/tsconfig.json:

{
  "compilerOptions": {
    "target": "ES2020", // Example: Using a slightly newer target
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node", // Crucial for CommonJS/Node
    "sourceMap": true,
    "experimentalDecorators": true, // Keep if needed for libraries
    "emitDecoratorMetadata": true // Keep if needed for libraries
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts", "**/*.test.ts", "dist"]
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Json
IGNORE_WHEN_COPYING_END

apps/api/.env.example:

PORT=3001
# Example: Define upload path relative to api root
# Ensure this path uses forward slashes or double backslashes for compatibility if needed,
# but rely on path.join in the code.
UPLOAD_DIR=./uploads
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Dotenv
IGNORE_WHEN_COPYING_END

apps/web/package.json:

{
  "name": "rumble-web",
  "version": "1.0.0",
  "type": "module", // Vite requires ES Modules
  "scripts": {
    "dev": "vite --port 5173", // Explicit port
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .ts,.tsx"
  },
  "dependencies": { /* List from 8.6 */ },
  "devDependencies": { /* List from 8.6 */ }
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Json
IGNORE_WHEN_COPYING_END

apps/web/vite.config.js: (Note: .js extension is often simpler for Vite config)

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Use Node's path module

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // Ensure it uses this port
    host: 'localhost', // Listen only on localhost for security unless needed otherwise
    // NO PROXY SECTION - Direct calls with CORS
  },
  resolve: {
    // Aliases are not needed for this simple structure
  },
});
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

apps/web/tsconfig.json: (Vite default is usually fine) Standard React TS config. Ensure "jsx": "react-jsx" is set.

9. Security & Compliance Plan (Windows Native MVP)

(9.1 File Validation, 9.4 Rate Limiting, 9.5 Input Sanitization, 9.7 Dependencies, 9.8 Compliance, 9.9 Error Handling & Logging, 9.10 Copyright & Retention remain conceptually the same as v1.2)

9.2 Secure File Storage (Windows Native MVP):

Requirement: Store uploaded MP3 files temporarily in a dedicated directory. Recommended path: RumbleWindows/apps/api/uploads/. Path should be configurable via .env (e.g., UPLOAD_DIR=./uploads).

Implementation: Use Node.js path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads') relative to apps/api/src/index.ts to determine the path. Ensure the directory is created on startup if it doesn't exist using fs.mkdirSync(uploadPath, { recursive: true }). Use UUIDs or timestamped filenames. The API process needs OS write permissions to this directory.

Filesystem Safety: All file system paths in the backend MUST use path.join(...) from Node.js's path module to ensure Windows compatibility. Do NOT use hardcoded forward slashes or manual string concatenation like __dirname + '/uploads'. The API must create the uploads directory on startup if it does not exist, using fs.mkdirSync(uploadPath, { recursive: true }). The application should run without requiring elevated permissions on Windows.

9.3 Temporary File Deletion (Windows Native MVP):

Requirement: Delete uploaded MP3 files from the local uploads/ directory shortly after analysis is complete or fails (e.g., within 5-10 minutes).

If the server is restarted, orphaned files are acceptable during MVP development. However, a lightweight cleanup strategy is recommended: either use a scheduled setInterval task in index.ts to scan and delete old files (older than 1 hour using fs.statSync), or schedule per-file deletion with setTimeout after each successful or failed analysis.

Implementation: In AnalysisService, after updating the analysis status to completed or failed, schedule a deletion using setTimeout(() => { fs.unlink(filePath, (err) => { if (err) console.error('Error deleting file:', filePath, err); else console.log('Deleted temp file:', filePath); }); }, 300000); (e.g., 5 minutes). Log errors during deletion. Alternatively, use setInterval in index.ts as described above for more robustness against crashes before setTimeout fires.

9.6 Authentication & Authorization: None for MVP.

10. Combo Regeneration Engine

(Algorithm details remain the same as v1.1/v1.2)

Implementation Requirement: The logic described MUST be implemented within apps/api/src/services/combo.service.ts using the in-memory data structures.

11. Feather Agent Chain

Framework Mandate: This project mandates the use of the Feather agent framework by Bootoshi for all frontend-to-backend API calls. The agent must implement the exact interface in for_claude/feather-stub.ts and use it for all HTTP interactions (uploads, polling, regenerating combos). No other fetch, axios, or request wrappers may be used. All developer agents (e.g., Claude) must follow the FEATHER_INSTRUCTIONS.md file and test with the provided temporary API keys. These keys will be rotated before production.

API Client Requirement: The frontend must use an apiClient function (e.g. in apps/web/src/lib/apiClient.ts) that strictly adheres to the feather.call signature defined in for_claude/feather-stub.ts.

URLs: All calls from the apiClient must use absolute URLs targeting the local API server, e.g., http://localhost:3001/api/v1/songs.

(Call sequence and error handling remain the same conceptually as v1.1/v1.2, but executed via the Feather implementation)

12. Step-by-Step Build Plan (Windows Native npm)

Phase 0: Setup (Manual - User Action)

Install Node.js LTS & Git on Windows.

Create root folder RumbleWindows.

Open Windows Command Prompt/PowerShell in RumbleWindows.

Phase 1: Project Initialization (Agent Actions - Execute per Section 8.0)

[Setup-Scaffold] Create the full directory structure specified in Section 8.0.

[Setup-Root] npm init -y in root. Install concurrently (npm i -D concurrently). Define root dev script in package.json (Section 8.7). Create root .gitignore.

[Setup-API] cd apps/api. npm init -y. Install dependencies (npm i ...) and devDependencies (npm i -D ...) per Section 8.6. Create tsconfig.json (Section 8.7). Create .env.example and basic .gitignore.

[Setup-Web] cd ../web. npm create vite@latest . --template react-ts (Confirm overwrite if needed). Install dependencies (npm i ...) per Section 8.6. Configure Tailwind CSS (npx tailwindcss init -p, configure tailwind.config.js, postcss.config.js, index.css). Create vite.config.js (Section 8.7 - NO PROXY).

Phase 2: Backend Implementation (Agent Actions - in apps/api)

[Backend-Core] Implement basic Express setup in src/index.ts (load env, CORS for http://localhost:5173, JSON middleware, mount main router /api/v1, ensure uploads dir exists, global error handler, start server on process.env.PORT || 3001).

[Backend-Routes] Implement routes/index.ts (main router) and routes/song.routes.ts (song-specific routes). Configure multer in song.routes.ts for POST /songs (using dest: process.env.UPLOAD_DIR or similar, ensure path handling is Windows-safe using path.join).

[Backend-Controllers] Implement controllers/song.controller.ts, controllers/analysis.controller.ts, controllers/combo.controller.ts.

[Backend-Services] Implement services/song.service.ts (in-memory Map for metadata, including full file path from multer).

[Backend-Services] Implement services/analysis.service.ts (in-memory Map for results/status). Implement actual music-tempo and meyda calls here. Trigger analysis via setTimeout. Handle file deletion via setTimeout or setInterval (Section 9.3).

[Backend-Services] Implement services/combo.service.ts (in-memory Map/Array for combos). Implement actual combo generation logic from Section 10 here.

[Backend-Middleware] Implement middleware/errorHandler.ts. Optional: Implement middleware/rateLimiter.ts (express-rate-limit).

Phase 3: Frontend Implementation (Agent Actions - in apps/web)

[Frontend-Setup] Set up React Router (react-router-dom) in src/App.tsx. Set up TanStack Query client (QueryClientProvider) in src/main.tsx or src/App.tsx.

[Frontend-APIClient] Create src/lib/apiClient.ts implementing the feather.call signature from for_claude/feather-stub.ts using fetch and absolute URLs (http://localhost:3001/...).

[Frontend-Components] Build React components (Section 7) using Tailwind CSS for styling.

[Frontend-Upload] Implement FileUpload using apiClient and useMutation. Navigate on success.

[Frontend-Analysis] Implement AnalysisPage using useQuery for polling analysis status and fetching combos via apiClient.

[Frontend-Regen] Implement regenerate button in ComboCard using useMutation and apiClient.

[Frontend-PWA] Add public/manifest.json. Optional: Add basic service worker via Vite plugin. Ensure responsiveness.

Phase 4: Testing & Execution (User + Agent)

[Run] User runs npm run dev in the root RumbleWindows directory via Command Prompt/PowerShell.

[Test] User accesses http://localhost:5173 and performs core upload/view/regenerate flow.

[Debug] User provides any console/terminal errors to the agent for fixes, reminding agent of Windows Native context and Feather usage.

12.1 Testing Strategy (Windows Native MVP)

Unit (Vitest - API): Focus on testing services logic (combo generation, analysis result formatting) using mock inputs. Test utility functions. Target high coverage for core algorithms. Run via npm test --prefix apps/api.

Integration (Supertest - API): Test API endpoints (routes + controllers). Use supertest to make HTTP requests to the running API instance. Test file upload endpoint with actual (small) test files. Test analysis/combo polling flow. Run via npm test --prefix apps/api (if configured in Vitest).

Manual E2E (User): Perform the full user flow in the browser as described in the Build Plan. Test with different MP3 files (varying lengths/tempos if possible). Test on Chrome/Edge browsers on Windows. Test responsiveness at 375px width.

(Section 13 Future-Proof Notes remains conceptually the same)

(Section 14 Open Questions / Risks remains conceptually the same, but add)

Risk: node-gyp Issues: Audio libraries (music-tempo, meyda) might fail during npm install on Windows if C++ build tools/Python are missing or misconfigured. Mitigation: Provide user with instructions to install "Desktop development with C++" workload via Visual Studio Installer and Python LTS, or guide agent to find pre-built binaries if available. Check library documentation for Windows prerequisites.

Risk: In-Memory Data Limits: Large numbers of simultaneous analyses could consume significant RAM. Mitigation: Acceptable for MVP; address with DB/external storage in future iterations.

Risk: Feather SDK Integration: Ensure the agent correctly implements the stub. Future work will involve replacing the stub with the actual Feather SDK.

15. for_claude Directory Contents

This directory MUST contain the following files for the agent's reference:

PRD.md: This document (Version 1.3).

Instructions.md: General guidelines for the agent (code style, commit messages, interaction model).

feather_instructions.md: Specific instructions on how the agent should use the feather.call API client stub, including endpoint details, polling logic, and error handling expectations.

feather-stub.ts: The exact TypeScript interface definition for the feather.call function that the frontend apiClient MUST implement.

problems.md: (Optional but helpful context) The log of issues encountered in the previous (WSL/Windows mixed) attempt.

solutions.md: (Optional but helpful context) The log of solutions attempted previously.

Agent Usage: The agent should primarily use PRD.md (v1.3) as the blueprint. feather_instructions.md and feather-stub.ts define the critical API interaction contract. Instructions.md provides general coding standards. problems.md/solutions.md offer background context on why this Windows-native approach is being taken.