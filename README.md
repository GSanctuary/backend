# Backend

## How To Run

### Setup

Make sure to create a `.env.dev` with the following fields:

- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`
- `DATABASE_URL`

The `DATABASE_URL` field should reflect the values of the postgres credentials.

### Steps

1. Make sure Docker is installed and running.
2. Run `docker compose -f docker-compose.dev.yml up --build`
3. Visit http://localhost:3000/test to make sure the API is running
4. In your Lens Studio project, make sure the base URL of the Sanctuary is set to `http://localhost:3000`

## Contributing Notes

- Every time you make a change to `prisma/schema.prisma`, you must run `npx prisma generate`. This ensures that our ORM client is up-to-date with our latest schema.
- It also gives us some insane intellisense :)
