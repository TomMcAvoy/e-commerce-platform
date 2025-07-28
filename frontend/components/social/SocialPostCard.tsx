'use client';

import React from 'react';
import Link from 'next/link';
import { IPost } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/Button';
import { HeartIcon, ChatBubbleOvalLeftIcon, ArrowUpOnSquareIcon } from '@heroicons/react/24/outline';

interface SocialPostCardProps {
  post: IPost;
}

export function SocialPostCard({ post }: SocialPostCardProps) {
  const getInitials = (name: string = '') => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formattedDate = new Date(post.createdAt).toLocaleString();

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start space-x-4 p-4">
        <Avatar>
          <AvatarImage src={post.author?.avatar} alt={post.author?.name} />
          <AvatarFallback>{getInitials(post.author?.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <p className="font-semibold">{post.author?.name || 'Anonymous'}</p>
          <p className="text-xs text-gray-500">
            <Link href={`/social/post/${post._id}`} className="hover:underline">
              {formattedDate}
            </Link>
          </p>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-2">
        <p className="text-sm text-gray-800 whitespace-pre-wrap">{post.content}</p>
        {post.image && (
          <div className="mt-4">
            <img src={post.image} alt="Post content" className="rounded-lg w-full object-cover" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between p-4 border-t">
        <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-600">
          <HeartIcon className="w-5 h-5" />
          <span>{post.likes?.length || 0} Likes</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-600">
          <ChatBubbleOvalLeftIcon className="w-5 h-5" />
          <span>{post.comments?.length || 0} Comments</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray