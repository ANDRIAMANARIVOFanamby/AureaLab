'use client'

import { MessageCircle } from 'lucide-react'

export default function WhatsAppButton() {
  const phoneNumber = '261375158491'
  const message = 'Bonjour AUREA Lab, je souhaiterais plus d\'informations sur vos prestations.'

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110 z-50"
      aria-label="Contactez-nous sur WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  )
}