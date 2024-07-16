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

export const getSignedURLForPost = graphql(`
  #graphql
  query GetSignedURLForPost($imageName: String!, $imageType: String!) {
    getSignedURLForPost(imageName: $imageName, imageType: $imageType)
  }
`);
