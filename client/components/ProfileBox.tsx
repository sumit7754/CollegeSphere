import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/gql/graphql';
import { useRouter } from 'next/router';

const ProfileBox: React.FC<{ user: User }> = ({ user }) => {
  const router = useRouter();

  const handleClick = (id: string) => {
    router.push(`/${id}`);
  };

  return (
    <div>
      <div className="bg-gray-800 p-6 rounded-lg text-center shadow-lg">
        <div onClick={() => handleClick(user?.id)}>
          <Avatar className="mx-auto mb-4">
            <AvatarImage src={user.profileImageURL || 'https://github.com/shadcn.png'} />
            <AvatarFallback>{`${user.firstName[0]}${user.lastName ? user.lastName[0] : ''}`}</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold text-white">
            {user.firstName} {user.lastName || ''}
          </h2>
        </div>
        <p className="text-sm text-gray-400">{user.email}</p>
      </div>

      <div className="mt-4 space-y-4 bg-gray-800 p-6 rounded-lg text-center shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-2 ">Recommended Users</h3>
        {user?.recommendedUsers.map((el) => (
          <div
            key={el?.id}
            className="flex items-center p-2 bg-gray-700 rounded-lg cursor-pointer mx-6 text-center"
            onClick={() => handleClick(el?.id)}
          >
            <div className="mx-auto flex items-center">
              <Avatar className="mx-auto mr-4">
                <AvatarImage src={el?.profileImageURL || 'https://github.com/shadcn.png'} />
                <AvatarFallback>{`${el?.firstName[0]}${el?.lastName ? el?.lastName[0] : ''}`}</AvatarFallback>
              </Avatar>
              <p className="text-white mx-auto">
                {el?.firstName} {el?.lastName}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileBox;
