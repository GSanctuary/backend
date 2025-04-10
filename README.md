# Backend

## How To Run

1. Make sure Docker is installed.
2. Run `docker compose -f docker-compose.dev.yml up --build`
3. Visit http://localhost:8000/test to make sure the API is running

## Other Notes

- Every time you make a change to `prisma/schema.prisma`, you must run `npx prisma generate`. This ensures that our ORM client is up-to-date with our latest schema.
- It also gives us some insane intellisense :)
- Make sure to create a `.env.dev` with the following fields:
  - `POSTGRES_USER`
  - `POSTGRES_PASSWORD`
  - `POSTGRES_DB`
  - `DATABASE_URL`
- Ask Advay if you need help figuring out what to put for these.
