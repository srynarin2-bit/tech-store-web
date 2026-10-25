'use client';
import React from 'react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    category: string;
    price: number;
    description: string;
    imageUrl: string;
  };
  onAddToCart: (p: any) => void;
  onSelect: (p: any) => void;
}

export default function ProductCard({ product, onAddToCart, onSelect }: ProductCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition-shadow group">
      <div onClick={() => onSelect(product)} className="cursor-pointer">
        <div className="h-44 w-full bg-gray-50 rounded flex items-center justify-center overflow-hidden mb-3">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
          />
        </div>
        <h3 className="text-xs font-bold text-gray-800 line-clamp-1">{product.name}</h3>
        <p className="text-gray-500 text-[11px] mt-1 line-clamp-2 leading-relaxed">{product.description}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm font-extrabold text-blue-600">${product.price.toFixed(2)}</span>
        <button
          onClick={() => onAddToCart(product)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}