'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('tech_user');
    if (storedUser) setUser(JSON.parse(storedUser));

    const storedCart = JSON.parse(localStorage.getItem('tech_cart') || '[]');
    setCart(storedCart);

    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        const historicalMockOrders = [
          {
            id: 'ORD-90214',
            customerName: 'Sophea Chan',
            items: [{ name: 'MacBook Pro 16" M3 Max', quantity: 1 }, { name: 'iPhone 15 Pro Max', quantity: 1 }],
            totalAmount: 4698.00,
            paymentMethod: 'KHQR',
            status: 'COMPLETED',
            createdAt: '2026-10-24T14:32:00.000Z'
          },
          {
            id: 'ORD-88412',
            customerName: 'Dara Sok',
            items: [{ name: 'iPad Pro 12.9" M2', quantity: 1 }],
            totalAmount: 1099.00,
            paymentMethod: 'CREDIT_CARD',
            status: 'COMPLETED',
            createdAt: '2026-10-22T09:15:00.000Z'
          }
        ];
        setOrders([...data, ...historicalMockOrders]);
      })
      .catch(err => console.error(err));
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
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
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('tech_user');
    showToast('Logged out successfully.');
  };

  const cartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const filteredOrders = user 
    ? orders.filter(o => o.customerName && user.name.toLowerCase() === o.customerName.toLowerCase())
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      
      {toastMessage && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl border border-gray-700 flex items-center gap-3 animate-bounce">
          <span className="text-emerald-400 font-bold text-sm">✓</span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Light Blue Header with Bold White Nav Links and Yellow Buttons */}
      <header className="bg-[#00a8e8] text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          
          <Link href="/" className="text-xl font-black tracking-tight text-white whitespace-nowrap shrink-0">
           Tech Store
          </Link>

          {/* Bold White Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-extrabold shrink-0">
            <Link href="/" className="text-white hover:text-amber-200 transition-colors drop-shadow-sm">
              Home Storefront
            </Link>
            <Link href="/cart" className="text-white hover:text-amber-200 transition-colors drop-shadow-sm">
              Shopping Cart
            </Link>
            <Link href="/orders" className="text-white border-b-2 border-white pb-0.5 drop-shadow-sm">
              My Orders History
            </Link>
          </nav>

          {/* Search Bar */}
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

          {/* User Auth and Yellow Cart Button */}
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
              className="relative flex items-center gap-1.5 bg-[#febd69] hover:bg-[#f3a847] text-gray-900 font-black px-4 py-1.5 rounded-full transition-all shadow text-xs"
            >
              <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow">
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
      <main className="max-w-7xl mx-auto px-6 py-10 flex-1 w-full">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">My Personal Order History</h1>
          
          </div>
          {user && (
            <div className="bg-sky-50 border border-sky-200 text-[#003459] px-4 py-2 rounded-xl text-xs font-semibold">
              Logged in account: <span className="font-bold">{user.name}</span> ({user.email})
            </div>
          )}
        </div>

        {!user ? (
          <div className="bg-white p-12 rounded-2xl text-center border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Please Sign In to View Your Orders</h3>
            <p className="text-xs text-gray-500 mb-6">Please logged into your registered account to see your order history.</p>
            <button 
              onClick={() => { setAuthMode('login'); setIsAuthOpen(true); }}
              className="bg-[#febd69] hover:bg-[#f3a847] text-gray-900 font-black px-6 py-2.5 rounded-xl text-xs shadow-md transition-all"
            >
              Sign In / Register Now
            </button>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Products Ordered</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Payment Type</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-10 text-center text-gray-400">
                      You have not placed any orders yet. Go to the storefront to complete a purchase!
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-mono font-bold text-[#007ea7]">{o.id}</td>
                      <td className="p-4 font-semibold text-gray-900 flex items-center gap-2">
                        <span>{o.customerName}</span>
                        <span className="bg-sky-100 text-[#003459] text-[9px] font-bold px-1.5 py-0.5 rounded border border-sky-300">YOU</span>
                      </td>
                      <td className="p-4">
                        {o.items && o.items.length > 0 ? (
                          <div className="space-y-0.5">
                            {o.items.map((item: any, idx: number) => (
                              <div key={idx} className="text-gray-700 font-medium">
                                • {item.name} {item.quantity ? `(x${item.quantity})` : ''}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">Tech Device Item</span>
                        )}
                      </td>
                      <td className="p-4 text-gray-500">{new Date(o.createdAt || Date.now()).toLocaleString()}</td>
                      <td className="p-4">
                        <span className="bg-gray-100 border border-gray-200 px-2.5 py-1 rounded font-bold text-[10px] text-gray-700">
                          {o.paymentMethod || 'KHQR'}
                        </span>
                      </td>
                      <td className="p-4 font-extrabold text-[#003459]">${o.totalAmount?.toFixed(2)}</td>
                      <td className="p-4">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full">
                          {o.status || 'COMPLETED'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

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
            <p>✉️ Email: info@techshop.com</p>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-3">Quick Links</h4>
            <ul className="space-y-1">
              <li><Link href="/" className="hover:underline">Home Storefront</Link></li>
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