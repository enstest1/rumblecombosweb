Global Instructions for Coder Agents

You are starting from a clean folder with only the `for_claude/` directory provided.

❗️Read `PRD.md` and `FEATHER_INSTRUCTIONS.md` first — these define everything you must build and how.

🔧 Tooling Rules:
- Use **Node.js + npm** only.
- Do NOT use pnpm, yarn, WSL, Git Bash, or Linux-style paths.
- Use only native Windows shell commands.
- Use `npm init -y` in each directory before installing packages.

💡 Code Quality Requirements:
- All frontend API calls must use the Feather wrapper defined in `feather-stub.ts`
- TypeScript is mandatory across frontend and backend
- Structure your code using the Routes → Controllers → Services pattern
- You must follow the exact file/folder layout from PRD Section 8.0

✅ Quality gates before commit:
- `npm run lint` — 0 ESLint or Prettier issues
- `npm run test` — 80%+ coverage for services
- All required scripts (`dev`, `build`, `start`) must work in both API and Web

Use conventional commits (`feat:`, `fix:`, etc.). After major changes, update `solutions.md` with what you did and why.
