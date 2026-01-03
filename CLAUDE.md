Use reatom state library. Always use context7 to get actual info about reatom@v1000.
https://v1000.reatom.dev/_llms-txt/getting-started.txt

## Store-centered development

Always keep shared stores in `src/store`

## Components

Always keep main component first. All supported, reused components should be below component.

Use `ComponentPropsWithoutRef<"">` from `react` as basic props for generic element. We prefer to have ability to pass all HTML element's props into component.

## Package Manager

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

# Lint and typecheck (type-aware, run before commits)
bun run lint

# Lint with auto-fix and typecheck
bun run lint:fix

# Format files
bun run format
bun run format:check
```

**IMPORTANT**: Always run lint and typecheck before committing changes.
**IMPORTANT**: Do not run `bun --bun tsc --noEmit 2>&1` because we have `bun run lint` with type-aware checking
