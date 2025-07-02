'use client';

import { useEffect, useState } from 'react';
import { getAllDoctors } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function FindDoctorsPage() {
  const router = useRouter();

  const [doctors, setDoctors] = useState<any[]>([]);
  const [specialty, setSpecialty] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllDoctors();
  }, []);

  const fetchAllDoctors = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllDoctors();
      setDoctors(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllDoctors();
      const filtered = data.filter((doctor: any) => {
        const matchesSpecialty = specialty
          ? doctor.specialty.toLowerCase().includes(specialty.toLowerCase())
          : true;
        const matchesName = name
          ? doctor.name.toLowerCase().includes(name.toLowerCase())
          : true;
        return matchesSpecialty && matchesName;
      });
      setDoctors(filtered);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return (
      <div className="flex gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <span key={i} className="text-yellow-400">★</span>
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={i} className="text-gray-300">★</span>
        ))}
      </div>
    );
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: "url('/hospital-banner.jpg')" }}
    >
      <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-center mb-6">Find Doctors</h1>

        {/* Filter Section */}
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Doctor Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Specialty (e.g., Cardiology)"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={handleFilter}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {loading && <p className="text-center text-gray-600">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Doctor Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold">{doctor.name}</h2>
                <p className="text-gray-600">{doctor.specialty}</p>
                <p className="text-sm text-gray-500">{doctor.email}</p>
                <div className="mt-2">{renderStars(doctor.averageRating || 4)}</div>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <button
                  onClick={() =>
                    router.push(
                      `/feedback?doctorName=${encodeURIComponent(doctor.name)}&doctorEmail=${encodeURIComponent(doctor.email)}`
                    )
                  }
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Give Feedback
                </button>
                <button
                  onClick={() =>
                    router.push(
                      `/appointments?doctorName=${encodeURIComponent(doctor.name)}&doctorEmail=${encodeURIComponent(doctor.email)}`
                    )
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Get Appointment
                </button>
                <button
                  onClick={() => alert('Coming soon...')}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Send Quick Message
                </button>
              </div>
            </div>
          ))}
        </div>

        {doctors.length === 0 && !loading && (
          <p className="text-center text-gray-600 mt-6">No doctors found.</p>
        )}
      </div>
    </div>
  );
}
