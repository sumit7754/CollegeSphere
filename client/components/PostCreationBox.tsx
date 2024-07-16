import React, { useState, useCallback } from 'react';
import { MdAddAPhoto } from 'react-icons/md';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCreatePost } from '@/hooks/post';

interface User {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  profileImageURL?: string;
}

const PostCreationBox: React.FC<{ user: User | null }> = ({ user }) => {
  const { mutate } = useCreatePost();
  const [content, setContent] = useState('');
  const [imageURL, setImageURL] = useState('');

  const handleCreatePost = useCallback(() => {
    mutate(
      {
        content,
        imageURL,
      },
      {
        onSuccess: () => {
          setContent('');
          setImageURL('');
        },
      },
    );
  }, [content, imageURL, mutate]);

  const handleSelectImage = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    // input.onchange = (event) => {
    //   const file = event.target.files?.[0];
    //   if (file) {
    //     const reader = new FileReader();
    //     reader.onload = () => {
    //       setImageURL(reader.result as string);
    //     };
    //     reader.readAsDataURL(file);
    //   }
    // };
    input.click();
  }, []);

  return (
    <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-2 sm:col-span-1">
          {user?.profileImageURL && (
            <Avatar>
              <AvatarImage src={user.profileImageURL} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          )}
        </div>
        <div className="col-span-10 sm:col-span-11">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-transparent text-xl px-3 py-2 border-b border-gray-600 focus:outline-none"
            placeholder="What's happening?"
            rows={3}
          ></textarea>
          {imageURL && <Image src={imageURL} alt="post-image" width={300} height={300} />}
          <div className="mt-2 flex justify-between items-center">
            <MdAddAPhoto
              onClick={handleSelectImage}
              className="text-2xl cursor-pointer text-gray-400 hover:text-gray-200"
            />
            <button
              onClick={handleCreatePost}
              className="bg-blue-500 hover:bg-blue-600 font-semibold text-sm py-2 px-4 rounded-full"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCreationBox;
