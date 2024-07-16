// /pages/[id].tsx

import React, { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useQueryClient } from '@tanstack/react-query';
import { graphqlClient } from '@/clients/api';
import FeedCard from '@/components/feedCard';
import { useCurrentUser, useUserByid } from '@/hooks/user';
import { followUsermutation, unfollowUserMutation } from '@/graphql/mutations/user';
import HeaderUI from '@/components/Header';

const UserProfilePage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  // Wait for the id to be available
  const { data, isLoading, error, refetch } = useUserByid(id as string);
  const userInfo = data?.getUserById;

  // Ensure userInfo is defined before accessing its properties
  const amIFollowing = useMemo(() => {
    return userInfo?.follower.some((el) => el.id === user?.id) ?? false;
  }, [userInfo, user]);

  const handleFollow = useCallback(async () => {
    try {
      await graphqlClient.request(followUsermutation, { to: userInfo?.id });
      await queryClient.invalidateQueries({ queryKey: ['getUserById'] });
      await queryClient.invalidateQueries({ queryKey: ['user-by-id'] });
    } catch (error: any) {
      if (error.response?.errors?.[0]?.message === 'Already following this user') {
        console.warn('Already following this user');
      } else {
        console.error('Error following user:', error);
      }
    }
  }, [userInfo?.id, queryClient, refetch, id]);

  const handleUnfollow = useCallback(async () => {
    try {
      await graphqlClient.request(unfollowUserMutation, { to: userInfo?.id });
      await queryClient.invalidateQueries({ queryKey: ['getUserById', id] });
      await queryClient.invalidateQueries({ queryKey: ['user-by-id'] });
    } catch (error: any) {
      console.error('Error unfollowing user:', error);
    }
  }, [userInfo?.id, queryClient, refetch, id]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error || !userInfo) {
    return <div className="flex items-center justify-center min-h-screen">User not found</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <HeaderUI />

      <main className="flex-grow flex flex-col items-center mt-8">
        <div className="relative w-full max-w-5xl rounded-lg shadow-lg overflow-hidden">
          <img src="https://via.placeholder.com/1500x500" alt="Cover Photo" className="w-full h-64 object-cover" />
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <img
              src={userInfo.profileImageURL || 'https://via.placeholder.com/150'}
              alt="Profile Picture"
              className="w-36 h-36 rounded-full border-4 border-gray-800"
            />
          </div>
        </div>

        <div className="mt-20 px-8 w-full max-w-5xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold">
              {userInfo.firstName} {userInfo.lastName}
            </h1>
            <p className="mt-2 text-lg italic">{'This is a hardcoded bio for the user.'}</p>
            <div className="mt-4 flex justify-center space-x-8">
              <div>
                <h3 className="text-lg font-semibold">Followers</h3>
                <p className="text-xl">{userInfo.follower.length}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Following</h3>
                <p className="text-xl">{userInfo.following.length}</p>
              </div>
            </div>
            {user.id !== userInfo?.id && (
              <div className="mt-4">
                {amIFollowing ? (
                  <button
                    onClick={handleUnfollow}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition transform hover:scale-105"
                  >
                    Unfollow
                  </button>
                ) : (
                  <button
                    onClick={handleFollow}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition transform hover:scale-105"
                  >
                    Follow
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {userInfo.posts && userInfo.posts.length > 0 ? (
              userInfo.posts.map((post) => (
                <FeedCard
                  key={post.id}
                  data={post}
                  name={`${userInfo.firstName} ${userInfo.lastName}`}
                  profileImage={userInfo.profileImageURL || ''}
                />
              ))
            ) : (
              <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">Recent Posts</h2>
                <p>No recent posts to show.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="flex items-center justify-center bg-gray-900 h-16 px-4 py-3 shadow-[0_0_10px_black] w-full mt-8">
        <p className="text-sm">© 2024 Your App Name. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default UserProfilePage;
