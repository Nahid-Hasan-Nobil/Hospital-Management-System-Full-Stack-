'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  createAppointment,
  getAppointmentsByPhone,
  deleteAppointment,
  updateAppointment,
} from '@/lib/api';
import jsPDF from 'jspdf';

export default function AppointmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    patientName: '',
    patientPhoneNumber: '',
    doctorName: '',
    doctorEmail: '',
    appointmentDate: '',
  });

  const [searchPhone, setSearchPhone] = useState('');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newDate, setNewDate] = useState('');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const doctorName = searchParams.get('doctorName');
    const doctorEmail = searchParams.get('doctorEmail');
    if (doctorName || doctorEmail) {
      setForm((prev) => ({
        ...prev,
        doctorName: doctorName || '',
        doctorEmail: doctorEmail || '',
      }));
    }
  }, [searchParams]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await createAppointment(form, token!);
      setMessage(res.message);
      setForm({
        patientName: '',
        patientPhoneNumber: '',
        doctorName: '',
        doctorEmail: '',
        appointmentDate: '',
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSearch = async () => {
    setError('');
    setMessage('');
    try {
      const res = await getAppointmentsByPhone(searchPhone, token!);
      setAppointments(res.appointments || []);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const confirmDelete = (id: number) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const performDelete = async () => {
    if (!selectedId) return;
    setError('');
    setMessage('');
    try {
      await deleteAppointment(selectedId, token!);
      setAppointments((prev) => prev.filter((appt) => appt.id !== selectedId));
      setMessage(`Appointment ID ${selectedId} cancelled.`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setShowModal(false);
      setSelectedId(null);
    }
  };

  const handleUpdate = async (id: number) => {
    if (!newDate) return alert('Please select a new date');
    try {
      await updateAppointment(id, { appointmentDate: newDate }, token!);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, appointmentDate: newDate } : a))
      );
      setMessage(`Appointment ID ${id} rescheduled.`);
      setEditingId(null);
      setNewDate('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const printAppointment = (appt: any) => {
    const printContent = `
      <html>
        <head>
          <title>Print Appointment</title>
        </head>
        <body>
          <h2>Appointment Details</h2>
          <p><strong>Patient Name:</strong> ${appt.patientName}</p>
          <p><strong>Phone Number:</strong> ${appt.patientPhoneNumber}</p>
          <p><strong>Doctor:</strong> ${appt.doctorName} (${appt.doctorEmail})</p>
          <p><strong>Date:</strong> ${new Date(appt.appointmentDate).toLocaleString()}</p>
          <hr/>
          <p>Thank you for choosing our service!</p>
        </body>
      </html>
    `;
    const newWin = window.open('', '', 'width=600,height=600');
    if (newWin) {
      newWin.document.write(printContent);
      newWin.document.close();
      newWin.print();
    }
  };

  const downloadPDF = (appt: any) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Appointment Confirmation', 20, 20);
    doc.setFontSize(12);
    doc.text(`Patient: ${appt.patientName}`, 20, 40);
    doc.text(`Phone: ${appt.patientPhoneNumber}`, 20, 50);
    doc.text(`Doctor: ${appt.doctorName} (${appt.doctorEmail})`, 20, 60);
    doc.text(`Date: ${new Date(appt.appointmentDate).toLocaleString()}`, 20, 70);
    doc.text(`Thank you for your appointment!`, 20, 90);
    doc.save(`appointment_${appt.id}.pdf`);
  };

  const filteredAppointments = appointments.filter((appt) => {
    const now = new Date();
    const apptDate = new Date(appt.appointmentDate);
    if (filter === 'upcoming') return apptDate > now;
    if (filter === 'past') return apptDate < now;
    return true;
  });

  return (
    <div
      className="min-h-screen bg-cover bg-center p-6 relative"
      style={{ backgroundImage: `url('/hospital-banner.jpg')` }}
    >
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={() => router.push('/')}
          className="bg-white text-black font-semibold px-4 py-2 rounded shadow hover:bg-gray-200"
        >
          ⬅️ Back to Home
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow backdrop-blur-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Book an Appointment</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="patientName" placeholder="Patient Name" className="border p-2 rounded" value={form.patientName} onChange={handleChange} required />
          <input name="patientPhoneNumber" placeholder="Patient Phone" className="border p-2 rounded" value={form.patientPhoneNumber} onChange={handleChange} required />
          <input name="doctorName" placeholder="Doctor Name" className="border p-2 rounded" value={form.doctorName} onChange={handleChange} required />
          <input name="doctorEmail" placeholder="Doctor Email" className="border p-2 rounded" value={form.doctorEmail} onChange={handleChange} required />
          <input name="appointmentDate" type="datetime-local" className="border p-2 rounded col-span-full" value={form.appointmentDate} onChange={handleChange} required />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 col-span-full">
            Submit Appointment
          </button>
        </form>

        {message && <p className="mt-4 text-green-600 font-semibold text-center">{message}</p>}
        {error && <p className="mt-4 text-red-600 font-semibold text-center">{error}</p>}
      </div>

      <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded shadow backdrop-blur-md">
        <h2 className="text-xl font-bold mb-4">Search Appointments</h2>
        <div className="flex gap-4 mb-4">
          <input type="text" placeholder="Enter Patient Phone" value={searchPhone} onChange={(e) => setSearchPhone(e.target.value)} className="border p-2 rounded w-full" />
          <button onClick={handleSearch} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Search
          </button>
        </div>

        {appointments.length > 0 && (
          <div className="flex justify-center gap-4 mb-4">
            <button onClick={() => setFilter('all')} className={`px-4 py-1 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>All</button>
            <button onClick={() => setFilter('upcoming')} className={`px-4 py-1 rounded ${filter === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Upcoming</button>
            <button onClick={() => setFilter('past')} className={`px-4 py-1 rounded ${filter === 'past' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Past</button>
          </div>
        )}

        {filteredAppointments.length > 0 ? (
          <ul className="divide-y">
            {filteredAppointments.map((appt) => (
              <li key={appt.id} className="py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p><strong>Date:</strong> {new Date(appt.appointmentDate).toLocaleString()}</p>
                    <p><strong>Doctor:</strong> {appt.doctor?.name || appt.doctorName} ({appt.doctor?.email || appt.doctorEmail})</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => confirmDelete(appt.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Cancel</button>
                    <button onClick={() => setEditingId(editingId === appt.id ? null : appt.id)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                      {editingId === appt.id ? 'Close' : 'Update'}
                    </button>
                    <button onClick={() => downloadPDF(appt)} className="bg-blue-800 text-white px-3 py-1 rounded hover:bg-blue-900">
                      📄 Download
                    </button>
                  </div>
                </div>

                {editingId === appt.id && (
                  <div className="mt-3 space-y-2">
                    <input type="datetime-local" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="border p-2 rounded w-full" />
                    <button onClick={() => handleUpdate(appt.id)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      Save New Date
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 mt-4 text-center">No appointments found.</p>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded shadow-lg w-[90%] max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-4">Confirm Cancellation</h2>
            <p className="mb-6">Are you sure you want to cancel appointment ID {selectedId}?</p>
            <div className="flex justify-center gap-4">
              <button onClick={performDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Yes, Cancel
              </button>
              <button onClick={() => setShowModal(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                No, Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
