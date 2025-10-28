import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { config } from 'dotenv';
import schema from './schema';
import context from './context';

// Load environment variables
config();

async function main() {
  // Create Apollo Server instance
  const server = new ApolloServer({
    schema,
    introspection: true, // Enable GraphQL Playground in development
  });

  // Start the server
  const { url } = await startStandaloneServer(server, {
    context: async () => context,
    listen: { port: Number(process.env.PORT) || 4000 },
  });

  console.log('🚀 Vaycay GraphQL Server Ready!');
  console.log(`📊 GraphQL endpoint: ${url}`);
  console.log(`🔍 GraphQL Playground: ${url}`);
  console.log('\nAvailable queries:');
  console.log('  - weatherData(limit: Int, offset: Int)');
  console.log('  - weatherByDate(monthDay: String!)');
  console.log('  - weatherByCity(city: String!)');
  console.log('  - cities');
  console.log('  - countries');
}

// Start the server
main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
