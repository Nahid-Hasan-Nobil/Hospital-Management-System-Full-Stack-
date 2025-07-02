const API_URL = 'http://localhost:3000';

// ------------------------
// Utility Function
// ------------------------

async function handleResponse(res: Response) {
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Request failed');
  }
  return res.json();
}

// ------------------------
// Patient APIs
// ------------------------

export async function patientLogin(phoneNumber: string, password: string) {
  const res = await fetch(`${API_URL}/patients/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber, password }),
  });
  return handleResponse(res);
}

export async function patientRegister(data: {
  name: string;
  phoneNumber: string;
  password: string;
  insuranceDetails?: string;
}) {
  const res = await fetch(`${API_URL}/patients/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function getAllPatients(token: string) {
  const res = await fetch(`${API_URL}/patients`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

export async function getPatientByPhone(phone: string, token: string) {
  const res = await fetch(`${API_URL}/patients/phone/${phone}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

export async function updatePatient(
  phoneNumber: string,
  data: { name?: string; password?: string; insuranceDetails?: string },
  token: string
) {
  const res = await fetch(`${API_URL}/patients/phone/${phoneNumber}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deletePatient(phoneNumber: string, token: string) {
  const res = await fetch(`${API_URL}/patients/phone/${phoneNumber}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

// ------------------------
// Doctor APIs
// ------------------------

export async function doctorRegister(data: {
  name: string;
  specialty: string;
  email: string;
  password: string;
  education?: string;
}) {
  const res = await fetch(`${API_URL}/doctors/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function doctorLogin(email: string, password: string) {
  const res = await fetch(`${API_URL}/doctors/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

export async function getAllDoctors() {
  const res = await fetch(`${API_URL}/doctors`);
  return handleResponse(res);
}

export async function getDoctorsBySpecialty(specialty: string) {
  const res = await fetch(`${API_URL}/doctors/specialty/${encodeURIComponent(specialty)}`);
  return handleResponse(res);
}

export async function getDoctorByEmail(email: string) {
  const res = await fetch(`${API_URL}/doctors/email/${encodeURIComponent(email)}`);
  return handleResponse(res);
}

export async function deleteDoctor(id: number, token: string) {
  const res = await fetch(`${API_URL}/doctors/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

// ✅ Send OTP to Doctor Email
export async function sendDoctorOtp(email: string) {
  const res = await fetch(`${API_URL}/doctors/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return handleResponse(res);
}

// ✅ Verify OTP
export async function verifyDoctorOtp(email: string, otp: string) {
  const res = await fetch(`${API_URL}/doctors/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
  return handleResponse(res);
}

// ✅ Reset Password
export async function resetDoctorPassword(email: string, otp: string, newPassword: string) {
  const res = await fetch(`${API_URL}/doctors/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp, newPassword }),
  });
  return handleResponse(res);
}

// ------------------------
// Appointment APIs
// ------------------------

export async function createAppointment(data: {
  patientName: string;
  patientPhoneNumber: string;
  doctorName: string;
  doctorEmail: string;
  appointmentDate: string;
}, token: string) {
  const res = await fetch(`${API_URL}/appointments/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function getAppointmentById(id: number, token: string) {
  const res = await fetch(`${API_URL}/appointments/${id}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

export async function updateAppointment(id: number, data: {
  appointmentDate?: string;
  doctorName?: string;
  doctorEmail?: string;
}, token: string) {
  const res = await fetch(`${API_URL}/appointments/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteAppointment(id: number, token: string) {
  const res = await fetch(`${API_URL}/appointments/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

export async function getAppointmentsByPhone(phoneNumber: string, token: string) {
  const res = await fetch(`${API_URL}/appointments/phone/${phoneNumber}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

export async function getAppointmentsByDoctorEmail(email: string, token: string) {
  try {
    const res = await fetch(`${API_URL}/appointments/doctor/${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Status: ${res.status}`);
    const responseBody = await res.json();
    if (Object.keys(responseBody).length === 0) throw new Error('No appointments found');
    return responseBody;
  } catch (err) {
    console.error('Fetch appointments error:', err);
    throw new Error('Failed to fetch appointments');
  }
}

// ------------------------
// Feedback APIs
// ------------------------

export async function createFeedback(data: {
  patientName: string;
  patientPhoneNumber: string;
  doctorName: string;
  doctorEmail: string;
  rating: number;
  comment?: string;
}) {
  const res = await fetch(`${API_URL}/feedback/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function getFeedbackByDoctor(doctorId: number) {
  const res = await fetch(`${API_URL}/feedback/doctor/${doctorId}`);
  return handleResponse(res);
}

export async function getFeedbackByPhoneNumber(phoneNumber: string) {
  const res = await fetch(`${API_URL}/feedback/patient/${phoneNumber}`);
  return handleResponse(res);
}

export async function updateFeedback(id: number, data: {
  patientPhoneNumber: string;
  rating?: number;
  comment?: string;
}) {
  const res = await fetch(`${API_URL}/feedback/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteFeedback(id: number, phoneNumber: string) {
  const res = await fetch(`${API_URL}/feedback/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patientPhoneNumber: phoneNumber }),
  });
  return handleResponse(res);
}
