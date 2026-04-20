import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import ScrollArrow from '@/components/ScrollArrow'

export default function Home() {
  return (
    <>
      <Header />
      <main className="overflow-hidden">
        
        {/* SECTION HERO - Version avec centrage forcé */}
<div className="hero-section" style={{ height: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  
  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
    <Image 
      src="/hero-bg.jpg" 
      alt="AUREA Lab"
      fill
      className="object-cover"
      priority
    />
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)' }}></div>
  </div>
  
  <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center', width: '100%' }}>
    
    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', color: 'white', marginBottom: '1rem' }}>
      AUREA Lab
    </h1>
    
    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#D4AF37', marginBottom: '1rem' }}>
      Le luxe dans chaque regard
    </p>
    
    <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.8)', maxWidth: '42rem', margin: '0 auto 1.5rem' }}>
      Extensions de cils haut de gamme – Ouverture bientôt
    </p>
    
    <div style={{ maxWidth: '28rem', margin: '0 auto 2.5rem' }}>
      <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', borderRadius: '1rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <g fill="none" stroke="#D4AF37" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 19v-9a6 6 0 0 1 6-6v0a6 6 0 0 1 6 6v9M6 19h12M6 19H4m14 0h2m-9 3h2" />
              <circle cx="12" cy="3" r="1" />
            </g>
          </svg>
          <p style={{ color: '#D4AF37', fontWeight: '600', fontSize: '0.875rem', margin: 0 }}>
            OUVERT BIENTÔT
          </p>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', margin: 0 }}>
          AUREA Lab prépare son ouverture. Un espace dédié à la beauté du regard.
        </p>
      </div>
    </div>
    
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
      
      {/* Bouton 2 - Liste d'attente avec effet doré */}
      <Link 
        href="/booking" 
        className="btn-gold"
        style={{ 
          backgroundColor: 'transparent',
          padding: '0.75rem 2rem', 
          borderRadius: '9999px', 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          fontWeight: '600',
          textDecoration: 'none'
        }}
      >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="4" cy="7" r="1" />
        <circle cx="4" cy="12" r="1" />
        <circle cx="4" cy="17" r="1" />
        <rect width="14" height="2" x="7" y="11" rx="0.94" ry="0.94" />
        <rect width="14" height="2" x="7" y="16" rx="0.94" ry="0.94" />
        <rect width="14" height="2" x="7" y="6" rx="0.94" ry="0.94" />
      </svg>
      <span>Rejoindre la liste d'attente</span>
    </Link>

      {/* Bouton 1 - Être informée */}
      <Link href="/contact" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '9999px', transition: 'all 0.3s ease', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 32 32" fill="currentColor">
          <path d="M17 22v-8h-4v2h2v6h-3v2h8v-2zM16 8a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 16 8" />
          <path d="M16 30a14 14 0 1 1 14-14a14 14 0 0 1-14 14m0-26a12 12 0 1 0 12 12A12 12 0 0 0 16 4" />
        </svg>
        <span>Être informée</span>
      </Link>
      
      {/* Bouton 3 - Nous contacter sur WhatsApp */}
      <a 
        href="https://wa.me/261375158491" 
        target="_blank"
        rel="noopener noreferrer"
        style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '9999px', transition: 'all 0.3s ease', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23c-1.48 0-2.93-.39-4.19-1.15l-.3-.17l-3.12.82l.83-3.04l-.2-.32a8.2 8.2 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31c-.22.25-.87.86-.87 2.07c0 1.22.89 2.39 1 2.56c.14.17 1.76 2.67 4.25 3.73c.59.27 1.05.42 1.41.53c.59.19 1.13.16 1.56.1c.48-.07 1.46-.6 1.67-1.18s.21-1.07.15-1.18c-.07-.1-.23-.16-.48-.27c-.25-.14-1.47-.74-1.69-.82c-.23-.08-.37-.12-.56.12c-.16.25-.64.81-.78.97c-.15.17-.29.19-.53.07c-.26-.13-1.06-.39-2-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.12-.24-.01-.39.11-.5c.11-.11.27-.29.37-.44c.13-.14.17-.25.25-.41c.08-.17.04-.31-.02-.43c-.06-.11-.56-1.35-.77-1.84c-.2-.48-.4-.42-.56-.43c-.14 0-.3-.01-.47-.01" />
        </svg>
        <span>Nous contacter sur WhatsApp</span>
      </a>
      
    </div>
    
    {/* Indicateur de scroll - Flèche dans un rond à gauche */}
    <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', zIndex: 20 }}>
      <ScrollArrow />
    </div>
    
  </div>
</div>

        {/* 🌿 SECTION PRÉSENTATION */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-dark mb-6">
              Une création unique pour chaque regard
            </h2>
            <p className="text-lg text-dark/70 leading-relaxed">
              Chez AUREA Lab, chaque regard est une création unique. Nous travaillons les extensions de cils avec précision afin d'offrir un résultat harmonieux, élégant et parfaitement adapté à votre visage.
            </p>
          </div>
        </section>

        {/* SECTION PRESTATIONS - Prix en haut à droite pour éviter superposition */}
        <section className="prestations-section">
          <h2 className="prestations-title">Nos prestations</h2>
          
          <div className="prestations-grid">
            
            {/* Carte 1 - Cil à cil */}
            <div className="prestation-card">
              <div className="prestation-image-wrapper">
                <img 
                  src="/prestations/cil-a-cil.jpg" 
                  alt="Cil à cil"
                  className="prestation-image"
                />
                <div className="prestation-overlay"></div>
                {/* Prix en haut à droite */}
                <div className="prestation-price-on-image">
                  60 000 Ar
                </div>
                {/* Texte en bas à gauche */}
                <div className="prestation-image-text">
                  <h4 className="prestation-image-title">Cil à cil</h4>
                  <p className="prestation-image-subtitle">Naturel & raffiné</p>
                </div>
              </div>
            </div>

            {/* Carte 2 - Hybride */}
            <div className="prestation-card">
              <div className="prestation-image-wrapper">
                <img 
                  src="/prestations/hybride.jpg" 
                  alt="Hybride"
                  className="prestation-image"
                />
                <div className="prestation-overlay"></div>
                <div className="prestation-price-on-image">
                  70 000 Ar
                </div>
                <div className="prestation-image-text">
                  <h4 className="prestation-image-title">Hybride</h4>
                  <p className="prestation-image-subtitle">Équilibre parfait</p>
                </div>
              </div>
            </div>

            {/* Carte 3 - Volume Brésilien */}
            <div className="prestation-card">
              <div className="prestation-image-wrapper">
                <img 
                  src="/prestations/volume-bresilien.jpg" 
                  alt="Volume Brésilien"
                  className="prestation-image"
                />
                <div className="prestation-overlay"></div>
                <div className="prestation-price-on-image">
                  80 000 Ar
                </div>
                <div className="prestation-image-text">
                  <h4 className="prestation-image-title">Volume Brésilien</h4>
                  <p className="prestation-image-subtitle">Douceur & intensité</p>
                </div>
              </div>
            </div>

            {/* Carte 4 - Mégavolume */}
            <div className="prestation-card">
              <div className="prestation-image-wrapper">
                <img 
                  src="/prestations/megavolume.jpg" 
                  alt="Mégavolume"
                  className="prestation-image"
                />
                <div className="prestation-overlay"></div>
                <div className="prestation-price-on-image">
                  100 000 Ar
                </div>
                <div className="prestation-image-text">
                  <h4 className="prestation-image-title">Mégavolume</h4>
                  <p className="prestation-image-subtitle">Glamour & sophistiqué</p>
                </div>
              </div>
            </div>
            
          </div>
          
          <p className="prestations-signature">
            "Le luxe dans chaque regard"
          </p>
        </section>

       {/* SECTION OUVERTURE - Nouveau design sophistiqué */}
        <section className="ouverture-section">
          <div className="ouverture-card">
            
            {/* Décoration */}
            <div className="ouverture-decoration">
              <span className="ouverture-dot"></span>
              <span className="ouverture-dot"></span>
              <span className="ouverture-dot"></span>
            </div>
            
            {/* Icône */}
            <div style={{ marginBottom: '1.5rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            
            <h2 className="ouverture-title">
              Prête à sublimer votre regard ?
            </h2>
            
            <p className="ouverture-description">
              Rejoignez notre liste d'attente exclusive et soyez parmi les premières 
              à découvrir l'excellence d'AUREA Lab.
            </p>
            
            <Link 
                href="/booking" 
                className="btn-gold"
                style={{ 
                  backgroundColor: 'transparent',
                  padding: '0.75rem 2rem', 
                  borderRadius: '9999px', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
              >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="4" cy="7" r="1" />
                <circle cx="4" cy="12" r="1" />
                <circle cx="4" cy="17" r="1" />
                <rect width="14" height="2" x="7" y="11" rx="0.94" ry="0.94" />
                <rect width="14" height="2" x="7" y="16" rx="0.94" ry="0.94" />
                <rect width="14" height="2" x="7" y="6" rx="0.94" ry="0.94" />
              </svg>
              <span>Rejoindre la liste d'attente</span>
            </Link>
            
          </div>
        </section>

      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}