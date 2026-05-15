'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import ScrollArrow from '@/components/ScrollArrow'

interface AboutContent {
  content_title: string
  content_paragraph1: string
  content_paragraph2: string
  content_paragraph3: string
  content_signature: string
}

interface Slide {
  id: number
  image: string
  title: string
  subtitle: string
}

// Slides du carrousel pour la page À propos
const slides: Slide[] = [
  {
    id: 1,
    image: 'https://res.cloudinary.com/degalhtre/image/upload/v1777295039/hero-about-bg_yegrpv.jpg',
    title: 'À propos de AUREA Lab',
    subtitle: 'Un studio d\'exception dédié à la mise en valeur du regard',
  },
  {
    id: 2,
    image: 'https://res.cloudinary.com/degalhtre/image/upload/v1778146995/compressedImage_1_jatfrp.jpg',
    title: 'À propos de AUREA Lab',
    subtitle: 'Parce que le regard mérite un cadre, mais les mains, une signature : on maîtrise aussi l’onglerie.',
  },
]

export default function About() {
  const [content, setContent] = useState<AboutContent>({
    content_title: 'Le luxe dans chaque regard',
    content_paragraph1: 'Chez AUREA Lab, chaque regard est une création unique. Notre vision est de proposer une expérience beauté élégante, personnalisée et raffinée.',
    content_paragraph2: 'Chaque pose est pensée sur-mesure selon la forme des yeux, le style et l\'effet souhaité. Nous croyons que le regard est une signature unique.',
    content_paragraph3: 'C\'est pourquoi nous accordons une attention particulière à chaque détail afin de sublimer la beauté naturelle sans la transformer.',
    content_signature: '— AUREA Lab, le luxe dans chaque regard'
  })
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    fetchContent()
  }, [])

  // Défilement automatique - CORRIGÉ pour 2 slides
  useEffect(() => {
    if (slides.length <= 1) return
    
    const interval = setInterval(() => {
      setIsTransitioning(true)
      // Passe au slide suivant, revient à 0 après le dernier
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

  const fetchContent = async () => {
    try {
      const res = await fetch('/admin/api/content?page=about')
      const data = await res.json()
      if (Object.keys(data).length > 0) {
        setContent({
          content_title: data.content_content_title || content.content_title,
          content_paragraph1: data.content_content_paragraph1 || content.content_paragraph1,
          content_paragraph2: data.content_content_paragraph2 || content.content_paragraph2,
          content_paragraph3: data.content_content_paragraph3 || content.content_paragraph3,
          content_signature: data.content_content_signature || content.content_signature
        })
      }
    } catch (error) {
      console.error('Erreur chargement contenu:', error)
    } finally {
      setLoading(false)
    }
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
        
        {/* Section À propos avec slider */}
        <div className="about-hero" style={{ height: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
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
          
          {/* Contenu - Le titre et sous-titre changent avec le slide actuel */}
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
              className="about-hero-divider"
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

        <section className="about-section">
          <div className="about-container">

            {/* Grille contenu + image - PARTIE DYNAMIQUE */}
            <div className="about-grid">
              
              {/* Texte (DYNAMIQUE) */}
              <div className="about-content">
                <h2>{content.content_title}</h2>
                <p>{content.content_paragraph1}</p>
                <p>{content.content_paragraph2}</p>
                <p>{content.content_paragraph3}</p>
                <div className="about-signature">
                  {content.content_signature}
                </div>
              </div>
            </div>

            {/* Valeurs (statiques) */}
            <div className="values-section bg-white/90 backdrop-blur-md">
              <h3 className="values-title">Nos valeurs</h3>
              <div className="values-grid">
                {/* Excellence */}
                <div className="value-card">
                  <div className="value-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" style={{ color: '#D4AF37' }}>
                      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                        d="m15.238 10.81l-.569 1.694a4.33 4.33 0 0 1-2.757 2.76l-1.713.569a.288.288 0 0 0 0 .548l1.713.569a4.32 4.32 0 0 1 2.736 2.738l.568 1.715a.287.287 0 0 0 .548 0l.59-1.694a4.32 4.32 0 0 1 2.735-2.738l1.714-.569a.288.288 0 0 0 0-.548l-1.692-.59a4.32 4.32 0 0 1-2.757-2.76l-.569-1.715a.29.29 0 0 0-.448-.126a.3.3 0 0 0-.099.148m-8.43-4.914l-.413 1.231a3.15 3.15 0 0 1-2.006 2.007l-1.246.414a.21.21 0 0 0 0 .398l1.246.415a3.14 3.14 0 0 1 1.99 1.99l.413 1.248a.21.21 0 0 0 .398 0l.43-1.232a3.15 3.15 0 0 1 1.99-1.99l1.245-.415a.21.21 0 0 0 0-.398l-1.23-.43A3.14 3.14 0 0 1 7.62 7.128l-.414-1.247a.21.21 0 0 0-.398.016m7.849-3.422l-.207.616a1.57 1.57 0 0 1-1.002 1.004l-.623.207a.104.104 0 0 0-.052.16a.1.1 0 0 0 .052.039l.623.207a1.57 1.57 0 0 1 .995.995l.206.624a.105.105 0 0 0 .2 0l.214-.616a1.57 1.57 0 0 1 .995-.995l.623-.207a.105.105 0 0 0 0-.2l-.615-.214a1.57 1.57 0 0 1-1.003-1.004l-.207-.624a.105.105 0 0 0-.199.008" />
                    </svg>
                  </div>
                  <h4>Excellence</h4>
                  <p>Des prestations réalisées avec précision et minutie pour un résultat parfait.</p>
                </div>

                {/* Personnalisation */}
                <div className="value-card">
                  <div className="value-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" style={{ color: '#D4AF37' }}>
                      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                        <path d="M2.55 13.406c-.272-.373-.408-.56-.502-.92a2.5 2.5 0 0 1 0-.971c.094-.361.23-.548.502-.92C4.039 8.55 7.303 5 12 5s7.961 3.55 9.45 5.594c.272.373.408.56.502.92a2.5 2.5 0 0 1 0 .971c-.094.361-.23.548-.502.92C19.961 15.45 16.697 19 12 19s-7.961-3.55-9.45-5.594" />
                        <path d="M12 14a2 2 0 1 0 0-4a2 2 0 0 0 0 4" />
                      </g>
                    </svg>
                  </div>
                  <h4>Personnalisation</h4>
                  <p>Chaque pose est unique et adaptée à la morphologie de vos yeux.</p>
                </div>

                {/* Bien-être */}
                <div className="value-card">
                  <div className="value-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" style={{ color: '#D4AF37' }}>
                      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5">
                        <path strokeLinejoin="round" d="M7.646 15.71A6 6 0 0 1 7 13c0-3.215 2.5-5.5 6-6c4.082-.583 5.833-2.833 7-4c3.5 13-3 16-7 16a6 6 0 0 1-3-.803" />
                        <path d="M3 21c.5-3 2.458-4.864 7-6c3.217-.804 5.463-2.82 7-4.945" />
                      </g>
                    </svg>
                  </div>
                  <h4>Bien-être</h4>
                  <p>Une expérience relaxante dans un cadre élégant et apaisant.</p>
                </div>

                {/* Hygiène */}
                <div className="value-card">
                  <div className="value-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" style={{ color: '#D4AF37' }}>
                      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                        d="m15.238 10.81l-.569 1.694a4.33 4.33 0 0 1-2.757 2.76l-1.713.569a.288.288 0 0 0 0 .548l1.713.569a4.32 4.32 0 0 1 2.736 2.738l.568 1.715a.287.287 0 0 0 .548 0l.59-1.694a4.32 4.32 0 0 1 2.735-2.738l1.714-.569a.288.288 0 0 0 0-.548l-1.692-.59a4.32 4.32 0 0 1-2.757-2.76l-.569-1.715a.29.29 0 0 0-.448-.126a.3.3 0 0 0-.099.148m-8.43-4.914l-.413 1.231a3.15 3.15 0 0 1-2.006 2.007l-1.246.414a.21.21 0 0 0 0 .398l1.246.415a3.14 3.14 0 0 1 1.99 1.99l.413 1.248a.21.21 0 0 0 .398 0l.43-1.232a3.15 3.15 0 0 1 1.99-1.99l1.245-.415a.21.21 0 0 0 0-.398l-1.23-.43A3.14 3.14 0 0 1 7.62 7.128l-.414-1.247a.21.21 0 0 0-.398.016m7.849-3.422l-.207.616a1.57 1.57 0 0 1-1.002 1.004l-.623.207a.104.104 0 0 0-.052.16a.1.1 0 0 0 .052.039l.623.207a1.57 1.57 0 0 1 .995.995l.206.624a.105.105 0 0 0 .2 0l.214-.616a1.57 1.57 0 0 1 .995-.995l.623-.207a.105.105 0 0 0 0-.2l-.615-.214a1.57 1.57 0 0 1-1.003-1.004l-.207-.624a.105.105 0 0 0-.199.008" />
                    </svg>
                  </div>
                  <h4>Hygiène</h4>
                  <p>Un protocole de nettoyage rigoureux et des outils stérilisés pour votre sécurité et votre tranquillité d'esprit.</p>
                </div>

              </div>
            </div>

            {/* Statut ouverture (statique) */}
            <div className="status-badge">
              <div className="status-badge-content">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24"
                  style={{ flexShrink: 0 }}
                >
                  <g fill="none" stroke="#D4AF37" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 19v-9a6 6 0 0 1 6-6v0a6 6 0 0 1 6 6v9M6 19h12M6 19H4m14 0h2m-9 3h2" />
                    <circle cx="12" cy="3" r="1" />
                  </g>
                </svg>
                <p>Ouverture bientôt – AUREA Lab arrive très prochainement</p>
              </div>
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