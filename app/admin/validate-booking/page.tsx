'use client'

export default function ValidateBookingPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#FDFBF7' 
    }}>
      <div style={{ 
        textAlign: 'center', 
        padding: '2rem',
        background: 'white',
        borderRadius: '1rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#D4AF37' }}>📅 Page de validation</h1>
        <p style={{ color: '#666', marginTop: '1rem' }}>
          Cette page est en cours de construction.
        </p>
        <p style={{ color: '#999', marginTop: '0.5rem', fontSize: '0.8rem' }}>
          Module validé - Page accessible
        </p>
      </div>
    </div>
  )
}