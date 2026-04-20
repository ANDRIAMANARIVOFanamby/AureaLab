'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function Booking() {
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

  const prestations = [
    { value: '', label: 'Choisissez une prestation' },
    { value: 'cil-a-cil', label: 'Cil à cil - 60 000 Ar' },
    { value: 'hybride', label: 'Hybride - 70 000 Ar' },
    { value: 'volume-bresilien', label: 'Volume Brésilien - 80 000 Ar' },
    { value: 'megavolume', label: 'Mégavolume - 100 000 Ar' },
    { value: 'non-sure', label: 'Je ne sais pas encore' }
  ]

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
        
        {/* Section Réservation */}
        <section className="booking-page">
          <div className="booking-container">
            
            {/* Hero */}
            <div className="booking-hero">
              <h1>Réservation</h1>
              <div className="booking-divider"></div>
              <p>
                AUREA Lab ouvrira bientôt ses portes. Vous pouvez dès maintenant rejoindre 
                la liste d'attente pour être parmi les premières clientes informées de l'ouverture.
              </p>
            </div>

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

                {/* Prestation */}
                <div className="form-group">
                  <label className="form-label">
                    Prestation souhaitée <span>*</span>
                  </label>
                  <select
                    name="prestation"
                    value={formData.prestation}
                    onChange={handleChange}
                    required
                    className="form-select"
                  >
                    {prestations.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
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
    </>
  )
}