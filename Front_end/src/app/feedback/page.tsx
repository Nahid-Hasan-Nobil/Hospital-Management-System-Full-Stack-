'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  createFeedback,
  getFeedbackByPhoneNumber,
  updateFeedback,
  deleteFeedback,
} from '@/lib/api';

export default function FeedbackPage() {
  const searchParams = useSearchParams();

  const doctorNameFromQuery = searchParams.get('doctorName');
  const doctorEmailFromQuery = searchParams.get('doctorEmail');

  const [form, setForm] = useState({
    patientName: '',
    patientPhoneNumber: '',
    doctorName: '',
    doctorEmail: '',
    rating: 5,
    comment: '',
  });

  const [searchPhone, setSearchPhone] = useState('');
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: '' });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    if (doctorNameFromQuery && doctorEmailFromQuery) {
      setForm((prev) => ({
        ...prev,
        doctorName: doctorNameFromQuery,
        doctorEmail: doctorEmailFromQuery,
      }));
    }
  }, [doctorNameFromQuery, doctorEmailFromQuery]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await createFeedback(form);
      setMessage('Feedback submitted successfully');
      setForm({
        patientName: '',
        patientPhoneNumber: '',
        doctorName: doctorNameFromQuery || '',
        doctorEmail: doctorEmailFromQuery || '',
        rating: 5,
        comment: '',
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSearch = async () => {
    setMessage('');
    setError('');
    try {
      const res = await getFeedbackByPhoneNumber(searchPhone);
      setFeedbacks(res);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdate = async (id: number) => {
    if (!searchPhone) return alert('Patient phone number required');
    try {
      await updateFeedback(id, {
        patientPhoneNumber: searchPhone,
        rating: editForm.rating,
        comment: editForm.comment,
      });
      setMessage('Feedback updated successfully');
      setEditingId(null);
      handleSearch();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteId(id);
  };

  const performDelete = async () => {
    if (!deleteId || !searchPhone) return;
    try {
      await deleteFeedback(deleteId, searchPhone);
      setMessage('Feedback deleted');
      setFeedbacks((prev) => prev.filter((f) => f.id !== deleteId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: "url('/hospital-banner.jpg')" }}
    >
      {/* Form */}
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow backdrop-blur-md">
        <h1 className="text-xl font-bold mb-4 text-center">Submit Feedback</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="patientName"
            placeholder="Patient Name"
            value={form.patientName}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            name="patientPhoneNumber"
            placeholder="Phone Number"
            value={form.patientPhoneNumber}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            name="doctorName"
            placeholder="Doctor Name"
            value={form.doctorName}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            name="doctorEmail"
            placeholder="Doctor Email"
            value={form.doctorEmail}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          {/* Stars */}
          <div className="col-span-full flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setForm({ ...form, rating: star })}
                className={`text-2xl ${
                  star <= form.rating ? 'text-yellow-400' : 'text-gray-300'
                } hover:scale-110 transition-transform`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            name="comment"
            placeholder="Comment"
            value={form.comment}
            onChange={handleChange}
            className="border p-2 rounded col-span-full"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 col-span-full"
          >
            Submit Feedback
          </button>
        </form>
        {message && <p className="text-green-600 mt-4 text-center">{message}</p>}
        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
      </div>

      {/* Search Section */}
      <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded shadow backdrop-blur-md">
        <h2 className="text-lg font-bold mb-4">Search Your Feedbacks</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Enter your phone number"
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleSearch}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Search
          </button>
        </div>

        {feedbacks.length > 0 ? (
          <ul className="divide-y">
            {feedbacks.map((fb) => (
              <li key={fb.id} className="py-4">
                <p>
                  <strong>Doctor:</strong> {fb.doctor.name} ({fb.doctor.email})
                </p>
                <p>
                  <strong>Rating:</strong>{' '}
                  <span className="text-yellow-400">
                    {'★'.repeat(fb.rating)}
                  </span>
                  <span className="text-gray-300">
                    {'★'.repeat(5 - fb.rating)}
                  </span>
                </p>
                <p>
                  <strong>Comment:</strong> {fb.comment || 'No comment'}
                </p>

                {editingId === fb.id ? (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setEditForm({ ...editForm, rating: star })
                          }
                          className={`text-2xl ${
                            star <= editForm.rating
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          } hover:scale-110 transition-transform`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={editForm.comment}
                      onChange={(e) =>
                        setEditForm({ ...editForm, comment: e.target.value })
                      }
                      className="border p-2 rounded w-full"
                    />
                    <button
                      onClick={() => handleUpdate(fb.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="ml-2 bg-gray-400 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        setEditingId(fb.id);
                        setEditForm({
                          rating: fb.rating,
                          comment: fb.comment || '',
                        });
                      }}
                      className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(fb.id)}
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-center">No feedbacks found.</p>
        )}
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-2">Confirm Delete</h2>
            <p>Are you sure you want to delete this feedback?</p>
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={performDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
