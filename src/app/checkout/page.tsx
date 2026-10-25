'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const [method, setMethod] = useState<'KHQR' | 'CARD'>('KHQR');
  const [loading, setLoading] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('tech_user');
    if (storedUser) setUser(JSON.parse(storedUser));

    const storedCart = JSON.parse(localStorage.getItem('tech_cart') || '[]');
    setCartItems(storedCart);
    const total = storedCart.reduce((acc: number, item: any) => acc + (item.price * (item.quantity || 1)), 0);
    setCartTotal(total > 0 ? total : 1199.00);
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    const activeCustomerName = user ? user.name : 'Valued Customer';

    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cartItems.length > 0 ? cartItems : [{ name: 'iPhone 15 Pro Max', price: 1199.00, quantity: 1 }],
        totalAmount: cartTotal,
        paymentMethod: method,
        customerName: activeCustomerName
      })
    });

    localStorage.removeItem('tech_cart');
    setLoading(false);
    setSuccessPopup(true);
    setTimeout(() => {
      router.push('/orders');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 relative">
      
      {successPopup && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold mb-4">
              ✓
            </div>
            <h2 className="text-xl font-bold text-gray-900">Payment Successful!</h2>
            <p className="text-xs text-gray-500 mt-2">
              Order placed under <span className="font-bold text-[#003459]">{user ? user.name : 'Valued Customer'}</span>. Recorded in Order History.
            </p>
          </div>
        </div>
      )}

      {/* Light Blue Theme Top Bar Header */}
      <header className="bg-[#00a8e8] text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          
          <Link href="/" className="text-lg font-black tracking-tight text-white whitespace-nowrap shrink-0">
           Tech Store
          </Link>

          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold shrink-0">
            <Link href="/" className="text-sky-100 hover:text-white transition-colors">
              Home Storefront
            </Link>
            <Link href="/cart" className="text-sky-100 hover:text-white transition-colors">
              Shopping Cart
            </Link>
            <Link href="/orders" className="text-sky-100 hover:text-white transition-colors">
              My Orders History
            </Link>
          </nav>

          <div className="flex items-center gap-3 text-xs font-medium shrink-0 ml-auto">
            {user && (
              <span className="text-white font-bold text-[11px]">Logged in: {user.name}</span>
            )}
          </div>

        </div>
      </header>

      {/* Checkout Container */}
      <main className="max-w-xl mx-auto px-6 py-10 flex-1 w-full">
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Secure Checkout & Payment</h1>
          <p className="text-xs text-gray-500 mb-6">
            Ordering as: <span className="font-bold text-[#003459]">{user ? user.name : 'Guest Customer'}</span>
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setMethod('KHQR')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all ${method === 'KHQR' ? 'border-red-600 bg-red-50 text-red-600 shadow-sm' : 'border-gray-200 text-gray-600'}`}
            >
              KHQR Bakong Pay
            </button>
            <button
              type="button"
              onClick={() => setMethod('CARD')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all ${method === 'CARD' ? 'border-[#00a8e8] bg-sky-50 text-[#003459] shadow-sm' : 'border-gray-200 text-gray-600'}`}
            >
              Credit / Debit Card
            </button>
          </div>

          {method === 'KHQR' ? (
            <div className="bg-gradient-to-b from-red-50 via-white to-white p-6 rounded-2xl text-center mb-6 border border-red-200 shadow-inner">
              
              <h3 className="text-sm font-extrabold text-red-700 tracking-wider mb-3 uppercase">
                QR CODE PAYMENT
              </h3>

              <div className="w-56 h-56 mx-auto bg-white border-4 border-red-600 rounded-2xl p-3 flex flex-col items-center justify-center shadow-lg relative">
                <div className="w-full h-full bg-white p-2 border border-gray-200 rounded-xl flex flex-col justify-between items-center relative">
                  
                  <svg className="w-36 h-36 my-auto text-black" viewBox="0 0 33 33" fill="currentColor">
                    <path d="M0 0h10v10H0V0zm2 2h6v6H2V2m13-2h4v4h-4V0m6 0h7v7h-7V0m2 2v3h3V2h-3M0 11h4v4H0v-4m6 0h4v4H6v-4m5 0h4v4h-1v-2h-3v-2m5 0h2v2h-2v-2m4 0h3v4h-3v-4m5 0h4v2h-4v-2m-21 5h4v4h-4v-4m6 0h2v2h-2v-2m4 0h2v4h-2v-4m5 0h3v2h-3v-2m4 0h2v4h-2v-4m-20 5h6v6H0v-6h6m-4 2v2h2v-2H2m13 0h3v4h-3v-4m5 0h2v2h-2v-2m3 0h4v4h-4v-4m-24 7h10v10H0V23zm2 2v6h6v-6H2m13 0h4v2h-4v-2m6 0h7v7h-7v-7m2 2v3h3v-3h-3Z" />
                    <rect x="11" y="11" width="2" height="2" />
                    <rect x="14" y="13" width="2" height="2" />
                    <rect x="18" y="11" width="3" height="2" />
                    <rect x="23" y="15" width="2" height="3" />
                    <rect x="26" y="14" width="3" height="2" />
                    <rect x="11" y="18" width="2" height="3" />
                    <rect x="15" y="17" width="3" height="2" />
                    <rect x="20" y="18" width="2" height="2" />
                    <rect x="24" y="20" width="3" height="3" />
                    <rect x="12" y="23" width="2" height="2" />
                    <rect x="16" y="22" width="2" height="4" />
                    <rect x="21" y="24" width="3" height="2" />
                    <rect x="26" y="25" width="4" height="4" />
                  </svg>

                  <div className="w-full text-center border-t pt-1">
                    <p className="text-[9px] font-bold text-gray-800">COMPUTER SHOP CAMBODIA</p>
                    <p className="text-[11px] font-black text-emerald-600">${cartTotal.toFixed(2)} USD</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-600 mt-4 font-medium">Scan with ABA Mobile, Acleda, or any Bakong Mobile App</p>
            </div>
          ) : (
            <div className="space-y-3 mb-6 bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <input type="text" placeholder="Card Number (4242 •••• •••• 4242)" className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-black bg-white focus:outline-[#00a8e8]"/>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="MM/YY" className="border border-gray-300 rounded-lg p-2.5 text-xs text-black bg-white focus:outline-[#00a8e8]"/>
                <input type="text" placeholder="CVC" className="border border-gray-300 rounded-lg p-2.5 text-xs text-black bg-white focus:outline-[#00a8e8]"/>
              </div>
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-[#00a8e8] hover:bg-[#007ea7] text-white font-bold py-3.5 rounded-xl text-xs shadow-lg transition-all"
          >
            {loading ? 'Processing Payment...' : `Confirm & Pay $${cartTotal.toFixed(2)}`}
          </button>
        </div>
      </main>

      <footer className="bg-[#003459] text-gray-300 text-xs py-6 text-center mt-auto">
        <p>© 2026 Tech Store Cambodia. All rights reserved.</p>
      </footer>
    </div>
  );
}