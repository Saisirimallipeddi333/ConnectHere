import React, { useEffect, useState } from 'react'
import api from '../apiClient'

export default function ResourcesPage() {
  const [resources, setResources] = useState([])
  const [channels, setChannels] = useState([])
  const [filters, setFilters] = useState({ channelId: '', type: '', title: '' })
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'NOTES',
    url: '',
    channelId: '',
  })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const buildParams = (f) => ({
    channelId: f.channelId || undefined,
    type: f.type || undefined,
    title: f.title || undefined,
  })

  const load = async () => {
    try {
      const [chRes, resRes] = await Promise.all([
        api.get('/channels'),
        api.get('/resources', { params: buildParams(filters) }),
      ])
      setChannels(chRes.data)
      setResources(resRes.data)
    } catch {
      setError('Failed to load resources')
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const applyFilters = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const resRes = await api.get('/resources', { params: buildParams(filters) })
      setResources(resRes.data)
    } catch {
      setError('Failed to apply filters')
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      await api.post('/resources', {
        ...form,
        channelId: form.channelId || null,
      })
      setForm({ title: '', description: '', type: 'NOTES', url: '', channelId: '' })
      setMessage('Resource added')
      await load()
    } catch {
      setError('Failed to add resource (faculty/admin only)')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
      <section>
        <h1 className="text-lg font-semibold text-slate-800 mb-3">Study resources</h1>
        {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
        {message && <p className="text-xs text-green-700 mb-2">{message}</p>}
        <form onSubmit={applyFilters} className="flex flex-wrap gap-2 items-end mb-3 text-xs">
          <div>
            <label className="block mb-1 text-slate-700">Channel</label>
            <select
              value={filters.channelId}
              onChange={(e) => handleFilterChange('channelId', e.target.value)}
              className="border border-slate-300 rounded px-2 py-1"
            >
              <option value="">All</option>
              {channels.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-slate-700">Type</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="border border-slate-300 rounded px-2 py-1"
            >
              <option value="">All</option>
              <option value="NOTES">Notes</option>
              <option value="SLIDES">Slides</option>
              <option value="LINK">Link</option>
              <option value="ASSIGNMENT">Assignment</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-slate-700">Title</label>
            <input
              value={filters.title}
              onChange={(e) => handleFilterChange('title', e.target.value)}
              className="border border-slate-300 rounded px-2 py-1"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 rounded bg-slate-800 text-white text-xs font-medium"
          >
            Apply
          </button>
        </form>
        <div className="space-y-3">
          {resources.map((r) => (
            <article
              key={r.id}
              className="bg-white rounded-lg shadow-sm border border-slate-100 p-3"
            >
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-slate-800">{r.title}</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {r.type}
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-1 whitespace-pre-line">
                {r.description || 'No description'}
              </p>
              {r.url && (
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-indigo-600 underline"
                >
                  Open resource
                </a>
              )}
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>{r.channel?.name || 'General'}</span>
                <span>{new Date(r.createdAt).toLocaleString()}</span>
              </div>
            </article>
          ))}
          {resources.length === 0 && (
            <p className="text-xs text-slate-500">No resources yet.</p>
          )}
        </div>
      </section>

      <aside className="bg-white rounded-lg shadow-sm border border-slate-100 p-4 h-fit">
        <h2 className="text-sm font-semibold text-slate-800 mb-2">Add resource</h2>
        <p className="text-[11px] text-slate-500 mb-2">
          Upload links to notes, slides, or external resources. Faculty/admin only.
        </p>
        <form onSubmit={handleCreate} className="space-y-2 text-xs">
          <div>
            <label className="block mb-1 text-slate-700">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              className="w-full border border-slate-300 rounded px-2 py-1"
              required
            />
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
          <div>
            <label className="block mb-1 text-slate-700">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
              className="w-full border border-slate-300 rounded px-2 py-1"
            >
              <option value="NOTES">Notes</option>
              <option value="SLIDES">Slides</option>
              <option value="LINK">Link</option>
              <option value="ASSIGNMENT">Assignment</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-slate-700">URL</label>
            <input
              value={form.url}
              onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
              className="w-full border border-slate-300 rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block mb-1 text-slate-700">Channel</label>
            <select
              value={form.channelId}
              onChange={(e) => setForm((p) => ({ ...p, channelId: e.target.value }))}
              className="w-full border border-slate-300 rounded px-2 py-1"
            >
              <option value="">General</option>
              {channels.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white rounded py-1.5 text-xs font-medium hover:bg-indigo-700"
          >
            Add resource
          </button>
        </form>
      </aside>
    </div>
  )
}
