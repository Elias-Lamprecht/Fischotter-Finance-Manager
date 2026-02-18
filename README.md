# Fischotter Finance Manager

A finance management hobby project built with Nuxt.

> [!CAUTION]
> This project is in early development and is **not production ready**.
> Expect breaking changes and incomplete features.

---

## Requirements

Before running the project, make sure you have:

- [pnpm](https://pnpm.io/)
- PostgreSQL (only tested and officially supported database)
- A properly configured [.env](example.env) file

> [!WARNING]
> Other databases may work, but only PostgreSQL has been tested.
> Using other databases may result in unexpected errors.

---

## Development Setup

Clone the repository:

```bash
git clone https://github.com/Elias-Lamprecht/Fischotter-Finance-Manager.git
cd Fischotter-Finance-Manager
```

Create a `.env` file in the root directory using [example.env](example.env) as a template.

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm run dev
```

---

## Database Setup

Ensure your PostgreSQL instance is running and correctly configured in your [.env](example.env) file.

Generate the migration:

```bash
pnpm run db:generate
```

Start Drizzle Studio:

```bash
npx drizzle-kit studio
```

After Drizzle Studio opens:

1. Go to the **SQL Console** tab.
2. Open the generated SQL file located in:

     ```
     ./drizzle/
     ```

3. Copy the SQL query from that file.
4. Paste it into the SQL Console.
5. Execute it using:

     ```
     Ctrl (or Strg on some keyboards) + Shift + Enter
     ```

If everything is configured correctly, the database schema will be created without errors.

> [!TIP]
> If Drizzle Studio fails to start or execution throws errors, double-check:
>
> - Database credentials in `.env`
> - Database host and port
> - That PostgreSQL is running
> - That the database specified in `DATABASE_URL` exists

---

## Project Status

- 🚧 Active hobby project
- ❌ No stable release
- ❌ Not production-ready

---

## License

Currently not specified.
