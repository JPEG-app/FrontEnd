import { User } from '../types';

import defaultUserAvatar from '../assets/avatar.png';

export const mockUser: User = {
  id: 'u1',
  name: 'React Dev',
  handle: 'reactdev',
  avatarUrl: defaultUserAvatar,
  bio: 'Building UIs with React & TypeScript.',
  followingCount: 150,
  followersCount: 500,
  createdAt: new Date()
};