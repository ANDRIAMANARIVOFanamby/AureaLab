'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function Contact() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: ''
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      const response = await fetch('/api/contact', {
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
          sujet: '',
          message: ''
        })
      } else {
        setErrorMessage(data.error || 'Une erreur est survenue')
      }
    } catch (error) {
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
          <section className="contact-page">
            <div className="contact-container">
              <div className="contact-form-wrapper">
                <div className="contact-success">
                  <div className="contact-success-icon">✉️</div>
                  <h2 className="contact-success-title">Message envoyé !</h2>
                  <p className="contact-success-message">
                    Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
                  </p>
                  <Link 
                    href="/"
                    className="contact-submit-btn"
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
              </div>
              <div className="contact-footer">
                AUREA Lab arrive très prochainement.
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
        <section className="contact-page">
          <div className="contact-container">
            
            <div className="contact-hero">
              <h1>Contact</h1>
              <div className="contact-divider"></div>
              <p>
                Pour toute information ou inscription à la liste d'attente, 
                contactez AUREA Lab.
              </p>
            </div>

            <div className="contact-grid">
              
              {/* Informations de contact */}
              <div className="contact-info-card">
                <h2 className="contact-info-title">Nous contacter</h2>
                <ul className="contact-info-list">
                  <li className="contact-info-item">
                    <div className="contact-info-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                      </svg>
                    </div>
                    <div className="contact-info-content">
                      <div className="contact-info-label">WhatsApp</div>
                      <a href="https://wa.me/261375158491" target="_blank" rel="noopener noreferrer" className="contact-info-value">
                        +261 37 51 584 91
                      </a>
                    </div>
                  </li>
                  <li className="contact-info-item">
                    <div className="contact-info-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                      </svg>
                    </div>
                    <div className="contact-info-content">
                      <div className="contact-info-label">Instagram</div>
                      <a href="https://instagram.com/lab.aurea" target="_blank" rel="noopener noreferrer" className="contact-info-value">
                        @lab.aurea
                      </a>
                    </div>
                  </li>
                  <li className="contact-info-item">
                    <div className="contact-info-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </div>
                    <div className="contact-info-content">
                      <div className="contact-info-label">Email</div>
                      <a href="mailto:contact@aurealab.com" className="contact-info-value">
                        contact@aurealab.com
                      </a>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Formulaire */}
              <div className="contact-form-wrapper">
                <h2 className="contact-form-title">Envoyez-nous un message</h2>
                
                {errorMessage && (
                  <div style={{ background: '#ffebee', color: '#c62828', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                    ⚠️ {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Nom complet <span>*</span></label>
                    <input type="text" name="nom" value={formData.nom} onChange={handleChange} required className="form-input" />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Email <span>*</span></label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-input" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Téléphone</label>
                      <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} className="form-input" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Sujet <span>*</span></label>
                    <select name="sujet" value={formData.sujet} onChange={handleChange} required className="form-select">
                      <option value="">Sélectionnez un sujet</option>
                      <option value="information">Demande d'information</option>
                      <option value="rdv">Prise de rendez-vous</option>
                      <option value="liste-attente">Inscription liste d'attente</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message <span>*</span></label>
                    <textarea name="message" value={formData.message} onChange={handleChange} required className="form-textarea" rows={5} />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    style={{
                      background: 'linear-gradient(135deg, #D4AF37 0%, #C59B27 100%)',
                      color: '#1A1A1A',
                      padding: '0.875rem 2rem',
                      borderRadius: '9999px',
                      width: '100%',
                      fontWeight: '600',
                      border: 'none',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      opacity: isLoading ? 0.6 : 1
                    }}
                  >
                    {isLoading ? '⏳ Envoi en cours...' : '✉️ Envoyer le message'}
                  </button>
                </form>
              </div>
            </div>

            <div className="contact-footer">
              AUREA Lab arrive très prochainement.
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}