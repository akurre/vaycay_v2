import { makeSchema } from 'nexus';
import { join } from 'path';
import * as types from './graphql';

const schema = makeSchema({
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

export default schema;
