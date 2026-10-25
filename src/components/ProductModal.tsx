'use client';
import React from 'react';

export default function ProductModal({ product, onClose, onAddToCart }: any) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative shadow-2xl border border-gray-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black font-bold">✕</button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center p-2">
            <img src={product.imageUrl} alt={product.name} className="max-h-full object-contain"/>
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                {product.category}
              </span>
              <h2 className="text-xl font-bold text-gray-900 mt-2">{product.name}</h2>
              <p className="text-gray-600 text-xs mt-3 leading-relaxed">{product.description}</p>
              <div className="text-2xl font-black text-blue-600 mt-4">${product.price.toFixed(2)}</div>
            </div>

            <button
              onClick={() => { onAddToCart(product); onClose(); }}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-xs"
            >
              Add to Cart & Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}