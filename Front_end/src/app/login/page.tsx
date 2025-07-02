'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  patientLogin,
  doctorLogin,
  sendDoctorOtp,
  verifyDoctorOtp,
  resetDoctorPassword,
} from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();

  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (role === 'patient') {
        const res = await patientLogin(phoneNumber, password);
        if (res.token) {
          localStorage.setItem('token', res.token);
          router.push('/');
        } else {
          setError(res.message || 'Login failed');
        }
      } else {
        const res = await doctorLogin(email, password);
        if (res.token) {
          localStorage.setItem('token', res.token);
          const encodedEmail = encodeURIComponent(email);
          router.push(`/doctor-dashboard?email=${encodedEmail}`);
        } else {
          setError(res.message || 'Login failed');
        }
      }
    } catch (err) {
      console.error(err);
      setError('Login error');
    }
  };

  const handleSendOtp = async () => {
    setModalError('');
    try {
      await sendDoctorOtp(email);
      setOtpSent(true);
      setModalSuccess('OTP sent to your email.');
    } catch (err: any) {
      setModalError(err.message);
    }
  };

  const handleVerifyOtp = async () => {
    setModalError('');
    try {
      const res = await verifyDoctorOtp(email, enteredOtp);
      if (res.valid) {
        setOtpVerified(true);
        setModalSuccess('OTP verified. Please enter a new password.');
      } else {
        setModalError('Invalid OTP');
      }
    } catch (err: any) {
      setModalError(err.message);
    }
  };

  const handleResetPassword = async () => {
    setModalError('');
    try {
      await resetDoctorPassword(email, enteredOtp, newPassword);
      setModalSuccess('Password reset successful. Please login.');
      setShowModal(false);
      setOtpSent(false);
      setOtpVerified(false);
      setEnteredOtp('');
      setNewPassword('');
    } catch (err: any) {
      setModalError(err.message);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center relative"
      style={{ backgroundImage: "url('/hospital-banner.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60 z-0" />

      <div className="relative z-10 bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setRole('patient')}
            className={`px-4 py-2 rounded-l ${
              role === 'patient' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Patient
          </button>
          <button
            onClick={() => setRole('doctor')}
            className={`px-4 py-2 rounded-r ${
              role === 'doctor' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Doctor
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {role === 'patient' ? (
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border px-4 py-2 rounded"
              required
            />
          ) : (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-4 py-2 rounded"
              required
            />
          )}

          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded"
            required
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="showPassword" className="text-sm cursor-pointer">
              Show Password
            </label>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>

          {role === 'patient' && (
            <button
              type="button"
              onClick={() => router.push('/patient-register')}
              className="w-full text-blue-600 hover:underline mt-2 text-sm"
            >
              Don't have an account? Register here
            </button>
          )}

          {role === 'doctor' && (
            <>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="w-full text-blue-600 hover:underline mt-2 text-sm"
              >
                Forgot Password?
              </button>

              <button
                type="button"
                onClick={() => router.push('/doctor-register')}
                className="w-full text-blue-600 hover:underline mt-1 text-sm"
              >
                Don't have an account? Register as Doctor
              </button>
            </>
          )}
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-4">Reset Password</h2>

            {!otpSent ? (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border p-2 rounded w-full mb-4"
                />
                <button
                  onClick={handleSendOtp}
                  className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
                >
                  Send OTP
                </button>
              </>
            ) : !otpVerified ? (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  className="border p-2 rounded w-full mb-4"
                />
                <button
                  onClick={handleVerifyOtp}
                  className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
                >
                  Verify OTP
                </button>
              </>
            ) : (
              <>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border p-2 rounded w-full mb-4"
                />
                <button
                  onClick={handleResetPassword}
                  className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700"
                >
                  Reset Password
                </button>
              </>
            )}

            {modalError && <p className="text-red-500 mt-3 text-sm">{modalError}</p>}
            {modalSuccess && <p className="text-green-500 mt-3 text-sm">{modalSuccess}</p>}

            <button
              onClick={() => {
                setShowModal(false);
                setOtpSent(false);
                setOtpVerified(false);
                setEnteredOtp('');
                setNewPassword('');
                setModalError('');
                setModalSuccess('');
              }}
              className="mt-4 text-gray-500 hover:underline text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
