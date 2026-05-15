'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  order: number
  isActive: boolean
  _count?: {
    services: number
  }
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '📌',
    isActive: true
  })
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_auth')
    if (!isAuth) {
      router.push('/admin/login')
      return
    }
    fetchCategories()
  }, [router])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/admin/api/categories')
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryLabel = (id: string) => {
    const category = categories.find(c => c.id === id)
    if (!category) return 'Sans catégorie'
    
    const isSvg = category.icon?.startsWith('<svg')
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {isSvg ? (
          <div 
            dangerouslySetInnerHTML={{ __html: category.icon }} 
            style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center' }}
          />
        ) : (
          <span style={{ fontSize: '1.2rem' }}>{category.icon}</span>
        )}
      </div>
    )
  }


  const handleDelete = async (id: string) => {
    const category = categories.find(c => c.id === id)
    if (category && category._count?.services && category._count.services > 0) {
      alert(`Impossible de supprimer : ${category._count.services} service(s) lui sont rattachés.`)
      return
    }
    
    if (confirm('Supprimer cette catégorie ?')) {
      const res = await fetch(`/admin/api/categories?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.error) {
        alert(data.error)
      } else {
        fetchCategories()
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/admin/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug.toLowerCase().replace(/\s/g, '-'),
          description: formData.description,
          icon: formData.icon,
          isActive: formData.isActive
        })
      })

      if (res.ok) {
        alert('Catégorie ajoutée avec succès !')
        setShowModal(false)
        setFormData({ name: '', slug: '', description: '', icon: '📌', isActive: true })
        fetchCategories()
      } else {
        alert('Erreur lors de l\'ajout')
      }
    } catch (error) {
      alert('Erreur de connexion')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCategory) return
    setSaving(true)

    try {
      const res = await fetch('/admin/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedCategory.id,
          name: formData.name,
          slug: formData.slug.toLowerCase().replace(/\s/g, '-'),
          description: formData.description,
          icon: formData.icon,
          order: selectedCategory.order,
          isActive: formData.isActive
        })
      })

      if (res.ok) {
        alert('Catégorie modifiée avec succès !')
        setShowEditModal(false)
        setSelectedCategory(null)
        fetchCategories()
      } else {
        alert('Erreur lors de la modification')
      }
    } catch (error) {
      alert('Erreur de connexion')
    } finally {
      setSaving(false)
    }
  }

  const openEditModal = (category: Category) => {
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon || '📌',
      isActive: category.isActive
    })
    setShowEditModal(true)
  }

  const moveUp = async (category: Category) => {
    if (category.order <= 1) return
    const prevCategory = categories.find(c => c.order === category.order - 1)
    if (prevCategory) {
      await fetch('/admin/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: category.id, order: prevCategory.order })
      })
      await fetch('/admin/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: prevCategory.id, order: category.order })
      })
      fetchCategories()
    }
  }

  const moveDown = async (category: Category) => {
    const nextCategory = categories.find(c => c.order === category.order + 1)
    if (nextCategory) {
      await fetch('/admin/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: category.id, order: nextCategory.order })
      })
      await fetch('/admin/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: nextCategory.id, order: category.order })
      })
      fetchCategories()
    }
  }

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  }

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7' }}>
      
      {/* Header */}
      <div style={{ background: '#1A1A1A', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#D4AF37' }}>Catégories</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: '#4CAF50',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            + Ajouter une catégorie
          </button>
          <Link href="/admin" style={{ color: '#D4AF37', textDecoration: 'none' }}>← Retour</Link>
        </div>
      </div>

      {/* Liste des catégories */}
      <div style={{ padding: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '1rem', overflow: 'hidden' }}>
          <thead style={{ background: '#D4AF37', color: '#1A1A1A' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Icône</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Nom</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Slug</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Services</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Statut</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '1rem', fontSize: '1.5rem' }}>{getCategoryLabel(category.id)}</td>
                <td style={{ padding: '1rem' }}>{category.name}</td>
                <td style={{ padding: '1rem' }}><code style={{ background: '#f0f0f0', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>{category.slug}</code></td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    background: category._count?.services ? '#D4AF37' : '#f0f0f0',
                    color: category._count?.services ? '#1A1A1A' : '#999',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem'
                  }}>
                    {category._count?.services || 0} service(s)
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    background: category.isActive ? '#4CAF50' : '#dc3545',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem'
                  }}>
                    {category.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <button
                    onClick={() => moveUp(category)}
                    style={{ background: '#f0f0f0', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', cursor: 'pointer', marginRight: '0.25rem' }}
                    title="Monter"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveDown(category)}
                    style={{ background: '#f0f0f0', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', cursor: 'pointer', marginRight: '0.25rem' }}
                    title="Descendre"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => openEditModal(category)}
                    style={{ background: '#2196F3', color: 'white', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', cursor: 'pointer', marginRight: '0.25rem' }}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    style={{ background: '#dc3545', color: 'white', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', cursor: 'pointer' }}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {categories.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#999' }}>
            Aucune catégorie. Cliquez sur "Ajouter une catégorie" pour commencer.
          </div>
        )}
      </div>

      {/* Modal Ajout */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            width: '100%',
            maxWidth: '500px'
          }}>
            <h2 style={{ color: '#D4AF37', marginBottom: '1rem' }}>Ajouter une catégorie</h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Icône *</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="📌"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Nom *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value
                    setFormData({ 
                      ...formData, 
                      name,
                      slug: generateSlug(name)
                    })
                  }}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem', background: '#f5f5f5' }}
                />
                <p style={{ fontSize: '0.7rem', color: '#999', marginTop: '0.25rem' }}>Identifiant unique pour l'URL (ex: "extensions-de-cils")</p>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span>Actif (visible sur le site)</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    flex: 1,
                    background: '#4CAF50',
                    color: 'white',
                    padding: '0.75rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: saving ? 'not-allowed' : 'pointer'
                  }}
                >
                  {saving ? 'Ajout...' : 'Ajouter'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    background: '#999',
                    color: 'white',
                    padding: '0.75rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Édition */}
      {showEditModal && selectedCategory && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            width: '100%',
            maxWidth: '500px'
          }}>
            <h2 style={{ color: '#D4AF37', marginBottom: '1rem' }}>Modifier la catégorie</h2>
            
            <form onSubmit={handleEdit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Icône</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Nom *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value
                    setFormData({ ...formData, name })
                  }}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem', background: '#f5f5f5' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span>Actif (visible sur le site)</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    flex: 1,
                    background: '#2196F3',
                    color: 'white',
                    padding: '0.75rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: saving ? 'not-allowed' : 'pointer'
                  }}
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{
                    flex: 1,
                    background: '#999',
                    color: 'white',
                    padding: '0.75rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}