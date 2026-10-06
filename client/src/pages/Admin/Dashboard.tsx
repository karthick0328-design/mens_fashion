import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  DollarSign,
  ShoppingBag,
  Package,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import api from '../../services/api';

export const AdminDashboard: React.FC = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['adminAnalytics'],
    queryFn: async () => {
      const res = await api.get('/admin/analytics/dashboard');
      return res.data?.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-neutral-800 rounded w-1/4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 bg-neutral-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const kpis = analytics?.kpis || {
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 80,
    lowStockCount: 0,
  };

  const lowStockAlerts = analytics?.lowStockAlerts || [];
  const recentOrders = analytics?.recentOrders || [];
  const salesChart = analytics?.salesChart || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-xs">
      {/* Page Title */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400 block mb-1">
          Executive Overview
        </span>
        <h1 className="text-2xl font-extrabold uppercase tracking-tight font-serif-luxury text-white">
          Atelier Analytics & Operations
        </h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="font-semibold uppercase text-[11px] tracking-wider">Total Sales</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            ₹{kpis.totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center space-x-1 text-emerald-400 text-[11px]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Server-verified transactional total</span>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="font-semibold uppercase text-[11px] tracking-wider">Orders Placed</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{kpis.totalOrders}</div>
          <div className="text-neutral-400 text-[11px]">All order fulfillment stages</div>
        </div>

        {/* Active Products */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="font-semibold uppercase text-[11px] tracking-wider">Live Catalog</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{kpis.totalProducts}</div>
          <div className="text-neutral-400 text-[11px]">Active fashion products</div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="font-semibold uppercase text-[11px] tracking-wider">Stock Alerts</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{kpis.lowStockCount}</div>
          <div className="text-neutral-400 text-[11px]">Variants with stock ≤ 5 units</div>
        </div>
      </div>

      {/* Sales Velocity Chart */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 shadow-lg space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-white">
          Weekly Sales Velocity
        </h2>
        <div className="grid grid-cols-7 gap-2 pt-6 items-end h-40">
          {salesChart.map((item: any) => (
            <div key={item.day} className="flex flex-col items-center space-y-2 h-full justify-end">
              <span className="text-[10px] text-amber-400 font-mono">₹{(item.sales / 1000).toFixed(0)}k</span>
              <div
                className="w-full bg-amber-500 hover:bg-amber-400 rounded-t transition-all"
                style={{ height: `${Math.min(100, Math.max(20, (item.sales / 50000) * 100))}%` }}
              />
              <span className="text-[11px] font-bold text-neutral-400">{item.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Columns: Low Stock Products & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Low Stock SKUs */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Low Inventory Watchlist</span>
            </h2>
            <Link to="/admin/inventory" className="text-amber-400 hover:underline text-[11px] font-bold uppercase">
              Manage All
            </Link>
          </div>

          <div className="divide-y divide-neutral-900 overflow-x-auto">
            {lowStockAlerts.length === 0 ? (
              <p className="py-4 text-neutral-500 text-center">No inventory alerts.</p>
            ) : (
              lowStockAlerts.slice(0, 5).map((alert: any) => (
                <div key={alert.sku} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src={alert.image} alt={alert.title} className="w-10 h-12 object-cover rounded bg-neutral-900" />
                    <div>
                      <span className="font-bold text-white block truncate max-w-[200px]">{alert.title}</span>
                      <span className="text-[11px] text-neutral-400">
                        {alert.color} | Size: {alert.size} • <span className="font-mono">{alert.sku}</span>
                      </span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                    alert.stock === 0 ? 'bg-rose-950 text-rose-300' : 'bg-amber-950 text-amber-300'
                  }`}>
                    {alert.stock === 0 ? 'Out of Stock' : `${alert.stock} left`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Recent Transactions
            </h2>
            <Link to="/admin/orders" className="text-amber-400 hover:underline text-[11px] font-bold uppercase">
              View All
            </Link>
          </div>

          <div className="divide-y divide-neutral-900 overflow-x-auto">
            {recentOrders.length === 0 ? (
              <p className="py-4 text-neutral-500 text-center">No recent orders yet.</p>
            ) : (
              recentOrders.map((ord: any) => (
                <div key={ord._id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-white block">{ord.orderNumber}</span>
                    <span className="text-[11px] text-neutral-400">
                      {ord.userId?.name || 'Customer'} • {new Date(ord.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-white block">
                      ₹{ord.pricing?.totalAmount?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-amber-400">
                      {ord.orderStatus}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
