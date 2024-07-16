"use strict";
// src/resolvers/user.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const db_1 = require("../../clients/db");
const user_1 = __importDefault(require("../../services/user"));
const redis_1 = require("../../clients/db/redis");
const queries = {
    verifyGoogleToken: (parent_1, _a) => __awaiter(void 0, [parent_1, _a], void 0, function* (parent, { token }) {
        try {
            const resultToken = yield user_1.default.verifyGoogleAuthToken(token);
            return resultToken;
        }
        catch (error) {
            console.error('Error verifying Google token:', error);
            throw new Error('Failed to verify Google token');
        }
    }),
    getCurrentUser: (parent, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const id = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!id)
            return null;
        return yield db_1.prismaClient.user.findUnique({ where: { id } });
    }),
    getUserById: (parent_1, _a, ctx_1) => __awaiter(void 0, [parent_1, _a, ctx_1], void 0, function* (parent, { id }, ctx) {
        try {
            if (!id) {
                throw new Error('ID is required');
            }
            const user = yield db_1.prismaClient.user.findUnique({
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
        }
        catch (error) {
            throw new Error(`Error fetching user: ${error}`);
        }
    }),
};
const mutations = {
    followUser: (parent_1, _a, ctx_1) => __awaiter(void 0, [parent_1, _a, ctx_1], void 0, function* (parent, { to }, ctx) {
        var _b, _c;
        if (!(ctx === null || ctx === void 0 ? void 0 : ctx.user) || !((_b = ctx === null || ctx === void 0 ? void 0 : ctx.user) === null || _b === void 0 ? void 0 : _b.id))
            throw new Error('Unauthenticated');
        try {
            yield user_1.default.followUser((_c = ctx === null || ctx === void 0 ? void 0 : ctx.user) === null || _c === void 0 ? void 0 : _c.id, to);
            return true;
        }
        catch (error) {
            console.error('Error following user:', error);
            throw error;
        }
    }),
    unfollowUser: (parent_1, _a, ctx_1) => __awaiter(void 0, [parent_1, _a, ctx_1], void 0, function* (parent, { to }, ctx) {
        var _b, _c;
        if (!(ctx === null || ctx === void 0 ? void 0 : ctx.user) || !((_b = ctx === null || ctx === void 0 ? void 0 : ctx.user) === null || _b === void 0 ? void 0 : _b.id))
            throw new Error('Unauthenticated');
        try {
            yield user_1.default.unfollowUser((_c = ctx === null || ctx === void 0 ? void 0 : ctx.user) === null || _c === void 0 ? void 0 : _c.id, to);
            return true;
        }
        catch (error) {
            console.error('Error unfollowing user:', error);
            throw error;
        }
    }),
};
const extraResolvers = {
    User: {
        posts: (parent, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            return yield db_1.prismaClient.post.findMany({ where: { authorId: parent.id } });
        }),
        follower: (parent, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const result = yield db_1.prismaClient.follow.findMany({
                where: { following: { id: parent.id } },
                include: {
                    follower: true,
                },
            });
            yield redis_1.redisClient.del(`RECOMMENDED_USERS : ${(_a = ctx === null || ctx === void 0 ? void 0 : ctx.user) === null || _a === void 0 ? void 0 : _a.id}`);
            return result.map((el) => el.follower);
        }),
        following: (parent, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const result = yield db_1.prismaClient.follow.findMany({
                where: { follower: { id: parent.id } },
                include: {
                    following: true,
                },
            });
            yield redis_1.redisClient.del(`RECOMMENDED_USERS : ${(_a = ctx === null || ctx === void 0 ? void 0 : ctx.user) === null || _a === void 0 ? void 0 : _a.id}`);
            return result.map((el) => el.following);
        }),
        recommendedUsers: (parent, _, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            if (!ctx.user)
                return [];
            const cachedValue = yield redis_1.redisClient.get(`RECOMMENDED_USERS : ${(_a = ctx === null || ctx === void 0 ? void 0 : ctx.user) === null || _a === void 0 ? void 0 : _a.id}`);
            if (cachedValue)
                return JSON.parse(cachedValue);
            const myFollowings = yield db_1.prismaClient.follow.findMany({
                where: {
                    follower: { id: ctx.user.id },
                },
                include: {
                    following: {
                        include: { follower: { include: { following: true } } },
                    },
                },
            });
            const users = [];
            for (const followings of myFollowings) {
                for (const followingOfFollowedUser of followings.following.follower) {
                    if (followingOfFollowedUser.following.id !== ctx.user.id &&
                        myFollowings.findIndex((e) => (e === null || e === void 0 ? void 0 : e.followingId) === followingOfFollowedUser.following.id) < 0) {
                        users.push(followingOfFollowedUser.following);
                    }
                }
            }
            yield redis_1.redisClient.set(`RECOMMENDED_USERS : ${(_b = ctx === null || ctx === void 0 ? void 0 : ctx.user) === null || _b === void 0 ? void 0 : _b.id}`, JSON.stringify(users));
            return users;
        }),
    },
};
exports.resolvers = {
    queries,
    mutations,
    extraResolvers,
};
