'use client'
import React, { useState, useRef } from 'react';
import { 
  FaCalendarAlt, 
  FaListAlt, 
  FaMoneyBillWave, 
  FaStickyNote, 
  FaSave, 
  FaArrowLeft, 
  FaCheckCircle,
  FaChurch,
  FaChartLine,
  FaPlusCircle,
  FaMinusCircle,
  FaHistory,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

const incomeCategories = [
  { id: 1, name: 'Persembahan Minggu' },
  { id: 2, name: 'Persembahan Khusus' },
  { id: 3, name: 'Perpuluhan' },
  { id: 4, name: 'Sumbangan' },
  { id: 5, name: 'Donasi' },
  { id: 6, name: 'Kotak Persembahan' },
  { id: 7, name: 'Persembahan Syukur' },
  { id: 8, name: 'Lainnya' }
];

export default function IncomeForm() {
  const router = useRouter();
  const pathname = usePathname();
  const formRef = useRef();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    amount: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Tanggal wajib diisi';
    if (!formData.category) newErrors.category = 'Kategori wajib dipilih';
    if (!formData.amount || formData.amount <= 0) newErrors.amount = 'Jumlah harus lebih dari 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const result = await Swal.fire({
      title: 'Konfirmasi Pencatatan',
      html: `
        <div class="text-left">
          <p><strong>Tanggal:</strong> ${formData.date}</p>
          <p><strong>Kategori:</strong> ${formData.category}</p>
          <p><strong>Jumlah:</strong> Rp ${parseFloat(formData.amount).toLocaleString('id-ID')}</p>
          <p><strong>Keterangan:</strong> ${formData.description || '-'}</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Simpan',
      cancelButtonText: 'Kembali'
    });

    if (result.isConfirmed) {
      // Handle form submission - API call would go here
      console.log('Submitting data:', formData);
      
      Swal.fire({
        title: 'Berhasil!',
        text: 'Data pemasukan telah disimpan',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        router.push('/admin/dashboard');
      });
    }
  };

  const handleCancel = async () => {
    // Check if form has been modified
    const isFormModified = 
      formData.category !== '' ||
      formData.amount !== '' ||
      formData.description !== '';
    
    if (isFormModified) {
      const result = await Swal.fire({
        title: 'Batalkan Pencatatan?',
        text: 'Data yang telah diisi akan hilang',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Batalkan',
        cancelButtonText: 'Lanjutkan Mengisi'
      });
      
      if (result.isConfirmed) {
        router.push('/admin/dashboard');
      }
    } else {
      router.push('/admin/dashboard');
    }
  };

  // Format currency as user types
  const handleAmountChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    setFormData({
      ...formData,
      amount: value
    });
    
    if (errors.amount) {
      setErrors({
        ...errors,
        amount: ''
      });
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '';
    return new Intl.NumberFormat('id-ID').format(amount);
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
          </nav>
        )}
      </div>

      {/* Main content */}
      <div className="md:ml-64 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
              <div className="flex items-center space-x-2">
                <FaMoneyBillWave className="text-white text-2xl" />
                <h1 className="text-2xl font-bold text-white">Catat Pemasukan</h1>
              </div>
              <p className="text-blue-100 mt-1">Formulir pencatatan pemasukan keuangan gereja</p>
            </div>

            {/* Form */}
            <form ref={formRef} onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* Date Input */}
                <div className="form-group">
                  <label className="block text-gray-700 font-medium mb-2">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-blue-500 mr-2" />
                      Tanggal Transaksi
                    </div>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 focus:border-blue-500 outline-none transition text-gray-800 ${
                      errors.date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                  )}
                </div>

                {/* Category Dropdown */}
                <div className="form-group">
                  <label className="block text-gray-700 font-medium mb-2">
                    <div className="flex items-center">
                      <FaListAlt className="text-blue-500 mr-2" />
                      Kategori
                    </div>
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg appearance-none focus:ring focus:ring-blue-300 focus:border-blue-500 outline-none transition text-gray-800 bg-white ${
                        errors.category ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">-- Pilih Kategori --</option>
                      {incomeCategories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                  )}
                </div>

                {/* Amount Input */}
                <div className="form-group">
                  <label className="block text-gray-700 font-medium mb-2">
                    <div className="flex items-center">
                      <FaMoneyBillWave className="text-blue-500 mr-2" />
                      Jumlah (Rp)
                    </div>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500">Rp</span>
                    </div>
                    <input
                      type="text"
                      name="amount"
                      value={formatCurrency(formData.amount)}
                      onChange={handleAmountChange}
                      placeholder="0"
                      className={`w-full p-3 pl-10 border rounded-lg focus:ring focus:ring-blue-300 focus:border-blue-500 outline-none transition text-gray-800 ${
                        errors.amount ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                  )}
                </div>

                {/* Description Textarea */}
                <div className="form-group">
                  <label className="block text-gray-700 font-medium mb-2">
                    <div className="flex items-center">
                      <FaStickyNote className="text-blue-500 mr-2" />
                      Keterangan
                    </div>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Tambahkan keterangan (opsional)"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:border-blue-500 outline-none transition text-gray-800"
                  ></textarea>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 pt-4">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
                  >
                    <FaSave className="mr-2" />
                    <span>Simpan Pemasukan</span>
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

          {/* Tips Card */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FaCheckCircle className="text-blue-500 mt-0.5" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Tips pencatatan keuangan</h3>
                <div className="mt-2 text-sm text-blue-700 space-y-1">
                  <p>• Pastikan tanggal transaksi sudah benar</p>
                  <p>• Pilih kategori yang paling sesuai</p>
                  <p>• Berikan keterangan yang jelas untuk memudahkan pencarian</p>
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