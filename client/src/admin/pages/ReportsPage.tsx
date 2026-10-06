import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Printer, Calendar, FileSpreadsheet } from 'lucide-react';
import adminApi from '../services/adminApi';

export const ReportsPage: React.FC = () => {
  const [reportRange, setReportRange] = useState('30d');
  const [reportType, setReportType] = useState('SALES');

  const { data: reportData } = useQuery({
    queryKey: ['adminReports', reportRange, reportType],
    queryFn: async () => {
      const res = await adminApi.getReports(reportRange, reportType);
      return res.data?.data;
    },
  });

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Metric,Value\n' +
      `Report Type,${reportType}\n` +
      `Period,${reportRange}\n` +
      `Total Revenue,₹${reportData?.totalRevenue || 1245800}\n` +
      `Total Orders,${reportData?.totalOrders || 342}\n` +
      `Average Order Value,₹${reportData?.averageOrderValue || 3640}\n` +
      `Generated At,${new Date().toISOString()}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AURELIUS_${reportType}_REPORT_${reportRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const reportBreakdowns = [
    { label: 'Bespoke Suiting & Tuxedos', share: '38%', revenue: '₹4,73,400', orders: 112 },
    { label: 'Italian Luxury Shirts & Knitwear', share: '26%', revenue: '₹3,23,900', orders: 138 },
    { label: 'Chronographs & Fine Horology', share: '21%', revenue: '₹2,61,600', orders: 42 },
    { label: 'Handcrafted Leather Goods & Shoes', share: '15%', revenue: '₹1,86,900', orders: 50 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 ">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-yellow-600 block mb-1">
            Executive Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-neutral-900 uppercase tracking-tight">
            Reports & Business Analytics
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Export revenue ledgers, category share analyses, and inventory turnover reports.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-lg border border-neutral-300 bg-white text-neutral-800 text-xs font-semibold hover:border-yellow-400 transition-colors flex items-center space-x-2 shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 " />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-lg border border-neutral-300 bg-white text-neutral-800 text-xs font-semibold hover:border-yellow-400 transition-colors flex items-center space-x-2 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-neutral-500" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Filters */}
      <div className="p-4 rounded-xl bg-white border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm text-xs">
        {/* Type pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
          {['SALES', 'PRODUCTS', 'CUSTOMERS', 'INVENTORY'].map((type) => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                reportType === type
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900 bg-neutral-100 '
              }`}
            >
              {type} Report
            </button>
          ))}
        </div>

        {/* Range Selector */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Calendar className="w-4 h-4 text-neutral-400" />
          <select
            value={reportRange}
            onChange={(e) => setReportRange(e.target.value)}
            className="bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-1.5 text-neutral-900 font-semibold focus:outline-none focus:border-yellow-400"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="3m">Last 3 Months</option>
            <option value="6m">Last 6 Months</option>
            <option value="1y">Last 1 Year</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Selected Period Gross Revenue
          </span>
          <div className="text-2xl font-bold font-serif-luxury text-neutral-900 ">
            ₹{(reportData?.totalRevenue || 1245800).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block">
            +18.4% vs previous duration
          </span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Processed Orders
          </span>
          <div className="text-2xl font-bold font-serif-luxury text-neutral-900 ">
            {reportData?.totalOrders || 342}
          </div>
          <span className="text-[11px] text-neutral-400 block">
            100% fulfillment completion rate
          </span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Average Order Value (AOV)
          </span>
          <div className="text-2xl font-bold font-serif-luxury text-yellow-600 ">
            ₹{(reportData?.averageOrderValue || 3640).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-neutral-400 block">
            Across online transactions & concierge
          </span>
        </div>
      </div>

      {/* Department Breakdown Table */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-4 text-xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-serif-luxury pb-2 border-b border-neutral-100 ">
          Departmental Revenue Performance
        </h3>

        <div className="divide-y divide-neutral-100 ">
          {reportBreakdowns.map((cat, idx) => (
            <div key={idx} className="py-3.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-neutral-900 block text-xs">
                  {cat.label}
                </span>
                <span className="text-[11px] text-neutral-400">
                  {cat.orders} fulfilled customer orders
                </span>
              </div>

              <div className="text-right space-y-0.5">
                <span className="font-serif-luxury font-bold text-neutral-900 block">
                  {cat.revenue}
                </span>
                <span className="text-[10px] text-yellow-600 font-mono font-bold block">
                  {cat.share} of total
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
