'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customerActivities, setCustomerActivities] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Phone',
    price: '',
    description: '',
    imageUrl: '',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadData = async () => {
    try {
      // 1. Load Products from localStorage or API
      const storedCustom = localStorage.getItem('tech_custom_products');
      if (storedCustom) {
        setProducts(JSON.parse(storedCustom));
      } else {
        const res = await fetch('/api/products');
        const apiData = await res.json();
        setProducts(apiData);
        localStorage.setItem('tech_custom_products', JSON.stringify(apiData));
      }

      // 2. Load Orders from localStorage or API
      let loadedOrders = [];
      const storedOrders = localStorage.getItem('tech_orders');
      if (storedOrders) {
        loadedOrders = JSON.parse(storedOrders);
      } else {
        const ordersRes = await fetch('/api/orders');
        loadedOrders = await ordersRes.json();
      }
      setOrders(loadedOrders);

      // 3. Build Dynamic Customer Activity Stream from actual orders & local logs
      const liveActivities = loadedOrders.map((o: any, idx: number) => ({
        id: o.id || `ord_${idx}`,
        type: 'order',
        name: o.customerName || 'Customer User',
        description: `placed order #${o.id} ($${Number(o.totalAmount || 0).toFixed(2)} via ${o.paymentMethod || 'KHQR'})`,
        time: o.createdAt ? new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent',
        dotColor: 'bg-emerald-500'
      }));

      // Add default activity if stream is empty
      if (liveActivities.length === 0) {
        liveActivities.push({
          id: 'act_1',
          type: 'info',
          name: 'System Store',
          description: 'Store initialized successfully with live inventory.',
          time: 'Just now',
          dotColor: 'bg-blue-500'
        });
      }

      setCustomerActivities(liveActivities);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
    const handleStorageSync = () => loadData();
    window.addEventListener('storage', handleStorageSync);
    window.addEventListener('products_updated', handleStorageSync);
    window.addEventListener('order_placed', handleStorageSync);

    return () => {
      window.removeEventListener('storage', handleStorageSync);
      window.removeEventListener('products_updated', handleStorageSync);
      window.removeEventListener('order_placed', handleStorageSync);
    };
  }, []);

  const saveToStorage = (updatedProducts: any[]) => {
    setProducts(updatedProducts);
    localStorage.setItem('tech_custom_products', JSON.stringify(updatedProducts));
    window.dispatchEvent(new Event('products_updated'));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm((prev) => ({
          ...prev,
          imageUrl: reader.result as string,
        }));
        showToast('Image uploaded and processed!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct = {
      id: `prod_${Date.now()}`,
      name: productForm.name,
      category: productForm.category,
      price: parseFloat(productForm.price),
      description: productForm.description,
      imageUrl: productForm.imageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80',
    };

    const updated = [newProduct, ...products];
    saveToStorage(updated);
    setIsAddModalOpen(false);
    setProductForm({ name: '', category: 'Phone', price: '', description: '', imageUrl: '' });
    showToast(`Added product "${newProduct.name}" successfully!`);
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = products.map((p) => {
      if (p.id === editingProduct.id) {
        return {
          ...p,
          name: productForm.name,
          category: productForm.category,
          price: parseFloat(productForm.price),
          description: productForm.description,
          imageUrl: productForm.imageUrl,
        };
      }
      return p;
    });

    saveToStorage(updated);
    setEditingProduct(null);
    setProductForm({ name: '', category: 'Phone', price: '', description: '', imageUrl: '' });
    showToast(`Updated "${productForm.name}" successfully!`);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      const updated = products.filter((p) => p.id !== id);
      saveToStorage(updated);
      showToast(`Product "${name}" removed from store.`);
    }
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      description: product.description,
      imageUrl: product.imageUrl,
    });
  };

  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const totalOrders = orders.length;
  const filteredProducts = products
    .filter((p) => categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase())
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-900">
      
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-gray-700 flex items-center gap-3 animate-bounce">
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/>
          </svg>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-[#003459] text-white flex flex-col justify-between shrink-0 shadow-xl">
        <div>
          <div className="p-6 border-b border-sky-900 flex items-center gap-3">
            <div className="w-9 h-9 bg-[#febd69] rounded-xl flex items-center justify-center font-black text-gray-900 text-sm">
              AD
            </div>
            <div>
              <h2 className="font-black text-base text-white tracking-tight">Admin Dashboard</h2>
              <p className="text-[10px] text-sky-200 uppercase tracking-widest font-bold">Tech Store</p>
            </div>
          </div>

          <nav className="p-4 space-y-1.5 text-xs font-bold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'overview' ? 'bg-[#00a8e8] text-white shadow-md' : 'text-sky-100 hover:bg-sky-900'
              }`}
            >
              <span>Analytics Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'products' ? 'bg-[#00a8e8] text-white shadow-md' : 'text-sky-100 hover:bg-sky-900'
              }`}
            >
              <span>Products Management</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'orders' ? 'bg-[#00a8e8] text-white shadow-md' : 'text-sky-100 hover:bg-sky-900'
              }`}
            >
              <span>Customer Orders Report</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-sky-900">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-[#febd69] hover:bg-[#f3a847] text-gray-900 font-black py-2.5 rounded-xl text-xs shadow-md transition-all"
          >
            <span>Back to Storefront</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Tech Store Sales Management Dashboard</h1>
            <p className="text-xs text-gray-500 mt-0.5">Real-time show total sales revenue, customers order record and product management.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setProductForm({ name: '', category: 'Phone', price: '', description: '', imageUrl: '' });
                setIsAddModalOpen(true);
              }}
              className="bg-[#febd69] hover:bg-[#f3a847] text-gray-900 font-black px-4 py-2.5 rounded-xl text-xs shadow-md flex items-center gap-2 transition-all"
            >
              <span>+ Add New Product</span>
            </button>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Sales Revenue</p>
                  <h3 className="text-2xl font-black text-[#003459] mt-1">${totalRevenue.toFixed(2)}</h3>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Orders</p>
                  <h3 className="text-2xl font-black text-[#003459] mt-1">{totalOrders}</h3>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Active Inventory</p>
                  <h3 className="text-2xl font-black text-[#003459] mt-1">{products.length} Items</h3>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Payment System</p>
                  <h3 className="text-lg font-black text-emerald-600 mt-1">QR Code and Credit Card</h3>
                </div>
              </div>
            </div>

            {/* Dynamic Customer Activity Stream */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
    
                <span>Customers ordering Recorded</span>
              </h3>
              <div className="space-y-3">
                {customerActivities.map((act) => (
                  <div key={act.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${act.dotColor}`}></span>
                      <div>
                        <span className="font-bold text-gray-800">{act.name}</span>{' '}
                        <span className="text-gray-600">{act.description}</span>
                      </div>
                    </div>
                    <span className="text-gray-400 text-[10px] font-mono">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {['All', 'Phone', 'Computer', 'Tablet'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      categoryFilter === cat ? 'bg-[#00a8e8] text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat === 'All' ? 'All Inventory' : cat + 's'}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Search products by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded-xl px-3.5 py-2 text-xs w-full sm:w-64 focus:outline-[#00a8e8]"
              />
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Item Image</th>
                    <th className="p-4">Product Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Unit Price</th>
                    <th className="p-4">Actions (CRUD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <img src={p.imageUrl} alt={p.name} className="w-12 h-12 object-contain bg-gray-50 rounded-lg p-1 border" />
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-gray-900">{p.name}</div>
                        <div className="text-[11px] text-gray-400 line-clamp-1">{p.description}</div>
                      </td>
                      <td className="p-4">
                        <span className="bg-sky-50 text-[#007ea7] border border-sky-200 font-bold text-[10px] px-2.5 py-1 rounded-full uppercase">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-4 font-black text-[#003459]">${p.price?.toFixed(2)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="bg-sky-100 hover:bg-sky-200 text-[#007ea7] font-bold px-3 py-1.5 rounded-lg text-[11px] transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-3 py-1.5 rounded-lg text-[11px] transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#007ea7]">{o.id}</td>
                    <td className="p-4 font-semibold text-gray-900">{o.customerName || 'Anonymous Guest'}</td>
                    <td className="p-4 font-bold text-gray-700">{o.paymentMethod || 'KHQR'}</td>
                    <td className="p-4 font-black text-[#003459]">${o.totalAmount?.toFixed(2)}</td>
                    <td className="p-4">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] px-2.5 py-1 rounded-full">
                        {o.status || 'COMPLETED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modal for Add / Edit */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-2xl">
            <button
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingProduct(null);
              }}
              className="absolute top-4 right-4 text-gray-400 font-bold"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingProduct ? 'Edit Product Details' : 'Add New Inventory Product'}
            </h3>

            <form onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-xs text-black focus:outline-[#00a8e8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-xs text-black focus:outline-[#00a8e8]"
                  >
                    <option value="Phone">Phone</option>
                    <option value="Computer">Computer</option>
                    <option value="Tablet">Tablet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-xs text-black focus:outline-[#00a8e8]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700">Product Image (File Upload or URL)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-50 file:text-[#007ea7] hover:file:bg-sky-100 cursor-pointer"
                />
                <input
                  type="text"
                  placeholder="Or enter Image URL (http://...)"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-xs text-black focus:outline-[#00a8e8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-xs text-black focus:outline-[#00a8e8]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#febd69] hover:bg-[#f3a847] text-gray-900 font-black py-3 rounded-xl text-xs transition-all shadow-md mt-2"
              >
                {editingProduct ? 'Save & Update Product' : 'Create & Publish Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}