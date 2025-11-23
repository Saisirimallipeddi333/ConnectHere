import React, { useEffect, useState } from 'react'
import api from '../apiClient'

export default function FeedPage() {
  // ----- role based heading + description -----
  const storedRole = (localStorage.getItem('role') || 'STUDENT').toUpperCase()
  const role =
    storedRole === 'ADMIN' || storedRole === 'FACULTY' || storedRole === 'STUDENT'
      ? storedRole
      : 'STUDENT'

  const heading =
    role === 'ADMIN'
      ? 'Admin control center'
      : role === 'FACULTY'
      ? 'Faculty campus feed'
      : 'Student campus feed'

  const subText =
    role === 'ADMIN'
      ? 'Review users, roles and overall platform activity.'
      : role === 'FACULTY'
      ? 'Post announcements, events and study resources for your classes.'
      : 'Stay updated with campus announcements, events and study resources.'

  // who is allowed to post?
  const canPost = role === 'ADMIN' || role === 'FACULTY'

  const [announcements, setAnnouncements] = useState([])
  const [events, setEvents] = useState([])
  const [channels, setChannels] = useState([])
  const [selectedChannel, setSelectedChannel] = useState('')
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    channelId: '',
    important: false,
  })
  const [tab, setTab] = useState('announcements')
  const [error, setError] = useState('')

  const loadData = async () => {
    try {
      const [chRes, annRes, evRes] = await Promise.all([
        api.get('/channels'),
        api.get('/announcements', { params: { channelId: selectedChannel || undefined } }),
        api.get('/events', { params: { channelId: selectedChannel || undefined } }),
      ])
      setChannels(chRes.data)
      setAnnouncements(annRes.data)
      setEvents(evRes.data)
    } catch {
      setError('Failed to load feed')
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChannel])

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/announcements', {
        ...newAnnouncement,
        channelId: newAnnouncement.channelId || null,
      })
      setNewAnnouncement({ title: '', content: '', channelId: '', important: false })
      await loadData()
    } catch {
      setError('Failed to create announcement (faculty/admin only)')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
      {/* MAIN FEED */}
      <section>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1 text-white">{heading}</h1>
            <p className="text-sm text-slate-400">{subText}</p>
          </div>

          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="border border-slate-300 rounded px-2 py-1 text-xs h-8 self-start bg-white"
          >
            <option value="">All channels</option>
            {channels.map((ch) => (
              <option key={ch.id} value={ch.id}>
                {ch.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 text-sm mb-3 border-b border-slate-200">
          <button
            onClick={() => setTab('announcements')}
            className={
              'pb-1 ' +
              (tab === 'announcements'
                ? 'border-b-2 border-indigo-600 text-indigo-600 font-medium'
                : 'text-slate-600')
            }
          >
            Announcements
          </button>
          <button
            onClick={() => setTab('events')}
            className={
              'pb-1 ' +
              (tab === 'events'
                ? 'border-b-2 border-indigo-600 text-indigo-600 font-medium'
                : 'text-slate-600')
            }
          >
            Events
          </button>
        </div>

        {error && <p className="text-xs text-red-600 mb-2">{error}</p>}

        {tab === 'announcements' ? (
          <div className="space-y-3">
            {announcements.map((a) => (
              <article
                key={a.id}
                className="bg-white rounded-lg shadow-sm border border-slate-100 p-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-semibold text-slate-800 text-sm">{a.title}</h2>
                  {a.important && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                      Important
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mb-1 whitespace-pre-line">{a.content}</p>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>{a.channel?.name || 'General'}</span>
                  <span>{new Date(a.createdAt).toLocaleString()}</span>
                </div>
              </article>
            ))}
            {announcements.length === 0 && (
              <p className="text-xs text-slate-500">No announcements yet.</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((ev) => (
              <article
                key={ev.id}
                className="bg-white rounded-lg shadow-sm border border-slate-100 p-3"
              >
                <h2 className="font-semibold text-slate-800 text-sm mb-1">{ev.title}</h2>
                <p className="text-xs text-slate-600 mb-1 whitespace-pre-line">
                  {ev.description}
                </p>
                <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                  <span>{ev.channel?.name || 'General'}</span>
                  <span>
                    {ev.eventDateTime
                      ? new Date(ev.eventDateTime).toLocaleString()
                      : 'No date set'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">Location: {ev.location || 'TBA'}</p>
              </article>
            ))}
            {events.length === 0 && <p className="text-xs text-slate-500">No events yet.</p>}
          </div>
        )}
      </section>

      {/* ASIDE: POST NEW ANNOUNCEMENT (FACULTY / ADMIN ONLY) */}
      {canPost && (
        <aside className="bg-white rounded-lg shadow-sm border border-slate-100 p-4 h-fit">
          <h2 className="text-sm font-semibold text-slate-800 mb-2">Post new announcement</h2>
          <form onSubmit={handleCreateAnnouncement} className="space-y-2 text-xs">
            <div>
              <label className="block mb-1 text-slate-700">Title</label>
              <input
                value={newAnnouncement.title}
                onChange={(e) =>
                  setNewAnnouncement((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full border border-slate-300 rounded px-2 py-1"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-slate-700">Content</label>
              <textarea
                value={newAnnouncement.content}
                onChange={(e) =>
                  setNewAnnouncement((prev) => ({ ...prev, content: e.target.value }))
                }
                rows={3}
                className="w-full border border-slate-300 rounded px-2 py-1"
                required
              />
            </div>
            <div className="flex gap-2 items-center">
              <select
                value={newAnnouncement.channelId}
                onChange={(e) =>
                  setNewAnnouncement((prev) => ({ ...prev, channelId: e.target.value }))
                }
                className="flex-1 border border-slate-300 rounded px-2 py-1"
              >
                <option value="">General</option>
                {channels.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    {ch.name}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-1 text-[11px] text-slate-600">
                <input
                  type="checkbox"
                  checked={newAnnouncement.important}
                  onChange={(e) =>
                    setNewAnnouncement((prev) => ({
                      ...prev,
                      important: e.target.checked,
                    }))
                  }
                />
                Important
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white rounded py-1.5 text-xs font-medium hover:bg-indigo-700"
            >
              Post
            </button>
            <p className="text-[10px] text-slate-400">
              Only faculty/admin accounts can post. Students can still see everything.
            </p>
          </form>
        </aside>
      )}
    </div>
  )
}
