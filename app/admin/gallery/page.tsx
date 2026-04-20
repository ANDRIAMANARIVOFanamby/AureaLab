'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface GalleryImage {
  id: number
  title: string
  description: string
  image: string
  category: string
  order: number
  createdAt: string
}

const categories = [
  { value: 'cil-a-cil', label: 'Cil à cil', color: '#E8D5A3' },
  { value: 'hybride', label: 'Hybride', color: '#D4AF37' },
  { value: 'volume-bresilien', label: 'Volume Brésilien', color: '#C59B27' },
  { value: 'megavolume', label: 'Mégavolume', color: '#B8962A' }
]

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'cil-a-cil',
    image: null as File | null
  })
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_auth')
    if (!isAuth) {
      router.push('/admin/login')
      return
    }
    fetchImages()
  }, [router])

  const fetchImages = async () => {
    try {
      const res = await fetch('/admin/api/gallery')
      const data = await res.json()
      setImages(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Supprimer cette image ?')) {
      await fetch(`/admin/api/gallery?id=${id}`, { method: 'DELETE' })
      fetchImages()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.image) {
      alert('Veuillez sélectionner une image')
      return
    }

    setUploading(true)
    const data = new FormData()
    data.append('title', formData.title)
    data.append('description', formData.description)
    data.append('category', formData.category)
    data.append('image', formData.image)

    try {
      const res = await fetch('/admin/api/gallery', {
        method: 'POST',
        body: data
      })

      if (res.ok) {
        alert('Image ajoutée avec succès !')
        setShowModal(false)
        setFormData({ title: '', description: '', category: 'cil-a-cil', image: null })
        fetchImages()
      } else {
        alert('Erreur lors de l\'ajout')
      }
    } catch (error) {
      alert('Erreur de connexion')
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedImage) return

    try {
      const res = await fetch('/admin/api/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedImage.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          order: selectedImage.order
        })
      })

      if (res.ok) {
        alert('Image modifiée avec succès !')
        setShowEditModal(false)
        setSelectedImage(null)
        fetchImages()
      } else {
        alert('Erreur lors de la modification')
      }
    } catch (error) {
      alert('Erreur de connexion')
    }
  }

  const openEditModal = (image: GalleryImage) => {
    setSelectedImage(image)
    setFormData({
      title: image.title,
      description: image.description || '',
      category: image.category,
      image: null
    })
    setShowEditModal(true)
  }

  const moveUp = async (image: GalleryImage) => {
    if (image.order <= 1) return
    const prevImage = images.find(i => i.order === image.order - 1)
    if (prevImage) {
      await fetch('/admin/api/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: image.id, order: prevImage.order })
      })
      await fetch('/admin/api/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: prevImage.id, order: image.order })
      })
      fetchImages()
    }
  }

  const moveDown = async (image: GalleryImage) => {
    const nextImage = images.find(i => i.order === image.order + 1)
    if (nextImage) {
      await fetch('/admin/api/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: image.id, order: nextImage.order })
      })
      await fetch('/admin/api/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: nextImage.id, order: image.order })
      })
      fetchImages()
    }
  }

  const getCategoryLabel = (category: string) => {
    return categories.find(c => c.value === category)?.label || category
  }

  const getCategoryColor = (category: string) => {
    return categories.find(c => c.value === category)?.color || '#D4AF37'
  }

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7' }}>
      {/* Header */}
      <div style={{ background: '#1A1A1A', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }}>Galerie</h1>
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
            + Ajouter une image
          </button>
          <Link href="/admin" style={{ color: '#D4AF37', textDecoration: 'none' }}>← Retour</Link>
        </div>
      </div>

      {/* Grille des images */}
      <div style={{ padding: '2rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {images.map((image) => (
            <div
              key={image.id}
              style={{
                background: 'white',
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease'
              }}
            >
              <div style={{ position: 'relative', height: '200px', background: '#f5f5f5' }}>
                <img
                  src={image.image}
                  alt={image.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  background: getCategoryColor(image.category),
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  color: '#1A1A1A'
                }}>
                  {getCategoryLabel(image.category)}
                </div>
              </div>
              
              <div style={{ padding: '1rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{image.title}</h3>
                {image.description && (
                  <p style={{ color: '#666', fontSize: '0.8rem', margin: '0 0 0.5rem 0' }}>
                    {image.description.substring(0, 60)}...
                  </p>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => moveUp(image)}
                      style={{
                        background: '#f0f0f0',
                        border: 'none',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        cursor: 'pointer'
                      }}
                      title="Monter"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveDown(image)}
                      style={{
                        background: '#f0f0f0',
                        border: 'none',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        cursor: 'pointer'
                      }}
                      title="Descendre"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => openEditModal(image)}
                      style={{
                        background: '#2196F3',
                        color: 'white',
                        border: 'none',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        cursor: 'pointer'
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(image.id)}
                      style={{
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        cursor: 'pointer'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#999' }}>
                    Ordre: {image.order}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#999' }}>
            Aucune image dans la galerie. Cliquez sur "Ajouter une image" pour commencer.
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
            <h2 style={{ color: '#D4AF37', marginBottom: '1rem' }}>Ajouter une image</h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Titre *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '0.5rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '0.5rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Catégorie *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '0.5rem'
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Image *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '0.5rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  type="submit"
                  disabled={uploading}
                  style={{
                    flex: 1,
                    background: '#4CAF50',
                    color: 'white',
                    padding: '0.75rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    opacity: uploading ? 0.6 : 1
                  }}
                >
                  {uploading ? 'Upload en cours...' : 'Ajouter'}
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
      {showEditModal && selectedImage && (
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
            <h2 style={{ color: '#D4AF37', marginBottom: '1rem' }}>Modifier l'image</h2>
            
            <form onSubmit={handleEdit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Titre *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '0.5rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '0.5rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Catégorie *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '0.5rem'
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '0.5rem',
                    marginBottom: '0.5rem'
                  }}
                />
                <p style={{ fontSize: '0.75rem', color: '#999' }}>
                  Pour changer l'image, supprimez et ajoutez une nouvelle.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: '#2196F3',
                    color: 'white',
                    padding: '0.75rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  Enregistrer
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