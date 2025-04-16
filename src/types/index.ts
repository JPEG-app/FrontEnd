// src/types/index.ts

// Represents the basic user info we can derive/use
// Note: API only provides authorUsername, so name/handle are derived, avatar is default
export interface AuthorInfo {
  id: string; // Corresponds to userId from API
  name: string; // Derived from authorUsername
  handle: string; // Derived from authorUsername (e.g., @authorUsername)
  avatarUrl?: string; // Will likely be undefined, triggering fallback in Avatar component
}

// Represents the structure needed by TweetCard, adapted from your API's FeedItem
export interface Tweet {
  id: string; // Use postId from API
  author: AuthorInfo; // Contains derived author info + userId
  title?: string; // postTitle from API (make optional if not always needed)
  content: string; // postContent from API
  createdAt: string; // createdAt from API (as ISO string)
  // Stats are not provided by the API FeedItem model, so make optional or default
  stats?: {
    replies?: number;
    retweets?: number;
    likes?: number;
    views?: number;
  };
  // Add other fields if your API sometimes includes them (e.g., imageUrl)
  imageUrl?: string;
}

// Interface for the actual item coming directly from the API
export interface ApiFeedItem {
  postId: string;
  userId: string;
  authorUsername: string;
  postTitle: string;
  postContent: string;
  createdAt: string; // Expecting ISO string from JSON
  // Add other optional fields if they might exist in the API response
  imageUrl?: string;
  likeCount?: number;
  commentCount?: number;
}

// Interface for the overall API response
export interface ApiFeedResponse {
  userId: string;
  items: ApiFeedItem[];
}

// Keep User type if used elsewhere, but it's less relevant for the feed now
export interface User {
  id: string;
  name: string;
  handle: string;
  avatarUrl?: string;
  bio?: string;
  followingCount?: number;
  followersCount?: number;
}