import { graphql } from '@/gql';

export const followUsermutation = graphql(`
  #graphql
  mutation FollowUser($to: ID!) {
    followUser(to: $to)
  }
`);

export const unfollowUserMutation = graphql(`
  #grahql
  mutation UnfollowUser($to: ID!) {
    unfollowUser(to: $to)
  }
`);
