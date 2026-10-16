import React, { useState, useEffect } from 'react';
import type { Order, Product, Coupon, ContactRequest, AdminMetrics } from '../types';
import { useStore } from '../context/StoreContext';
import {
  Shield,
  Plus,
  Trash2,
  Tag
} from 'lucide-react';
import { getProductImageUrl, handleImageError } from '../utils/imageUrl';

export const AdminView: React.FC = () => {
  const { user, token, quickLoginDemo, showToast, refreshProducts, products } = useStore();

  const [activeTab, setActiveTab] = useState<'metrics' | 'orders' | 'products' | 'coupons' | 'inquiries'>('metrics');

  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [adminOrders, setAdminOrders] = useState<Order[]>([]);
  const [adminCustomers, setAdminCustomers] = useState<any[]>([]);
  const [adminCoupons, setAdminCoupons] = useState<Coupon[]>([]);
  const [inquiries, setInquiries] = useState<ContactRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Product Modal / Form
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('cat_fragrances');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('15');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdNotes, setNewProdNotes] = useState('');

  // New Coupon Form
  const [showAddCoupon, setShowAddCoupon] = useState(false);
  const [newCoupCode, setNewCoupCode] = useState('');
  const [newCoupDiscount, setNewCoupDiscount] = useState('15');
  const [newCoupMinOrder, setNewCoupMinOrder] = useState('5000');

  const loadAdminData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [mRes, oRes, cRes, coupRes, inqRes] = await Promise.all([
        fetch('/api/admin/metrics', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/orders', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/customers', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/coupons', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/contact-requests', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (mRes.ok) {
        const mData = await mRes.json();
        setMetrics(mData.metrics);
      }
      if (oRes.ok) {
        const oData = await oRes.json();
        setAdminOrders(oData.orders || []);
      }
      if (cRes.ok) {
        const cData = await cRes.json();
        setAdminCustomers(cData.customers || []);
      }
      if (coupRes.ok) {
        const coupData = await coupRes.json();
        setAdminCoupons(coupData.coupons || []);
      }
      if (inqRes.ok) {
        const inqData = await inqRes.json();
        setInquiries(inqData.contactRequests || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      loadAdminData();
    }
  }, [user, token]);

  if (user?.role !== 'ADMIN') {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-12 h-12 bg-[#FAF7F2] border border-[#E8DED4] text-[#C9878D] rounded-full flex items-center justify-center mx-auto">
          <Shield className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-3xl text-[#392C2A]">Restricted Administrator Access</h2>
        <p className="text-xs text-[#7D6B67] leading-relaxed">
          The Store Administrator portal is reserved for authenticated staff members.
        </p>
        <button
          onClick={() => quickLoginDemo('ADMIN')}
          className="w-full py-3 bg-[#C9878D] hover:bg-[#B56F75] text-white text-xs font-semibold uppercase tracking-[0.2em] transition-colors cursor-pointer rounded-sm shadow-xs"
        >
          Sign In as Store Administrator
        </button>
      </div>
    );
  }

  const handleUpdateOrderStatus = async (orderId: string, status: string, trackingNum?: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          orderStatus: status,
          trackingNumber: trackingNum || `BD-IND-${Math.floor(10000000 + Math.random() * 90000000)}`
        })
      });
      if (res.ok) {
        showToast(`Order status updated to ${status}.`, 'success');
        loadAdminData();
      }
    } catch (e) {
      showToast('Failed to update order status.', 'error');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newProdName,
          categoryId: newProdCategory,
          price: newProdPrice,
          stock: newProdStock,
          description: newProdDesc || 'Artisanal luxury formulation.',
          notes: newProdNotes ? newProdNotes.split(',').map(s => s.trim()) : [],
          images: ['/images/hero_luxury_boutique_1791824705943.jpg']
        })
      });
      if (res.ok) {
        showToast('New product added to catalog.', 'success');
        setShowAddProduct(false);
        setNewProdName('');
        setNewProdPrice('');
        setNewProdDesc('');
        setNewProdNotes('');
        refreshProducts();
        loadAdminData();
      }
    } catch {
      showToast('Error creating product.', 'error');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Remove this product from the active catalog?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        showToast('Product removed from catalog.', 'info');
        refreshProducts();
        loadAdminData();
      }
    } catch {
      showToast('Failed to delete product.', 'error');
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupCode || !newCoupDiscount) return;
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          code: newCoupCode,
          discountType: 'PERCENT',
          discountValue: newCoupDiscount,
          minOrder: newCoupMinOrder,
          expiryDate: '2027-12-31'
        })
      });
      if (res.ok) {
        showToast(`Promo code "${newCoupCode.toUpperCase()}" generated.`, 'success');
        setShowAddCoupon(false);
        setNewCoupCode('');
        loadAdminData();
      }
    } catch {
      showToast('Error creating promo code.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E8DED4] pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-[#C9878D] font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>Store Administrator</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#392C2A] mt-1">
            Admin Management Console
          </h1>
        </div>

        <button
          onClick={loadAdminData}
          className="px-4 py-2 border border-[#E8DED4] hover:border-[#C9878D] text-xs uppercase tracking-wider text-[#392C2A] rounded-xs cursor-pointer bg-[#FFFDF9]"
        >
          Refresh Data
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap border-b border-[#E8DED4] gap-6 text-xs uppercase tracking-[0.18em]">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'metrics'
              ? 'text-[#392C2A] border-b-2 border-[#C9878D] font-semibold'
              : 'text-[#7D6B67] hover:text-[#392C2A]'
          }`}
        >
          Overview & Sales
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'orders'
              ? 'text-[#392C2A] border-b-2 border-[#C9878D] font-semibold'
              : 'text-[#7D6B67] hover:text-[#392C2A]'
          }`}
        >
          Orders & Fulfillment ({adminOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'products'
              ? 'text-[#392C2A] border-b-2 border-[#C9878D] font-semibold'
              : 'text-[#7D6B67] hover:text-[#392C2A]'
          }`}
        >
          Products Catalog ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'coupons'
              ? 'text-[#392C2A] border-b-2 border-[#C9878D] font-semibold'
              : 'text-[#7D6B67] hover:text-[#392C2A]'
          }`}
        >
          Promo Codes ({adminCoupons.length})
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'inquiries'
              ? 'text-[#392C2A] border-b-2 border-[#C9878D] font-semibold'
              : 'text-[#7D6B67] hover:text-[#392C2A]'
          }`}
        >
          Customer Inquiries ({inquiries.length})
        </button>
      </div>

      {/* 1. OVERVIEW & SALES */}
      {activeTab === 'metrics' && (
        <div className="space-y-8">
          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-[#FFFDF9] border border-[#E8DED4] space-y-2 rounded-sm shadow-xs">
              <span className="text-[11px] tracking-wider uppercase text-[#7D6B67] font-semibold">Gross Sales</span>
              <p className="font-mono text-3xl text-[#392C2A] tabular-nums font-bold">
                ₹{metrics?.totalSales ? metrics.totalSales.toLocaleString('en-US') : '0'}
              </p>
              <span className="text-[11px] text-[#7D6B67]">Verified completed orders</span>
            </div>

            <div className="p-6 bg-[#FFFDF9] border border-[#E8DED4] space-y-2 rounded-sm shadow-xs">
              <span className="text-[11px] tracking-wider uppercase text-[#7D6B67] font-semibold">Total Orders</span>
              <p className="font-mono text-3xl text-[#392C2A] tabular-nums font-bold">
                {metrics?.totalOrders || 0}
              </p>
              <span className="text-[11px] text-[#7D6B67]">Lifetime customer transactions</span>
            </div>

            <div className="p-6 bg-[#FFFDF9] border border-[#E8DED4] space-y-2 rounded-sm shadow-xs">
              <span className="text-[11px] tracking-wider uppercase text-[#7D6B67] font-semibold">Registered Customers</span>
              <p className="font-mono text-3xl text-[#392C2A] tabular-nums font-bold">
                {metrics?.totalCustomers || 0}
              </p>
              <span className="text-[11px] text-[#7D6B67]">Active member accounts</span>
            </div>

            <div className="p-6 bg-[#FFFDF9] border border-[#E8DED4] space-y-2 rounded-sm shadow-xs">
              <span className="text-[11px] tracking-wider uppercase text-[#7D6B67] font-semibold">Inventory Alerts</span>
              <p className="font-mono text-3xl text-[#D97979] tabular-nums font-bold">
                {metrics?.lowStockProducts || 0}
              </p>
              <span className="text-[11px] text-[#7D6B67]">Products with ≤10 units in stock</span>
            </div>
          </div>

          {/* Recent Orders Preview */}
          <div className="bg-[#FFFDF9] border border-[#E8DED4] p-6 space-y-4 rounded-sm shadow-xs">
            <h2 className="font-serif text-xl text-[#392C2A]">Recent Orders</h2>
            <div className="divide-y divide-[#E8DED4]">
              {adminOrders.slice(0, 5).map(o => (
                <div key={o.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono text-[#392C2A] font-semibold">#{o.orderNumber}</span>
                    <span className="text-[#7D6B67] ml-3">{o.customerName}</span>
                    <span className="text-[#7D6B67] ml-2">({o.items.length} items)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[#392C2A] font-mono tabular-nums font-bold">
                      ₹{o.totalAmount.toLocaleString('en-US')}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 border border-[#E8DED4] text-[#392C2A] bg-[#FAF7F2] rounded-xs">
                      {o.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. ORDERS & FULFILLMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="divide-y divide-[#E8DED4] bg-[#FFFDF9] border border-[#E8DED4] rounded-sm shadow-xs">
            {adminOrders.map(order => (
              <div key={order.id} className="p-6 space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DED4] pb-3">
                  <div>
                    <span className="font-mono text-base text-[#392C2A] font-semibold">
                      Order #{order.orderNumber}
                    </span>
                    <span className="text-[#7D6B67] ml-3">
                      {order.customerName} ({order.customerEmail})
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-base text-[#392C2A] tabular-nums font-bold">
                      ₹{order.totalAmount.toLocaleString('en-US')}
                    </span>
                    <span className="font-mono text-[11px] uppercase px-2 py-0.5 border border-[#E8DED4] text-[#392C2A] bg-[#FAF7F2] rounded-xs font-semibold">
                      {order.paymentStatus} · {order.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Items & Shipping Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#7D6B67]">
                  <div>
                    <span className="text-[#392C2A] font-semibold block mb-1">Products:</span>
                    <ul className="space-y-1">
                      {order.items.map((it, idx) => (
                        <li key={idx}>
                          {it.quantity}x {it.productName} ({it.selectedVariant || 'Standard'}) - ₹{it.price.toLocaleString('en-US')}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="text-[#392C2A] font-semibold block mb-1">Shipping Address:</span>
                    <p>{order.shippingAddress.addressLine1}, {order.shippingAddress.city} - {order.shippingAddress.postalCode}</p>
                    <p>Contact: {order.shippingAddress.phone}</p>
                  </div>
                </div>

                {/* Status action control */}
                <div className="pt-3 border-t border-[#E8DED4] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[#7D6B67]">Update Status:</span>
                    <button
                      onClick={() => handleUpdateOrderStatus(order.id, 'PROCESSING')}
                      className={`px-3 py-1 border text-[11px] uppercase font-mono cursor-pointer rounded-xs ${
                        order.orderStatus === 'PROCESSING' ? 'bg-[#392C2A] text-white border-[#392C2A]' : 'border-[#E8DED4] text-[#7D6B67]'
                      }`}
                    >
                      Processing
                    </button>
                    <button
                      onClick={() => handleUpdateOrderStatus(order.id, 'SHIPPED')}
                      className={`px-3 py-1 border text-[11px] uppercase font-mono cursor-pointer rounded-xs ${
                        order.orderStatus === 'SHIPPED' ? 'bg-[#C9878D] text-white border-[#C9878D]' : 'border-[#E8DED4] text-[#7D6B67]'
                      }`}
                    >
                      Shipped
                    </button>
                    <button
                      onClick={() => handleUpdateOrderStatus(order.id, 'DELIVERED')}
                      className={`px-3 py-1 border text-[11px] uppercase font-mono cursor-pointer rounded-xs ${
                        order.orderStatus === 'DELIVERED' ? 'bg-[#3E7B54] text-white border-[#3E7B54]' : 'border-[#E8DED4] text-[#7D6B67]'
                      }`}
                    >
                      Delivered
                    </button>
                  </div>

                  {order.trackingNumber && (
                    <span className="font-mono text-[#7D6B67]">
                      Tracking: <strong className="text-[#392C2A]">{order.trackingNumber}</strong>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. CATALOG MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-serif text-xl text-[#392C2A]">Catalog Products</h2>
            <button
              onClick={() => setShowAddProduct(!showAddProduct)}
              className="px-4 py-2 bg-[#C9878D] hover:bg-[#B56F75] text-white text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors cursor-pointer rounded-sm shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Product</span>
            </button>
          </div>

          {showAddProduct && (
            <form onSubmit={handleCreateProduct} className="p-6 bg-[#FFFDF9] border border-[#E8DED4] space-y-4 text-xs max-w-2xl rounded-sm shadow-xs">
              <h3 className="font-serif text-lg text-[#392C2A]">Add New Product</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#7D6B67] mb-1 font-semibold uppercase">Product Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amber Blanc Extrait"
                    value={newProdName}
                    onChange={e => setNewProdName(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3 py-2 text-[#392C2A] rounded-sm focus:border-[#C9878D]"
                  />
                </div>
                <div>
                  <label className="block text-[#7D6B67] mb-1 font-semibold uppercase">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={e => setNewProdCategory(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3 py-2 text-[#392C2A] rounded-sm focus:border-[#C9878D]"
                  >
                    <option value="cat_fragrances">Luxury Fragrances</option>
                    <option value="cat_apparel">Lifestyle & Apparel</option>
                    <option value="cat_skincare">Botanical Skincare</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#7D6B67] mb-1 font-semibold uppercase">Price (₹ INR)</label>
                  <input
                    type="number"
                    required
                    placeholder="21000"
                    value={newProdPrice}
                    onChange={e => setNewProdPrice(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3 py-2 text-[#392C2A] font-mono rounded-sm focus:border-[#C9878D]"
                  />
                </div>
                <div>
                  <label className="block text-[#7D6B67] mb-1 font-semibold uppercase">Initial Stock</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={e => setNewProdStock(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3 py-2 text-[#392C2A] font-mono rounded-sm focus:border-[#C9878D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#7D6B67] mb-1 font-semibold uppercase">Description</label>
                <textarea
                  rows={2}
                  placeholder="Detailed product notes and formulation description..."
                  value={newProdDesc}
                  onChange={e => setNewProdDesc(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3 py-2 text-[#392C2A] rounded-sm focus:border-[#C9878D]"
                />
              </div>

              <div>
                <label className="block text-[#7D6B67] mb-1 font-semibold uppercase">Notes / Key Ingredients (comma-separated)</label>
                <input
                  type="text"
                  placeholder="Top: Bergamot, Heart: Leather, Base: Birch Tar"
                  value={newProdNotes}
                  onChange={e => setNewProdNotes(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3 py-2 text-[#392C2A] rounded-sm focus:border-[#C9878D]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#C9878D] hover:bg-[#B56F75] text-white uppercase tracking-wider font-semibold rounded-sm shadow-xs cursor-pointer"
                >
                  Save Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="px-4 py-2 border border-[#E8DED4] text-[#7D6B67] uppercase tracking-wider rounded-sm cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Table of Products */}
          <div className="divide-y divide-[#E8DED4] bg-[#FFFDF9] border border-[#E8DED4] rounded-sm shadow-xs">
            {products.map(prod => (
              <div key={prod.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-14 bg-[#FAF7F2] border border-[#E8DED4] overflow-hidden shrink-0 rounded-xs">
                    <img
                      src={getProductImageUrl(prod.images?.[0])}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      onError={handleImageError}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm text-[#392C2A] font-medium">{prod.name}</h4>
                    <p className="text-[#7D6B67]">{prod.categoryName} · SKU: {prod.sku}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <span className="font-mono text-[#392C2A] tabular-nums font-semibold">
                    ₹{prod.price.toLocaleString('en-US')}
                  </span>
                  <span className={`font-mono tabular-nums ${prod.stock <= 10 ? 'text-[#D97979] font-semibold' : 'text-[#7D6B67]'}`}>
                    Stock: {prod.stock}
                  </span>
                  <button
                    onClick={() => handleDeleteProduct(prod.id)}
                    className="text-[#7D6B67] hover:text-[#D97979] p-1.5 cursor-pointer"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. PROMO CODES */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-serif text-xl text-[#392C2A]">Promo Codes & Discounts</h2>
            <button
              onClick={() => setShowAddCoupon(!showAddCoupon)}
              className="px-4 py-2 bg-[#C9878D] hover:bg-[#B56F75] text-white text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 rounded-sm shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Promo Code</span>
            </button>
          </div>

          {showAddCoupon && (
            <form onSubmit={handleCreateCoupon} className="p-6 bg-[#FFFDF9] border border-[#E8DED4] space-y-4 text-xs max-w-md rounded-sm shadow-xs">
              <h3 className="font-serif text-lg text-[#392C2A]">New Promo Code</h3>
              <div>
                <label className="block text-[#7D6B67] mb-1 font-semibold uppercase">Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP25"
                  value={newCoupCode}
                  onChange={e => setNewCoupCode(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3 py-2 text-[#392C2A] font-mono uppercase rounded-sm focus:border-[#C9878D]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#7D6B67] mb-1 font-semibold uppercase">Discount %</label>
                  <input
                    type="number"
                    required
                    value={newCoupDiscount}
                    onChange={e => setNewCoupDiscount(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3 py-2 text-[#392C2A] font-mono rounded-sm focus:border-[#C9878D]"
                  />
                </div>
                <div>
                  <label className="block text-[#7D6B67] mb-1 font-semibold uppercase">Min Order (₹)</label>
                  <input
                    type="number"
                    required
                    value={newCoupMinOrder}
                    onChange={e => setNewCoupMinOrder(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3 py-2 text-[#392C2A] font-mono rounded-sm focus:border-[#C9878D]"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#C9878D] hover:bg-[#B56F75] text-white uppercase tracking-wider font-semibold rounded-sm shadow-xs cursor-pointer"
                >
                  Create Code
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCoupon(false)}
                  className="px-4 py-2 border border-[#E8DED4] text-[#7D6B67] uppercase tracking-wider rounded-sm cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="divide-y divide-[#E8DED4] bg-[#FFFDF9] border border-[#E8DED4] rounded-sm shadow-xs">
            {adminCoupons.map(c => (
              <div key={c.id} className="p-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <Tag className="w-4 h-4 text-[#C9878D]" />
                  <span className="font-mono text-sm text-[#392C2A] font-semibold">{c.code}</span>
                  <span className="text-[#7D6B67]">{c.discountValue}% OFF (Min ₹{c.minOrder.toLocaleString('en-US')})</span>
                </div>
                <div className="flex items-center gap-4 text-[#7D6B67] font-mono">
                  <span>Expires: {c.expiryDate}</span>
                  <span className="text-[#3E7B54] border border-[#3E7B54]/30 px-2 py-0.5 rounded-xs">
                    {c.active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. CONSULTATION INQUIRIES */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          <h2 className="font-serif text-xl text-[#392C2A]">Customer Inquiries</h2>
          <div className="divide-y divide-[#E8DED4] bg-[#FFFDF9] border border-[#E8DED4] rounded-sm shadow-xs">
            {inquiries.length === 0 ? (
              <p className="p-8 text-xs text-[#7D6B67] text-center">No inquiries currently received.</p>
            ) : (
              inquiries.map(req => (
                <div key={req.id} className="p-6 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-base text-[#392C2A] font-medium">{req.name}</span>
                    <span className="text-[#7D6B67] font-mono">{new Date(req.createdAt).toLocaleDateString('en-US')}</span>
                  </div>
                  <p className="text-[#C9878D] font-medium">{req.subject} ({req.email})</p>
                  <p className="text-[#7D6B67] leading-relaxed pt-1">"{req.message}"</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
