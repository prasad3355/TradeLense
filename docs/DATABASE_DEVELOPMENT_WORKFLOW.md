# Database Development Workflow

This document outlines the required workflow for managing the Tradelense V2 Supabase PostgreSQL database.

## 1. Migration-First Rule
All database schema changes MUST be represented as SQL migrations in `supabase/migrations/`. 
Do **NOT** perform ad-hoc SQL executions via the Supabase Dashboard SQL Editor or via random scripts against production.

## 2. Local/Development Supabase Workflow
- Rely on the `supabase` directory configured via `config.toml`.
- When Docker is available, you can boot the local environment via `supabase start`.
- Doing this locally allows you to iterate safely without affecting production data.

## 3. How to Validate Migrations
- Use `supabase migration list` (or `--local` if isolated locally) to verify migration histories. 
- You can parse and test your migrations locally by checking the Supabase Studio dashboard (`localhost:54323`) after running `supabase start`.

## 4. How to Create Future Migrations
Always generate new migrations using the CLI:
```bash
supabase migration new short_descriptive_name
```
Then, populate the generated file in `supabase/migrations/` with your schema changes.

## 5. Secret Handling
- **Never** commit secrets or service-role keys into Git, `.env.example`, or migrations.
- The `config.toml` holds development configurations. Secrets belong strictly in local `.env` overriding files or cloud secret managers.
- `VITE_` prefixed variables are exposed to the client browser. Never expose privileged credentials (like `SUPABASE_SERVICE_ROLE_KEY`) with a `VITE_` prefix.

## 6. RLS Testing Expectations
- Always enable Row Level Security (RLS) on newly created tables.
- Before considering an RLS policy complete, it must be validated specifically under the conditions of a bound, authenticated user (e.g. referencing `auth.uid()`).
- Refrain from using `true` or bypassing roles manually to feign policy adherence.

## 7. Production Migration Discipline
- Apply migrations sequentially in a CI/CD pipeline using `supabase db push`.
- Never edit an already-applied migration. If a deployed schema is flawed, generate a *new* migration to roll it back or modify it safely.

## 8. Prohibition on Destructive Resets
- Do **NOT** run `supabase db reset` against a live remote environment or ANY environment containing non-disposable valuable data. 
- Use reset commands strictly in isolated, disposable local containers.
