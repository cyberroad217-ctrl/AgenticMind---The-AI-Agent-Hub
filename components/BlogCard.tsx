
import React from 'react';
import { BlogPost } from '../types';

interface BlogCardProps {
  post: BlogPost;
  onClick: (post: BlogPost) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, onClick }) => {
  return (
    <div 
      onClick={() => onClick(post)}
      className="group cursor-pointer bg-gray-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all hover:translate-y-[-4px]"
    >
      <div className="aspect-video overflow-hidden">
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase bg-blue-400/10 px-2 py-1 rounded">
            {post.category}
          </span>
          <span className="text-xs text-gray-500">{post.readTime} read</span>
        </div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-3 mb-4">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-3 pt-4 border-t border-white/5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-[10px] font-bold">
            {post.author.charAt(0)}
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-300">{post.author}</p>
            <p className="text-[10px] text-gray-500">{post.date}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
