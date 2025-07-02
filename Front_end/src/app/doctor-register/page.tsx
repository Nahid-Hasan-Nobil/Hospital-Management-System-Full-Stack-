'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doctorRegister } from '@/lib/api';

export default function DoctorRegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialty: '',
    education: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await doctorRegister(formData);
      setSuccess('Doctor registered successfully! Redirecting to login...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/hospital-banner.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60 z-0" />
      <div className="relative z-10 bg-white p-8 rounded shadow max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Doctor Registration</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="specialty"
            placeholder="Specialty (e.g., Cardiologist)"
            value={formData.specialty}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="education"
            placeholder="Education (optional)"
            value={formData.education}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="w-full text-blue-600 hover:underline mt-2 text-sm"
          >
            Already have an account? Login
          </button>
        </form>
      </div>
    </div>
  );
}
