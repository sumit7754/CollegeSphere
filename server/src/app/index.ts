import express from 'express';
import bodyParser from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware as express4Middleware } from '@apollo/server/express4';
import { User } from './user';
import cors from 'cors';
import { GraphqlContext } from '../interfaces';
import JWTService from '../services/jwt';
import { Post } from './Post';

export const initServer = async () => {
  const app = express();

  app.get('/', (req, res) => res.status(200).json({ message: 'Everything is good' }));

  app.use(cors());
  app.use(bodyParser.json());

  const typeDefs = `
    ${User.types}
    ${Post.types}
    type Query {
       ${User.queries}
       ${Post.queries}
    }
    type Mutation {
       ${Post.mutations}
       ${User.mutations}
    }
  `;

  const resolvers = {
    Query: {
      ...User.resolvers.queries,
      ...Post.resolvers.queries,
    },
    Mutation: {
      ...Post.resolvers.mutations,
      ...User.resolvers.mutations,
    },
    ...Post.resolvers.extraResolvers,
    ...User.resolvers.extraResolvers,
  };

  const graphqlServer = new ApolloServer<GraphqlContext>({
    typeDefs,
    resolvers,
  });

  await graphqlServer.start();

  app.use(
    '/graphql',
    express4Middleware(graphqlServer, {
      context: async ({ req, res }) => {
        return {
          user: req.headers.authorization
            ? JWTService.decodeToken(req.headers.authorization.split('Bearer ')[1])
            : undefined,
        };
      },
    }),
  );

  return app;
};
