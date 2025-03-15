import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="flex flex-col gap-[32px] row-start-2 items-center max-w-3xl">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-blue-600 dark:text-blue-400">Finance Tracker</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">Manage your finances with ease and precision</p>
        </div>
        
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <ul className="list-disc list-inside text-sm/6 text-left font-medium space-y-2 text-gray-700 dark:text-gray-200">
            <li className="mb-2">Track income and expenses in real-time</li>
            <li className="mb-2">Generate detailed financial reports</li>
            <li className="mb-2">Set budgets and receive notifications</li>
            <li>Access your data securely from anywhere</li>
          </ul>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link 
            href="/admin/dashboard"
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm5 4a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm-2 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm2 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            Admin Dashboard
          </Link>
          <Link
            href="/signup"
            className="rounded-full border border-solid border-blue-600 dark:border-blue-400 transition-colors flex items-center justify-center hover:bg-blue-50 dark:hover:bg-gray-700 font-medium text-blue-600 dark:text-blue-400 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
          >
            Create Account
          </Link>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-gray-600 dark:text-gray-400">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="#features"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 1h10v8H5V6z" clipRule="evenodd" />
          </svg>
          Features
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="#pricing"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm7 5a1 1 0 10-2 0v1H8a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
          </svg>
          Pricing
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="#support"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Support
        </a>
      </footer>
    </div>
  );
}
