export interface ApiFeedItem {
  postId: string;
  userId: string;
  authorUsername: string;
  postTitle: string;
  postContent: string;
  createdAt: string; 
  updatedAt: string; 
  imageUrl?: string;
  likeCount?: number;
  commentCount?: number;
}

export interface Author {
  id: string;
  name: string;
  handle: string;
  avatarUrl?: string;
}

export interface Tweet {
  id: string;
  author: Author; 
  title?: string;
  content: string;
  createdAt: Date;  
  stats?: {
    replies?: number;
    retweets?: number;
    likes?: number;
    views?: number;
  };
  imageUrl?: string;
}

export interface User {
  id: string;
  name: string; 
  handle: string; 
  avatarUrl?: string;
  bio?: string;
  followingCount?: number;
  followersCount?: number;
}