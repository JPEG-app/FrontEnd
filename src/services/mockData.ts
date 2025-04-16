import { User, Tweet } from '../types';

import defaultUserAvatar from '../assets/avatar.png';

export const mockUser: User = {
  id: 'u1',
  name: 'React Dev',
  handle: 'reactdev',
  avatarUrl: defaultUserAvatar,
  bio: 'Building UIs with React & TypeScript.',
  followingCount: 150,
  followersCount: 500,
};

export const mockTweets: Tweet[] = [
  {
    id: 't1',
    author: mockUser,
    content: 'Just set up Tailwind CSS with React and TypeScript! Loving the utility-first approach. #react #tailwindcss',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    stats: {
      replies: 5,
      retweets: 12,
      likes: 35,
      views: 1200,
    },
  },
  {
    id: 't2',
    author: {
      id: 'u2',
      name: 'TypeScript Fan',
      handle: 'tsfan',
      avatarUrl: defaultUserAvatar,
    },
    content: 'TypeScript makes building complex applications so much more manageable. Static typing for the win!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    stats: {
      replies: 8,
      retweets: 25,
      likes: 70,
      views: 3500,
    },
  },
   {
    id: 't3',
    author: {
      id: 'u3',
      name: 'CSS Enjoyer',
      handle: 'cssguru',
      // 4. Using the same local avatar
      avatarUrl: defaultUserAvatar,
    },
    content: `Exploring the latest CSS features. Grid and Flexbox have changed the game, but sometimes you just need a simple solution.
    \nWhat are your favorite CSS tricks?`,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    stats: {
      replies: 15,
      retweets: 40,
      likes: 110,
      views: 8000,
    },
  },
];