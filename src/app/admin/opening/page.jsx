'use client'
import React, { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, 
  FaMoneyBillWave,
  FaSave, 
  FaArrowLeft,
  FaChurch,
  FaChartLine,
  FaPlusCircle,
  FaMinusCircle,
  FaHistory,
  FaBars,
  FaTimes,
  FaBook,
  FaInfoCircle,
  FaExclamationTriangle,
  FaCheckCircle
} from 'react-icons/fa';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

export default function OpenBookPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPreviousPeriod, setHasPreviousPeriod] = useState(false);
  const [previousPeriodInfo, setPreviousPeriodInfo] = useState(null);
  const [formData, setFormData] = useState({
    initialBalance: '',
    startDate: '',
    endDate: '',
    name: ''
  });
  const [errors, setErrors] = useState({});
  
  // Fetch previous period data
  useEffect(() => {
    // Simulate API call to get previous period data
    setIsLoading(true);
    
    setTimeout(() => {
      // Mock data - replace with actual API call
      const mockPreviousPeriod = {
        id: 5,
        name: "April 2023",
        startDate: "2023-04-01",
        endDate: "2023-04-30",
        closedDate: "2023-05-01",
        finalBalance: 12500000
      };

      // Uncomment to test when there's no previous period
      // const mockPreviousPeriod = null;
      
      if (mockPreviousPeriod) {
        setHasPreviousPeriod(true);
        setPreviousPeriodInfo(mockPreviousPeriod);
        
        // Set initial form values
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        // Format dates as YYYY-MM-DD
        const formatDate = (date) => {
          return date.toISOString().split('T')[0];
        };
        
        // Generate a name for the new period (e.g., "Mei 2023")
        const monthNames = [
          "Januari", "Februari", "Maret", "April", "Mei", "Juni",
          "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];
        const periodName = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        
        setFormData({
          initialBalance: mockPreviousPeriod.finalBalance.toString(),
          startDate: formatDate(firstDayOfMonth),
          endDate: formatDate(lastDayOfMonth),
          name: periodName
        });
      } else {
        setHasPreviousPeriod(false);
        
        // Set default dates even if no previous period
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        const formatDate = (date) => {
          return date.toISOString().split('T')[0];
        };
        
        const monthNames = [
          "Januari", "Februari", "Maret", "April", "Mei", "Juni",
          "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];
        const periodName = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        
        setFormData({
          initialBalance: '',
          startDate: formatDate(firstDayOfMonth),
          endDate: formatDate(lastDayOfMonth),
          name: periodName
        });
      }
      
      setIsLoading(false);
    }, 1000);
  }, []);

  const isActive = (path) => {
    return pathname === path;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Handle date change with automatic period name update
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => {
      const newData = {
        ...prevData,
        [name]: value
      };

      // If it's the start date, update the period name
      if (name === 'startDate' && value) {
        const date = new Date(value);
        const monthNames = [
          "Januari", "Februari", "Maret", "April", "Mei", "Juni",
          "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];
        newData.name = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      }

      return newData;
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleInitialBalanceChange = (e) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, '');
    
    setFormData({
      ...formData,
      initialBalance: value
    });
    
    if (errors.initialBalance) {
      setErrors({
        ...errors,
        initialBalance: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate initial balance
    if (!hasPreviousPeriod && !formData.initialBalance) {
      newErrors.initialBalance = 'Saldo awal wajib diisi';
    }
    
    // Validate start date
    if (!formData.startDate) {
      newErrors.startDate = 'Tanggal awal periode wajib diisi';
    }
    
    // Validate end date
    if (!formData.endDate) {
      newErrors.endDate = 'Tanggal akhir periode wajib diisi';
    } else if (formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'Tanggal akhir harus setelah tanggal awal';
    }

    // Validate period name
    if (!formData.name.trim()) {
      newErrors.name = 'Nama periode wajib diisi';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const result = await Swal.fire({
      title: 'Buka Pembukuan Baru',
      html: `
        <div class="text-left">
          <p><strong>Periode:</strong> ${formData.name}</p>
          <p><strong>Saldo Awal:</strong> Rp ${parseFloat(formData.initialBalance).toLocaleString('id-ID')}</p>
          <p><strong>Tanggal Mulai:</strong> ${formatDateDisplay(formData.startDate)}</p>
          <p><strong>Tanggal Berakhir:</strong> ${formatDateDisplay(formData.endDate)}</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Buka Pembukuan',
      cancelButtonText: 'Batalkan'
    });

    if (result.isConfirmed) {
      // Handle form submission - API call would go here
      console.log('Submitting data:', formData);
      
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        
        Swal.fire({
          title: 'Berhasil!',
          text: `Pembukuan periode ${formData.name} berhasil dibuka`,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          router.push('/admin/report');
        });
      }, 1000);
    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: 'Batalkan Pembukuan?',
      text: 'Data yang telah diisi akan hilang',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Batalkan',
      cancelButtonText: 'Lanjutkan Mengisi'
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/admin/report');
      }
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return '';
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
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
        <div className="max-w-4xl mx-auto">
          {/* Header with back button */}
          <div className="flex items-center mb-6">
            <button 
              onClick={handleCancel}
              className="mr-4 text-gray-600 hover:text-gray-800 transition-colors"
              aria-label="Kembali"
            >
              <FaArrowLeft className="text-xl" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Buka Pembukuan Periode Baru</h2>
              <p className="text-gray-600">Buat periode pembukuan baru untuk mencatat transaksi keuangan</p>
            </div>
          </div>

          {isLoading ? (
            <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Memuat data...</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Previous Period Info Card (if available) */}
              {hasPreviousPeriod && (
                <div className="bg-blue-50 p-4 border-l-4 border-blue-500">
                  <div className="flex items-start">
                    <FaInfoCircle className="text-blue-600 mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium text-blue-800">Informasi Periode Sebelumnya</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        Pembukuan periode <strong>{previousPeriodInfo.name}</strong> telah ditutup pada {formatDateDisplay(previousPeriodInfo.closedDate)} dengan saldo akhir sebesar <strong>Rp {previousPeriodInfo.finalBalance.toLocaleString('id-ID')}</strong>.
                      </p>
                      <p className="text-sm text-blue-700 mt-1">
                        Saldo akhir tersebut akan otomatis menjadi saldo awal untuk periode baru.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6">
                  {/* Period Name */}
                  <div className="form-group">
                    <label className="block text-gray-700 font-medium mb-2">
                      <div className="flex items-center">
                        <FaBook className="text-blue-500 mr-2" />
                        Nama Periode
                      </div>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 focus:border-blue-500 outline-none transition text-gray-800 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="contoh: Mei 2023"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  
                  {/* Initial Balance Input */}
                  <div className="form-group">
                    <label className="block text-gray-700 font-medium mb-2">
                      <div className="flex items-center">
                        <FaMoneyBillWave className="text-blue-500 mr-2" />
                        Saldo Awal (Rp)
                      </div>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-gray-500">Rp</span>
                      </div>
                      <input
                        type="text"
                        name="initialBalance"
                        value={formatCurrency(formData.initialBalance)}
                        onChange={handleInitialBalanceChange}
                        placeholder="0"
                        className={`w-full p-3 pl-10 border rounded-lg focus:ring focus:ring-blue-300 focus:border-blue-500 outline-none transition text-gray-800 ${
                          errors.initialBalance ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={hasPreviousPeriod}
                      />
                      {hasPreviousPeriod && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <FaCheckCircle className="text-green-500" />
                        </div>
                      )}
                    </div>
                    {errors.initialBalance ? (
                      <p className="text-red-500 text-sm mt-1">{errors.initialBalance}</p>
                    ) : hasPreviousPeriod ? (
                      <p className="text-sm text-gray-600 mt-1">Saldo awal diambil dari periode sebelumnya</p>
                    ) : (
                      <p className="text-sm text-gray-600 mt-1">Masukkan saldo awal untuk pembukuan baru</p>
                    )}
                  </div>

                  {/* Date Range */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Start Date */}
                    <div className="form-group">
                      <label className="block text-gray-700 font-medium mb-2">
                        <div className="flex items-center">
                          <FaCalendarAlt className="text-blue-500 mr-2" />
                          Tanggal Awal Periode
                        </div>
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleDateChange}
                        className={`w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 focus:border-blue-500 outline-none transition text-gray-800 ${
                          errors.startDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.startDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
                      )}
                    </div>

                    {/* End Date */}
                    <div className="form-group">
                      <label className="block text-gray-700 font-medium mb-2">
                        <div className="flex items-center">
                          <FaCalendarAlt className="text-blue-500 mr-2" />
                          Tanggal Akhir Periode
                        </div>
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleDateChange}
                        className={`w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 focus:border-blue-500 outline-none transition text-gray-800 ${
                          errors.endDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.endDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                      )}
                    </div>
                  </div>

                  {/* Warning */}
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Pembukuan periode baru akan membuat catatan keuangan baru. Pastikan periode sebelumnya sudah ditutup.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 pt-4">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
                    >
                      <FaSave className="mr-2" />
                      <span>Buka Pembukuan</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg border border-gray-300 transition-colors duration-300 flex items-center justify-center"
                    >
                      <FaArrowLeft className="mr-2" />
                      <span>Kembali</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Tips Card */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FaInfoCircle className="text-blue-500 mt-0.5" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Tips pembukuan keuangan</h3>
                <div className="mt-2 text-sm text-blue-700 space-y-1">
                  <p>• Periode pembukuan biasanya dibuat per bulan</p>
                  <p>• Saldo awal periode baru adalah saldo akhir periode sebelumnya</p>
                  <p>• Pastikan tanggal awal dan akhir periode sudah benar</p>
                </div>
              </div>
            </div>
          </div>
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
}