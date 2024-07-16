import { GraphQLClient } from 'graphql-request';

const isClient = typeof window !== 'undefined';

const getAuthorizationHeader = () => {
  if (isClient) {
    const token = window.localStorage.getItem('token');
    return token ? `Bearer ${token}` : '';
  }
  return '';
};

export const graphqlClient = new GraphQLClient('http://localhost:8000/graphql', {
  headers: () => ({
    Authorization: getAuthorizationHeader(),
  }),
});
