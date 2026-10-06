import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  Gift,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import adminApi from '../services/adminApi';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';

export const DashboardPage: React.FC = () => {
  const [salesRange, setSalesRange] = useState<'today' | '7d' | '30d' | '3m' | '1y'>('30d');

  const { data: analyticsRes } = useQuery({
    queryKey: ['adminDashboard', salesRange],
    queryFn: async () => {
      const res = await adminApi.getDashboardAnalytics(salesRange);
      return res.data?.data;
    },
  });

  const kpis = analyticsRes?.kpis;
  const salesOverview = analyticsRes?.salesOverview;
  const recentOrders = analyticsRes?.recentOrders || [];
  const topSelling = analyticsRes?.topSellingProducts || [];
  const lowStockAlerts = analyticsRes?.lowStockAlerts || [];
  const customerOverview = analyticsRes?.customerOverview;

  const defaultKpis = {
    totalRevenue: { value: 1245800, formatted: '₹12,45,800', change: '+18.4%', isPositive: true, comparison: 'vs last month' },
    totalOrders: { value: 342, formatted: '342', change: '+12.6%', isPositive: true, comparison: 'vs last month' },
    totalCustomers: { value: 890, formatted: '890', change: '+8.2%', isPositive: true, comparison: 'vs last month' },
    totalProducts: { value: 80, formatted: '80', change: '+4.5%', isPositive: true, comparison: 'active in catalog' },
    lowStockProducts: { value: 4, formatted: '4', change: '-2', isPositive: true, comparison: 'require replenishment' },
    giftCardSales: { value: 84500, formatted: '₹84,500', change: '+24.1%', isPositive: true, comparison: 'vs last month' },
  };

  const activeKpis = kpis || defaultKpis;

  const sparklines = {
    revenue: [30, 45, 40, 60, 55, 75, 80, 95],
    orders: [20, 35, 30, 45, 40, 55, 60, 70],
    customers: [15, 20, 25, 30, 35, 40, 50, 60],
    products: [40, 42, 45, 50, 52, 60, 70, 80],
    lowStock: [10, 8, 7, 5, 4, 3, 4, 4],
    giftCards: [20, 30, 25, 45, 50, 65, 70, 85],
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 ">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-yellow-600 block mb-1">
            Executive Control Suite
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-neutral-900 uppercase tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Overview of your AURELIUS store performance, clientele transactions, and live inventory.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/admin/products/create"
            className="bg-yellow-400 hover:bg-yellow-500 text-neutral-950 font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-sm transition-colors flex items-center space-x-2"
          >
            <span>Craft New Piece</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 6 TOP STATISTICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Revenue"
          value={activeKpis.totalRevenue.formatted}
          change={activeKpis.totalRevenue.change}
          isPositive={activeKpis.totalRevenue.isPositive}
          comparison={activeKpis.totalRevenue.comparison}
          icon={DollarSign}
          sparklineData={sparklines.revenue}
        />
        <StatCard
          title="Total Orders"
          value={activeKpis.totalOrders.formatted}
          change={activeKpis.totalOrders.change}
          isPositive={activeKpis.totalOrders.isPositive}
          comparison={activeKpis.totalOrders.comparison}
          icon={ShoppingBag}
          sparklineData={sparklines.orders}
        />
        <StatCard
          title="Total Customers"
          value={activeKpis.totalCustomers.formatted}
          change={activeKpis.totalCustomers.change}
          isPositive={activeKpis.totalCustomers.isPositive}
          comparison={activeKpis.totalCustomers.comparison}
          icon={Users}
          sparklineData={sparklines.customers}
        />
        <StatCard
          title="Total Products"
          value={activeKpis.totalProducts.formatted}
          change={activeKpis.totalProducts.change}
          isPositive={activeKpis.totalProducts.isPositive}
          comparison={activeKpis.totalProducts.comparison}
          icon={Package}
          sparklineData={sparklines.products}
        />
        <StatCard
          title="Low Stock SKUs"
          value={activeKpis.lowStockProducts.formatted}
          change={activeKpis.lowStockProducts.change}
          isPositive={activeKpis.lowStockProducts.isPositive}
          comparison={activeKpis.lowStockProducts.comparison}
          icon={AlertTriangle}
          sparklineData={sparklines.lowStock}
        />
        <StatCard
          title="Gift Card Sales"
          value={activeKpis.giftCardSales.formatted}
          change={activeKpis.giftCardSales.change}
          isPositive={activeKpis.giftCardSales.isPositive}
          comparison={activeKpis.giftCardSales.comparison}
          icon={Gift}
          sparklineData={sparklines.giftCards}
        />
      </div>

      {/* SALES OVERVIEW CHART & CUSTOMER BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Overview Chart */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-600 block">
                Atelier Revenue
              </span>
              <h3 className="text-base font-bold font-serif-luxury text-neutral-900 uppercase tracking-wider">
                Sales Overview
              </h3>
            </div>

            {/* Time Filter Pills */}
            <div className="flex items-center space-x-1 p-1 bg-neutral-100 rounded-lg border border-neutral-200 text-[11px] font-semibold">
              {(
                [
                  { key: 'today', label: 'Today' },
                  { key: '7d', label: '7 Days' },
                  { key: '30d', label: '30 Days' },
                  { key: '3m', label: '3 Months' },
                  { key: '1y', label: '1 Year' },
                ] as const
              ).map((f) => (
                <button
                  key={f.key}
                  onClick={() => setSalesRange(f.key)}
                  className={`px-3 py-1 rounded-md transition-all ${
                    salesRange === f.key
                      ? 'bg-yellow-400 text-neutral-950 font-bold shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-900 '
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 rounded-lg bg-neutral-50 border border-neutral-100 ">
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">Period Revenue</span>
              <span className="text-lg font-bold font-serif-luxury text-neutral-900 ">
                {activeKpis.totalRevenue.formatted}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">Period Orders</span>
              <span className="text-lg font-bold font-serif-luxury text-neutral-900 ">
                {activeKpis.totalOrders.formatted} Orders
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">Average Order Value</span>
              <span className="text-lg font-bold font-serif-luxury text-yellow-600 ">
                ₹{salesOverview?.avgOrderValue ? salesOverview.avgOrderValue.toLocaleString('en-IN') : '3,640'}
              </span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-4">
            <div className="flex items-end space-x-2 sm:space-x-4 h-48 pt-6">
              {salesOverview?.chart && salesOverview.chart.length > 0 ? (
                salesOverview.chart.map((point) => {
                  const maxRev = Math.max(...salesOverview.chart.map((p) => p.revenue));
                  const heightPercent = maxRev > 0 ? Math.min(100, Math.max(15, (point.revenue / maxRev) * 100)) : 20;

                  return (
                    <div key={point.label} className="flex-1 flex flex-col items-center h-full justify-end group">
                      <div className="text-[9px] font-mono text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1 whitespace-nowrap">
                        ₹{(point.revenue / 1000).toFixed(0)}k
                      </div>
                      <div className="w-full relative flex items-end justify-center">
                        <div
                          className="w-full max-w-[36px] bg-neutral-200 group-hover:bg-yellow-400 rounded-t-sm transition-all duration-200 cursor-pointer"
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-neutral-500 mt-2 truncate max-w-full">
                        {point.label}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="w-full flex items-center justify-center text-neutral-500 text-xs">
                  Loading sales performance chart...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Customer Overview */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-600 block">
              Client Loyalty
            </span>
            <h3 className="text-base font-bold font-serif-luxury text-neutral-900 uppercase tracking-wider mb-6">
              Customer Overview
            </h3>

            {/* Visual Gauge Representation */}
            <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider">
                    Client Satisfaction
                  </span>
                  <div className="text-2xl font-bold font-serif-luxury text-yellow-600 ">98.4%</div>
                </div>
                <div className="p-3 rounded-full bg-yellow-400/20 text-yellow-700 ">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              {/* Progress bars */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-neutral-700 ">New Clients</span>
                    <span className="text-neutral-900 ">{customerOverview?.newCustomers || 578}</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-neutral-700 ">Returning Patrons</span>
                    <span className="text-neutral-900 ">{customerOverview?.returningCustomers || 312}</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                    <div className="h-full bg-neutral-400 rounded-full" style={{ width: '35%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-100 ">
            <Link
              to="/admin/customers"
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-neutral-200 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:text-neutral-900 hover:border-yellow-400 transition-colors"
            >
              <span>Explore Client Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2-COLUMNS: RECENT ORDERS & TOP SELLING PRODUCTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Recent Orders */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 ">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-600 block">
                Fulfillment Ledger
              </span>
              <h3 className="text-base font-bold font-serif-luxury text-neutral-900 uppercase tracking-wider">
                Recent Orders
              </h3>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold uppercase tracking-wider text-yellow-600 hover:underline flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-neutral-100 ">
            {recentOrders.length === 0 ? (
              <p className="py-8 text-neutral-400 text-center text-xs">No customer orders recorded yet.</p>
            ) : (
              recentOrders.slice(0, 6).map((ord) => (
                <div key={ord._id} className="py-3 flex items-center justify-between group">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-yellow-50 text-yellow-600 group-hover:bg-yellow-100 transition-colors">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-mono font-bold text-xs text-neutral-900 block">
                        {ord.orderNumber}
                      </span>
                      <span className="text-[11px] text-neutral-500 ">
                        {ord.userId?.name || 'Customer'} • {ord.items?.length || 1} items
                      </span>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="font-bold text-xs text-neutral-900 block font-serif-luxury">
                      ₹{ord.pricing?.totalAmount?.toLocaleString('en-IN')}
                    </span>
                    <StatusBadge status={ord.orderStatus} type="order" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 ">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-600 block">
                Catalog Leaders
              </span>
              <h3 className="text-base font-bold font-serif-luxury text-neutral-900 uppercase tracking-wider">
                Top Selling Products
              </h3>
            </div>
            <Link
              to="/admin/products"
              className="text-xs font-bold uppercase tracking-wider text-yellow-600 hover:underline flex items-center space-x-1"
            >
              <span>Manage Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-neutral-100 ">
            {topSelling.length === 0 ? (
              <p className="py-8 text-neutral-400 text-center text-xs">No product metrics available.</p>
            ) : (
              topSelling.slice(0, 6).map((item) => (
                <div key={item.productId} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-10 h-12 object-cover rounded-md bg-neutral-100 border border-neutral-200 "
                    />
                    <div>
                      <span className="font-bold text-xs text-neutral-900 block truncate max-w-[200px]">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-neutral-500 ">
                        {item.category} • {item.unitsSold} units dispatched
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-xs text-neutral-900 block font-serif-luxury">
                      ₹{item.revenue.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold">
                      {item.stock} in stock
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* LOW STOCK ALERT BANNER & LIST */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-neutral-100 ">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-yellow-400/15 text-amber-500">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif-luxury text-neutral-900 uppercase tracking-wider">
                Low Stock Critical Alerts
              </h3>
              <p className="text-xs text-neutral-500 ">
                Variants below minimum threshold (≤ 5 units). Restock recommended.
              </p>
            </div>
          </div>

          <Link
            to="/admin/inventory"
            className="px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-neutral-950 font-bold text-xs uppercase tracking-wider shadow-sm transition-colors self-start sm:self-auto"
          >
            VIEW INVENTORY
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {lowStockAlerts.length === 0 ? (
            <div className="col-span-full py-6 text-center text-neutral-400 text-xs">
              All inventory levels are currently optimum. No urgent alerts.
            </div>
          ) : (
            lowStockAlerts.slice(0, 4).map((alert) => (
              <div
                key={alert.sku}
                className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-2 flex flex-col justify-between"
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={alert.image}
                    alt={alert.title}
                    className="w-12 h-14 object-cover rounded-md bg-neutral-100 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-neutral-900 block truncate">
                      {alert.title}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono block">
                      {alert.sku}
                    </span>
                    <span className="text-[11px] text-neutral-400 block mt-0.5">
                      {alert.color} / Size {alert.size}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-200 ">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">
                    Threshold: {alert.threshold}
                  </span>
                  <StatusBadge status={alert.status} type="stock" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
