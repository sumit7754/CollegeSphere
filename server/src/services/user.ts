import axios from 'axios';
import { prismaClient } from '../clients/db';
import JWTService from './jwt';

interface GoogleTokenResult {
  email: string;
  email_verified: string;
  given_name: string;
  family_name?: string;
  picture?: string;
}

class UserService {
  public static async verifyGoogleAuthToken(token: string) {
    const googleToken = token;
    const googleOauthURL = new URL('https://oauth2.googleapis.com/tokeninfo');
    googleOauthURL.searchParams.set('id_token', googleToken);

    const { data } = await axios.get<GoogleTokenResult>(googleOauthURL.toString(), {
      responseType: 'json',
    });

    const user = await prismaClient.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      await prismaClient.user.create({
        data: {
          email: data.email,
          firstName: data.given_name,
          lastName: data.family_name,
          profileImageURL: data.picture,
        },
      });
    }

    const userInDb = await prismaClient.user.findUnique({
      where: { email: data.email },
    });

    if (!userInDb) throw new Error('User with email not found');

    const userToken = JWTService.generateTokenForUser(userInDb);
    console.log(userToken);

    return userToken;
  }

  public static async followUser(from: string, to: string) {
    try {
      // Check if the follow relationship already exists
      const existingFollow = await prismaClient.follow.findUnique({
        where: {
          followerId_followingId: { followerId: from, followingId: to },
        },
      });

      if (existingFollow) {
        throw new Error('Already following this user');
      }

      await prismaClient.follow.create({
        data: {
          follower: { connect: { id: from } },
          following: { connect: { id: to } },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  public static async unfollowUser(from: string, to: string) {
    await prismaClient.follow.delete({
      where: { followerId_followingId: { followerId: from, followingId: to } },
    });
  }
}

export default UserService;
