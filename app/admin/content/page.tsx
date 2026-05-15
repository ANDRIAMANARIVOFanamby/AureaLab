'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminContent() {
  const [content, setContent] = useState({
    content_title: '',
    content_paragraph1: '',
    content_paragraph2: '',
    content_paragraph3: '',
    content_signature: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_auth')
    if (!isAuth) {
      router.push('/admin/login')
      return
    }
    fetchContent()
  }, [router])

  const fetchContent = async () => {
    try {
      const res = await fetch('/admin/api/content?page=about')
      const data = await res.json()
      setContent({
        content_title: data.content_title || 'Le luxe dans chaque regard',
        content_paragraph1: data.content_paragraph1 || 'Chez AUREA Lab, chaque regard est une création unique. Notre vision est de proposer une expérience beauté élégante, personnalisée et raffinée.',
        content_paragraph2: data.content_paragraph2 || 'Chaque pose est pensée sur-mesure selon la forme des yeux, le style et l\'effet souhaité. Nous croyons que le regard est une signature unique.',
        content_paragraph3: data.content_paragraph3 || 'C\'est pourquoi nous accordons une attention particulière à chaque détail afin de sublimer la beauté naturelle sans la transformer.',
        content_signature: data.content_signature || '— AUREA Lab, le luxe dans chaque regard'
      })
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    
    try {
      const updates = Object.entries(content).map(([key, value]) =>
        fetch('/admin/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: 'about',
            section: 'content',
            key: key,
            value
          })
        })
      )
      
      await Promise.all(updates)
      setMessage('✅ Contenu sauvegardé avec succès !')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('❌ Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FDFBF7' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #D4AF37', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p>Chargement...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7' }}>
      
      <div style={{ background: '#1A1A1A', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#D4AF37' }}>Gestion du contenu - À propos</h1>
        <Link href="/admin" style={{ color: '#D4AF37', textDecoration: 'none' }}>← Retour</Link>
      </div>

      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        
        {message && (
          <div style={{
            background: message.includes('✅') ? '#d4edda' : '#f8d7da',
            color: message.includes('✅') ? '#155724' : '#721c24',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Titre de la section</label>
            <input
              type="text"
              value={content.content_title}
              onChange={(e) => setContent({ ...content, content_title: e.target.value })}
              className="form-input"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Paragraphe 1</label>
            <textarea
              value={content.content_paragraph1}
              onChange={(e) => setContent({ ...content, content_paragraph1: e.target.value })}
              rows={4}
              className="form-input"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Paragraphe 2</label>
            <textarea
              value={content.content_paragraph2}
              onChange={(e) => setContent({ ...content, content_paragraph2: e.target.value })}
              rows={4}
              className="form-input"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Paragraphe 3</label>
            <textarea
              value={content.content_paragraph3}
              onChange={(e) => setContent({ ...content, content_paragraph3: e.target.value })}
              rows={4}
              className="form-input"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Signature</label>
            <input
              type="text"
              value={content.content_signature}
              onChange={(e) => setContent({ ...content, content_signature: e.target.value })}
              className="form-input"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              background: '#D4AF37',
              color: '#1A1A1A',
              padding: '0.75rem 2rem',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {saving ? 'Sauvegarde...' : '💾 Sauvegarder les modifications'}
          </button>
        </form>
      </div>
    </div>
  )
}