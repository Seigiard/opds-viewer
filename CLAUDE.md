Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun install` instead of `npm install`
- Use `bun run <script>` instead of `npm run <script>`
- Bun automatically loads .env, so don't use dotenv.

## Testing & Linting

```bash
# Run tests
bun run test

# Lint (type-aware, run before commits)
bun run lint

# Lint with auto-fix
bun run lint:fix

# Type check
bun --bun tsc --noEmit
```

**IMPORTANT**: Always run `bun run lint:fix` before committing changes.
