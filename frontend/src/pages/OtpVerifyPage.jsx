import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOtp } from '../apiClient';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function OtpVerifyPage() {
  const navigate = useNavigate();
  const query = useQuery();
  const defaultEmail = query.get('email') || '';

  const [email, setEmail] = useState(defaultEmail);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !code) {
      setError('Please fill out both email and code.');
      return;
    }

    setLoading(true);
    try {
      await verifyOtp({ email, code });
      setSuccess('Email verified! You can now log in.');
      setTimeout(() => navigate('/login'), 800);
    } catch (err) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-700 rounded-2xl shadow-xl p-8 mx-4">
        <h2 className="text-2xl font-semibold mb-2">Verify your email</h2>
        <p className="text-sm text-slate-300 mb-4">
          We sent a 6-digit code to your email. Enter it below to activate your account.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500 text-red-200 px-3 py-2 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500 text-emerald-200 px-3 py-2 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">6-digit code</label>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              maxLength={6}
              required
              className="w-full tracking-[0.4em] text-center rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-1 rounded-lg bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium py-2.5 transition"
          >
            {loading ? 'Verifying…' : 'Verify email'}
          </button>
        </form>
      </div>
    </div>
  );
}
