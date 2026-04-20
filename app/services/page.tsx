import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function Services() {
  const prestations = [
    {
      id: 1,
      title: 'Cil à cil',
      price: '60 000 Ar',
      description: 'Un effet naturel et élégant, idéal pour un regard subtil et raffiné. Pose cil par cil pour un rendu léger et harmonieux.',
      features: ['Naturel', 'Léger', 'Raffiné'],
      image: '/prestations/cil-a-cil.jpg'
    },
    {
      id: 2,
      title: 'Hybride',
      price: '70 000 Ar',
      description: 'Un équilibre parfait entre naturel et volume. Association de cil à cil et de légers bouquets de volume.',
      features: ['Équilibre', 'Volume léger', 'Naturel boosté'],
      image: '/prestations/hybride.jpg'
    },
    {
      id: 3,
      title: 'Volume Brésilien',
      price: '80 000 Ar',
      description: 'Une technique douce pour un volume structuré et élégant. Idéal pour intensifier le regard avec finesse.',
      features: ['Volume structuré', 'Élégant', 'Intensité'],
      image: '/prestations/volume-bresilien.jpg'
    },
    {
      id: 4,
      title: 'Mégavolume',
      price: '100 000 Ar',
      description: 'Un regard intense, glamour et sophistiqué. Volume dense pour un effet plus marqué.',
      features: ['Intense', 'Glamour', 'Sophistiqué'],
      image: '/prestations/megavolume.jpg'
    }
  ]

  return (
    <>
      <Header />
      <main>
        
        {/* Section Prestations */}
        <section className="prestations-page">
          <div className="prestations-page-container">
            
            {/* Hero */}
            <div className="prestations-page-hero">
              <h1>Nos prestations</h1>
              <div className="prestations-page-divider"></div>
              <p>
                Des techniques sur-mesure pour sublimer votre regard avec élégance et précision.
                Chaque prestation est personnalisée selon vos attentes.
              </p>
            </div>

            {/* Liste des prestations */}
            <div className="prestations-list">
              {prestations.map((prestation) => (
                <div key={prestation.id} className="prestation-item">
                  
                  {/* Image */}
                  <div className="prestation-item-image">
                    <img 
                      src={prestation.image} 
                      alt={prestation.title}
                      className="prestation-item-img"
                    />
                  </div>

                  {/* Contenu */}
                  <div className="prestation-item-content">
                    <div className="prestation-item-header">
                      <h2 className="prestation-item-title">{prestation.title}</h2>
                      <p className="prestation-item-price">{prestation.price}</p>
                    </div>
                    <p className="prestation-item-desc">{prestation.description}</p>
                    <ul className="prestation-item-features">
                      {prestation.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Note de personnalisation */}
            <div className="prestations-note">
              <p>
                <strong>Chaque prestation est personnalisée</strong> selon votre regard et vos attentes.
                Une consultation préalable permet de déterminer la technique idéale pour vous.
              </p>
            </div>

            {/* Bouton CTA */}
            <div className="prestations-cta">
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
                <span></span>
                <span>Réserver ma prestation</span>
              </Link>
            </div>

          </div>
        </section>

      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}