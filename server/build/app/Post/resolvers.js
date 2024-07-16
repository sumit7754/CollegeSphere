"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const db_1 = require("../../clients/db");
const redis_1 = require("../../clients/db/redis");
const queries = {
    getAllPosts: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const cachedData = yield redis_1.redisClient.get('ALL-POSTS');
            if (cachedData) {
                return JSON.parse(cachedData);
            }
            const data = yield db_1.prismaClient.post.findMany({
                orderBy: { createdAt: 'desc' },
            });
            yield redis_1.redisClient.set('ALL-POSTS', JSON.stringify(data));
            return data;
        }
        catch (error) {
            console.error('Error fetching posts:', error);
            throw new Error('Could not fetch posts');
        }
    }),
};
const mutations = {
    createPosts: (parent_1, _a, ctx_1) => __awaiter(void 0, [parent_1, _a, ctx_1], void 0, function* (parent, { payload }, ctx) {
        if (!ctx.user) {
            throw new Error('You are not loggedIn');
        }
        try {
            const post = yield db_1.prismaClient.post.create({
                data: {
                    content: payload.content,
                    imageURL: payload.imageURL,
                    author: {
                        connect: { id: ctx.user.id },
                    },
                },
            });
            yield redis_1.redisClient.del('ALL-POSTS');
            return post;
        }
        catch (error) {
            console.error('Error creating post:', error);
            throw new Error('Something went wrong!');
        }
    }),
};
const extraResolvers = {
    Post: {
        author: (parent) => {
            return db_1.prismaClient.user.findUnique({ where: { id: parent.authorId } });
        },
    },
};
exports.resolvers = {
    mutations,
    extraResolvers,
    queries,
};
