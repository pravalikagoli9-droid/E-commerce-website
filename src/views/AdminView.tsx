import React, { useState, useEffect } from 'react';
import type { Order, Product, Coupon, ContactRequest, AdminMetrics } from '../types';
import { useStore } from '../context/StoreContext';
import {
  Shield,
  Package,
  TrendingUp,
  Users,
  AlertTriangle,
  Plus,
  Trash2,
  Edit3,
  CheckCircle,
  Truck,
  Tag,
  MessageSquare,
  ArrowRight
} from 'lucide-react';

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
        <div className="w-12 h-12 bg-[#261515] text-[#C5A880] rounded-full flex items-center justify-center mx-auto">
          <Shield className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-3xl text-white">Restricted Atelier Access</h2>
        <p className="text-xs text-[#888] leading-relaxed">
          The Atelier Director portal is reserved exclusively for authenticated administrative curators.
        </p>
        <button
          onClick={() => quickLoginDemo('ADMIN')}
          className="w-full py-3 bg-[#F0ECE8] hover:bg-white text-black text-xs font-semibold uppercase tracking-[0.2em] transition-colors cursor-pointer"
        >
          Sign In as Atelier Director (Admin)
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
          trackingNumber: trackingNum || `WG-IND-${Math.floor(10000000 + Math.random() * 90000000)}`
        })
      });
      if (res.ok) {
        showToast(`Order status updated to ${status}.`, 'success');
        loadAdminData();
      }
    } catch (e) {
      showToast('Failed to update status.', 'error');
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
          description: newProdDesc || 'Artisanal atelier formulation.',
          notes: newProdNotes ? newProdNotes.split(',').map(s => s.trim()) : [],
          images: ['/src/assets/images/hero_luxury_boutique_1791824705943.jpg']
        })
      });
      if (res.ok) {
        showToast('New product inscribed into atelier collection.', 'success');
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
    if (!confirm('Archive and remove this creation from active catalog?')) return;
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
      showToast('Failed to delete.', 'error');
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
        showToast(`Privilege code "${newCoupCode.toUpperCase()}" generated.`, 'success');
        setShowAddCoupon(false);
        setNewCoupCode('');
        loadAdminData();
      }
    } catch {
      showToast('Error creating coupon.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1C1C1C] pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-[#C5A880]">
            <Shield className="w-3.5 h-3.5" />
            <span>Directeur de l'Atelier</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-white mt-1">
            Atelier Administrative Console
          </h1>
        </div>

        <button
          onClick={loadAdminData}
          className="px-4 py-2 border border-[#333] hover:border-white text-xs uppercase tracking-wider text-white"
        >
          Refresh Ledgers
        </button>
      </div>

      {/* Navigation Tabs (Zero Pill) */}
      <div className="flex flex-wrap border-b border-[#1C1C1C] gap-6 text-xs uppercase tracking-[0.18em]">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'metrics'
              ? 'text-white border-b-2 border-[#F0ECE8] font-medium'
              : 'text-[#777] hover:text-white'
          }`}
        >
          Overview & Financials
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'orders'
              ? 'text-white border-b-2 border-[#F0ECE8] font-medium'
              : 'text-[#777] hover:text-white'
          }`}
        >
          Orders & Fulfillment ({adminOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'products'
              ? 'text-white border-b-2 border-[#F0ECE8] font-medium'
              : 'text-[#777] hover:text-white'
          }`}
        >
          Catalog Management ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'coupons'
              ? 'text-white border-b-2 border-[#F0ECE8] font-medium'
              : 'text-[#777] hover:text-white'
          }`}
        >
          Privilege Codes ({adminCoupons.length})
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'inquiries'
              ? 'text-white border-b-2 border-[#F0ECE8] font-medium'
              : 'text-[#777] hover:text-white'
          }`}
        >
          Consultation Requests ({inquiries.length})
        </button>
      </div>

      {/* 1. OVERVIEW & FINANCIALS */}
      {activeTab === 'metrics' && (
        <div className="space-y-8">
          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-[#0A0A0A] border border-[#1F1F1F] space-y-2">
              <span className="text-[11px] tracking-wider uppercase text-[#888]">Gross Acquisitions</span>
              <p className="font-mono text-3xl text-[#C5A880] tabular-nums">
                ₹{metrics?.totalSales ? metrics.totalSales.toLocaleString('en-IN') : '0'}
              </p>
              <span className="text-[11px] text-[#666]">Verified settled orders</span>
            </div>

            <div className="p-6 bg-[#0A0A0A] border border-[#1F1F1F] space-y-2">
              <span className="text-[11px] tracking-wider uppercase text-[#888]">Total Orders</span>
              <p className="font-mono text-3xl text-white tabular-nums">
                {metrics?.totalOrders || 0}
              </p>
              <span className="text-[11px] text-[#666]">Lifetime ledger transactions</span>
            </div>

            <div className="p-6 bg-[#0A0A0A] border border-[#1F1F1F] space-y-2">
              <span className="text-[11px] tracking-wider uppercase text-[#888]">Inscribed Patrons</span>
              <p className="font-mono text-3xl text-white tabular-nums">
                {metrics?.totalCustomers || 0}
              </p>
              <span className="text-[11px] text-[#666]">Client sanctuary accounts</span>
            </div>

            <div className="p-6 bg-[#0A0A0A] border border-[#1F1F1F] space-y-2">
              <span className="text-[11px] tracking-wider uppercase text-[#888]">Inventory Alerts</span>
              <p className="font-mono text-3xl text-[#A86464] tabular-nums">
                {metrics?.lowStockProducts || 0}
              </p>
              <span className="text-[11px] text-[#666]">Formulations with ≤10 units</span>
            </div>
          </div>

          {/* Recent Orders Preview */}
          <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-6 space-y-4">
            <h2 className="font-serif text-xl text-white">Recent Transactions</h2>
            <div className="divide-y divide-[#181818]">
              {adminOrders.slice(0, 5).map(o => (
                <div key={o.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono text-white font-medium">#{o.orderNumber}</span>
                    <span className="text-[#888] ml-3">{o.customerName}</span>
                    <span className="text-[#666] ml-2">({o.items.length} items)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[#C5A880] font-mono tabular-nums">
                      ₹{o.totalAmount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 border border-[#333]">
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
          <div className="divide-y divide-[#181818] bg-[#0A0A0A] border border-[#1F1F1F]">
            {adminOrders.map(order => (
              <div key={order.id} className="p-6 space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#141414] pb-3">
                  <div>
                    <span className="font-mono text-base text-white font-semibold">
                      Order #{order.orderNumber}
                    </span>
                    <span className="text-[#888] ml-3">
                      {order.customerName} ({order.customerEmail})
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-base text-[#C5A880] tabular-nums">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </span>
                    <span className="font-mono text-[11px] uppercase px-2 py-0.5 border border-[#333] text-white">
                      {order.paymentStatus} · {order.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Items & Shipping Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#AAA]">
                  <div>
                    <span className="text-white block mb-1">Acquisitions:</span>
                    <ul className="space-y-1">
                      {order.items.map((it, idx) => (
                        <li key={idx}>
                          {it.quantity}x {it.productName} ({it.selectedVariant || 'Standard'}) - ₹{it.price.toLocaleString('en-IN')}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="text-white block mb-1">Delivery Destination:</span>
                    <p>{order.shippingAddress.addressLine1}, {order.shippingAddress.city} - {order.shippingAddress.postalCode}</p>
                    <p>Contact: {order.shippingAddress.phone}</p>
                  </div>
                </div>

                {/* Status action control */}
                <div className="pt-3 border-t border-[#141414] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[#888]">Update Fulfillment Status:</span>
                    <button
                      onClick={() => handleUpdateOrderStatus(order.id, 'PROCESSING')}
                      className={`px-3 py-1 border text-[11px] uppercase font-mono ${
                        order.orderStatus === 'PROCESSING' ? 'bg-[#333] text-white border-white' : 'border-[#333] text-[#888]'
                      }`}
                    >
                      Processing
                    </button>
                    <button
                      onClick={() => handleUpdateOrderStatus(order.id, 'SHIPPED')}
                      className={`px-3 py-1 border text-[11px] uppercase font-mono ${
                        order.orderStatus === 'SHIPPED' ? 'bg-[#C5A880] text-black border-[#C5A880]' : 'border-[#333] text-[#888]'
                      }`}
                    >
                      Shipped
                    </button>
                    <button
                      onClick={() => handleUpdateOrderStatus(order.id, 'DELIVERED')}
                      className={`px-3 py-1 border text-[11px] uppercase font-mono ${
                        order.orderStatus === 'DELIVERED' ? 'bg-[#64B587] text-black border-[#64B587]' : 'border-[#333] text-[#888]'
                      }`}
                    >
                      Delivered
                    </button>
                  </div>

                  {order.trackingNumber && (
                    <span className="font-mono text-[#888]">
                      Waybill: <strong className="text-white">{order.trackingNumber}</strong>
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
            <h2 className="font-serif text-xl text-white">Atelier Catalog Items</h2>
            <button
              onClick={() => setShowAddProduct(!showAddProduct)}
              className="px-4 py-2 bg-[#F0ECE8] hover:bg-white text-black text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Inscribe New Creation</span>
            </button>
          </div>

          {showAddProduct && (
            <form onSubmit={handleCreateProduct} className="p-6 bg-[#0D0D0D] border border-[#2B2B2B] space-y-4 text-xs max-w-2xl">
              <h3 className="font-serif text-lg text-white">Inscribe New Creation</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#AAA] mb-1">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cuir Impérial Extrait"
                    value={newProdName}
                    onChange={e => setNewProdName(e.target.value)}
                    className="w-full bg-[#141414] border border-[#2B2B2B] px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#AAA] mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={e => setNewProdCategory(e.target.value)}
                    className="w-full bg-[#141414] border border-[#2B2B2B] px-3 py-2 text-white"
                  >
                    <option value="cat_fragrances">Haute Parfumerie</option>
                    <option value="cat_apparel">Sartorial Wardrobe</option>
                    <option value="cat_skincare">Botanical Skincare</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#AAA] mb-1">Price (₹ INR)</label>
                  <input
                    type="number"
                    required
                    placeholder="21000"
                    value={newProdPrice}
                    onChange={e => setNewProdPrice(e.target.value)}
                    className="w-full bg-[#141414] border border-[#2B2B2B] px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#AAA] mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={e => setNewProdStock(e.target.value)}
                    className="w-full bg-[#141414] border border-[#2B2B2B] px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#AAA] mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Atmospheric narrative and formulation details..."
                  value={newProdDesc}
                  onChange={e => setNewProdDesc(e.target.value)}
                  className="w-full bg-[#141414] border border-[#2B2B2B] px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-[#AAA] mb-1">Notes / Ingredients (comma-separated)</label>
                <input
                  type="text"
                  placeholder="Top: Bergamot, Heart: Leather, Base: Birch Tar"
                  value={newProdNotes}
                  onChange={e => setNewProdNotes(e.target.value)}
                  className="w-full bg-[#141414] border border-[#2B2B2B] px-3 py-2 text-white"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#F0ECE8] text-black uppercase tracking-wider font-semibold"
                >
                  Save Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="px-4 py-2 border border-[#333] text-[#888] uppercase tracking-wider"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Table of Products */}
          <div className="divide-y divide-[#181818] bg-[#0A0A0A] border border-[#1F1F1F]">
            {products.map(prod => (
              <div key={prod.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-14 bg-[#141414] border border-[#222] overflow-hidden shrink-0">
                    <img
                      src={prod.images[0] || ''}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm text-white">{prod.name}</h4>
                    <p className="text-[#888]">{prod.categoryName} · SKU: {prod.sku}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <span className="font-mono text-white tabular-nums">
                    ₹{prod.price.toLocaleString('en-IN')}
                  </span>
                  <span className={`font-mono tabular-nums ${prod.stock <= 10 ? 'text-[#A86464]' : 'text-[#888]'}`}>
                    Stock: {prod.stock}
                  </span>
                  <button
                    onClick={() => handleDeleteProduct(prod.id)}
                    className="text-[#666] hover:text-[#A86464] p-1.5"
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

      {/* 4. PRIVILEGE CODES (COUPONS) */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-serif text-xl text-white">Privilege Codes & Concessions</h2>
            <button
              onClick={() => setShowAddCoupon(!showAddCoupon)}
              className="px-4 py-2 bg-[#F0ECE8] hover:bg-white text-black text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Generate Privilege Code</span>
            </button>
          </div>

          {showAddCoupon && (
            <form onSubmit={handleCreateCoupon} className="p-6 bg-[#0D0D0D] border border-[#2B2B2B] space-y-4 text-xs max-w-md">
              <h3 className="font-serif text-lg text-white">New Privilege Code</h3>
              <div>
                <label className="block text-[#AAA] mb-1">Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP25"
                  value={newCoupCode}
                  onChange={e => setNewCoupCode(e.target.value)}
                  className="w-full bg-[#141414] border border-[#2B2B2B] px-3 py-2 text-white font-mono uppercase"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#AAA] mb-1">Discount %</label>
                  <input
                    type="number"
                    required
                    value={newCoupDiscount}
                    onChange={e => setNewCoupDiscount(e.target.value)}
                    className="w-full bg-[#141414] border border-[#2B2B2B] px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#AAA] mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    required
                    value={newCoupMinOrder}
                    onChange={e => setNewCoupMinOrder(e.target.value)}
                    className="w-full bg-[#141414] border border-[#2B2B2B] px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#F0ECE8] text-black uppercase tracking-wider font-semibold"
                >
                  Create Code
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCoupon(false)}
                  className="px-4 py-2 border border-[#333] text-[#888] uppercase tracking-wider"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="divide-y divide-[#181818] bg-[#0A0A0A] border border-[#1F1F1F]">
            {adminCoupons.map(c => (
              <div key={c.id} className="p-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <Tag className="w-4 h-4 text-[#C5A880]" />
                  <span className="font-mono text-sm text-white font-semibold">{c.code}</span>
                  <span className="text-[#888]">{c.discountValue}% OFF (Min ₹{c.minOrder.toLocaleString('en-IN')})</span>
                </div>
                <div className="flex items-center gap-4 text-[#777] font-mono">
                  <span>Expires: {c.expiryDate}</span>
                  <span className="text-[#64B587] border border-[#64B587]/30 px-2 py-0.5">
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
          <h2 className="font-serif text-xl text-white">Private Client Inquiries</h2>
          <div className="divide-y divide-[#181818] bg-[#0A0A0A] border border-[#1F1F1F]">
            {inquiries.length === 0 ? (
              <p className="p-8 text-xs text-[#888] text-center">No inquiries currently pending.</p>
            ) : (
              inquiries.map(req => (
                <div key={req.id} className="p-6 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-base text-white">{req.name}</span>
                    <span className="text-[#666] font-mono">{new Date(req.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-[#C5A880]">{req.subject} ({req.email})</p>
                  <p className="text-[#AAA] leading-relaxed pt-1">"{req.message}"</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
