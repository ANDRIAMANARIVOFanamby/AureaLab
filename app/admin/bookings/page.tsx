'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Calendar from '../components/Calendar'

interface Booking {
  id: number
  nom: string
  email: string
  telephone: string
  prestation: string
  disponibilite: string | null
  message: string | null
  createdAt: string
  status: string
}

interface RendezVous {
  id: number
  bookingId: number
  nom: string
  email: string
  telephone: string
  prestation: string
  date: string
  duree: number
  status: string
  createdAt: string
}

// Durée des prestations (en minutes) - 2h30 = 150 minutes
const prestationDuree: Record<string, number> = {
  'cil-a-cil': 150,
  'hybride': 150,
  'volume-bresilien': 150,
  'megavolume': 150,
  'non-sure': 150,
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [rendezVous, setRendezVous] = useState<RendezVous[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [selectedRendezVous, setSelectedRendezVous] = useState<RendezVous | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('09:00')
  const [selectedDuree, setSelectedDuree] = useState(60)
  const [isValidating, setIsValidating] = useState(false)
  const [statusFilter, setStatusFilter] = useState('tous') // ← Ajout du filtre
  const router = useRouter()

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_auth')
    if (!isAuth) {
      router.push('/admin/login')
      return
    }
    fetchBookings()
    fetchRendezVous()
  }, [router])

  // Appliquer le filtre quand les données ou le filtre changent
  useEffect(() => {
    if (statusFilter === 'tous') {
      setFilteredBookings(bookings)
    } else {
      setFilteredBookings(bookings.filter(b => b.status === statusFilter))
    }
  }, [statusFilter, bookings])

  const fetchBookings = async () => {
    try {
      const res = await fetch('/admin/api/admin-bookings')
      const data = await res.json()
      setBookings(data)
      setFilteredBookings(data)
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const fetchRendezVous = async () => {
    try {
      const res = await fetch('/admin/api/rendez-vous')
      const data = await res.json()
      setRendezVous(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Supprimer cette inscription ?')) {
      await fetch(`/admin/api/bookings?id=${id}`, { method: 'DELETE' })
      fetchBookings()
    }
  }

  const openValidateModal = (booking: Booking) => {
    setSelectedBooking(booking)
    setSelectedDuree(prestationDuree[booking.prestation] || 150)
    setSelectedDate('')
    setSelectedTime('09:00')
    setShowModal(true)
  }

  const openDetailsModal = (booking: Booking) => {
    const rdv = rendezVous.find(r => r.bookingId === booking.id)
    if (rdv) {
      setSelectedRendezVous(rdv)
      setShowDetailsModal(true)
    }
  }

  const handleSelectSlot = (date: Date, time: string) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    const correctedDate = new Date(year, month, day)
    const dateStr = correctedDate.toISOString().split('T')[0]
    setSelectedDate(dateStr)
    setSelectedTime(time)
  }

  const handleValidate = async () => {
    if (!selectedBooking || !selectedDate) return

    setIsValidating(true)
    const dateTime = `${selectedDate}T${selectedTime}:00`

    try {
      const response = await fetch('/admin/api/validate-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          date: dateTime,
          duree: selectedDuree
        })
      })

      if (response.ok) {
        alert('Rendez-vous créé et email envoyé !')
        setShowModal(false)
        fetchBookings()
        fetchRendezVous()
      } else {
        alert('Erreur lors de la validation')
      }
    } catch (error) {
      alert('Erreur de connexion')
    } finally {
      setIsValidating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    if (status === 'valide') {
      return { text: '✅ Validé', color: '#4CAF50' }
    }
    return { text: '⏳ En attente', color: '#FF9800' }
  }

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Statistiques
  const stats = {
    total: bookings.length,
    enAttente: bookings.filter(b => b.status !== 'valide').length,
    valide: bookings.filter(b => b.status === 'valide').length
  }

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7' }}>
      <div style={{ background: '#1A1A1A', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }}>Inscriptions</h1>
        <Link href="/admin" style={{ color: '#D4AF37', textDecoration: 'none' }}>← Retour</Link>
      </div>

      <div style={{ padding: '2rem' }}>
        
        {/* Statistiques */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ background: 'white', padding: '1rem 1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#D4AF37' }}>{stats.total}</span>
            <span style={{ marginLeft: '0.5rem', color: '#666' }}>Total</span>
          </div>
          <div style={{ background: 'white', padding: '1rem 1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#FF9800' }}>{stats.enAttente}</span>
            <span style={{ marginLeft: '0.5rem', color: '#666' }}>En attente</span>
          </div>
          <div style={{ background: 'white', padding: '1rem 1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4CAF50' }}>{stats.valide}</span>
            <span style={{ marginLeft: '0.5rem', color: '#666' }}>Validés</span>
          </div>
        </div>

        {/* Filtres */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '1.5rem',
          padding: '1rem',
          background: 'white',
          borderRadius: '0.5rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontWeight: 'bold', color: '#333' }}>Filtrer par statut :</span>
          <button
            onClick={() => setStatusFilter('tous')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: statusFilter === 'tous' ? '#D4AF37' : '#f0f0f0',
              color: statusFilter === 'tous' ? '#1A1A1A' : '#666',
              cursor: 'pointer',
              fontWeight: statusFilter === 'tous' ? 'bold' : 'normal'
            }}
          >
            Tous ({stats.total})
          </button>
          <button
            onClick={() => setStatusFilter('en_attente')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: statusFilter === 'en_attente' ? '#FF9800' : '#f0f0f0',
              color: statusFilter === 'en_attente' ? 'white' : '#666',
              cursor: 'pointer',
              fontWeight: statusFilter === 'en_attente' ? 'bold' : 'normal'
            }}
          >
            En attente ({stats.enAttente})
          </button>
          <button
            onClick={() => setStatusFilter('valide')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: statusFilter === 'valide' ? '#4CAF50' : '#f0f0f0',
              color: statusFilter === 'valide' ? 'white' : '#666',
              cursor: 'pointer',
              fontWeight: statusFilter === 'valide' ? 'bold' : 'normal'
            }}
          >
            Validés ({stats.valide})
          </button>
        </div>

        {/* Tableau */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '1rem', overflow: 'hidden' }}>
            <thead style={{ background: '#D4AF37', color: '#1A1A1A' }}>
              <tr>
                <th style={{ padding: '1rem', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Nom</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Téléphone</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Prestation</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Statut</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Date inscription</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => {
                const status = getStatusBadge(booking.status)
                const hasRendezVous = rendezVous.some(r => r.bookingId === booking.id)
                return (
                  <tr 
                    key={booking.id} 
                    style={{ 
                      borderBottom: '1px solid #eee',
                      cursor: hasRendezVous ? 'pointer' : 'default',
                      background: 'white'
                    }}
                    onClick={() => hasRendezVous && openDetailsModal(booking)}
                  >
                    <td style={{ padding: '1rem' }}>{booking.id}</td>
                    <td style={{ padding: '1rem' }}>{booking.nom}</td>
                    <td style={{ padding: '1rem' }}>{booking.email}</td>
                    <td style={{ padding: '1rem' }}>{booking.telephone}</td>
                    <td style={{ padding: '1rem' }}>{booking.prestation}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        background: status.color, 
                        color: 'white', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem'
                      }}>
                        {status.text}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>{new Date(booking.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {booking.status !== 'valide' && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            openValidateModal(booking)
                          }} 
                          style={{ 
                            background: '#4CAF50', 
                            color: 'white', 
                            border: 'none', 
                            padding: '0.5rem 1rem', 
                            borderRadius: '0.25rem', 
                            cursor: 'pointer',
                            marginRight: '0.5rem'
                          }}
                        >
                          ✅ Valider
                        </button>
                      )}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(booking.id)
                        }} 
                        style={{ background: '#dc3545', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.25rem', cursor: 'pointer' }}
                      >
                        🗑️ Supprimer
                      </button>
                     </td>
                   </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals (inchangés) */}
      {/* ... reste des modals ... */}
    </div>
  )
}