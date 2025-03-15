'use client'

import React, { useState, useEffect } from 'react';
import { 
  FaChurch,
  FaChartLine,
  FaMoneyBillWave,
  FaReceipt,
  FaCalendarAlt,
  FaDownload,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
  FaInfoCircle
} from 'react-icons/fa';
import { PieChart, Pie, ResponsiveContainer, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function PublicFinancialReport() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [periods, setPeriods] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDirection, setSortDirection] = useState('desc');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [summaryData, setSummaryData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    categoryData: []
  });

  // Fetch periods and initial data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockPeriods = [
        { id: 1, name: "Januari 2023" },
        { id: 2, name: "Februari 2023" },
        { id: 3, name: "Maret 2023" },
        { id: 4, name: "April 2023" }
      ];
      setPeriods(mockPeriods);
      setSelectedPeriod(mockPeriods[mockPeriods.length - 1]);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Fetch data when period changes
  useEffect(() => {
    if (selectedPeriod) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        // Mock transaction data
        const mockTransactions = [
          { id: 1, date: "2023-04-02", type: "income", category: "Persembahan Minggu", amount: 3500000, description: "Persembahan minggu pertama", createdAt: "2023-04-02T08:30:00" },
          { id: 2, date: "2023-04-05", type: "expense", category: "Utilitas", amount: 750000, description: "Pembayaran listrik", createdAt: "2023-04-05T14:15:00" },
          { id: 3, date: "2023-04-07", type: "income", category: "Perpuluhan", amount: 2750000, description: "Perpuluhan jemaat", createdAt: "2023-04-07T10:45:00" },
          // ... more transactions
        ];

        // Find latest transaction by createdAt
        if (mockTransactions.length > 0) {
          const sortedByCreatedAt = [...mockTransactions].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
          setLastUpdated(new Date(sortedByCreatedAt[0].createdAt));
        }

        // Mock summary data
        const mockSummary = {
          totalIncome: 15000000,
          totalExpense: 8500000,
          balance: 6500000,
          categoryData: [
            { name: 'Persembahan', value: 8000000, type: 'income' },
            { name: 'Perpuluhan', value: 5000000, type: 'income' },
            { name: 'Donasi', value: 2000000, type: 'income' },
            { name: 'Utilitas', value: 2500000, type: 'expense' },
            { name: 'Gaji Staff', value: 3500000, type: 'expense' },
            { name: 'Operasional', value: 2500000, type: 'expense' }
          ]
        };

        setTransactions(mockTransactions);
        setSummaryData(mockSummary);
        setIsLoading(false);
      }, 500);
    }
  }, [selectedPeriod]);

  const handlePeriodChange = (e) => {
    const period = periods.find(p => p.id === parseInt(e.target.value));
    setSelectedPeriod(period);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (date) => {
    if (!date) return '-';
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(item => {
      if (filterType !== 'all' && item.type !== filterType) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          item.category.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });

  // Chart colors
  const COLORS = {
    income: ['#34D399', '#6EE7B7', '#A7F3D0'],
    expense: ['#F87171', '#FCA5A5', '#FECACA']
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <FaChurch className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">GerejaKu</h1>
              <p className="text-blue-200 text-sm">Laporan Keuangan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Period Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Laporan Keuangan</h2>
              <div className="relative">
                <select 
                  className="w-full md:w-64 p-2 pl-9 border border-gray-300 rounded-md text-gray-800 appearance-none focus:ring-2 focus:ring-blue-500"
                  onChange={handlePeriodChange}
                  value={selectedPeriod?.id || ''}
                  disabled={isLoading}
                >
                  <option value="">Pilih Periode</option>
                  {periods.map((period) => (
                    <option key={period.id} value={period.id}>
                      {period.name}
                    </option>
                  ))}
                </select>
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div>
              <button 
                className="inline-flex items-center px-4 py-2 border border-blue-600 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                onClick={() => {/* Handle download */}}
              >
                <FaDownload className="mr-2" />
                Unduh Laporan
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border-l-4 border-green-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600">Total Pemasukan</p>
                    <h3 className="text-xl font-bold text-gray-800 mt-1">
                      {formatCurrency(summaryData.totalIncome)}
                    </h3>
                  </div>
                  <div className="bg-green-200 rounded-full p-3">
                    <FaMoneyBillWave className="text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-6 border-l-4 border-red-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600">Total Pengeluaran</p>
                    <h3 className="text-xl font-bold text-gray-800 mt-1">
                      {formatCurrency(summaryData.totalExpense)}
                    </h3>
                  </div>
                  <div className="bg-red-200 rounded-full p-3">
                    <FaReceipt className="text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border-l-4 border-blue-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600">Saldo</p>
                    <h3 className="text-xl font-bold text-gray-800 mt-1">
                      {formatCurrency(summaryData.balance)}
                    </h3>
                  </div>
                  <div className="bg-blue-200 rounded-full p-3">
                    <FaChartLine className="text-blue-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Pie Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribusi Dana</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={summaryData.categoryData.filter(item => item.type === 'income')}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={(entry) => `${entry.name} (${((entry.value / summaryData.totalIncome) * 100).toFixed(1)}%)`}
                      >
                        {summaryData.categoryData
                          .filter(item => item.type === 'income')
                          .map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS.income[index % COLORS.income.length]} />
                          ))
                        }
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatCurrency(value)}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Line Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Tren Keuangan</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { name: 'Minggu 1', income: 3500000, expense: 2000000 },
                        { name: 'Minggu 2', income: 4200000, expense: 1800000 },
                        { name: 'Minggu 3', income: 3800000, expense: 2500000 },
                        { name: 'Minggu 4', income: 3500000, expense: 2200000 },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis
                        tickFormatter={(value) => 
                          new Intl.NumberFormat('id-ID', {
                            notation: 'compact',
                            compactDisplay: 'short',
                          }).format(value)
                        }
                      />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                      <Line type="monotone" dataKey="income" stroke="#34D399" name="Pemasukan" />
                      <Line type="monotone" dataKey="expense" stroke="#F87171" name="Pengeluaran" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <h3 className="text-lg font-semibold text-gray-800">Riwayat Transaksi</h3>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Cari transaksi..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full sm:w-64 pl-9 pr-3 py-2 border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500"
                      />
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>

                    <div className="relative">
                      <select
                        value={filterType}
                        onChange={handleFilterChange}
                        className="w-full sm:w-auto pl-9 pr-8 py-2 border border-gray-300 rounded-md text-gray-800 appearance-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">Semua Transaksi</option>
                        <option value="income">Pemasukan</option>
                        <option value="expense">Pengeluaran</option>
                      </select>
                      <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>

                    <button
                      onClick={toggleSortDirection}
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
                    >
                      {sortDirection === 'asc' ? (
                        <>
                          <FaSortAmountUp className="mr-2" />
                          <span>Terlama</span>
                        </>
                      ) : (
                        <>
                          <FaSortAmountDown className="mr-2" />
                          <span>Terbaru</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kategori
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Keterangan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jumlah
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransactions.map(transaction => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(transaction.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`h-2 w-2 rounded-full mr-2 ${
                              transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                            }`}></span>
                            <span className="text-sm font-medium text-gray-800">
                              {transaction.category}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {transaction.description}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Transparency Notice */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <FaInfoCircle className="text-blue-500 mt-1 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-blue-800">Transparansi Keuangan</h3>
                  <p className="mt-2 text-sm text-blue-700">
                    Laporan keuangan ini diperbarui secara berkala untuk memberikan transparansi kepada jemaat. 
                    Data yang ditampilkan merupakan rangkuman dari seluruh transaksi keuangan gereja.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <FaChurch className="h-6 w-6" />
              <span className="text-lg font-semibold">GerejaKu</span>
            </div>
            <p className="text-sm mb-2">
              Sistem Pengelolaan Anggaran Gereja © {new Date().getFullYear()}
            </p>
            <p className="text-xs text-gray-500">
              Terakhir diperbarui: {formatDateTime(lastUpdated)}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}