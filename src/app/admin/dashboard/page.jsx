'use client'
import React, { useState, useEffect } from 'react';
import { 
  FaChurch, FaMoneyBillWave, FaReceipt, FaHistory, 
  FaChartLine, FaCalendarAlt, FaPlusCircle, FaMinusCircle,
  FaBars, FaTimes, FaArrowRight, FaBookmark
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  ArcElement 
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Menu, Transition } from '@headlessui/react';
import Link from 'next/link';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  ArcElement
);

// Sample data (replace with your API calls)
const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const currentYear = new Date().getFullYear();
const years = Array.from({length: 5}, (_, i) => currentYear - 2 + i);

const Dashboard = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  
  // New state variables for different offering types
  const [pundiMerahData, setPundiMerahData] = useState([]);
  const [pundiHijauData, setPundiHijauData] = useState([]);
  const [g1000Data, setG1000Data] = useState([]);
  const [rumahTanggaData, setRumahTanggaData] = useState([]);
  
  // New state variables for different expense types
  const [operationalExpenses, setOperationalExpenses] = useState([]);
  const [programExpenses, setProgramExpenses] = useState([]);
  const [socialExpenses, setSocialExpenses] = useState([]);
  
  // Fetch data based on selected period
  useEffect(() => {
    // Mock data for example
    // In real implementation, replace with API calls
    const mockPundiMerahData = Array.from({length: 30}, () => Math.floor(Math.random() * 200000) + 50000);
    const mockPundiHijauData = Array.from({length: 30}, () => Math.floor(Math.random() * 150000) + 30000);
    const mockG1000Data = Array.from({length: 30}, () => Math.floor(Math.random() * 100000) + 20000);
    const mockRumahTanggaData = Array.from({length: 30}, () => Math.floor(Math.random() * 150000) + 40000);
    
    // Calculate total income data as sum of all offering types
    const totalIncomeData = Array.from({length: 30}, (_, i) => 
      mockPundiMerahData[i] + mockPundiHijauData[i] + mockG1000Data[i] + mockRumahTanggaData[i]
    );
    
    // Mock expense data by category
    const mockOperationalExpenses = Array.from({length: 30}, () => Math.floor(Math.random() * 150000) + 30000);
    const mockProgramExpenses = Array.from({length: 30}, () => Math.floor(Math.random() * 130000) + 20000);
    const mockSocialExpenses = Array.from({length: 30}, () => Math.floor(Math.random() * 120000) + 10000);
    
    // Calculate total expense data as sum of all expense types
    const totalExpenseData = Array.from({length: 30}, (_, i) => 
      mockOperationalExpenses[i] + mockProgramExpenses[i] + mockSocialExpenses[i]
    );
    
    const mockTransactions = [
      { id: 1, type: 'income', category: 'Persembahan', source: 'Pundi Merah', amount: 2500000, date: '2023-03-05', description: 'Persembahan minggu pertama' },
      { id: 2, type: 'expense', category: 'Utilitas', source: 'Operasional', amount: 750000, date: '2023-03-07', description: 'Pembayaran listrik' },
      { id: 3, type: 'income', category: 'Perpuluhan', source: 'Pundi Hijau', amount: 1750000, date: '2023-03-12', description: 'Perpuluhan jemaat' },
      { id: 4, type: 'expense', category: 'Kegiatan', source: 'Program', amount: 1200000, date: '2023-03-15', description: 'Kegiatan remaja' },
      { id: 5, type: 'income', category: 'Donasi', source: 'G-1000', amount: 5000000, date: '2023-03-20', description: 'Donasi pembangunan' },
      { id: 6, type: 'expense', category: 'Gaji', source: 'Operasional', amount: 3500000, date: '2023-03-25', description: 'Gaji staf gereja' },
    ];
    
    setPundiMerahData(mockPundiMerahData);
    setPundiHijauData(mockPundiHijauData);
    setG1000Data(mockG1000Data);
    setRumahTanggaData(mockRumahTanggaData);
    
    setOperationalExpenses(mockOperationalExpenses);
    setProgramExpenses(mockProgramExpenses);
    setSocialExpenses(mockSocialExpenses);
    
    setIncomeData(totalIncomeData);
    setExpenseData(totalExpenseData);
    setTransactions(mockTransactions);
  }, [selectedMonth, selectedYear]);

  // Chart data
  const incomeChartData = {
    labels: Array.from({length: 30}, (_, i) => i + 1),
    datasets: [
      {
        label: 'Pemasukan',
        data: incomeData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3
      }
    ]
  };

  const expenseChartData = {
    labels: Array.from({length: 30}, (_, i) => i + 1),
    datasets: [
      {
        label: 'Pengeluaran',
        data: expenseData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3
      }
    ]
  };

  const summaryChartData = {
    labels: ['Pemasukan', 'Pengeluaran'],
    datasets: [
      {
        data: [
          incomeData.reduce((a, b) => a + b, 0),
          expenseData.reduce((a, b) => a + b, 0)
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 99, 132, 0.7)'
        ],
        borderColor: [
          'rgb(75, 192, 192)',
          'rgb(255, 99, 132)'
        ],
        borderWidth: 1
      }
    ]
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-800 to-blue-600 text-white shadow-lg hidden md:block">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <FaChurch className="h-8 w-8" />
            <h1 className="text-2xl font-bold">GerejaKu</h1>
          </div>
          <p className="text-blue-200 text-sm mt-1">Sistem Anggaran</p>
        </div>
        <nav className="mt-6">
          <Link href="/admin/dashboard" className="flex items-center px-6 py-3 bg-blue-700 text-white hover:bg-blue-600 transition-colors">
            <FaChartLine className="mr-3" />
            Dashboard
          </Link>
          <Link href="/admin/income" className="flex items-center px-6 py-3 text-blue-100 hover:bg-blue-700 transition-colors">
            <FaPlusCircle className="mr-3" />
            Catat Pemasukan
          </Link>
          <Link href="/admin/expense" className="flex items-center px-6 py-3 text-blue-100 hover:bg-blue-700 transition-colors">
            <FaMinusCircle className="mr-3" />
            Catat Pengeluaran
          </Link>
          <Link href="/admin/financial-report" className="flex items-center px-6 py-3 text-blue-100 hover:bg-blue-700 transition-colors">
            <FaBookmark className="mr-3" />
            Pembukuan
          </Link>
          <Link href="/admin/transactions" className="flex items-center px-6 py-3 text-blue-100 hover:bg-blue-700 transition-colors">
            <FaHistory className="mr-3" />
            Riwayat Transaksi
          </Link>
        </nav>
      </div>

      {/* Mobile navbar */}
      <div className="bg-blue-800 text-white shadow-lg md:hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <FaChurch className="h-6 w-6" />
            <h1 className="text-xl font-bold">GerejaKu</h1>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="bg-blue-700 p-4 space-y-3">
            <Link href="/admin/dashboard" className="flex items-center py-2 text-white hover:opacity-80">
              <FaChartLine className="mr-3" />
              Dashboard
            </Link>
            <Link href="/admin/income" className="flex items-center py-2 text-blue-100 hover:text-white">
              <FaPlusCircle className="mr-3" />
              Catat Pemasukan
            </Link>
            <Link href="/admin/expense" className="flex items-center py-2 text-blue-100 hover:text-white">
              <FaMinusCircle className="mr-3" />
              Catat Pengeluaran
            </Link>
            <Link href="/admin/financial-report" className="flex items-center px-6 py-3 text-blue-100 hover:bg-blue-700 transition-colors">
            <FaBookmark className="mr-3" />
            Pembukuan
          </Link>
            <Link href="/admin/transactions" className="flex items-center py-2 text-blue-100 hover:text-white">
              <FaHistory className="mr-3" />
              Riwayat Transaksi
            </Link>
          </nav>
        )}
      </div>

      {/* Main content */}
      <div className="md:ml-64 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard Keuangan</h2>
          <p className="text-gray-600">Pantau keuangan gereja dengan mudah</p>
        </div>

        {/* Period filter */}
        <div className="mb-6 flex flex-wrap items-center space-y-2 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-2">
            <FaCalendarAlt className="text-blue-600" />
            <span className="text-gray-700">Filter Periode:</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="p-2 border rounded-md bg-white shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              className="p-2 border rounded-md bg-white shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Cards - Income */}
        <h3 className="text-xl font-bold text-gray-700 mb-4">Ringkasan Pemasukan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {/* Grand Total Income Card */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg shadow-md text-white col-span-1 md:col-span-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100">Total Pemasukan</p>
                <h3 className="text-2xl font-bold mt-1">
                  {formatCurrency(incomeData.reduce((a, b) => a + b, 0))}
                </h3>
              </div>
              <div className="p-3 bg-blue-400 bg-opacity-30 rounded-full">
                <FaMoneyBillWave className="text-xl" />
              </div>
            </div>
          </div>
          
          {/* Pundi Merah Card */}
          <div className="bg-gradient-to-r from-red-400 to-red-500 p-4 rounded-lg shadow-md text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-red-100">Pundi Merah</p>
                <h3 className="text-lg font-bold mt-1">
                  {formatCurrency(pundiMerahData.reduce((a, b) => a + b, 0))}
                </h3>
              </div>
              <div className="p-2 bg-red-400 bg-opacity-30 rounded-full">
                <FaMoneyBillWave className="text-sm" />
              </div>
            </div>
          </div>
          
          {/* Pundi Hijau Card */}
          <div className="bg-gradient-to-r from-green-400 to-green-500 p-4 rounded-lg shadow-md text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-100">Pundi Hijau</p>
                <h3 className="text-lg font-bold mt-1">
                  {formatCurrency(pundiHijauData.reduce((a, b) => a + b, 0))}
                </h3>
              </div>
              <div className="p-2 bg-green-400 bg-opacity-30 rounded-full">
                <FaMoneyBillWave className="text-sm" />
              </div>
            </div>
          </div>
          
          {/* G-1000 Card */}
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-4 rounded-lg shadow-md text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-yellow-100">G-1000 (Dana Sosial)</p>
                <h3 className="text-lg font-bold mt-1">
                  {formatCurrency(g1000Data.reduce((a, b) => a + b, 0))}
                </h3>
              </div>
              <div className="p-2 bg-yellow-400 bg-opacity-30 rounded-full">
                <FaMoneyBillWave className="text-sm" />
              </div>
            </div>
          </div>
          
          {/* Persekutuan Rumah Tangga Card */}
          <div className="bg-gradient-to-r from-purple-400 to-purple-500 p-4 rounded-lg shadow-md text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-purple-100">Persekutuan Rumah Tangga</p>
                <h3 className="text-lg font-bold mt-1">
                  {formatCurrency(rumahTanggaData.reduce((a, b) => a + b, 0))}
                </h3>
              </div>
              <div className="p-2 bg-purple-400 bg-opacity-30 rounded-full">
                <FaMoneyBillWave className="text-sm" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Summary Cards - Expense */}
        <h3 className="text-xl font-bold text-gray-700 mb-4 mt-8">Ringkasan Pengeluaran</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Grand Total Expense Card */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 rounded-lg shadow-md text-white col-span-1 md:col-span-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-red-100">Total Pengeluaran</p>
                <h3 className="text-2xl font-bold mt-1">
                  {formatCurrency(expenseData.reduce((a, b) => a + b, 0))}
                </h3>
              </div>
              <div className="p-3 bg-red-400 bg-opacity-30 rounded-full">
                <FaReceipt className="text-xl" />
              </div>
            </div>
          </div>
          
          {/* Operational Expenses Card */}
          <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-4 rounded-lg shadow-md text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-orange-100">Operasional</p>
                <h3 className="text-lg font-bold mt-1">
                  {formatCurrency(operationalExpenses.reduce((a, b) => a + b, 0))}
                </h3>
              </div>
              <div className="p-2 bg-orange-400 bg-opacity-30 rounded-full">
                <FaReceipt className="text-sm" />
              </div>
            </div>
          </div>
          
          {/* Program Expenses Card */}
          <div className="bg-gradient-to-r from-indigo-400 to-indigo-500 p-4 rounded-lg shadow-md text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-indigo-100">Program/Kegiatan</p>
                <h3 className="text-lg font-bold mt-1">
                  {formatCurrency(programExpenses.reduce((a, b) => a + b, 0))}
                </h3>
              </div>
              <div className="p-2 bg-indigo-400 bg-opacity-30 rounded-full">
                <FaReceipt className="text-sm" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-md text-white mb-8">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-100">Saldo</p>
              <h3 className="text-2xl font-bold mt-1">
                {formatCurrency(
                  incomeData.reduce((a, b) => a + b, 0) - 
                  expenseData.reduce((a, b) => a + b, 0)
                )}
              </h3>
            </div>
            <div className="p-3 bg-green-400 bg-opacity-30 rounded-full">
              <FaChartLine className="text-xl" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Trend Pemasukan & Pengeluaran</h3>
            <div className="h-80">
              <Bar
                data={{
                  labels: ['1', '5', '10', '15', '20', '25', '30'],
                  datasets: [
                    {
                      label: 'Pemasukan',
                      data: [incomeData[0], incomeData[4], incomeData[9], incomeData[14], incomeData[19], incomeData[24], incomeData[29]],
                      backgroundColor: 'rgba(75, 192, 192, 0.7)'
                    },
                    {
                      label: 'Pengeluaran',
                      data: [expenseData[0], expenseData[4], expenseData[9], expenseData[14], expenseData[19], expenseData[24], expenseData[29]],
                      backgroundColor: 'rgba(255, 99, 132, 0.7)'
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return formatCurrency(value);
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan Bulan Ini</h3>
            <div className="h-64 flex items-center justify-center">
              <Pie 
                data={summaryChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.raw || 0;
                          return `${label}: ${formatCurrency(value)}`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Persentase Pengeluaran: {
                  Math.round(
                    (expenseData.reduce((a, b) => a + b, 0) / 
                    incomeData.reduce((a, b) => a + b, 0)) * 100
                  )}%
              </p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Transaksi Terbaru</h3>
            <Link href="/admin/transactions" className="text-blue-600 hover:text-blue-800 text-sm flex items-center group">
              <span>Lihat Semua</span>
              <FaArrowRight className="h-4 w-4 ml-1 transition-transform transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sumber Dana</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map(transaction => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`h-2 w-2 rounded-full mr-2 ${
                          transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                        <span className="text-sm font-medium text-gray-800">{transaction.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {transaction.source}
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link href="/admin/income" className="group">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg shadow-sm border border-blue-200 group-hover:shadow-md cursor-pointer transition-all duration-300 h-full">
              <div className="flex items-center">
                <div className="p-3 bg-blue-500 text-white rounded-full mr-4 group-hover:bg-blue-600 transition-colors">
                  <FaPlusCircle className="text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-800 transition-colors">Catat Pemasukan Baru</h3>
                  <p className="text-gray-600 text-sm">Persembahan, perpuluhan, atau donasi</p>
                </div>
              </div>
            </div>
          </Link>
          <Link href="/admin/expense" className="group">
            <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-lg shadow-sm border border-red-200 group-hover:shadow-md cursor-pointer transition-all duration-300 h-full">
              <div className="flex items-center">
                <div className="p-3 bg-red-500 text-white rounded-full mr-4 group-hover:bg-red-600 transition-colors">
                  <FaMinusCircle className="text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-red-800 transition-colors">Catat Pengeluaran Baru</h3>
                  <p className="text-gray-600 text-sm">Operasional, kegiatan, atau pengadaan</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-4 mt-8">
          <p className="text-center text-gray-500 text-sm">
            Sistem Pengelolaan Anggaran Gereja © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;