import { Post } from '@prisma/client';
import { prismaClient } from '../../clients/db';
import { GraphqlContext } from '../../interfaces';
import { redisClient } from '../../clients/db/redis';

interface CreatePostPayload {
  content: string;
  imageURL: string;
}

const queries = {
  getAllPosts: async () => {
    try {
      const cachedData = await redisClient.get('ALL-POSTS');
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const data = await prismaClient.post.findMany({
        orderBy: { createdAt: 'desc' },
      });
      await redisClient.set('ALL-POSTS', JSON.stringify(data));

      return data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new Error('Could not fetch posts');
    }
  },
};

const mutations = {
  createPosts: async (parent: any, { payload }: { payload: CreatePostPayload }, ctx: GraphqlContext) => {
    if (!ctx.user) {
      throw new Error('You are not loggedIn');
    }
    try {
      const post = await prismaClient.post.create({
        data: {
          content: payload.content,
          imageURL: payload.imageURL,
          author: {
            connect: { id: ctx.user.id },
          },
        },
      });
      await redisClient.del('ALL-POSTS');
      return post;
    } catch (error) {
      console.error('Error creating post:', error);
      throw new Error('Something went wrong!');
    }
  },
};

const extraResolvers = {
  Post: {
    author: (parent: Post) => {
      return prismaClient.user.findUnique({ where: { id: parent.authorId } });
    },
  },
};

export const resolvers = {
  mutations,
  extraResolvers,
  queries,
};
