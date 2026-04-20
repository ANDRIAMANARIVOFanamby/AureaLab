import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function About() {
  return (
    <>
      <Header />
      <main>
        
        {/* Section À propos */}
        <section className="about-section">
          <div className="about-container">
            
            {/* Hero */}
            <div className="about-hero">
              <h1>À propos de AUREA Lab</h1>
              <div className="about-hero-divider"></div>
              <p>
                Un studio d'exception dédié à la mise en valeur du regard à travers 
                des techniques d'extensions de cils haut de gamme.
              </p>
            </div>

            {/* Grille contenu + image */}
            <div className="about-grid">
              
              {/* Image */}
              <div className="about-image-wrapper">
                <img 
                  src="/about-studio.jpg" 
                  alt="AUREA Lab Studio"
                  className="about-image"
                />
              </div>

              {/* Texte */}
              <div className="about-content">
                <h2>Le luxe dans chaque regard</h2>
                <p>
                  Chez AUREA Lab, chaque regard est une création unique. Notre vision est de 
                  proposer une expérience beauté élégante, personnalisée et raffinée.
                </p>
                <p>
                  Chaque pose est pensée sur-mesure selon la forme des yeux, le style et 
                  l'effet souhaité. Nous croyons que le regard est une signature unique.
                </p>
                <p>
                  C'est pourquoi nous accordons une attention particulière à chaque détail 
                  afin de sublimer la beauté naturelle sans la transformer.
                </p>
                <div className="about-signature">
                  — AUREA Lab, le luxe dans chaque regard
                </div>
              </div>
            </div>

            {/* Valeurs */}
            <div className="values-section">
            <h3 className="values-title">Nos valeurs</h3>
            <div className="values-grid">
                
                {/* Excellence - avec icône étoile/diamant */}
                <div className="value-card">
                <div className="value-icon">
                    <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="32" 
                    height="32" 
                    viewBox="0 0 24 24"
                    style={{ color: '#D4AF37' }}
                    >
                    <path 
                        fill="none" 
                        stroke="currentColor" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="1.5" 
                        d="m15.238 10.81l-.569 1.694a4.33 4.33 0 0 1-2.757 2.76l-1.713.569a.288.288 0 0 0 0 .548l1.713.569a4.32 4.32 0 0 1 2.736 2.738l.568 1.715a.287.287 0 0 0 .548 0l.59-1.694a4.32 4.32 0 0 1 2.735-2.738l1.714-.569a.288.288 0 0 0 0-.548l-1.692-.59a4.32 4.32 0 0 1-2.757-2.76l-.569-1.715a.29.29 0 0 0-.448-.126a.3.3 0 0 0-.099.148m-8.43-4.914l-.413 1.231a3.15 3.15 0 0 1-2.006 2.007l-1.246.414a.21.21 0 0 0 0 .398l1.246.415a3.14 3.14 0 0 1 1.99 1.99l.413 1.248a.21.21 0 0 0 .398 0l.43-1.232a3.15 3.15 0 0 1 1.99-1.99l1.245-.415a.21.21 0 0 0 0-.398l-1.23-.43A3.14 3.14 0 0 1 7.62 7.128l-.414-1.247a.21.21 0 0 0-.398.016m7.849-3.422l-.207.616a1.57 1.57 0 0 1-1.002 1.004l-.623.207a.104.104 0 0 0-.052.16a.1.1 0 0 0 .052.039l.623.207a1.57 1.57 0 0 1 .995.995l.206.624a.105.105 0 0 0 .2 0l.214-.616a1.57 1.57 0 0 1 .995-.995l.623-.207a.105.105 0 0 0 0-.2l-.615-.214a1.57 1.57 0 0 1-1.003-1.004l-.207-.624a.105.105 0 0 0-.199.008" 
                    />
                    </svg>
                </div>
                <h4>Excellence</h4>
                <p>Des prestations réalisées avec précision et minutie pour un résultat parfait.</p>
                </div>

                {/* Personnalisation - avec icône œil */}
                <div className="value-card">
                <div className="value-icon">
                    <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="32" 
                    height="32" 
                    viewBox="0 0 24 24"
                    style={{ color: '#D4AF37' }}
                    >
                    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                        <path d="M2.55 13.406c-.272-.373-.408-.56-.502-.92a2.5 2.5 0 0 1 0-.971c.094-.361.23-.548.502-.92C4.039 8.55 7.303 5 12 5s7.961 3.55 9.45 5.594c.272.373.408.56.502.92a2.5 2.5 0 0 1 0 .971c-.094.361-.23.548-.502.92C19.961 15.45 16.697 19 12 19s-7.961-3.55-9.45-5.594" />
                        <path d="M12 14a2 2 0 1 0 0-4a2 2 0 0 0 0 4" />
                    </g>
                    </svg>
                </div>
                <h4>Personnalisation</h4>
                <p>Chaque pose est unique et adaptée à la morphologie de vos yeux.</p>
                </div>

                {/* Bien-être - avec icône feuille/cœur */}
                <div className="value-card">
                <div className="value-icon">
                    <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="32" 
                    height="32" 
                    viewBox="0 0 24 24"
                    style={{ color: '#D4AF37' }}
                    >
                    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5">
                        <path strokeLinejoin="round" d="M7.646 15.71A6 6 0 0 1 7 13c0-3.215 2.5-5.5 6-6c4.082-.583 5.833-2.833 7-4c3.5 13-3 16-7 16a6 6 0 0 1-3-.803" />
                        <path d="M3 21c.5-3 2.458-4.864 7-6c3.217-.804 5.463-2.82 7-4.945" />
                    </g>
                    </svg>
                </div>
                <h4>Bien-être</h4>
                <p>Une expérience relaxante dans un cadre élégant et apaisant.</p>
                </div>

            </div>
            </div>

            {/* Statut ouverture */}
            {/* Statut ouverture avec icône SVG */}
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
    </>
  )
}