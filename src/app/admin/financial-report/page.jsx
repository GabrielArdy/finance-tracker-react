'use client'
import React, { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, 
  FaBook, 
  FaClipboardCheck,
  FaLock,
  FaLockOpen,
  FaChurch,
  FaChartLine,
  FaPlusCircle,
  FaMinusCircle,
  FaHistory,
  FaBars,
  FaTimes,
  FaDownload,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
} from 'react-icons/fa';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

export default function FinancialReportingPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [isBookClosed, setIsBookClosed] = useState(false);
  const [financialHistory, setFinancialHistory] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDirection, setSortDirection] = useState('desc');
  const [periods, setPeriods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get active periods
  useEffect(() => {
    // Mock data - replace with API call
    const mockPeriods = [
      { id: 1, name: "Januari 2023", startDate: "2023-01-01", endDate: "2023-01-31", isClosed: true, closedDate: "2023-02-01" },
      { id: 2, name: "Februari 2023", startDate: "2023-02-01", endDate: "2023-02-28", isClosed: true, closedDate: "2023-03-02" },
      { id: 3, name: "Maret 2023", startDate: "2023-03-01", endDate: "2023-03-31", isClosed: false, closedDate: null },
      { id: 4, name: "April 2023", startDate: "2023-04-01", endDate: "2023-04-30", isClosed: false, closedDate: null }
    ];
    
    setPeriods(mockPeriods);
    setSelectedPeriod(mockPeriods[mockPeriods.length - 1]);
    setIsLoading(false);
  }, []);

  // Get financial history when period changes
  useEffect(() => {
    if (selectedPeriod) {
      setIsLoading(true);
      // Mock data - replace with API call
      setTimeout(() => {
        const mockHistory = [
          { id: 1, date: "2023-04-02", type: "income", category: "Persembahan Minggu", amount: 3500000, description: "Persembahan minggu pertama April" },
          { id: 2, date: "2023-04-05", type: "expense", category: "Utilitas", amount: 750000, description: "Pembayaran listrik bulanan" },
          { id: 3, date: "2023-04-07", type: "income", category: "Perpuluhan", amount: 2750000, description: "Perpuluhan jemaat" },
          { id: 4, date: "2023-04-10", type: "expense", category: "Operasional", amount: 500000, description: "Kebutuhan operasional mingguan" },
          { id: 5, date: "2023-04-15", type: "expense", category: "Gaji Staff", amount: 3500000, description: "Gaji staff gereja" },
          { id: 6, date: "2023-04-17", type: "income", category: "Donasi", amount: 5000000, description: "Donasi untuk pembangunan" },
          { id: 7, date: "2023-04-20", type: "expense", category: "Pemeliharaan", amount: 1200000, description: "Perbaikan AC ruang ibadah" },
          { id: 8, date: "2023-04-24", type: "income", category: "Persembahan Syukur", amount: 4500000, description: "Persembahan syukur bulanan" },
        ];
        
        setFinancialHistory(mockHistory);
        setIsBookClosed(selectedPeriod.isClosed);
        setIsLoading(false);
      }, 500);
    }
  }, [selectedPeriod]);
  
  const isActive = (path) => {
    return pathname === path;
  };

  const handlePeriodChange = (e) => {
    const periodId = parseInt(e.target.value);
    const period = periods.find(p => p.id === periodId);
    setSelectedPeriod(period);
  };
  
  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleCloseBook = () => {
    Swal.fire({
      title: 'Tutup Buku Periode Ini?',
      html: `
        <div class="text-left mb-4">
          <p class="mb-2">Anda akan menutup pembukuan untuk periode <strong>${selectedPeriod?.name}</strong>.</p>
          <p class="mb-4">Setelah ditutup, data keuangan tidak dapat diubah lagi.</p>
          
          <div class="bg-gray-100 p-3 rounded-lg">
            <h4 class="font-semibold mb-2">Ringkasan Keuangan Periode Ini:</h4>
            <div class="grid grid-cols-2 gap-2">
              <div>Total Pemasukan:</div>
              <div class="text-right font-medium text-green-600">${formatCurrency(summary.totalIncome)}</div>
              
              <div>Total Pengeluaran:</div>
              <div class="text-right font-medium text-red-600">${formatCurrency(summary.totalExpense)}</div>
              
              <div>Saldo Akhir:</div>
              <div class="text-right font-medium ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}">${formatCurrency(balance)}</div>
            </div>
          </div>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Tutup Buku',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        // API call would go here
        setIsBookClosed(true);
        
        Swal.fire(
          'Berhasil!',
          `Pembukuan periode ${selectedPeriod?.name} telah ditutup dengan saldo akhir ${formatCurrency(balance)}.`,
          'success'
        );
      }
    });
  };

  const handleOpenBook = () => {
    // Check if there are any open periods
    const hasOpenPeriod = periods.some(period => !period.isClosed);
    
    if (hasOpenPeriod) {
      Swal.fire({
        title: 'Periode Masih Aktif',
        text: 'Masih ada periode yang belum ditutup. Tutup periode tersebut terlebih dahulu sebelum membuka periode baru.',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Mengerti'
      });
      return;
    }
    
    // Get the last period to calculate the next period
    const lastPeriod = periods[periods.length - 1];
    const lastEndDate = new Date(lastPeriod.endDate);
    
    // Calculate next month's start and end dates
    const nextStartDate = new Date(lastEndDate);
    nextStartDate.setDate(1);
    nextStartDate.setMonth(nextStartDate.getMonth() + 1);
    
    const nextEndDate = new Date(nextStartDate);
    nextEndDate.setMonth(nextStartDate.getMonth() + 1);
    nextEndDate.setDate(0); // Set to last day of month
    
    // Format dates for display
    const formatDisplayDate = (date) => {
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
    
    // Generate period name (e.g., "Mei 2023")
    const nextPeriodName = nextStartDate.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long'
    });

    Swal.fire({
      title: 'Buka Periode Baru',
      html: `
        <div class="text-left mb-4">
          <p class="mb-2">Anda akan membuka periode pembukuan baru:</p>
          <div class="bg-blue-50 p-3 rounded-lg mb-3">
            <p class="font-semibold">${nextPeriodName}</p>
            <p class="text-sm text-gray-600">Periode: ${formatDisplayDate(nextStartDate)} - ${formatDisplayDate(nextEndDate)}</p>
          </div>
          
          <p class="mb-2">Saldo awal periode baru akan menggunakan saldo akhir dari periode sebelumnya:</p>
          <div class="bg-gray-100 p-3 rounded-lg">
            <p class="font-medium">Saldo Awal: ${formatCurrency(balance)}</p>
          </div>
          
          <div class="bg-yellow-50 border-l-4 border-yellow-400 p-3 mt-4">
            <p class="text-yellow-700">
              <span class="font-bold">Catatan:</span> Pastikan periode sebelumnya sudah ditutup dan semua transaksi telah dicatat dengan benar.
            </p>
          </div>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Buka Periode Baru',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        // In a real app, this would make an API call to create a new period
        const newPeriod = {
          id: periods.length + 1,
          name: nextPeriodName,
          startDate: nextStartDate.toISOString().split('T')[0],
          endDate: nextEndDate.toISOString().split('T')[0],
          isClosed: false,
          closedDate: null
        };
        
        // Update periods list with the new period
        setPeriods([...periods, newPeriod]);
        setSelectedPeriod(newPeriod);
        setFinancialHistory([]); // Clear financial history for the new period
        
        Swal.fire(
          'Berhasil!',
          `Periode pembukuan baru "${nextPeriodName}" telah dibuka.`,
          'success'
        );
      }
    });
  };

  const exportToExcel = () => {
    Swal.fire({
      title: 'Ekspor Laporan',
      text: `Laporan keuangan periode ${selectedPeriod?.name} akan diekspor ke Excel`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Ekspor',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        // Export logic would go here
        
        Swal.fire(
          'Berhasil!',
          'Data telah diekspor ke Excel.',
          'success'
        );
      }
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  // Filter and sort transactions
  const filteredHistory = financialHistory
    .filter(item => {
      // Filter by type
      if (filterType !== 'all' && item.type !== filterType) return false;
      
      // Filter by search query
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
      // Convert to date objects for comparison
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      if (sortDirection === 'asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  
  // Calculate summary
  const summary = financialHistory.reduce(
    (acc, item) => {
      if (item.type === 'income') {
        acc.totalIncome += item.amount;
      } else {
        acc.totalExpense += item.amount;
      }
      return acc;
    },
    { totalIncome: 0, totalExpense: 0 }
  );
  
  const balance = summary.totalIncome - summary.totalExpense;

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
          <Link href="/admin/dashboard" 
            className={`flex items-center px-6 py-3 ${isActive('/admin/dashboard') ? 'bg-blue-700 text-white' : 'text-blue-100'} hover:bg-blue-700 transition-colors`}>
            <FaChartLine className="mr-3" />
            Dashboard
          </Link>
          <Link href="/admin/income" 
            className={`flex items-center px-6 py-3 ${isActive('/admin/income') ? 'bg-blue-700 text-white' : 'text-blue-100'} hover:bg-blue-700 transition-colors`}>
            <FaPlusCircle className="mr-3" />
            Catat Pemasukan
          </Link>
          <Link href="/admin/expense" 
            className={`flex items-center px-6 py-3 ${isActive('/admin/expense') ? 'bg-blue-700 text-white' : 'text-blue-100'} hover:bg-blue-700 transition-colors`}>
            <FaMinusCircle className="mr-3" />
            Catat Pengeluaran
          </Link>
          <Link href="/admin/transactions" 
            className={`flex items-center px-6 py-3 ${isActive('/admin/transactions') ? 'bg-blue-700 text-white' : 'text-blue-100'} hover:bg-blue-700 transition-colors`}>
            <FaHistory className="mr-3" />
            Riwayat Transaksi
          </Link>
          <Link href="/admin/report" 
            className={`flex items-center px-6 py-3 ${isActive('/admin/report') ? 'bg-blue-700 text-white' : 'text-blue-100'} hover:bg-blue-700 transition-colors`}>
            <FaBook className="mr-3" />
            Pembukuan
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
            <Link href="/admin/dashboard" 
              className={`flex items-center py-2 ${isActive('/admin/dashboard') ? 'text-white' : 'text-blue-100'} hover:text-white`}
              onClick={() => setMobileMenuOpen(false)}>
              <FaChartLine className="mr-3" />
              Dashboard
            </Link>
            <Link href="/admin/income" 
              className={`flex items-center py-2 ${isActive('/admin/income') ? 'text-white' : 'text-blue-100'} hover:text-white`}
              onClick={() => setMobileMenuOpen(false)}>
              <FaPlusCircle className="mr-3" />
              Catat Pemasukan
            </Link>
            <Link href="/admin/expense" 
              className={`flex items-center py-2 ${isActive('/admin/expense') ? 'text-white' : 'text-blue-100'} hover:text-white`}
              onClick={() => setMobileMenuOpen(false)}>
              <FaMinusCircle className="mr-3" />
              Catat Pengeluaran
            </Link>
            <Link href="/admin/transactions" 
              className={`flex items-center py-2 ${isActive('/admin/transactions') ? 'text-white' : 'text-blue-100'} hover:text-white`}
              onClick={() => setMobileMenuOpen(false)}>
              <FaHistory className="mr-3" />
              Riwayat Transaksi
            </Link>
            <Link href="/admin/report" 
              className={`flex items-center py-2 ${isActive('/admin/report') ? 'text-white' : 'text-blue-100'} hover:text-white`}
              onClick={() => setMobileMenuOpen(false)}>
              <FaBook className="mr-3" />
              Pembukuan
            </Link>
          </nav>
        )}
      </div>

      {/* Main content */}
      <div className="md:ml-64 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Pembukuan Keuangan</h2>
          <p className="text-gray-600">Kelola dan pantau periode pembukuan keuangan gereja</p>
        </div>

        {/* Period Selection and Status Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Periode Pembukuan</h3>
              <div className="relative">
                <select 
                  className="w-full md:w-64 p-2 pl-9 border border-gray-300 rounded-md text-gray-800 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  onChange={handlePeriodChange}
                  value={selectedPeriod?.id || ''}
                  disabled={isLoading}
                >
                  <option value="">-- Pilih Periode --</option>
                  {periods.map((period) => (
                    <option key={period.id} value={period.id}>
                      {period.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaCalendarAlt className="text-gray-500" />
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:items-end">
              <div className={`flex items-center space-x-2 mb-2 ${isBookClosed ? 'text-red-600' : 'text-green-600'}`}>
                {isBookClosed ? (
                  <>
                    <FaLock />
                    <span className="font-medium">Tutup Buku</span>
                  </>
                ) : (
                  <>
                    <FaLockOpen />
                    <span className="font-medium">Buku Terbuka</span>
                  </>
                )}
              </div>
              {selectedPeriod && (
                <div className="text-sm text-gray-600">
                  {isBookClosed ? (
                    <div>Ditutup pada: {formatDate(selectedPeriod.closedDate || new Date())}</div>
                  ) : (
                    <div>Berlangsung: {formatDate(selectedPeriod.startDate)} - {formatDate(selectedPeriod.endDate)}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {selectedPeriod && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Income Card */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg shadow-md p-5 border-l-4 border-green-500">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Pemasukan</p>
                    <h3 className="text-xl font-bold text-gray-800 mt-1">
                      {formatCurrency(summary.totalIncome)}
                    </h3>
                  </div>
                  <div className="bg-green-200 rounded-full h-10 w-10 flex items-center justify-center">
                    <FaPlusCircle className="text-green-600" />
                  </div>
                </div>
              </div>

              {/* Expense Card */}
              <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg shadow-md p-5 border-l-4 border-red-500">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Pengeluaran</p>
                    <h3 className="text-xl font-bold text-gray-800 mt-1">
                      {formatCurrency(summary.totalExpense)}
                    </h3>
                  </div>
                  <div className="bg-red-200 rounded-full h-10 w-10 flex items-center justify-center">
                    <FaMinusCircle className="text-red-600" />
                  </div>
                </div>
              </div>

              {/* Balance Card */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md p-5 border-l-4 border-blue-500">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Saldo</p>
                    <h3 className="text-xl font-bold text-gray-800 mt-1">
                      {formatCurrency(balance)}
                    </h3>
                  </div>
                  <div className="bg-blue-200 rounded-full h-10 w-10 flex items-center justify-center">
                    <FaChartLine className="text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Actions Card */}
              <div className="bg-white rounded-lg shadow-md p-5">
                <div className="flex flex-col h-full justify-between">
                  <p className="text-sm font-medium text-gray-600">Aksi</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {isBookClosed ? (
                      <button 
                        onClick={handleOpenBook}
                        className="flex-1 bg-green-100 hover:bg-green-200 text-green-800 text-xs md:text-sm py-2 px-3 rounded-md flex items-center justify-center transition-colors"
                      >
                        <FaPlusCircle className="mr-1" />
                        <span>Buka Periode Baru</span>
                      </button>
                    ) : (
                      <button 
                        onClick={handleCloseBook}
                        className="flex-1 bg-red-100 hover:bg-red-200 text-red-800 text-xs md:text-sm py-2 px-3 rounded-md flex items-center justify-center transition-colors"
                      >
                        <FaLock className="mr-1" />
                        <span>Tutup Buku</span>
                      </button>
                    )}
                    <button 
                      onClick={exportToExcel}
                      className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs md:text-sm py-2 px-3 rounded-md flex items-center justify-center transition-colors"
                    >
                      <FaDownload className="mr-1" />
                      <span>Ekspor Excel</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial History Table Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <h3 className="text-lg font-semibold text-gray-800">Riwayat Transaksi</h3>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search Input */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Cari transaksi..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full sm:w-64 pl-9 pr-3 py-2 border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FaSearch className="text-gray-400" />
                      </div>
                    </div>

                    {/* Filter Dropdown */}
                    <div className="relative">
                      <select
                        value={filterType}
                        onChange={handleFilterChange}
                        className="w-full sm:w-auto pl-9 pr-8 py-2 border border-gray-300 rounded-md text-gray-800 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        <option value="all">Semua Transaksi</option>
                        <option value="income">Pemasukan</option>
                        <option value="expense">Pengeluaran</option>
                      </select>
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FaFilter className="text-gray-400" />
                      </div>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Sort Button */}
                    <button
                      onClick={toggleSortDirection}
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors"
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

              {isLoading ? (
                <div className="p-6 flex justify-center items-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  {filteredHistory.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tanggal
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Kategori
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Keterangan
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Jumlah
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredHistory.map(transaction => (
                            <tr key={transaction.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(transaction.date)}
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
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-gray-500">Tidak ada transaksi untuk ditampilkan</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="border-t border-gray-200 pt-4 mt-8">
          <p className="text-center text-gray-500 text-sm">
            Sistem Pengelolaan Anggaran Gereja © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}