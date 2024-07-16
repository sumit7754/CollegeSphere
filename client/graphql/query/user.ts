import { graphql } from '@/gql';

export const verifyUserGoogleTokenQuery = graphql(`
  #graphql
  query VerifyUserGoogleToken($token: String!) {
    verifyGoogleToken(token: $token)
  }
`);

export const getCurrentUserQuery = graphql(`
  query Query {
    getCurrentUser {
      id
      firstName
      email
      profileImageURL
      lastName
      recommendedUsers {
        id
        firstName
        lastName
        profileImageURL
      }
    }
  }
`);

export const getUserByidQuery = graphql(`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      firstName
      lastName
      email
      profileImageURL
      follower {
        id
        firstName
        lastName
        profileImageURL
      }
      following {
        id
        firstName
        lastName
        profileImageURL
      }

      posts {
        id
        content
        imageURL
      }
    }
  }
`);
