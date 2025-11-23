// frontend/src/pages/RegisterPage.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../apiClient'

export default function RegisterPage() {
  const navigate = useNavigate()

  // step: "FORM" -> show registration form, "OTP" -> show OTP verify
  const [step, setStep] = useState('FORM')

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'PLEASE SELECT YOUR ROLE',
  })

  const [otpCode, setOtpCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // ----------------- SUBMIT REGISTRATION -----------------
  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/register', {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        role: form.role, // STUDENT or FACULTY
      })

      setSuccessMsg('Registration successful! We’ve emailed you a 6-digit OTP.')
      setStep('OTP')
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Unable to register. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  // ----------------- VERIFY OTP -----------------
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    if (!otpCode.trim()) {
      setError('Please enter the OTP code.')
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/verify-otp', {
        email: form.email.trim(),
        code: otpCode.trim(),
      })

      setSuccessMsg('Email verified! You can now log in.')
      // small delay, then go to login
      setTimeout(() => navigate('/login'), 1200)
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Invalid or expired OTP. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  // ----------------- UI -----------------
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundImage:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 35%, #111827 100%), url('https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-slate-900/70" />

      <div className="relative max-w-xl w-full">
        <div className="bg-white/95 backdrop-blur shadow-2xl rounded-3xl px-8 py-8 sm:px-10 sm:py-10">
          {/* logo / title */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              C
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                <span>Connect</span>
                <span className="text-indigo-600">Here</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Create your ConnectHere account
              </p>
            </div>
          </div>

          {step === 'FORM' ? (
            <>
              <h2 className="text-lg font-semibold text-slate-900 mb-1">
                Join your college community
              </h2>
              <p className="text-xs text-slate-500 mb-5">
                
              </p>

              {error && (
                <p className="text-xs sm:text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2 mb-3">
                  {error}
                </p>
              )}
              {successMsg && (
                <p className="text-xs sm:text-sm text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-md px-3 py-2 mb-3">
                  {successMsg}
                </p>
              )}

              <form onSubmit={handleRegister} className="space-y-3 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1">First name</label>
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">Last name</label>
                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">College email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="Email Address"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      placeholder="Create a strong password"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">Confirm password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      placeholder="Re-enter password"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">I am</label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="PLEASE SELECT YOUR ROLE" disabled>Please Select your role</option>
                    <option value="STUDENT">Student</option>
                    <option value="FACULTY">Faculty</option>
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Admin accounts are provisioned separately and cannot be created here.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 inline-flex justify-center items-center rounded-2xl bg-indigo-600 text-white font-semibold text-sm py-2.5 shadow-md hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating account…' : 'Create account & send OTP'}
                </button>
              </form>

              <p className="mt-4 text-[11px] sm:text-xs text-slate-500 text-center">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-indigo-600 font-medium hover:underline"
                >
                  Go to login
                </button>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-slate-900 mb-1">
                Verify your email with OTP
              </h2>
              <p className="text-xs text-slate-500 mb-5">
                We sent a 6-digit verification code to{' '}
                <span className="font-medium text-slate-700">{form.email}</span>. Enter it
                below to activate your account.
              </p>

              {error && (
                <p className="text-xs sm:text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2 mb-3">
                  {error}
                </p>
              )}
              {successMsg && (
                <p className="text-xs sm:text-sm text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-md px-3 py-2 mb-3">
                  {successMsg}
                </p>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-slate-700 mb-1">OTP code</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 tracking-[0.3em] text-center font-mono text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="••••••"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Didn’t get the code? Check spam, or wait a minute and try again.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex justify-center items-center rounded-2xl bg-indigo-600 text-white font-semibold text-sm py-2.5 shadow-md hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying…' : 'Verify & continue to login'}
                </button>
              </form>

              <p className="mt-4 text-[11px] sm:text-xs text-slate-500 text-center">
                Entered the wrong email?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setStep('FORM')
                    setOtpCode('')
                    setError('')
                    setSuccessMsg('')
                  }}
                  className="text-indigo-600 font-medium hover:underline"
                >
                  Go back and edit details
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
