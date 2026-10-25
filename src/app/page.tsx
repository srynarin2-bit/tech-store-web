'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Storefront() {
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [cartAnimate, setCartAnimate] = useState(false);

  // Load products from localStorage or fallback to API
  const loadProducts = async () => {
    const storedCustom = localStorage.getItem('tech_custom_products');
    if (storedCustom) {
      try {
        const parsed = JSON.parse(storedCustom);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
      localStorage.setItem('tech_custom_products', JSON.stringify(data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('tech_user');
    if (storedUser) setUser(JSON.parse(storedUser));

    const storedCart = JSON.parse(localStorage.getItem('tech_cart') || '[]');
    setCart(storedCart);

    loadProducts();

    // Listen for updates from the Admin dashboard across tabs or windows
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'tech_custom_products') {
        loadProducts();
      }
    };

    const handleCustomSync = () => {
      loadProducts();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('products_updated', handleCustomSync);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('products_updated', handleCustomSync);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddToCart = (product: any) => {
    if (!user) {
      showToast('⚠️ Please Sign In or Register to add items to your cart.');
      setIsAuthOpen(true);
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem('tech_cart') || '[]');
    const existingIndex = existingCart.findIndex((item: any) => item.id === product.id);

    let updatedCart;
    if (existingIndex > -1) {
      existingCart[existingIndex].quantity = (existingCart[existingIndex].quantity || 1) + 1;
      updatedCart = [...existingCart];
    } else {
      updatedCart = [...existingCart, { ...product, quantity: 1 }];
    }

    localStorage.setItem('tech_cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
    showToast(`Successfully added "${product.name}" to your cart!`);

    setCartAnimate(true);
    setTimeout(() => setCartAnimate(false), 400);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('tech_user', JSON.stringify(data.user));
        setIsAuthOpen(false);
        showToast(authMode === 'login' ? 'Signed in successfully!' : 'Account created & logged in!');
      }
    } catch (err) {
      const mockUser = { name: authForm.name || 'Customer User', email: authForm.email };
      setUser(mockUser);
      localStorage.setItem('tech_user', JSON.stringify(mockUser));
      setIsAuthOpen(false);
      showToast('Signed in successfully!');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('tech_user');
    showToast('Logged out successfully.');
  };

  const cartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  // Filter products by selected category and search input
  const displayedProducts = products
    .filter((p: any) => category === 'All' || p.category.toLowerCase() === category.toLowerCase())
    .filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      
      {toastMessage && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl border border-gray-700 flex items-center gap-3 animate-bounce">
          <span className="text-emerald-400 font-bold text-sm">✓</span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-[#00a8e8] text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          
          <Link href="/" className="text-xl font-black tracking-tight text-white whitespace-nowrap shrink-0">
            Tech Store
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-extrabold shrink-0">
            <Link href="/" className="text-white border-b-2 border-white pb-0.5 drop-shadow-sm">
              Home Storefront
            </Link>
            <Link href="/cart" className="text-white hover:text-amber-200 transition-colors drop-shadow-sm">
              Shopping Cart
            </Link>
            <Link href="/orders" className="text-white hover:text-amber-200 transition-colors drop-shadow-sm">
              My Orders History
            </Link>
          </nav>

          <div className="flex items-center h-9 rounded-lg bg-white overflow-hidden shadow-sm max-w-xs md:max-w-sm flex-1 border border-sky-300">
            <select 
              onChange={e => setCategory(e.target.value)} 
              value={category}
              className="bg-gray-100 text-[11px] px-2 h-full text-gray-800 border-r border-gray-300 focus:outline-none cursor-pointer font-bold shrink-0"
            >
              <option value="All">All Products</option>
              <option value="Computer">Laptops</option>
              <option value="Phone">Phones</option>
              <option value="Tablet">Tablets</option>
            </select>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 px-2.5 text-xs text-black h-full focus:outline-none min-w-0"
            />
            <button className="bg-[#febd69] hover:bg-[#f3a847] text-gray-900 font-extrabold px-4 h-full text-xs shrink-0">
              Search
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs font-medium shrink-0">
            {user ? (
              <div className="flex items-center gap-2 bg-[#007ea7] px-3 py-1 rounded-xl border border-sky-300 shadow-sm">
                <span className="text-white font-bold text-xs">Hi, {user.name}</span>
                <button 
                  onClick={handleLogout} 
                  className="text-white hover:bg-red-600 bg-sky-900 px-2 py-0.5 rounded text-[10px] font-bold transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => { setAuthMode('login'); setIsAuthOpen(true); }} 
                className="bg-[#febd69] hover:bg-[#f3a847] text-gray-900 font-black px-4 py-1.5 rounded-xl transition-all shadow text-xs"
              >
                Sign In / Register
              </button>
            )}

            <Link 
              href="/cart" 
              className="relative flex items-center gap-1.5 bg-[#febd69] hover:bg-[#f3a847] text-gray-900 font-black px-4 py-1.5 rounded-full transition-all shadow text-xs group"
            >
              <span className={`absolute -top-1.5 -right-1.5 bg-red-600 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow transition-transform duration-300 ${cartAnimate ? 'scale-125' : 'scale-100'}`}>
                {cartCount}
              </span>
              <svg className="w-4 h-4 text-gray-900 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H19m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              <span>Cart</span>
            </Link>
          </div>

        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#00223e] via-[#003459] to-[#007ea7] text-white py-12 px-6 text-center shadow-md">
        <p className="text-xs uppercase tracking-widest text-[#febd69] font-extrabold">Affordable Price for You</p>
        <h1 className="text-3xl md:text-5xl font-black mt-2 text-white drop-shadow-sm">Buy Your Laptops & Electronics Devices Here</h1>
        <p className="text-sky-100 text-xs md:text-sm mt-2 max-w-lg mx-auto leading-relaxed">
          Explore high-performance smartphones, laptops, and tablets with secure payment.
        </p>
      </div>

      {/* Product Catalog Section */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
        <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-2">
          <h2 className="font-bold text-sm text-gray-800 uppercase">Featured Products ({category})</h2>
          <div className="flex gap-2 text-xs">
            {['All', 'Phone', 'Computer', 'Tablet'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${category === cat ? 'bg-[#00a8e8] text-white shadow-sm' : 'bg-white border text-gray-700 hover:bg-gray-50'}`}
              >
                {cat === 'All' ? 'All Products' : cat + 's'}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedProducts.map((product: any) => (
            <div key={product.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div onClick={() => setSelectedProduct(product)} className="cursor-pointer">
                <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden mb-3">
                  <img src={product.imageUrl} alt={product.name} className="max-h-full object-contain hover:scale-105 transition-transform"/>
                </div>
                <span className="text-[10px] font-bold text-[#007ea7] uppercase">{product.category}</span>
                <h3 className="font-bold text-sm text-gray-900 mt-1 line-clamp-1">{product.name}</h3>
                <p className="text-gray-500 text-xs mt-1 line-clamp-2">{product.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-base font-extrabold text-[#003459]">${Number(product.price).toFixed(2)}</span>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-[#febd69] hover:bg-[#f3a847] text-gray-900 text-xs font-black px-4 py-2 rounded-xl shadow-sm transition-all active:scale-95"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 relative shadow-2xl">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-gray-400 font-bold">✕</button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="h-60 bg-gray-50 rounded-lg flex items-center justify-center p-2">
                <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="max-h-full object-contain"/>
              </div>
              <div>
                <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-bold uppercase">{selectedProduct.category}</span>
                <h2 className="text-xl font-bold text-gray-900 mt-2">{selectedProduct.name}</h2>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">{selectedProduct.description}</p>
                <div className="text-2xl font-black text-[#003459] mt-4">${Number(selectedProduct.price).toFixed(2)}</div>
                <button
                  onClick={() => { handleAddToCart(selectedProduct); setSelectedProduct(null); }}
                  className="mt-4 w-full bg-[#febd69] hover:bg-[#f3a847] text-gray-900 font-black py-3 rounded-xl text-xs transition-all shadow-md"
                >
                  Add to Cart & Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sign In / Register Modal */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setIsAuthOpen(false)} className="absolute top-4 right-4 text-gray-400 font-bold">✕</button>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {authMode === 'login' ? 'Sign In First to Tech Store.' : 'Register First to Tech Store.'}
            </h3>
            <p className="text-xs text-gray-500 mb-6">Registered users can buy products you want immediately.</p>
            
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={authForm.name}
                    onChange={e => setAuthForm({ ...authForm, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-black focus:outline-[#00a8e8]"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={authForm.email}
                  onChange={e => setAuthForm({ ...authForm, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-black focus:outline-[#00a8e8]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authForm.password}
                  onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-black focus:outline-[#00a8e8]"
                />
              </div>
              <button type="submit" className="w-full bg-[#febd69] hover:bg-[#f3a847] text-gray-900 font-black py-3 rounded-xl text-xs transition-all shadow-md">
                {authMode === 'login' ? 'Sign In' : 'Register Account'}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-gray-600">
              {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} 
                className="text-[#00a8e8] font-bold hover:underline"
              >
                {authMode === 'login' ? 'Register now' : 'Sign in'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#003459] text-gray-300 text-xs py-10 mt-auto border-t border-sky-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold text-white text-sm mb-3">Tech Store Cambodia</h4>
            <p className="text-gray-300 text-xs leading-relaxed">
              Your trusted destination for premium smartphones, laptops, and tablets with instant KHQR payment verification.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-3">Customer Support & Contact</h4>
            <p className="mb-1">📞 Phone 1: +855 12 345 678</p>
            <p className="mb-1">📞 Phone 2: +855 98 765 432</p>
            <p>✉️ Email: info@techstore.com</p>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-3">Quick Links</h4>
            <ul className="space-y-1">
              <li><Link href="/admin" className="hover:underline text-[#febd69] font-bold">Admin Portal Dashboard</Link></li>
              <li><Link href="/orders" className="hover:underline">Orders History</Link></li>
              <li><Link href="/cart" className="hover:underline">Shopping Cart</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 border-t border-sky-900/60 mt-8 pt-6 text-center text-gray-400">
          <p>© 2026 Tech Store Cambodia. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}