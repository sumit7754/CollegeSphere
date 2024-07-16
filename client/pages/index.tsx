import React from 'react';
import HeaderUI from '@/components/Header';
import Slidebar from '@/components/Slidebar';
import { useCurrentUser } from '@/hooks/user';
import ProfileBox from '@/components/ProfileBox';
import PostCreationBox from '@/components/PostCreationBox';
import SignInBox from '@/components/SignInBox';
import FeedCard from '@/components/feedCard';
import { useGetAllData } from '@/hooks/post';

const Home: React.FC = () => {
  const { user } = useCurrentUser();
  const { posts = [] } = useGetAllData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 h-screen bg-gray-900 text-white">
      <div className="hidden lg:block lg:col-span-2 bg-gray-800">
        <Slidebar />
      </div>
      <div className="col-span-1 lg:col-span-10 flex flex-col overflow-hidden">
        <HeaderUI />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 p-4 overflow-hidden">
          <div className="col-span-1 lg:col-span-3 overflow-y-auto">
            <PostCreationBox user={user} />
            {posts?.map((post) => (post ? <FeedCard key={post.id} data={post} /> : null))}
          </div>
          <div className="col-span-1 lg:col-span-2 h-full">{user ? <ProfileBox user={user} /> : <SignInBox />}</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
