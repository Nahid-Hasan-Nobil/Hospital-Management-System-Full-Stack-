'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { patientRegister } from '@/lib/api';

export default function PatientRegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [phoneValid, setPhoneValid] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [match, setMatch] = useState(true);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const phoneRegex = /^[0-9]{10,15}$/;
    setPhoneValid(phoneRegex.test(phoneNumber));
  }, [phoneNumber]);

  useEffect(() => {
    if (password.length < 6) {
      setPasswordStrength('Too short');
    } else if (!/[A-Z]/.test(password)) {
      setPasswordStrength('Needs uppercase');
    } else if (!/[a-z]/.test(password)) {
      setPasswordStrength('Needs lowercase');
    } else if (!/[0-9]/.test(password)) {
      setPasswordStrength('Needs number');
    } else {
      setPasswordStrength('Strong');
    }
  }, [password]);

  useEffect(() => {
    setMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!phoneValid || passwordStrength !== 'Strong' || !match) {
      setError('Please fix all validation errors before submitting.');
      return;
    }

    try {
      await patientRegister({ name, phoneNumber, password });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 relative"
      style={{ backgroundImage: "url('/hospital-banner.jpg')" }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Form Card */}
      <div className="relative z-10 bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Patient Registration</h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-4 py-2 rounded"
            required
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className={`w-full border px-4 py-2 rounded ${!phoneValid ? 'border-red-500' : ''}`}
            required
          />
          {!phoneValid && (
            <p className="text-red-500 text-sm">Phone number must be 10–15 digits</p>
          )}

          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <p className={`text-sm ${passwordStrength === 'Strong' ? 'text-green-600' : 'text-yellow-600'}`}>
            Password strength: {passwordStrength}
          </p>

          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded"
            required
          />
          {!match && <p className="text-red-500 text-sm">Passwords do not match</p>}

          <div className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="cursor-pointer"
            />
            <label htmlFor="showPassword" className="cursor-pointer">
              Show Passwords
            </label>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Register
          </button>

          <button
            type="button"
            onClick={() => router.push('/login')}
            className="w-full text-blue-500 text-sm mt-2 hover:underline"
          >
            Already have an account? Log in
          </button>
        </form>
      </div>
    </div>
  );
}
