# Revised Migration Plan: Mimicking the Nexus + Prisma + Apollo Architecture

Based on the reference architecture you provided, I'm revising the plan to follow the **Nexus (code-first GraphQL) + Prisma (ORM) + Apollo Server** pattern. This is a much more modern and type-safe approach than my initial TypeORM suggestion.

## Updated Architecture Stack

### Core Technologies (Matching Reference)

- **GraphQL Schema**: Nexus (code-first, TypeScript-native)
- **ORM**: Prisma (replacing SQLAlchemy)
- **Server**: Apollo Server (replacing FastAPI)
- **Type Generation**: Automatic via Nexus + GraphQL Code Generator
- **Database**: PostgreSQL (keep existing)
- **Language**: TypeScript throughout

---

## Revised Project Structure

```jsx
vaycay_v2/
├── server/                           # NEW: Backend GraphQL API
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema (replaces SQLAlchemy models)
│   │   └── migrations/              # Prisma migrations (replaces Alembic)
│   ├── src/
│   │   ├── graphql/                 # GraphQL schema definitions
│   │   │   ├── enums.ts            # All enums (WeatherMetric, etc.)
│   │   │   ├── WeatherData.ts      # Weather data queries/mutations
│   │   │   ├── City.ts             # City-related operations
│   │   │   └── scalars.ts          # Custom scalars (Date, etc.)
│   │   ├── context.ts              # Prisma client context
│   │   ├── schema.ts               # Nexus schema assembly
│   │   └── index.ts                # Apollo Server entry
│   ├── schema.graphql              # Generated GraphQL schema
│   ├── nexus-typegen.ts            # Generated TypeScript types
│   └── package.json
├── client/                          # FUTURE: React frontend (optional)
│   ├── src/
│   │   ├── generated/
│   │   │   └── graphql.tsx         # Generated hooks & types
│   │   └── ...
│   └── package.json
├── vaycay/                          # OLD: Python code (to be removed)
├── scripts/                         # Data processing scripts
│   └── data-import.ts              # TypeScript data import
└── docker-compose.yml              # Updated for Node.js

```

---

## Phase-by-Phase Implementation (Revised)

### **PHASE 1: Prisma Setup & Database Schema Migration**

### 1.1 Initialize Prisma Project

```bash
cd server
npm init -y
npm install prisma @prisma/client
npx prisma init

```

### 1.2 Define Prisma Schema (Replaces SQLAlchemy Models)

**`server/prisma/schema.prisma`:**

```
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model WeatherData {
  // Composite primary key
  city   String
  date   String
  name   String  // station name

  // Location data
  country String?
  state   String?
  suburb  String?
  lat     String?
  long    String?

  // Weather metrics
  PRCP    Float?  // Precipitation
  TAVG    Float?  // Average temperature
  TMAX    Float?  // Max temperature
  TMIN    Float?  // Min temperature

  // Metadata
  submitterId String?

  @@id([city, date, name])
  @@index([date])
  @@index([city])
  @@map("weather_data")
}

// Optional: Add aggregated city data for performance
model City {
  id          String   @id @default(uuid())
  name        String   @unique
  country     String?
  state       String?
  lat         Float?
  long        Float?
  recordCount Int      @default(0)

  @@map("cities")
}

```

### 1.3 Introspect Existing Database

```bash
# Connect to existing PostgreSQL database
npx prisma db pull  # Introspects existing schema
npx prisma generate # Generates Prisma Client

```

### 1.4 Create Initial Migration

```bash
npx prisma migrate dev --name init

```

---

### **PHASE 2: Nexus GraphQL Schema (Code-First)**

### 2.1 Install Nexus Dependencies

```bash
npm install nexus graphql
npm install --save-dev @types/node ts-node typescript

```

### 2.2 Define GraphQL Types with Nexus

**`server/src/graphql/enums.ts`:**

```tsx
import { enumType } from 'nexus';

export const WeatherMetric = enumType({
  name: 'WeatherMetric',
  members: ['PRECIPITATION', 'AVG_TEMP', 'MAX_TEMP', 'MIN_TEMP'],
});

export const DateFormat = enumType({
  name: 'DateFormat',
  members: ['MMDD', 'YYYY_MM_DD', 'ISO'],
});

```

**`server/src/graphql/WeatherData.ts`:**

```tsx
import { objectType, queryField, nonNull, arg, list, intArg, stringArg } from 'nexus';

// GraphQL Type Definition
export const WeatherData = objectType({
  name: 'WeatherData',
  definition(t) {
    t.nonNull.string('city');
    t.string('country');
    t.string('state');
    t.string('suburb');
    t.nonNull.string('date');
    t.float('lat');
    t.float('long');
    t.float('precipitation');
    t.float('avgTemperature');
    t.float('maxTemperature');
    t.float('minTemperature');
    t.nonNull.string('stationName');
    t.string('submitterId');
  },
});

// Queries
export const WeatherDataQueries = queryField((t) => {
  // Get all weather data (paginated)
  t.list.field('weatherData', {
    type: 'WeatherData',
    args: {
      limit: intArg({ default: 10 }),
      offset: intArg({ default: 0 }),
    },
    async resolve(_parent, args, context) {
      const data = await context.prisma.weatherData.findMany({
        take: args.limit,
        skip: args.offset,
      });

      return data.map(item => ({
        city: item.city,
        country: item.country,
        state: item.state,
        suburb: item.suburb,
        date: item.date,
        lat: item.lat ? parseFloat(item.lat) : null,
        long: item.long ? parseFloat(item.long) : null,
        precipitation: item.PRCP,
        avgTemperature: item.TAVG,
        maxTemperature: item.TMAX,
        minTemperature: item.TMIN,
        stationName: item.name,
        submitterId: item.submitterId,
      }));
    },
  });

  // Get weather by date (MMDD format)
  t.list.field('weatherByDate', {
    type: 'WeatherData',
    args: {
      monthDay: nonNull(stringArg()),
    },
    async resolve(_parent, args, context) {
      // Convert MMDD to 2020-MM-DD format (matching current logic)
      const dateStr = `2020-${args.monthDay.slice(0, 2)}-${args.monthDay.slice(2)}`;

      const data = await context.prisma.weatherData.findMany({
        where: { date: dateStr },
        take: 100,
      });

      return data.map(item => ({
        city: item.city,
        country: item.country,
        state: item.state,
        suburb: item.suburb,
        date: item.date,
        lat: item.lat ? parseFloat(item.lat) : null,
        long: item.long ? parseFloat(item.long) : null,
        precipitation: item.PRCP,
        avgTemperature: item.TAVG,
        maxTemperature: item.TMAX,
        minTemperature: item.TMIN,
        stationName: item.name,
        submitterId: item.submitterId,
      }));
    },
  });

  // Get weather by city
  t.list.field('weatherByCity', {
    type: 'WeatherData',
    args: {
      city: nonNull(stringArg()),
    },
    async resolve(_parent, args, context) {
      const cityName = args.city.charAt(0).toUpperCase() + args.city.slice(1).toLowerCase();

      const data = await context.prisma.weatherData.findMany({
        where: { city: cityName },
        take: 100,
      });

      return data.map(item => ({
        city: item.city,
        country: item.country,
        state: item.state,
        suburb: item.suburb,
        date: item.date,
        lat: item.lat ? parseFloat(item.lat) : null,
        long: item.long ? parseFloat(item.long) : null,
        precipitation: item.PRCP,
        avgTemperature: item.TAVG,
        maxTemperature: item.TMAX,
        minTemperature: item.TMIN,
        stationName: item.name,
        submitterId: item.submitterId,
      }));
    },
  });

  // NEW: Get all cities
  t.list.field('cities', {
    type: 'String',
    async resolve(_parent, _args, context) {
      const cities = await context.prisma.weatherData.findMany({
        distinct: ['city'],
        select: { city: true },
      });
      return cities.map(c => c.city);
    },
  });

  // NEW: Get all countries
  t.list.field('countries', {
    type: 'String',
    async resolve(_parent, _args, context) {
      const countries = await context.prisma.weatherData.findMany({
        distinct: ['country'],
        select: { country: true },
        where: { country: { not: null } },
      });
      return countries.map(c => c.country).filter(Boolean);
    },
  });
});

```

### 2.3 Context Setup

**`server/src/context.ts`:**

```tsx
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
}

export const context: Context = {
  prisma,
};

```

### 2.4 Schema Assembly

**`server/src/schema.ts`:**

```tsx
import { makeSchema } from 'nexus';
import { join } from 'path';
import * as types from './graphql';

export const schema = makeSchema({
  types,
  outputs: {
    schema: join(__dirname, '..', 'schema.graphql'),
    typegen: join(__dirname, '..', 'nexus-typegen.ts'),
  },
  contextType: {
    module: join(__dirname, './context.ts'),
    export: 'Context',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
});

```

---

### **PHASE 3: Apollo Server Setup**

### 3.1 Install Apollo Server

```bash
npm install @apollo/server graphql
npm install --save-dev @types/node

```

### 3.2 Server Entry Point

**`server/src/index.ts`:**

```tsx
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { schema } from './schema';
import { context } from './context';

async function main() {
  const server = new ApolloServer({
    schema,
  });

  const { url } = await startStandaloneServer(server, {
    context: async () => context,
    listen: { port: 4000 },
  });

  console.log(`🚀 Server ready at ${url}`);
  console.log(`📊 GraphQL Playground: ${url}`);
}

main();

```

### 3.3 TypeScript Configuration

**`server/tsconfig.json`:**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}

```

### 3.4 Package Scripts

**`server/package.json`:**

```json
{
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "generate": "ts-node src/schema.ts",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  }
}

```

---

### **PHASE 4: Data Import Migration**

### 4.1 TypeScript Data Import Script

**`server/scripts/import-data.ts`:**

```tsx
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function importWeatherData() {
  const dataPath = path.join(__dirname, '../../vaycay/weather_data/16April2024/datacleaning4_nopopulation_wholeEurope.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const weatherData = JSON.parse(rawData);

  console.log(`Importing ${weatherData.length} records...`);

  // Batch insert for performance
  const batchSize = 1000;
  for (let i = 0; i < weatherData.length; i += batchSize) {
    const batch = weatherData.slice(i, i + batchSize);

    await prisma.weatherData.createMany({
      data: batch.map((item: any) => ({
        city: item.city,
        country: item.country,
        state: item.state,
        suburb: item.suburb,
        date: item.date,
        lat: item.lat?.toString(),
        long: item.long?.toString(),
        PRCP: item.PRCP,
        TAVG: item.TAVG,
        TMAX: item.TMAX,
        TMIN: item.TMIN,
        name: item.name,
        submitterId: item.submitter_id,
      })),
      skipDuplicates: true,
    });

    console.log(`Imported ${Math.min(i + batchSize, weatherData.length)} / ${weatherData.length}`);
  }

  console.log('✅ Data import complete!');
}

importWeatherData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

```

---

### **PHASE 5: Frontend Code Generation (Optional)**

If you want to add a React frontend later:

### 5.1 Install GraphQL Code Generator

```bash
cd client
npm install @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/typescript-react-apollo

```

### 5.2 Codegen Configuration

**`client/codegen.yml`:**

```yaml
overwrite: true
schema: "../server/schema.graphql"
documents: "src/**/*.graphql"
generates:
  src/generated/graphql.tsx:
    plugins:
      - "typescript"
      - "typescript-operations"
      - "typescript-react-apollo"
    config:
      withHooks: true

```

### 5.3 Example Query

**`client/src/queries/weather.graphql`:**

```graphql
query GetWeatherByCity($city: String!) {
  weatherByCity(city: $city) {
    city
    date
    avgTemperature
    maxTemperature
    minTemperature
    precipitation
  }
}

```

Then run: `npm run codegen` to generate type-safe hooks.

---

### **PHASE 6: Docker & Deployment**

### 6.1 Updated Docker Compose

**`docker-compose.yml`:**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: iwantsun
      POSTGRES_DB: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  server:
    build:
      context: ./server
      dockerfile: Dockerfile
    ports:
      - "4000:4000"
    environment:
      DATABASE_URL: postgresql://postgres:iwantsun@postgres:5432/postgres
    depends_on:
      - postgres
    command: npm run dev

volumes:
  postgres_data:

```

### 6.2 Server Dockerfile

**`server/Dockerfile`:**

```docker
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]

```

---

## Migration Execution Timeline

### Week 1: Foundation

- [x]  Set up server directory structure
- [ ]  Initialize Prisma with existing database
- [ ]  Create Prisma schema matching current models
- [ ]  Test Prisma connection

### Week 2: GraphQL Layer

- [ ]  Install Nexus and Apollo Server
- [ ]  Define GraphQL types with Nexus
- [ ]  Implement basic queries (matching REST endpoints)
- [ ]  Test GraphQL Playground

### Week 3: Data & Testing

- [ ]  Create TypeScript data import script
- [ ]  Test data import process
- [ ]  Write integration tests
- [ ]  Compare GraphQL vs REST responses

### Week 4: Deployment & Cleanup

- [ ]  Update Docker configuration
- [ ]  Deploy alongside Python API
- [ ]  Monitor performance
- [ ]  Remove Python code once validated

---

## Key Advantages of This Approach

1. **Full Type Safety**: Prisma → Nexus → Frontend (end-to-end types)
2. **Code-First**: Schema defined in TypeScript, not SDL
3. **Auto-Generation**: Types, schema, and frontend hooks generated automatically
4. **Modern Stack**: Matches industry best practices
5. **Maintainable**: Clear separation of concerns, domain-based organization
6. **Scalable**: Easy to add new features following established patterns

---

## Next Steps

Would you like me to start implementing Phase 1 (Prisma setup)? I can:

1. Create the initial `server/` directory structure
2. Set up `prisma/schema.prisma` matching your current database
3. Configure Prisma to connect to your existing PostgreSQL
4. Generate the Prisma Client