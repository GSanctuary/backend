# Backend

## How To Run

### Setup

1. Make sure to create a `.env.dev` with the following fields:

- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`
- `DATABASE_URL`

The `DATABASE_URL` field should reflect the values of the postgres credentials. Here are some sample values you can use for testing:

```
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="postgres"
POSTGRES_DB="postgres"
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/postgres?schema=public"
```

2. Create an `env.ts` file in the root directory that has the following information:

```typescript
export const env = {
  port: 3000,
  webserver: null,
  GEMINI_API_KEY: 'YOUR GEMINI KEY',
};
```

You can generate a Gemini API key for free [here](https://ai.google.dev/gemini-api/docs/api-key).

3. Install [Docker](https://www.docker.com/)
4. Install [ngrok](https://www.npmjs.com/package/ngrok#global-install)

### Steps

1. Make sure Docker is installed and running.
2. Run `docker compose -f docker-compose.dev.yml up --build`
3. Visit http://localhost:3000/test to make sure the API is running
4. Run `ngrok http 3000`, noting the URL that's outputted.
5. In your Lens Studio project, make sure the base URL of the Sanctuary API scene object is set to the API url in the previous part.

## Contributing Notes

- Every time you make a change to `prisma/schema.prisma`, you must run `npx prisma generate`. This ensures that our ORM client is up-to-date with our latest schema.
- It also gives us some insane intellisense :)
