'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/about', label: 'À propos' },
    { href: '/services', label: 'Prestations' },
    { href: '/gallery', label: 'Galerie' },
    { href: '/booking', label: 'Réservation' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50">
      <nav className="container">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/logo.png" 
              alt="AUREA Lab Logo" 
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: 'auto', height: '50px' }}
              className="object-contain"
              priority
            />
          </Link>

          {/* Navigation Desktop - sans trait, couleur dorée au hover */}
          <div className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-dark/50 hover:text-gold transition-all duration-300 font-medium text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            className="md:hidden text-2xl text-dark"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4 px-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-dark/50 hover:text-gold transition-all duration-300 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}