import React, { useEffect, useState } from 'react'
import api from '../apiClient'

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/profile')
        setProfile(res.data)
      } catch {
        setError('Failed to load profile')
      }
    }
    load()
  }, [])

  if (error) {
    return <p className="text-xs text-red-600">{error}</p>
  }

  if (!profile) {
    return <p className="text-xs text-slate-500">Loading profile...</p>
  }

  return (
    <div className="max-w-lg bg-white rounded-lg shadow-sm border border-slate-100 p-4">
      <h1 className="text-lg font-semibold text-slate-800 mb-2">My profile</h1>
      <p className="text-sm text-slate-800">{profile.fullName}</p>
      <p className="text-xs text-slate-500 mb-2">{profile.email}</p>
      <p className="text-xs text-slate-500 mb-2">
        Roles: {profile.roles.join(', ').replace(/ROLE_/g, '')}
      </p>
      <p className="text-xs text-slate-500 mb-4">
        Status:{' '}
        <span className={profile.active ? 'text-green-600' : 'text-red-600'}>
          {profile.active ? 'Active' : 'Inactive'}
        </span>
      </p>
      <div className="grid grid-cols-3 gap-3 text-center text-xs">
        <div className="bg-slate-50 border border-slate-200 rounded p-2">
          <p className="text-[11px] text-slate-500 mb-1">Announcements</p>
          <p className="text-lg font-semibold text-slate-800">
            {profile.myAnnouncementsCount}
          </p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded p-2">
          <p className="text-[11px] text-slate-500 mb-1">Events</p>
          <p className="text-lg font-semibold text-slate-800">{profile.myEventsCount}</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded p-2">
          <p className="text-[11px] text-slate-500 mb-1">Resources</p>
          <p className="text-lg font-semibold text-slate-800">
            {profile.myResourcesCount}
          </p>
        </div>
      </div>
    </div>
  )
}
