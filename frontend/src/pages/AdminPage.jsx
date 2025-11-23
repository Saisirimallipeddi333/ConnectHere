import React, { useEffect, useState } from 'react'
import api from '../apiClient'

export default function AdminPage() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const load = async () => {
    try {
      const res = await api.get('/admin/users')
      setUsers(res.data)
    } catch {
      setError('Failed to load users (admin only)')
    }
  }

  useEffect(() => {
    load()
  }, [])

  const toggleActive = async (id) => {
    setError('')
    setMessage('')
    try {
      await api.post(`/admin/users/${id}/toggle-active`)
      setMessage('Updated user status')
      await load()
    } catch {
      setError('Failed to update user')
    }
  }

  return (
    <div>
      <h1 className="text-lg font-semibold text-slate-800 mb-3">Admin – Users</h1>
      {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
      {message && <p className="text-xs text-green-700 mb-2">{message}</p>}
      <div className="overflow-x-auto text-xs">
        <table className="min-w-full bg-white border border-slate-200 rounded">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-2 py-1 border-b border-slate-200 text-left">Name</th>
              <th className="px-2 py-1 border-b border-slate-200 text-left">Email</th>
              <th className="px-2 py-1 border-b border-slate-200 text-left">Roles</th>
              <th className="px-2 py-1 border-b border-slate-200 text-left">Active</th>
              <th className="px-2 py-1 border-b border-slate-200 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-slate-100">
                <td className="px-2 py-1">{u.fullName}</td>
                <td className="px-2 py-1">{u.email}</td>
                <td className="px-2 py-1 text-[10px]">
                  {u.roles.map((r) => r.name.replace('ROLE_', '')).join(', ')}
                </td>
                <td className="px-2 py-1">
                  <span className={u.active ? 'text-green-600' : 'text-red-600'}>
                    {u.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-2 py-1">
                  <button
                    onClick={() => toggleActive(u.id)}
                    className="px-2 py-1 rounded border border-slate-300 text-[11px] hover:bg-slate-50"
                  >
                    Toggle
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td className="px-2 py-2 text-slate-500" colSpan={5}>
                  No users or you are not admin.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
