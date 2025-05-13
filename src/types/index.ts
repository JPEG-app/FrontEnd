// src/types/index.ts

// Interface for the actual item coming directly from the API
export interface ApiFeedItem {
  postId: string;
  userId: string;
  authorUsername: string;
  postTitle: string;
  postContent: string;
  createdAt: string; // Expecting ISO string from JSON
  updatedAt: string; // Assuming API also sends this
  imageUrl?: string;
  likeCount?: number;
  commentCount?: number;
}

// Interface for the overall API response (if it's an object with an items array)
// If your API /feed returns an array directly, this specific type might not be used for that call.
// Based on earlier discussion, /feed now returns ApiFeedItem[] directly.
// export interface ApiFeedResponse {
//   userId: string;
//   items: ApiFeedItem[];
// }

// Re-using Author from previous definitions, or define it here if it's different.
// Let's assume a consistent Author type.
export interface Author {
  id: string;
  name: string;
  handle: string;
  avatarUrl?: string;
}

// Represents the structure needed by TweetCard
export interface Tweet {
  id: string;
  author: Author; // Use the consistent Author type
  title?: string;
  content: string;
  createdAt: Date;   // <<<< CHANGED TO Date
  stats?: {
    replies?: number;
    retweets?: number;
    likes?: number;
    views?: number;
  };
  imageUrl?: string;
}

// User type, if needed elsewhere
export interface User {
  id: string;
  name: string; // Or username
  handle: string; // Or derived
  avatarUrl?: string;
  bio?: string;
  followingCount?: number;
  followersCount?: number;
}