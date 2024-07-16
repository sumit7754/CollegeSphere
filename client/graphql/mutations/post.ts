import { graphql } from '@/gql';

export const createPostMutation = graphql(`
  #graphql
  mutation createPost($payload: CreatePostData!) {
    createPosts(payload: $payload) {
      id
    }
  }
`);
