'use client';
import React, { useState } from 'react';
import Link from 'next/link';

interface NavbarProps {
  cartCount: number;
  user: any;
  onOpenAuth: () => void;
  onLogout: () => void;
  onCategoryChange?: (cat: string) => void;
  onSearchChange?: (term: string) => void;
}

export default function Navbar({
  cartCount,
  user,
  onOpenAuth,
  onLogout,
  onCategoryChange,
  onSearchChange,
}: NavbarProps) {
  const [search, setSearch] = useState('');

  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200 select-none">
      {/* Top Contact Bar */}
      <div className="bg-[#f8f9fa] text-xs text-gray-600 px-6 py-1.5 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center gap-4">
          <span>📞 Call To: +855 12 345 678</span>
          <span>✉️ Email: info@techshop.com</span>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">Hi, {user.name}</span>
              <button onClick={onLogout} className="text-red-600 hover:underline">Logout</button>
            </div>
          ) : (
            <button onClick={onOpenAuth} className="hover:text-blue-600 font-semibold">Sign In / Register</button>
          )}
          <Link href="/orders" className="hover:text-blue-600">My Orders / DB Audit</Link>
          <Link href="/qa-studio" className="text-amber-600 font-bold hover:underline">⚡ QA Studio</Link>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand / Logo */}
        <Link href="/" className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-1">
          Computer <span className="text-blue-600">Shop</span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <button onClick={() => onCategoryChange?.('All')} className="hover:text-blue-600">Shop</button>
          <button onClick={() => onCategoryChange?.('Computer')} className="hover:text-blue-600">Most Popular</button>
          <Link href="/orders" className="hover:text-blue-600">Blog</Link>
          <Link href="/qa-studio" className="hover:text-blue-600">Contact Us</Link>
        </nav>

        {/* Search Bar & Cart */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white w-full md:w-80">
            <select 
              onChange={(e) => onCategoryChange?.(e.target.value)} 
              className="bg-gray-100 text-xs px-2 py-2 border-r border-gray-300 text-gray-700 focus:outline-none"
            >
              <option value="All">All Departments</option>
              <option value="Computer">Laptops</option>
              <option value="Phone">Phones</option>
              <option value="Tablet">Tablets</option>
            </select>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                onSearchChange?.(e.target.value);
              }}
              className="px-3 py-1.5 text-xs w-full focus:outline-none text-gray-800"
            />
            <button className="bg-blue-600 text-white px-4 py-2 text-xs font-bold hover:bg-blue-700">
              🔍
            </button>
          </div>

          <Link href="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 flex items-center gap-1">
            <span className="text-2xl">🛒</span>
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}