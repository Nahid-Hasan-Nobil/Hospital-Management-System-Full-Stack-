'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  getAppointmentsByDoctorEmail,
  deleteAppointment,
} from '@/lib/api';

export default function DoctorDashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const emailFromUrl = searchParams.get('email') || '';
  const [searchEmail, setSearchEmail] = useState(emailFromUrl);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleSearch = async () => {
    if (!searchEmail) {
      setError('Please enter an email to search.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await getAppointmentsByDoctorEmail(searchEmail, token);
      setAppointments(res.appointments || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch appointments.');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelConfirm = (id: number) => {
    setConfirmId(id);
  };

  const handleCancelAppointment = async () => {
    if (!confirmId) return;
    try {
      await deleteAppointment(confirmId, token);
      setAppointments((prev) => prev.filter((appt) => appt.id !== confirmId));
    } catch (err: any) {
      alert(err.message || 'Failed to cancel appointment');
    } finally {
      setConfirmId(null);
    }
  };

  const handleViewMessages = () => {
    alert('Messaging feature coming soon...');
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center p-6 relative"
      style={{ backgroundImage: "url('/hospital-banner.jpg')" }}
    >
      {/* Overlay if modal is active */}
      <div className={confirmId ? 'blur-sm pointer-events-none' : ''}>
        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="absolute top-6 right-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
        >
          Logout
        </button>

        <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-md p-6 rounded shadow mt-6">
          <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">
            Welcome, {emailFromUrl || 'Doctor'} 👨‍⚕️
          </h1>

          {/* Search Section */}
          <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            <input
              type="email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="Enter your email to search appointments"
              className="flex-1 border p-2 rounded"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              🔍 Show Appointments
            </button>
            <button
              onClick={handleViewMessages}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              📨 View Messages
            </button>
          </div>

          {/* Feedback */}
          {loading && <p className="text-gray-500">Searching appointments...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {/* Appointments List */}
          {appointments.length > 0 ? (
            <ul className="divide-y">
              {appointments.map((appt) => (
                <li key={appt.id} className="py-4 flex justify-between items-start gap-4">
                  <div>
                    <p><strong>Patient:</strong> {appt.patientName}</p>
                    <p><strong>Phone:</strong> {appt.patientPhoneNumber}</p>
                    <p><strong>Date:</strong> {new Date(appt.appointmentDate).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => handleCancelConfirm(appt.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                     Cancel
                  </button>
                </li>
              ))}
            </ul>
          ) : !loading && (
            <p className="text-gray-100 bg-red-400 p-2 rounded text-center">No appointments found for this email.</p>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {confirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded shadow text-center max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Cancel Appointment</h2>
            <p className="mb-6">Are you sure you want to cancel this appointment?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleCancelAppointment}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Cancel
              </button>
              <button
                onClick={() => setConfirmId(null)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                No, Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
