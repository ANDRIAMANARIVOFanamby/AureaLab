'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import Image from 'next/image'
import ScrollArrow from '@/components/ScrollArrow'

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
  category: Category | null
  image: string
  order: number
  isActive: boolean
}

interface Slide {
  id: number
  image: string
  title: string
  subtitle: string
}

// Slides du carrousel pour la page Services
const slides: Slide[] = [
  {
    id: 1,
    image: 'https://res.cloudinary.com/degalhtre/image/upload/v1777295111/hero-prestation-bg_rm7kv3.jpg',
    title: 'Nos prestations',
    subtitle: 'Des techniques sur-mesure pour sublimer votre regard avec élégance et précision',
  },
  {
    id: 2,
    image: 'https://res.cloudinary.com/degalhtre/image/upload/v1778148322/compressedImage_3_uvlhrs.jpg',
    title: 'Prestations personnalisées',
    subtitle: 'Chaque prestation est adaptée selon vos attentes',
  },
]

export default function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('tous')
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  // Défilement automatique
  useEffect(() => {
    if (slides.length <= 1) return
    
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setCurrentSlide((prev) => (prev + 1) % slides.length)
      setTimeout(() => setIsTransitioning(false), 1000)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index: number) => {
    if (index === currentSlide) return
    if (index < 0 || index >= slides.length) return
    setIsTransitioning(true)
    setCurrentSlide(index)
    setTimeout(() => setIsTransitioning(false), 1000)
  }

  const fetchData = async () => {
    try {
      const servicesRes = await fetch('/admin/api/services')
      const allServices = await servicesRes.json()
      
      const categoriesRes = await fetch('/admin/api/categories')
      const allCategories = await categoriesRes.json()
      
      const activeServices = allServices.filter((s: Service) => s.isActive === true)
      const activeCategories = allCategories.filter((c: Category) => c.isActive === true)
      
      activeServices.sort((a: Service, b: Service) => a.order - b.order)
      activeCategories.sort((a: Category, b: Category) => a.order - b.order)
      
      setServices(activeServices)
      setCategories(activeCategories)
      setFilteredServices(activeServices)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (activeCategory === 'tous') {
      setFilteredServices(services)
    } else {
      setFilteredServices(services.filter(s => s.categoryId === activeCategory))
    }
  }, [activeCategory, services])

  const renderIcon = (icon: string) => {
    if (!icon) return null
    const isSvg = icon.trim().startsWith('<svg')
    if (isSvg) {
      return (
        <div 
          dangerouslySetInnerHTML={{ __html: icon }} 
          style={{ display: 'inline-block', width: '18px', height: '18px', marginRight: '6px', verticalAlign: 'middle' }}
        />
      )
    }
    return <span style={{ marginRight: '6px' }}>{icon}</span>
  }

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #D4AF37', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
        <Footer />
        <WhatsAppButton />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </>
    )
  }

  return (
    <>
      <Header />
      <main>
        
        {/* Hero avec slider */}
        <div className="prestations-page-hero" style={{ height: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Slides - Images de fond */}
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 0,
                opacity: index === currentSlide ? 1 : 0,
                transition: 'opacity 800ms ease-in-out',
              }}
            >
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image 
                  src={slide.image} 
                  alt="AUREA Lab"
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)' }}></div>
              </div>
            </div>
          ))}
          
          {/* Contenu */}
          <div 
            style={{ 
              position: 'relative', 
              zIndex: 10, 
              maxWidth: '1200px', 
              margin: '0 auto', 
              padding: '0 1.5rem', 
              textAlign: 'center', 
              width: '100%',
              opacity: isTransitioning ? 0.7 : 1,
              transition: 'opacity 300ms ease-in-out',
            }}
          >
            <h1 
              key={`title-${currentSlide}`}
              style={{ 
                animation: 'fadeInUp 0.5s ease-out',
              }}
            >
              {slides[currentSlide].title}
            </h1>
            <div 
              key={`divider-${currentSlide}`}
              className="prestations-page-divider"
              style={{ 
                animation: 'fadeInUp 0.5s ease-out 0.1s both',
              }}
            ></div>
            <p 
              key={`subtitle-${currentSlide}`}
              style={{ 
                animation: 'fadeInUp 0.5s ease-out 0.2s both',
              }}
            >
              {slides[currentSlide].subtitle}
            </p>
            <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', zIndex: 20 }}>
              <ScrollArrow />
            </div>
          </div>
          
        </div>

        <section className="prestations-page">
          <div className="prestations-page-container">
            
            {/* Filtres par catégorie */}
            {categories.length > 0 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                marginBottom: '2rem',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => setActiveCategory('tous')}
                  style={{
                    padding: '0.5rem 1.5rem',
                    borderRadius: '9999px',
                    background: activeCategory === 'tous' ? '#D4AF37' : 'transparent',
                    color: activeCategory === 'tous' ? '#1A1A1A' : '#666',
                    border: activeCategory === 'tous' ? 'none' : '1px solid #ddd',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontFamily: 'inherit'
                  }}
                >
                  Toutes les prestations
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    style={{
                      padding: '0.5rem 1.5rem',
                      borderRadius: '9999px',
                      background: activeCategory === cat.id ? '#D4AF37' : 'transparent',
                      color: activeCategory === cat.id ? '#1A1A1A' : '#666',
                      border: activeCategory === cat.id ? 'none' : '1px solid #ddd',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontFamily: 'inherit',
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}
                  >
                    {renderIcon(cat.icon)}
                    {cat.name}
                  </button>
                ))}
              </div>
            )}

            {/* Liste des prestations */}
            <div className="prestations-list">
              {filteredServices.map((service) => (
                <div key={service.id} className="prestation-item">
                  
                  <div className="prestation-item-image" style={{ position: 'relative' }}>
                    <img 
                      src={service.image} 
                      alt={service.name}
                      className="prestation-item-img"
                    />
                    {service.category && (
                      <div style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        background: '#D4AF37',
                        color: '#1A1A1A',
                        padding: '0.35rem 0.9rem',
                        borderRadius: '30px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        backdropFilter: 'blur(2px)',
                        zIndex: 5
                      }}>
                        {renderIcon(service.category.icon)}
                        {service.category.name}
                      </div>
                    )}
                  </div>

                  <div className="prestation-item-content">
                    <div className="prestation-item-header">
                      <h2 className="prestation-item-title">{service.name}</h2>
                      <p className="prestation-item-price">{service.price}</p>
                    </div>
                    <p className="prestation-item-desc">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
                <p>Aucune prestation disponible dans cette catégorie.</p>
              </div>
            )}

            <div className="prestations-note">
              <p>
                <strong>✨ Chaque prestation est personnalisée</strong> selon votre regard et vos attentes.
                Une consultation préalable permet de déterminer la technique idéale pour vous.
              </p>
            </div>

            <div className="prestations-cta">
              <Link 
                href="/booking" 
                className="btn-gold"
                style={{ 
                  background: 'linear-gradient(135deg, #D4AF37 0%, #C59B27 100%)',
                  color: '#1A1A1A',
                  padding: '0.875rem 2.5rem',
                  borderRadius: '9999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
              >
                <span>📝</span>
                <span>Réserver ma prestation</span>
              </Link>
            </div>

          </div>
        </section>

      </main>
      <Footer />
      <WhatsAppButton />

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}