'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [cartAnimate, setCartAnimate] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('tech_user');
    if (storedUser) setUser(JSON.parse(storedUser));

    const storedCart = JSON.parse(localStorage.getItem('tech_cart') || '[]');
    setCartItems(storedCart);
  }, []);

  const updateCart = (newCart: any[]) => {
    setCartItems(newCart);
    localStorage.setItem('tech_cart', JSON.stringify(newCart));
    
    setCartAnimate(true);
    setTimeout(() => setCartAnimate(false), 400);
  };

  const handleIncreaseQty = (id: string) => {
    const updated = cartItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity: (item.quantity || 1) + 1 };
      }
      return item;
    });
    updateCart(updated);
  };

  const handleDecreaseQty = (id: string) => {
    const updated = cartItems.map(item => {
      if (item.id === id && (item.quantity || 1) > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    updateCart(updated);
  };

  const removeItem = (id: string) => {
    const updated = cartItems.filter(item => item.id !== id);
    updateCart(updated);
  };

  const total = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      
      {/* Header */}
      <header className="bg-[#00a8e8] text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          
          <Link href="/" className="text-xl font-black tracking-tight text-white whitespace-nowrap shrink-0">
            Tech Store
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-extrabold shrink-0">
            <Link href="/" className="text-white hover:text-amber-200 transition-colors drop-shadow-sm">
              Home Storefront
            </Link>
            <Link href="/cart" className="text-white border-b-2 border-white pb-0.5 drop-shadow-sm">
              Shopping Cart
            </Link>
            <Link href="/orders" className="text-white hover:text-amber-200 transition-colors drop-shadow-sm">
              My Orders History
            </Link>
          </nav>

          <div className="flex items-center h-9 rounded-lg bg-white overflow-hidden shadow-sm max-w-xs md:max-w-sm flex-1 border border-sky-300">
            <select className="bg-gray-100 text-[11px] px-2 h-full text-gray-800 border-r border-gray-300 focus:outline-none font-bold shrink-0">
              <option value="All">All Products</option>
              <option value="Computer">Laptops</option>
              <option value="Phone">Phones</option>
              <option value="Tablet">Tablets</option>
            </select>
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 px-2.5 text-xs text-black h-full focus:outline-none min-w-0"
            />
            <button className="bg-[#febd69] hover:bg-[#f3a847] text-gray-900 font-extrabold px-4 h-full text-xs shrink-0">
              Search
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs font-medium shrink-0">
            {user && (
              <span className="text-white font-bold text-xs">Hi, {user.name}</span>
            )}
            
            <Link 
              href="/cart" 
              className="relative flex items-center gap-1.5 bg-[#febd69] hover:bg-[#f3a847] text-gray-900 font-black px-4 py-1.5 rounded-full transition-all shadow text-xs"
            >
              <span className={`absolute -top-1.5 -right-1.5 bg-red-600 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow transition-transform duration-300 ${cartAnimate ? 'scale-125' : 'scale-100'}`}>
                {cartCount}
              </span>
              <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H19m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              <span>Cart</span>
            </Link>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-10 flex-1 w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white p-10 rounded-xl text-center border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-sm mb-3">Your cart is currently empty.</p>
            <Link href="/" className="inline-block bg-[#febd69] hover:bg-[#f3a847] text-gray-900 px-6 py-2.5 rounded-xl text-xs font-black shadow-sm">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-contain bg-gray-50 rounded p-1"/>
                    <div>
                      <span className="text-[10px] font-bold text-[#007ea7] uppercase">{item.category}</span>
                      <h3 className="font-bold text-sm text-gray-800">{item.name}</h3>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                          <button 
                            onClick={() => handleDecreaseQty(item.id)}
                            className="px-2.5 py-1 text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-xs font-bold text-gray-900 bg-white">
                            {item.quantity || 1}
                          </span>
                          <button 
                            onClick={() => handleIncreaseQty(item.id)}
                            className="px-2.5 py-1 text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-xs font-extrabold text-[#003459]">
                          ${(item.price * (item.quantity || 1)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => removeItem(item.id)} 
                    className="text-red-500 text-xs font-semibold hover:bg-red-50 px-3 py-1.5 rounded transition-all"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
              <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Order Summary</h3>
              <div className="flex justify-between text-xs text-gray-600 mb-2">
                <span>Subtotal ({cartCount} items)</span>
                <span className="font-bold text-gray-900">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600 mb-4">
                <span>Shipping</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-sm font-black text-gray-900 mb-6">
                <span>Total Amount</span>
                <span className="text-[#003459]">${total.toFixed(2)}</span>
              </div>
              <Link 
                href="/checkout" 
                className="block text-center w-full bg-[#febd69] hover:bg-[#f3a847] text-gray-900 font-black py-3 rounded-xl text-xs shadow-md transition-all"
              >
                Proceed to Checkout & Payment
              </Link>
            </div>

          </div>
        )}
      </main>

      <footer className="bg-[#003459] text-gray-300 text-xs py-6 text-center mt-auto">
        <p>© 2026 Tech Store Cambodia. All rights reserved.</p>
      </footer>
    </div>
  );
}