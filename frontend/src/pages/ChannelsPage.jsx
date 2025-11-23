import React, { useEffect, useState } from 'react'
import api from '../apiClient'

export default function ChannelsPage() {
  const [channels, setChannels] = useState([])
  const [myChannels, setMyChannels] = useState([])
  const [form, setForm] = useState({ name: '', type: 'COURSE', description: '' })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const load = async () => {
    try {
      const [allRes, myRes] = await Promise.all([
        api.get('/channels'),
        api.get('/channels/me'),
      ])
      setChannels(allRes.data)
      setMyChannels(myRes.data.map((uc) => uc.channel))
    } catch {
      setError('Failed to load channels')
    }
  }

  useEffect(() => {
    load()
  }, [])

  const isJoined = (id) => myChannels.some((c) => c.id === id)

  const handleJoin = async (id) => {
    setError('')
    setMessage('')
    try {
      await api.post(`/channels/${id}/join`)
      setMessage('Joined channel')
      await load()
    } catch {
      setError('Failed to join channel')
    }
  }

  const handleLeave = async (id) => {
    setError('')
    setMessage('')
    try {
      await api.post(`/channels/${id}/leave`)
      setMessage('Left channel')
      await load()
    } catch {
      setError('Failed to leave channel')
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      await api.post('/channels', form)
      setForm({ name: '', type: 'COURSE', description: '' })
      setMessage('Channel created')
      await load()
    } catch {
      setError('Failed to create channel (faculty/admin only)')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
      <section>
        <h1 className="text-lg font-semibold text-slate-800 mb-3">Browse channels</h1>
        {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
        {message && <p className="text-xs text-green-700 mb-2">{message}</p>}
        <div className="space-y-3">
          {channels.map((ch) => (
            <article
              key={ch.id}
              className="bg-white rounded-lg shadow-sm border border-slate-100 p-3 flex items-center justify-between"
            >
              <div>
                <h2 className="text-sm font-semibold text-slate-800">{ch.name}</h2>
                <p className="text-[11px] text-slate-500">
                  {ch.type} • {ch.description || 'No description'}
                </p>
              </div>
              <div>
                {isJoined(ch.id) ? (
                  <button
                    onClick={() => handleLeave(ch.id)}
                    className="px-3 py-1 text-[11px] rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    Leave
                  </button>
                ) : (
                  <button
                    onClick={() => handleJoin(ch.id)}
                    className="px-3 py-1 text-[11px] rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Join
                  </button>
                )}
              </div>
            </article>
          ))}
          {channels.length === 0 && (
            <p className="text-xs text-slate-500">No channels yet. Ask a faculty to create one.</p>
          )}
        </div>
      </section>

      <aside className="bg-white rounded-lg shadow-sm border border-slate-100 p-4 h-fit">
        <h2 className="text-sm font-semibold text-slate-800 mb-2">Create a channel</h2>
        <p className="text-[11px] text-slate-500 mb-2">
          For courses, clubs, or project groups. Only faculty/admin can create.
        </p>
        <form onSubmit={handleCreate} className="space-y-2 text-xs">
          <div>
            <label className="block mb-1 text-slate-700">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full border border-slate-300 rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-slate-700">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
              className="w-full border border-slate-300 rounded px-2 py-1"
            >
              <option value="COURSE">Course</option>
              <option value="CLUB">Club</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-slate-700">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={3}
              className="w-full border border-slate-300 rounded px-2 py-1"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white rounded py-1.5 text-xs font-medium hover:bg-indigo-700"
          >
            Create channel
          </button>
        </form>
      </aside>
    </div>
  )
}
