// src/resolvers/user.ts

import { User } from '@prisma/client';
import { prismaClient } from '../../clients/db';
import { GraphqlContext } from '../../interfaces';
import UserService from '../../services/user';
import { redisClient } from '../../clients/db/redis';

const queries = {
  verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
    try {
      const resultToken = await UserService.verifyGoogleAuthToken(token);
      return resultToken;
    } catch (error) {
      console.error('Error verifying Google token:', error);
      throw new Error('Failed to verify Google token');
    }
  },

  getCurrentUser: async (parent: any, args: any, ctx: GraphqlContext) => {
    const id = ctx?.user?.id;
    if (!id) return null;
    return await prismaClient.user.findUnique({ where: { id } });
  },

  getUserById: async (parent: any, { id }: { id: string }, ctx: GraphqlContext) => {
    try {
      if (!id) {
        throw new Error('ID is required');
      }

      const user = await prismaClient.user.findUnique({
        where: { id },
        include: {
          posts: true,
        },
      });

      if (!user) {
        console.log('No user found with the given ID');
        throw new Error('No user found with the given ID');
      }

      console.log('Fetched User:', user);
      return user;
    } catch (error) {
      throw new Error(`Error fetching user: ${error}`);
    }
  },
};

const mutations = {
  followUser: async (parent: any, { to }: { to: string }, ctx: GraphqlContext) => {
    if (!ctx?.user || !ctx?.user?.id) throw new Error('Unauthenticated');
    try {
      await UserService.followUser(ctx?.user?.id, to);
      return true;
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  },
  unfollowUser: async (parent: any, { to }: { to: string }, ctx: GraphqlContext) => {
    if (!ctx?.user || !ctx?.user?.id) throw new Error('Unauthenticated');
    try {
      await UserService.unfollowUser(ctx?.user?.id, to);
      return true;
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  },
};

const extraResolvers = {
  User: {
    posts: async (parent: User, ctx: GraphqlContext) => {
      return await prismaClient.post.findMany({ where: { authorId: parent.id } });
    },
    follower: async (parent: User, ctx: GraphqlContext) => {
      const result = await prismaClient.follow.findMany({
        where: { following: { id: parent.id } },
        include: {
          follower: true,
        },
      });
      await redisClient.del(`RECOMMENDED_USERS : ${ctx?.user?.id}`);
      return result.map((el) => el.follower);
    },
    following: async (parent: User, ctx: GraphqlContext) => {
      const result = await prismaClient.follow.findMany({
        where: { follower: { id: parent.id } },
        include: {
          following: true,
        },
      });
      await redisClient.del(`RECOMMENDED_USERS : ${ctx?.user?.id}`);
      return result.map((el) => el.following);
    },
    recommendedUsers: async (parent: User, _: any, ctx: GraphqlContext) => {
      if (!ctx.user) return [];

      const cachedValue = await redisClient.get(`RECOMMENDED_USERS : ${ctx?.user?.id}`);

      if (cachedValue) return JSON.parse(cachedValue);

      const myFollowings = await prismaClient.follow.findMany({
        where: {
          follower: { id: ctx.user.id },
        },
        include: {
          following: {
            include: { follower: { include: { following: true } } },
          },
        },
      });

      const users: User[] = [];

      for (const followings of myFollowings) {
        for (const followingOfFollowedUser of followings.following.follower) {
          if (
            followingOfFollowedUser.following.id !== ctx.user.id &&
            myFollowings.findIndex((e) => e?.followingId === followingOfFollowedUser.following.id) < 0
          ) {
            users.push(followingOfFollowedUser.following);
          }
        }
      }

      await redisClient.set(`RECOMMENDED_USERS : ${ctx?.user?.id}`, JSON.stringify(users));

      return users;
    },
  },
};

export const resolvers = {
  queries,
  mutations,
  extraResolvers,
};
