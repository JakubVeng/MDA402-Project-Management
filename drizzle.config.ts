import type { Config } from 'drizzle-kit';

export default {
    schema: './src/db/schema',
    dialect: 'sqlite',
    driver: 'turso',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
        authToken: process.env.AUTH_TOKEN
    },
    out: '.drizzle'
} satisfies Config;
