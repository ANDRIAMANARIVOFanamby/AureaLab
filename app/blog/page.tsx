'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  image: string
  publishedAt: string
}

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts')
        const data = await res.json()
        setPosts(data)
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const scrollToContent = () => {
    const section = document.querySelector('.blog-section')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
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
        
        {/* Hero - plein écran */}
        <div className="blog-hero">
          <div className="blog-hero-content">
            <h1 className="blog-hero-title">Le blog AUREA Lab</h1>
            <div className="blog-hero-divider"></div>
            <p className="blog-hero-subtitle">
              Conseils beauté, tendances et actualités autour du regard
            </p>
          </div>
          
          {/* Flèche de scroll */}
          <div className="blog-hero-scroll" onClick={scrollToContent}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        {/* Section grille */}
        <section className="blog-section">
          <div className="container mx-auto px-6 max-w-6xl">
            
            <div className="blog-grid">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="blog-card">
                  
                  {/* Image */}
                  <div className="blog-card-image">
                    {post.image ? (
                      <img src={post.image} alt={post.title} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gold/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Contenu */}
                  <div className="blog-card-content">
                    
                    {/* Date */}
                    <div className="blog-card-date">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>
                        {new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    {/* Titre */}
                    <h2 className="blog-card-title">{post.title}</h2>
                    
                    {/* Extrait */}
                    <p className="blog-card-excerpt">{post.excerpt || post.title}</p>
                    
                    {/* Lien */}
                    <div className="blog-card-link">
                      <span>
                        Lire
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                      <span className="text-gold/40 text-xs">✦</span>
                    </div>
                    
                  </div>
                </Link>
              ))}
            </div>

            {/* Message si aucun article */}
            {posts.length === 0 && (
              <div className="text-center py-10 bg-white rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="font-serif text-base text-dark mb-1">Aucun article</h3>
                <p className="text-gray text-xs">Revenez bientôt !</p>
              </div>
            )}
          </div>
        </section>

      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}