import { graphql } from '@/gql';

export const getAllPostQueries = graphql(`
  #graphql

  query GetAllPosts {
    getAllPosts {
      id
      content
      imageURL
      author {
        id
        firstName
        lastName
        profileImageURL
      }
    }
  }
`);
