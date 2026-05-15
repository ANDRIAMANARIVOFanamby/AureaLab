'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  slug: string
  icon: string
  isActive: boolean
}

interface Service {
  id: string
  name: string
  description: string
  price: string
  categoryId: string
  image: string
  order: number
  isActive: boolean
  createdAt: string
}

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    image: null as File | null
  })
  const [uploading, setUploading] = useState(false)
  const [filterCategory, setFilterCategory] = useState('tous')
  const router = useRouter()

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_auth')
    if (!isAuth) {
      router.push('/admin/login')
      return
    }
    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      const [servicesRes, categoriesRes] = await Promise.all([
        fetch('/admin/api/services'),
        fetch('/admin/api/categories')
      ])
      const servicesData = await servicesRes.json()
      const categoriesData = await categoriesRes.json()
      
      setServices(servicesData)
      setCategories(categoriesData.filter((c: Category) => c.isActive))
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cette prestation ?')) {
      await fetch(`/admin/api/services?id=${id}`, { method: 'DELETE' })
      fetchData()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.image) {
      alert('Veuillez sélectionner une image')
      return
    }
    if (!formData.categoryId) {
      alert('Veuillez sélectionner une catégorie')
      return
    }

    setUploading(true)
    const data = new FormData()
    data.append('name', formData.name)
    data.append('description', formData.description)
    data.append('price', formData.price)
    data.append('categoryId', formData.categoryId)
    data.append('image', formData.image)

    try {
      const res = await fetch('/admin/api/services', {
        method: 'POST',
        body: data
      })

      if (res.ok) {
        alert('Prestation ajoutée avec succès !')
        setShowModal(false)
        setFormData({ name: '', description: '', price: '', categoryId: '', image: null })
        fetchData()
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
    if (!selectedService) return

    try {
      const res = await fetch('/admin/api/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedService.id,
          name: formData.name,
          description: formData.description,
          price: formData.price,
          categoryId: formData.categoryId,
          order: selectedService.order,
          isActive: selectedService.isActive
        })
      })

      if (res.ok) {
        alert('Prestation modifiée avec succès !')
        setShowEditModal(false)
        setSelectedService(null)
        fetchData()
      } else {
        alert('Erreur lors de la modification')
      }
    } catch (error) {
      alert('Erreur de connexion')
    }
  }

  const toggleActive = async (service: Service) => {
    await fetch('/admin/api/services', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price,
        categoryId: service.categoryId,
        order: service.order,
        isActive: !service.isActive
      })
    })
    fetchData()
  }

  const openEditModal = (service: Service) => {
    setSelectedService(service)
    setFormData({
      name: service.name,
      description: service.description || '',
      price: service.price,
      categoryId: service.categoryId,
      image: null
    })
    setShowEditModal(true)
  }

  const moveUp = async (service: Service) => {
    if (service.order <= 1) return
    const prevService = services.find(s => s.order === service.order - 1)
    if (prevService) {
      await fetch('/admin/api/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: service.id, order: prevService.order })
      })
      await fetch('/admin/api/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: prevService.id, order: service.order })
      })
      fetchData()
    }
  }

  const moveDown = async (service: Service) => {
    const nextService = services.find(s => s.order === service.order + 1)
    if (nextService) {
      await fetch('/admin/api/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: service.id, order: nextService.order })
      })
      await fetch('/admin/api/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: nextService.id, order: service.order })
      })
      fetchData()
    }
  }

//   const getCategoryLabel = (categoryId: string) => {
//     const category = categories.find(c => c.id === categoryId)
//     return category ? `${category.icon} ${category.name}` : 'Sans catégorie'
//   }

const getCategoryLabel = (categoryId: string) => {
  const category = categories.find(c => c.id === categoryId)
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
      <span>{category.name}</span>
    </div>
  )
}

  const filteredServices = filterCategory === 'tous'
    ? services
    : services.filter(s => s.categoryId === filterCategory)

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7' }}>
      
      {/* Header */}
      <div style={{ background: '#1A1A1A', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#D4AF37' }}>Prestations</h1>
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
            + Ajouter une prestation
          </button>
          <Link href="/admin" style={{ color: '#D4AF37', textDecoration: 'none' }}>← Retour</Link>
        </div>
      </div>

      {/* Filtres par catégorie */}
      <div style={{ padding: '1rem 2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', borderBottom: '1px solid #eee', background: 'white' }}>
        <button
          onClick={() => setFilterCategory('tous')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: 'none',
            background: filterCategory === 'tous' ? '#D4AF37' : '#f0f0f0',
            cursor: 'pointer',
            fontWeight: filterCategory === 'tous' ? 'bold' : 'normal'
          }}
        >
          Toutes
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: filterCategory === cat.id ? '#D4AF37' : '#f0f0f0',
              cursor: 'pointer',
              fontWeight: filterCategory === cat.id ? 'bold' : 'normal'
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grille des prestations */}
      <div style={{ padding: '2rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {filteredServices.map((service) => (
            <div
              key={service.id}
              style={{
                background: 'white',
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease',
                opacity: service.isActive ? 1 : 0.6
              }}
            >
              <div style={{ position: 'relative', height: '200px', background: '#f5f5f5' }}>
                <img
                  src={service.image}
                  alt={service.name}
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
                  background: '#D4AF37',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  color: '#1A1A1A'
                }}>
                  {service.price}
                </div>
                {!service.isActive && (
                  <div style={{
                    position: 'absolute',
                    bottom: '0.5rem',
                    left: '0.5rem',
                    background: '#dc3545',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.7rem'
                  }}>
                    Inactif
                  </div>
                )}
              </div>
              
              <div style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{service.name}</h3>
                  <span style={{ fontSize: '0.7rem', color: '#D4AF37' }}>
                    {getCategoryLabel(service.categoryId)}
                  </span>
                </div>
                {service.description && (
                  <p style={{ color: '#666', fontSize: '0.8rem', margin: '0 0 0.5rem 0' }}>
                    {service.description.substring(0, 80)}...
                  </p>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => moveUp(service)}
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
                      onClick={() => moveDown(service)}
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
                      onClick={() => toggleActive(service)}
                      style={{
                        background: service.isActive ? '#FF9800' : '#4CAF50',
                        color: 'white',
                        border: 'none',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        cursor: 'pointer'
                      }}
                      title={service.isActive ? 'Désactiver' : 'Activer'}
                    >
                      {service.isActive ? '🔘' : '▶️'}
                    </button>
                    <button
                      onClick={() => openEditModal(service)}
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
                      onClick={() => handleDelete(service.id)}
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
                    Ordre: {service.order}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#999' }}>
            Aucune prestation dans cette catégorie.
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
            <h2 style={{ color: '#D4AF37', marginBottom: '1rem' }}>Ajouter une prestation</h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Nom *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Prix *</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  placeholder="ex: 60 000 Ar"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Catégorie *</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
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
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}
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
                    cursor: uploading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {uploading ? 'Upload...' : 'Ajouter'}
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
      {showEditModal && selectedService && (
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
            <h2 style={{ color: '#D4AF37', marginBottom: '1rem' }}>Modifier la prestation</h2>
            
            <form onSubmit={handleEdit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Nom *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Prix *</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Catégorie *</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <img
                  src={selectedService.image}
                  alt={selectedService.name}
                  style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '0.5rem' }}
                />
                <p style={{ fontSize: '0.75rem', color: '#999' }}>Pour changer l'image, supprimez et ajoutez-en une nouvelle.</p>
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