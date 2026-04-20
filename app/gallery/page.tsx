'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

interface GalleryImage {
  id: number
  title: string
  description: string
  image: string
  category: string
  order: number
  createdAt: string
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('tous')

  // Catégories disponibles
  const categories = [
    { value: 'tous', label: 'Tous', color: '#D4AF37' },
    { value: 'cil-a-cil', label: 'Cil à cil', color: '#E8D5A3' },
    { value: 'hybride', label: 'Hybride', color: '#D4AF37' },
    { value: 'volume-bresilien', label: 'Volume Brésilien', color: '#C59B27' },
    { value: 'megavolume', label: 'Mégavolume', color: '#B8962A' }
  ]

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/gallery')
      const data = await res.json()
      setImages(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredImages = activeCategory === 'tous' 
    ? images 
    : images.filter(img => img.category === activeCategory)

  const getCategoryLabel = (category: string) => {
    return categories.find(c => c.value === category)?.label || category
  }

  if (loading) {
    return (
      <>
        <Header />
        <main>
          <div style={{ 
            minHeight: '60vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: '#FDFBF7'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                border: '3px solid #D4AF37', 
                borderTopColor: 'transparent', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem'
              }} />
              <p style={{ color: '#666' }}>Chargement de la galerie...</p>
            </div>
          </div>
        </main>
        <Footer />
        <WhatsAppButton />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </>
    )
  }

  return (
    <>
      <Header />
      <main>
        
        {/* Section Galerie */}
        <section className="gallery-page">
          <div className="gallery-container">
            
            {/* Hero */}
            <div className="gallery-hero">
              <h1>Nos créations</h1>
              <div className="gallery-divider"></div>
              <p>
                Découvrez l'univers AUREA Lab à travers des créations de regard élégantes et précises.
                Chaque pose est réalisée avec soin pour un résultat harmonieux et sophistiqué.
              </p>
            </div>

            {/* Filtres par catégorie */}
            {images.length > 0 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                marginBottom: '2rem',
                flexWrap: 'wrap'
              }}>
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setActiveCategory(cat.value)}
                    style={{
                      padding: '0.5rem 1.5rem',
                      borderRadius: '9999px',
                      border: activeCategory === cat.value ? `2px solid ${cat.color}` : '1px solid #ddd',
                      background: activeCategory === cat.value ? cat.color : 'white',
                      color: activeCategory === cat.value ? '#1A1A1A' : '#666',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontWeight: activeCategory === cat.value ? 'bold' : 'normal'
                    }}
                  >
                    {cat.label}
                    {activeCategory === cat.value && (
                      <span style={{ marginLeft: '0.5rem' }}>
                        ({filteredImages.length})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Grille de la galerie */}
            {filteredImages.length > 0 ? (
              <div className="gallery-grid">
                {filteredImages.map((image) => (
                  <div 
                    key={image.id} 
                    className="gallery-item"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img 
                      src={image.image} 
                      alt={image.title}
                      className="gallery-image"
                    />
                    <div className="gallery-overlay">
                      <div className="gallery-icon">🔍</div>
                    </div>
                    <div className="gallery-text">
                      <h3>{image.title}</h3>
                      <p>{getCategoryLabel(image.category)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '4rem',
                background: 'white',
                borderRadius: '1rem',
                marginTop: '2rem'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📸</div>
                <h3 style={{ color: '#D4AF37', marginBottom: '0.5rem' }}>Aucune image pour le moment</h3>
                <p style={{ color: '#666' }}>
                  La galerie est en cours de construction. Revenez bientôt pour découvrir nos créations !
                </p>
              </div>
            )}

            {/* Citation */}
            <div className="gallery-quote">
              "Le luxe se trouve dans la précision"
            </div>

          </div>
        </section>

      </main>
      <Footer />
      <WhatsAppButton />

      {/* Lightbox - Modal d'agrandissement */}
      {selectedImage && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.95)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          onClick={() => setSelectedImage(null)}
        >
          <div style={{ maxWidth: '90%', maxHeight: '90%', textAlign: 'center' }}>
            <img 
              src={selectedImage.image} 
              alt={selectedImage.title}
              style={{ 
                maxWidth: '100%', 
                maxHeight: '80vh', 
                borderRadius: '0.5rem', 
                objectFit: 'contain' 
              }}
            />
            <div style={{ textAlign: 'center', color: 'white', marginTop: '1rem' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", margin: 0 }}>
                {selectedImage.title}
              </h3>
              {selectedImage.description && (
                <p style={{ margin: '0.5rem 0 0', opacity: 0.8 }}>
                  {selectedImage.description}
                </p>
              )}
              <p style={{ margin: '0.5rem 0 0', opacity: 0.6, fontSize: '0.875rem' }}>
                {getCategoryLabel(selectedImage.category)}
              </p>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginTop: '1rem' }}>
              Cliquez n'importe où pour fermer
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}