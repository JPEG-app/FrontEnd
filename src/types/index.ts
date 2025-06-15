export interface ApiFeedItem {
  postId: string;
  userId: string;
  authorUsername: string;
  title: string;
  content: string;
  createdAt: string; 
  updatedAt: string; 
  imageUrl?: string;
  likeCount?: number;
  hasUserLiked: Boolean;
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
  likeCount: number;
  hasUserLiked: Boolean;
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
  createdAt: Date;
}