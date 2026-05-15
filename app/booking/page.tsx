'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import Image from 'next/image'
import ScrollArrow from '@/components/ScrollArrow'

interface Service {
  id: string
  name: string
  price: string
  isActive: boolean
}

interface Slide {
  id: number
  image: string
  title: string
  subtitle: string
}

// Slides du carrousel pour la page Réservation
const slides: Slide[] = [
  {
    id: 1,
    image: 'https://res.cloudinary.com/degalhtre/image/upload/v1777295098/hero-booking-bg_qhquhh.jpg',
    title: 'Réservation',
    subtitle: 'AUREA Lab ouvrira bientôt ses portes. Rejoignez notre liste d\'attente',
  },
  {
    id: 2,
    image: 'https://res.cloudinary.com/degalhtre/image/upload/v1778143227/compressedImage_2_yxvbo5.jpg',
    title: 'Réserver votre prestation',
    subtitle: 'Soyez parmi les premières à découvrir l\'excellence d\'AUREA Lab',
  },
]

export default function Booking() {
  const [services, setServices] = useState<Service[]>([])
  const [loadingServices, setLoadingServices] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    prestation: '',
    disponibilite: '',
    message: ''
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Charger les prestations dynamiquement
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/admin/api/services')
        const data = await res.json()
        const activeServices = data.filter((s: Service) => s.isActive === true)
        setServices(activeServices)
      } catch (error) {
        console.error('Erreur chargement prestations:', error)
      } finally {
        setLoadingServices(false)
      }
    }
    fetchServices()
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setErrorMessage('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')
    
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSubmitted(true)
        setFormData({
          nom: '',
          email: '',
          telephone: '',
          prestation: '',
          disponibilite: '',
          message: ''
        })
      } else {
        setErrorMessage(data.error || 'Une erreur est survenue')
      }
    } catch (error) {
      console.error('Erreur:', error)
      setErrorMessage('Erreur de connexion. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <>
        <Header />
        <main>
          <section className="booking-page">
            <div className="booking-container">
              <div className="booking-form-wrapper">
                <div className="booking-success">
                  <div className="success-icon">✨</div>
                  <h2 className="success-title">Merci pour votre inscription !</h2>
                  <p className="success-message">
                    Vous avez bien été ajoutée à notre liste d'attente. <br />
                    Nous vous contacterons dès l'ouverture d'AUREA Lab.
                  </p>
                  <Link 
                    href="/"
                    className="booking-submit-btn"
                    style={{ 
                      width: 'auto', 
                      padding: '0.75rem 2rem',
                      textDecoration: 'none',
                      display: 'inline-block'
                    }}
                  >
                    ← Retour à l'accueil
                  </Link>
                </div>
                <div className="booking-footer">
                  "Votre regard mérite l'excellence."
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
        <WhatsAppButton />
      </>
    )
  }

  return (
    <>
      <Header />
      <main>
        
        {/* Section Réservation avec slider */}
        <div className="booking-hero" style={{ height: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
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
              className="booking-divider"
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

        <section className="booking-page">
          <div className="booking-container">

            {/* Formulaire */}
            <div className="booking-form-wrapper">
              
              {/* Message d'erreur */}
              {errorMessage && (
                <div style={{
                  background: '#ffebee',
                  color: '#c62828',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  marginBottom: '1.5rem',
                  textAlign: 'center'
                }}>
                  ⚠️ {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                
                {/* Nom */}
                <div className="form-group">
                  <label className="form-label">
                    Nom complet <span>*</span>
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="Votre nom et prénom"
                  />
                </div>

                {/* Email et Téléphone */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      Email <span>*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      WhatsApp / Téléphone <span>*</span>
                    </label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="+261 XX XXX XX"
                    />
                  </div>
                </div>

                {/* Prestation - DYNAMIQUE */}
                <div className="form-group">
                  <label className="form-label">
                    Prestation souhaitée <span>*</span>
                  </label>
                  {loadingServices ? (
                    <div className="form-input" style={{ background: '#f5f5f5' }}>
                      Chargement des prestations...
                    </div>
                  ) : (
                    <select
                      name="prestation"
                      value={formData.prestation}
                      onChange={handleChange}
                      required
                      className="form-select"
                    >
                      <option value="">Choisissez une prestation</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name} - {service.price}
                        </option>
                      ))}
                      <option value="non-sure">Je ne sais pas encore</option>
                    </select>
                  )}
                </div>

                {/* Disponibilité */}
                <div className="form-group">
                  <label className="form-label">
                    Disponibilité préférentielle
                  </label>
                  <input
                    type="text"
                    name="disponibilite"
                    value={formData.disponibilite}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Ex: matin, après-midi, week-end..."
                  />
                </div>

                {/* Message */}
                <div className="form-group">
                  <label className="form-label">
                    Message (optionnel)
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="form-textarea"
                    placeholder="Une question, une demande particulière ?"
                  />
                </div>

                {/* Bouton */}
                <button 
                  type="submit" 
                  className="booking-submit-btn"
                  disabled={isLoading}
                  style={{
                    background: 'linear-gradient(135deg, #D4AF37 0%, #C59B27 100%)',
                    color: '#1A1A1A',
                    padding: '0.875rem 2rem',
                    borderRadius: '9999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    fontWeight: '600',
                    border: 'none',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    width: '100%',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
                    opacity: isLoading ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #E8D5A3 0%, #D4AF37 100%)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(212, 175, 55, 0.4)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #D4AF37 0%, #C59B27 100%)'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.3)'
                  }}
                >
                  {isLoading ? (
                    <>⏳ Envoi en cours...</>
                  ) : (
                    <>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="18" 
                        height="18" 
                        viewBox="0 0 24 24" 
                        fill="currentColor"
                      >
                        <circle cx="4" cy="7" r="1" />
                        <circle cx="4" cy="12" r="1" />
                        <circle cx="4" cy="17" r="1" />
                        <rect width="14" height="2" x="7" y="11" rx="0.94" ry="0.94" />
                        <rect width="14" height="2" x="7" y="16" rx="0.94" ry="0.94" />
                        <rect width="14" height="2" x="7" y="6" rx="0.94" ry="0.94" />
                      </svg>
                      <span>Rejoindre la liste d'attente</span>
                    </>
                  )}
                </button>

                {/* Note */}
                <p className="booking-note">
                  En soumettant ce formulaire, vous acceptez d'être contactée par AUREA Lab.
                  Vos informations ne seront pas partagées.
                </p>

              </form>
            </div>

            {/* Phrase finale */}
            <div className="booking-footer">
              "Votre regard mérite l'excellence."
            </div>

          </div>
        </section>

      </main>
      <Footer />
      <WhatsAppButton />

      {/* Animation CSS */}
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