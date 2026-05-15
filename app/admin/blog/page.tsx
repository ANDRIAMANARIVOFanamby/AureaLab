'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  author: string
  published: boolean
  publishedAt: string
  createdAt: string
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    imageFile: null as File | null,
    author: 'AUREA Lab',
    published: false
    })
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_auth')
    if (!isAuth) {
      router.push('/admin/login')
      return
    }
    fetchPosts()
  }, [router])

  const fetchPosts = async () => {
    try {
      const res = await fetch('/admin/api/posts')
      const data = await res.json()
      setPosts(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cet article ?')) {
      await fetch(`/admin/api/posts?id=${id}`, { method: 'DELETE' })
      fetchPosts()
    }
  }

  const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .trim()
    .normalize('NFD')                    // Décompose les accents
    .replace(/[\u0300-\u036f]/g, '')    // Supprime les accents
    .replace(/[^a-z0-9\s-]/g, '')       // Supprime les caractères spéciaux
    .replace(/\s+/g, '-')               // Remplace les espaces par des tirets
    .replace(/-+/g, '-')                // Remplace les tirets multiples
    .replace(/^-|-$/g, '')              // Supprime les tirets au début/fin
}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
        const data = new FormData()
        data.append('title', formData.title)
        data.append('slug', formData.slug)
        data.append('excerpt', formData.excerpt)
        data.append('content', formData.content)
        data.append('author', formData.author)
        data.append('published', String(formData.published))
        if (formData.imageFile) {
        data.append('image', formData.imageFile)
        }

        const res = await fetch('/admin/api/posts', {
        method: 'POST',
        body: data  // ← Important : ne pas mettre Content-Type, laissez le navigateur le gérer
        })

        if (res.ok) {
        alert('Article ajouté avec succès !')
        setShowModal(false)
        setFormData({ title: '', slug: '', excerpt: '', content: '', image: '', imageFile: null, author: 'AUREA Lab', published: false })
        fetchPosts()
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
    if (!selectedPost) return
    setSaving(true)

    try {
      const res = await fetch('/admin/api/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedPost.id, ...formData })
      })

      if (res.ok) {
        alert('Article modifié avec succès !')
        setShowEditModal(false)
        setSelectedPost(null)
        fetchPosts()
      } else {
        alert('Erreur lors de la modification')
      }
    } catch (error) {
      alert('Erreur de connexion')
    } finally {
      setSaving(false)
    }
  }

  const openEditModal = (post: Post) => {
    setSelectedPost(post)
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content,
      image: post.image || '',
      author: post.author,
      published: post.published
    })
    setShowEditModal(true)
  }

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7' }}>
      
      {/* Header */}
      <div style={{ background: '#1A1A1A', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }}>Blog</h1>
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
            + Nouvel article
          </button>
          <Link href="/admin" style={{ color: '#D4AF37', textDecoration: 'none' }}>← Retour</Link>
        </div>
      </div>

      {/* Liste des articles */}
      <div style={{ padding: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '1rem', overflow: 'hidden' }}>
          <thead style={{ background: '#D4AF37', color: '#1A1A1A' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Titre</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Slug</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Statut</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '1rem' }}>{post.title}</td>
                <td style={{ padding: '1rem' }}><code>{post.slug}</code></td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    background: post.published ? '#4CAF50' : '#FF9800',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem'
                  }}>
                    {post.published ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>{new Date(post.createdAt).toLocaleDateString('fr-FR')}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <button
                    onClick={() => openEditModal(post)}
                    style={{ background: '#2196F3', color: 'white', border: 'none', padding: '0.25rem 0.75rem', borderRadius: '0.25rem', cursor: 'pointer', marginRight: '0.5rem' }}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    style={{ background: '#dc3545', color: 'white', border: 'none', padding: '0.25rem 0.75rem', borderRadius: '0.25rem', cursor: 'pointer' }}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {posts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#999' }}>
            Aucun article. Cliquez sur "Nouvel article" pour commencer.
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
          zIndex: 1000,
          overflowY: 'auto',
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            width: '100%',
            maxWidth: '700px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ color: '#D4AF37', marginBottom: '1rem' }}>Nouvel article</h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Titre *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })}
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
                <p style={{ fontSize: '0.7rem', color: '#999', marginTop: '0.25rem' }}>URL unique de l'article (ex: "mon-premier-article")</p>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Résumé</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={2}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}
                  placeholder="Court résumé pour la liste des articles"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Contenu *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem', fontFamily: 'monospace' }}
                  placeholder="Contenu HTML de l'article..."
                />
              </div>

              {/* <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>URL de l'image de couverture</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}
                  placeholder="https://..."
                />
              </div> */}

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Image de couverture</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, imageFile: e.target.files?.[0] || null })}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}
                />
                {formData.image && typeof formData.image === 'string' && (
                    <img src={formData.image} alt="Aperçu" style={{ marginTop: '0.5rem', maxWidth: '100%', maxHeight: '150px', borderRadius: '0.5rem' }} />
                )}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  />
                  <span>Publier immédiatement</span>
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

      {/* Modal Édition (similaire) */}
      {showEditModal && selectedPost && (
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
          zIndex: 1000,
          overflowY: 'auto',
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            width: '100%',
            maxWidth: '700px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ color: '#D4AF37', marginBottom: '1rem' }}>Modifier l'article</h2>
            
            <form onSubmit={handleEdit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Titre *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Résumé</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={2}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Contenu *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem', fontFamily: 'monospace' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>URL de l'image</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  />
                  <span>Publié</span>
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