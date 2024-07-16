import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { FaHeart, FaRegComment, FaShareAlt } from 'react-icons/fa';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Post } from '@/gql/graphql';
import Image from 'next/image';

interface FeedCardProps {
  data: Post;
  profileImage: string;
  name: string;
}

const FeedCard: React.FC<FeedCardProps> = ({ data, name, profileImage }) => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const authorName = `${data.author?.firstName || ''} ${data.author?.lastName || ''}`.trim() || name;
  const authorInitials = `${data.author?.firstName?.charAt(0) || ''}${data.author?.lastName?.charAt(0) || ''}`;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    router.push({
      pathname: '/[id]',
      query: { id: data.author?.id },
    });
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out cursor-pointer mt-8 mb-6">
      <div className="flex items-center mb-4" onClick={handleClick}>
        <Avatar>
          <AvatarImage src={data.author?.profileImageURL || profileImage || 'https://github.com/shadcn.png'} />
          <AvatarFallback>
            {authorInitials ||
              name
                .split(' ')
                .map((n) => n[0])
                .join('')}
          </AvatarFallback>
        </Avatar>
        <h5 className="ml-4 font-bold text-xl text-white">{authorName}</h5>
      </div>
      <div className="text-white text-sm mb-4 break-words">
        <p className={`${isExpanded ? 'block' : 'line-clamp-3'}`}>{data.content}</p>
        {data.content.length > 150 && (
          <button onClick={toggleExpand} className="text-blue-400 hover:underline mt-2">
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
      {data.imageURL && (
        <div className="mb-4">
          <Image src={data.imageURL} alt="Post Image" width={600} height={400} className="rounded-lg" />
        </div>
      )}
      <div className="flex justify-between border-t border-gray-700 pt-4">
        <div className="flex items-center text-gray-400 hover:text-red-500 active:text-red-500 cursor-pointer">
          <FaHeart className="mr-2 text-xl" />
          {/* Add likes count here: <p>{data.likes}</p> */}
        </div>
        <div className="flex items-center text-gray-400 cursor-pointer">
          <FaShareAlt className="mr-2 text-xl" />
          {/* Add reposts count here: <p>{data.reposts}</p> */}
        </div>
        <div className="flex items-center text-gray-400 cursor-pointer">
          <FaRegComment className="mr-2 text-xl" />
          {/* Add comments count here: <p>{data.comments}</p> */}
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
