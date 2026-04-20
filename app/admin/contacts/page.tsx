'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Contact {
  id: number
  nom: string
  email: string
  telephone: string | null
  sujet: string
  message: string
  createdAt: string
  status: string
  replied: boolean
  repliedAt: string | null
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [replySubject, setReplySubject] = useState('')
  const [replyMessage, setReplyMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [statusFilter, setStatusFilter] = useState('tous') // ← Ajout du filtre
  const router = useRouter()

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_auth')
    if (!isAuth) {
      router.push('/admin/login')
      return
    }
    fetchContacts()
  }, [router])

  // Appliquer le filtre quand les données ou le filtre changent
  useEffect(() => {
    if (statusFilter === 'tous') {
      setFilteredContacts(contacts)
    } else if (statusFilter === 'repondu') {
      setFilteredContacts(contacts.filter(c => c.replied === true))
    } else if (statusFilter === 'en_attente') {
      setFilteredContacts(contacts.filter(c => c.replied === false))
    }
  }, [statusFilter, contacts])

  const fetchContacts = async () => {
    try {
      const res = await fetch('/admin/api/admin-contacts')
      const data = await res.json()
      setContacts(data)
      setFilteredContacts(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Supprimer ce message ?')) {
      await fetch(`/admin/api/contacts?id=${id}`, { method: 'DELETE' })
      fetchContacts()
    }
  }

  const openDetailsModal = (contact: Contact) => {
    setSelectedContact(contact)
    setReplySubject(`Re: ${getSujetLabel(contact.sujet)} - ${contact.nom}`)
    setReplyMessage('')
    setShowDetailsModal(true)
  }

  const openReplyModal = () => {
    setShowDetailsModal(false)
    setShowReplyModal(true)
  }

  const handleSendReply = async () => {
    if (!selectedContact) return
    
    setSending(true)
    try {
      const response = await fetch('/admin/api/contact-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: selectedContact.email,
          subject: replySubject,
          message: replyMessage,
          originalMessage: selectedContact.message,
          contactId: selectedContact.id
        })
      })

      if (response.ok) {
        alert('✅ Réponse envoyée avec succès !')
        setShowReplyModal(false)
        setReplyMessage('')
        fetchContacts()
      } else {
        alert('❌ Erreur lors de l\'envoi')
      }
    } catch (error) {
      alert('❌ Erreur de connexion')
    } finally {
      setSending(false)
    }
  }

  const getSujetLabel = (sujet: string) => {
    const labels: Record<string, string> = {
      information: 'Demande d\'information',
      rdv: 'Prise de rendez-vous',
      'liste-attente': 'Inscription liste d\'attente',
      autre: 'Autre'
    }
    return labels[sujet] || sujet
  }

  const getStatusBadge = (contact: Contact) => {
    if (contact.replied) {
      return { text: '✅ Répondu', color: '#4CAF50' }
    }
    return { text: '⏳ En attente', color: '#FF9800' }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Statistiques
  const stats = {
    total: contacts.length,
    enAttente: contacts.filter(c => !c.replied).length,
    repondu: contacts.filter(c => c.replied).length
  }

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7' }}>
      <div style={{ background: '#1A1A1A', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }}>Messages de contact</h1>
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
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4CAF50' }}>{stats.repondu}</span>
            <span style={{ marginLeft: '0.5rem', color: '#666' }}>Répondus</span>
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
            onClick={() => setStatusFilter('repondu')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: statusFilter === 'repondu' ? '#4CAF50' : '#f0f0f0',
              color: statusFilter === 'repondu' ? 'white' : '#666',
              cursor: 'pointer',
              fontWeight: statusFilter === 'repondu' ? 'bold' : 'normal'
            }}
          >
            Répondus ({stats.repondu})
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
                <th style={{ padding: '1rem', textAlign: 'left' }}>Sujet</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Statut</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((contact) => {
                const status = getStatusBadge(contact)
                return (
                  <tr 
                    key={contact.id} 
                    style={{ 
                      borderBottom: '1px solid #eee',
                      cursor: 'pointer',
                      background: 'white',
                      opacity: contact.replied ? 0.7 : 1
                    }}
                    onClick={() => openDetailsModal(contact)}
                  >
                    <td style={{ padding: '1rem' }}>{contact.id}</td>
                    <td style={{ padding: '1rem' }}>{contact.nom}</td>
                    <td style={{ padding: '1rem' }}>{contact.email}</td>
                    <td style={{ padding: '1rem' }}>{getSujetLabel(contact.sujet)}</td>
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
                    <td style={{ padding: '1rem' }}>{formatDate(contact.createdAt)}</td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(contact.id)
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