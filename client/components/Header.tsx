import React from 'react';
import { MdHome } from 'react-icons/md';
import { IoNotificationsCircle } from 'react-icons/io5';
import { AiFillMessage } from 'react-icons/ai';

const HeaderUI: React.FC = () => {
  return (
    <header className="bg-zinc-900 py-2 h-16 flex items-center">
      <div className="w-full flex justify-between px-4">
        {/* Left Section */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <MdHome className="text-white text-3xl" />
            <h1 className="text-white text-2xl font-bold">Home</h1>
          </div>
          <div className="hidden md:flex space-x-4">
            <button className="text-white hover:bg-zinc-700 px-4 py-2 rounded-lg focus:outline-none">Explore</button>
            <button className="text-white hover:bg-zinc-700 px-4 py-2 rounded-lg focus:outline-none">
              Community Feed
            </button>
            <button className="text-white hover:bg-zinc-700 px-4 py-2 rounded-lg focus:outline-none">
              Mutual Friends
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          <div className="flex items-center text-white text-2xl gap-4">
            <AiFillMessage />
            <IoNotificationsCircle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderUI;
