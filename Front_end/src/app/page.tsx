'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Check for token in localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/login');
  };

  const triggerLoginWarning = (message: string) => {
    setModalMessage(message);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white relative">
      {/* Blur overlay if modal is active */}
      <div className={showModal ? 'blur-sm pointer-events-none select-none' : ''}>
        {/* Header */}
        <header className="flex justify-between items-center p-6 bg-black bg-opacity-30">
          <div>
            <h1 className="text-2xl font-bold leading-tight">
              Healspire<br />Medical Institute
            </h1>
            <p className="text-sm text-gray-300">Inspiring Healing, Empowering Lives.</p>
          </div>
          <nav className="space-x-6 text-sm">
            <button className="hover:underline">About</button>
            <button className="hover:underline">Contact Us</button>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white font-semibold px-4 py-1 rounded hover:bg-red-600"
              >
                Log out
              </button>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="bg-white text-black font-semibold px-4 py-1 rounded hover:bg-gray-300"
              >
                Log in
              </button>
            )}
          </nav>
        </header>

        {/* Main Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6">
          {/* Sidebar Quick Actions */}
          <aside className="col-span-1 h-[500px] flex flex-col justify-evenly">
            <button
              onClick={() =>
                isLoggedIn
                  ? router.push('/doctors')
                  : triggerLoginWarning('Please log in to access this feature.')
              }
              className="bg-violet-300 text-black font-semibold py-4 px-6 rounded-lg flex items-center gap-4 shadow-lg hover:bg-violet-400"
            >
              <span className="text-2xl">🔍</span> Find a Doctor
            </button>

            <button
              onClick={() =>
                isLoggedIn
                  ? router.push('/appointments')
                  : triggerLoginWarning('Please log in to book an appointment.')
              }
              className="bg-violet-300 text-black font-semibold py-4 px-6 rounded-lg flex items-center gap-4 shadow-lg hover:bg-violet-400"
            >
              <span className="text-2xl">📅</span> Book Appointment
            </button>

            <button
              onClick={() =>
                isLoggedIn
                  ? router.push('/feedback')
                  : triggerLoginWarning('Please log in to provide feedback.')
              }
              className="bg-violet-300 text-black font-semibold py-4 px-6 rounded-lg flex items-center gap-4 shadow-lg hover:bg-violet-400"
            >
              <span className="text-2xl">💬</span> Give Feedback
            </button>
          </aside>

          {/* Banner */}
          <div className="col-span-1 md:col-span-4 h-[500px] rounded-lg overflow-hidden shadow-lg relative">
            <Image
              src="/hospital-banner.jpg"
              alt="Hospital Banner"
              width={1200}
              height={500}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-blue-900/30 p-10 flex flex-col justify-center text-white">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Welcome to Healspire Medical Institute
              </h1>
              <p className="text-lg max-w-xl">
                Delivering excellence in patient care with compassion, technology, and trust.
                Explore our departments and find expert care tailored to your needs.
              </p>
              <button
                className="bg-white text-black px-6 py-2 rounded mt-6 hover:bg-gray-200 font-semibold w-fit"
                onClick={() => router.push('/login')}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>

        {/* Department Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mt-10 pb-10">
          <button className="bg-white text-black px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow">
            <span className="text-xl">❤️</span> CARDIOLOGY
          </button>
          <button className="bg-white text-black px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow">
            <span className="text-xl">🧠</span> NEUROLOGY
          </button>
          <button className="bg-white text-black px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow">
            <span className="text-xl">👶</span> MOTHER & CHILD
          </button>
          <button className="bg-yellow-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-yellow-700">
            📋 View All Departments
          </button>
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg w-[90%] max-w-sm text-center">
            <h2 className="text-lg font-bold mb-4">Access Restricted</h2>
            <p className="mb-6">{modalMessage}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                OK
              </button>
              <button
                onClick={() => router.push('/login')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
