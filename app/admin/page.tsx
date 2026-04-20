'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export default function AdminDashboard() {
  const [bookingsCount, setBookingsCount] = useState(0)
  const [contactsCount, setContactsCount] = useState(0)
  const [galleryCount, setGalleryCount] = useState(0)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_auth')
    if (!isAuth) {
      router.push('/admin/login')
      return
    }

    const fetchStats = async () => {
      try {
        const [bookingsRes, contactsRes, galleryRes] = await Promise.all([
          fetch('/admin/api/admin-bookings'),
          fetch('/admin/api/admin-contacts'),
          fetch('/admin/api/gallery')
        ])
        
        const bookings = await bookingsRes.json()
        const contacts = await contactsRes.json()
        const gallery = await galleryRes.json()
        
        setBookingsCount(Array.isArray(bookings) ? bookings.length : 0)
        setContactsCount(Array.isArray(contacts) ? contacts.length : 0)
        setGalleryCount(Array.isArray(gallery) ? gallery.length : 0)
      } catch (error) {
        console.error('Erreur:', error)
      }
    }
    fetchStats()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('admin_auth')
    router.push('/admin/login')
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
    { href: '/admin/bookings', label: 'Inscriptions', icon: 'bookings' },
    { href: '/admin/contacts', label: 'Contacts', icon: 'contacts' },
    { href: '/admin/gallery', label: 'Galerie', icon: 'gallery' }
  ]

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'dashboard':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-5v-8H7v8H5a2 2 0 0 1-2-2z"/>
            <path d="M9 22v-8h6v8"/>
          </svg>
        )
      case 'bookings':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 6L9 17l-5-5"/>
            <path d="M20 10v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8"/>
          </svg>
        )
      case 'contacts':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        )
      case 'gallery':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="M21 15l-5-4-3 3-4-4-5 5"/>
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7' }}>
      
      {/* Hero Section */}
      <div className="admin-hero">
        <div className="admin-hero-content">
          <h1>AUREA Lab</h1>
          <p>Gérez votre espace d'administration : inscriptions, messages et galerie</p>
          
          {/* Navigation */}
          <div className="admin-nav">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-link ${pathname === item.href ? 'active' : ''}`}
              >
                {getIcon(item.icon)}
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="admin-nav-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="admin-stats-grid">
        
        {/* Carte Inscriptions */}
        <Link href="/admin/bookings" className="admin-stat-card">
          <div className="admin-stat-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.2">
              <path d="M20 6L9 17l-5-5"/>
              <path d="M20 10v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8"/>
            </svg>
          </div>
          <div className="admin-stat-number">{bookingsCount}</div>
          <div className="admin-stat-label">Inscriptions liste d'attente</div>
          <div className="admin-stat-sub">📝 Gérer les demandes</div>
        </Link>

        {/* Carte Messages */}
        <Link href="/admin/contacts" className="admin-stat-card">
          <div className="admin-stat-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div className="admin-stat-number">{contactsCount}</div>
          <div className="admin-stat-label">Messages de contact</div>
          <div className="admin-stat-sub">✉️ Lire et répondre</div>
        </Link>

        {/* Carte Galerie */}
        <Link href="/admin/gallery" className="admin-stat-card">
          <div className="admin-stat-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-4-3 3-4-4-5 5"/>
            </svg>
          </div>
          <div className="admin-stat-number">{galleryCount}</div>
          <div className="admin-stat-label">Images dans la galerie</div>
          <div className="admin-stat-sub">🖼️ Ajouter / Modifier</div>
        </Link>

      </div>

      {/* Conseil */}
      <div className="admin-tip">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" style={{ marginBottom: '0.5rem' }}>
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4M12 8h.01"/>
        </svg>
        <p style={{ color: '#666', margin: 0 }}>
          <strong>Conseil :</strong> Utilisez la galerie pour ajouter des photos de vos réalisations. 
          Les images apparaîtront automatiquement sur la page publique.
        </p>
      </div>
    </div>
  )
}