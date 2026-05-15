'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

interface Post {
  id: string
  title: string
  content: string
  image: string
  author: string
  publishedAt: string
}

export default function BlogPost() {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const { slug } = useParams()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${slug}`)
        if (res.ok) {
          const data = await res.json()
          setPost(data)
        } else {
          setPost(null)
        }
      } catch (error) {
        console.error('Erreur:', error)
        setPost(null)
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [slug])

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #D4AF37', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
        <Footer />
        <WhatsAppButton />
      </>
    )
  }

  if (!post) {
    return (
      <>
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl text-dark mb-4">Article non trouvé</h1>
            <p className="text-gray mb-8">L'article que vous recherchez n'existe pas.</p>
            <Link href="/blog" className="inline-flex items-center gap-2 text-gold hover:gap-3 transition-all">
              ← Retour au blog
            </Link>
          </div>
        </div>
        <Footer />
        <WhatsAppButton />
      </>
    )
  }

  return (
    <>
      <Header />
      <main>
        
        {/* Hero article - VERSION CORRIGÉE (image plus petite) */}
        <div className="relative pt-20 pb-12 md:pt-24 md:pb-16 bg-gradient-to-br from-dark to-dark/90">
          
          {/* Image en arrière-plan avec overlay léger */}
          {post.image && (
            <div className="absolute inset-0 z-0 opacity-20">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
            
            {/* Badge */}
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-gold/20 rounded-full text-gold text-sm">
                ✨ Article
              </span>
            </div>
            
            {/* Titre */}
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-6">
              {post.title}
            </h1>
            
            {/* Métadonnées */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Par {post.author}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>
                  {new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
            
          </div>
        </div>

        {/* Contenu de l'article */}
        <section className="py-12 lg:py-16 bg-white">
          <div className="container mx-auto px-6 max-w-3xl">
            
            {/* Image de couverture intégrée dans le contenu (optionnel) */}
            {post.image && (
              <div className="mb-8 -mt-6">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full max-h-[400px] object-cover rounded-xl shadow-md"
                />
              </div>
            )}
            
            {/* Contenu riche */}
            <div 
              className="prose prose-lg prose-gold max-w-none
                prose-headings:font-serif prose-headings:text-dark 
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-xl prose-h3:text-gold
                prose-p:text-gray-600 prose-p:leading-relaxed
                prose-strong:text-gold-dark
                prose-a:text-gold prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:shadow-md
                prose-ul:text-gray-600 prose-li:my-1"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            {/* Séparateur décoratif */}
            <div className="my-12 text-center">
              <div className="inline-flex items-center gap-3">
                <span className="w-8 h-px bg-gold/30"></span>
                <span className="text-gold">✦</span>
                <span className="w-8 h-px bg-gold/30"></span>
              </div>
            </div>
            
            {/* Navigation retour */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-100">
              <Link href="/blog" className="flex items-center gap-2 text-gray-500 hover:text-gold transition-colors group">
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour au blog
              </Link>
              
              <Link href="/booking" className="flex items-center gap-2 text-gold hover:gap-3 transition-all">
                Prendre rendez-vous
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
            
          </div>
        </section>

        {/* Section partage */}
        <section className="py-8 bg-off-white border-y border-gray-100">
          <div className="container mx-auto px-6 text-center">
            <p className="text-gray-500 text-sm mb-3">Partager cet article</p>
            <div className="flex justify-center gap-4">
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://aurealab.vip/blog/${slug}`)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://aurealab.vip/blog/${slug}`)}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <svg className="w-5 h-5 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                </svg>
              </a>
              <a href={`https://wa.me/?text=${encodeURIComponent(`${post.title} - https://aurealab.vip/blog/${slug}`)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}