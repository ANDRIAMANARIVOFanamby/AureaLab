'use client'

export default function ScrollArrow() {
  const handleScroll = (): void => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.currentTarget.style.borderColor = '#D4AF37'
    const svg = e.currentTarget.querySelector('svg')
    if (svg) svg.style.color = '#D4AF37'
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
    const svg = e.currentTarget.querySelector('svg')
    if (svg) svg.style.color = 'rgba(255,255,255,0.7)'
  }

  return (
    <div 
      onClick={handleScroll}
      style={{ 
        width: '3rem', 
        height: '3rem', 
        border: '1.5px solid rgba(255,255,255,0.3)', 
        borderRadius: '50%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        animation: 'bounce-arrow 2s infinite'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        style={{ width: '1.2rem', height: '1.2rem', color: 'rgba(255,255,255,0.7)', transition: 'all 0.3s ease' }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  )
}