import React from 'react';
import { RiHome4Line, RiCommunityLine, RiCalendarLine, RiNewspaperLine, RiSearchLine } from 'react-icons/ri';

interface Logo {
  name: string;
  icon: JSX.Element;
}

const Sidebar: React.FC = () => {
  // Array of logo names
  const logos: Logo[] = [
    { name: 'Home', icon: <RiHome4Line className="mr-3" /> },
    { name: 'Community Feed', icon: <RiCommunityLine className="mr-3" /> },
    { name: 'Events', icon: <RiCalendarLine className="mr-3" /> },
    { name: 'News Feed', icon: <RiNewspaperLine className="mr-3" /> },
  ];

  return (
    <div className="h-full bg-zinc-900 p-4 hidden lg:block">
      {/* Logo */}
      <div className="flex items-center justify-center mb-8">
        <img src="/logo.svg" alt="Logo" className="h-12" />
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-zinc-800 text-white rounded-full py-2 px-4 pr-10 focus:outline-none focus:bg-gray-700 
          border-none ring-2 ring-gray-700 focus:ring-2 focus:ring-blue-500"
          style={{ borderRadius: '9999px' }}
        />
        <div className="absolute inset-y-0 right-0 flex items-center mr-2">
          <RiSearchLine className="text-gray-500 h-5 w-5 fill-current" />
        </div>
      </div>

      {/* Buttons */}
      <div>
        {logos.map((logo, index) => (
          <button
            key={index}
            className="flex items-center justify-start w-full py-3 px-4 text-white transition duration-300 rounded-lg hover:bg-zinc-600 hover:shadow-lg"
            style={{ backgroundColor: 'transparent' }}
          >
            {logo.icon}
            {logo.name}
          </button>
        ))}
      </div>

      {/* Line */}
      <div className="border-t border-zinc my-4"></div>

      {/* Community Options */}
      <div className="text-white mb-4">Community Options</div>
      <div>{/* Add community options here */}</div>

      {/* Line */}
      <div className="border-t border-zinc my-4"></div>

      {/* Upcoming Events */}
      <div className="text-white mb-4">Upcoming Events</div>
      <div>{/* Add upcoming events here */}</div>
    </div>
  );
};

export default Sidebar;
