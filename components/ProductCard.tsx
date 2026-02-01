
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onBuy: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onBuy }) => {
  return (
    <div className="group glass rounded-2xl p-4 border border-white/5 hover:border-blue-500/30 transition-all flex flex-col h-full">
      <div className="aspect-square rounded-xl overflow-hidden mb-4 relative">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1">
          <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {product.rating}
        </div>
      </div>
      
      <div className="flex-1">
        <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">
          {product.type.replace('_', ' ')}
        </div>
        <h3 className="text-white font-bold mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-gray-400 text-xs mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex flex-wrap gap-1 mb-4">
          {product.tags.map(tag => (
            <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/5">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <span className="text-lg font-bold text-white">
          ${product.price.toLocaleString()}
        </span>
        <button 
          onClick={() => onBuy(product)}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
