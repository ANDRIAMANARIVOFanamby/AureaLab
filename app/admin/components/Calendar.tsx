'use client'

import { useState, useEffect } from 'react'

interface CalendarProps {
  onSelectSlot: (date: Date, time: string) => void
  selectedDate: string
  selectedTime: string
  prestationDuree: number
}

interface RendezVous {
  id: number
  bookingId: number
  nom: string
  date: string
  duree: number
  status: string
}

export default function Calendar({ onSelectSlot, selectedDate, selectedTime, prestationDuree }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [rendezVous, setRendezVous] = useState<RendezVous[]>([])
  const [loading, setLoading] = useState(true)

  // Générer les créneaux horaires avec espacement de 3h (2h30 prestation + 30min pause)
  const generateTimeSlots = () => {
    const slots = []
    const startHour = 9  // 9h
    const endHour = 18   // 18h (dernier créneau à 15h pour finir à 18h)
    const slotDuration = 3  // 3h d'espacement
    
    for (let hour = startHour; hour <= endHour - slotDuration; hour += slotDuration) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`
      slots.push(startTime)
    }
    
    return slots
  }

  const timeSlots = generateTimeSlots()

  useEffect(() => {
    const fetchRendezVous = async () => {
      try {
        const res = await fetch('/admin/api/rendez-vous')
        const data = await res.json()
        setRendezVous(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Erreur:', error)
        setRendezVous([])
      } finally {
        setLoading(false)
      }
    }
    fetchRendezVous()
  }, [])

  const isPastDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    return compareDate < today
  }

  // Vérifier si un créneau est disponible (avec gestion des 3h d'espacement)
  const isSlotAvailable = (date: Date, time: string) => {
    if (isPastDate(date)) return false

    const slotStart = new Date(date)
    const [hours, minutes] = time.split(':')
    slotStart.setHours(parseInt(hours), parseInt(minutes), 0, 0)
    
    // Durée totale du créneau (3h)
    const slotDuration = 3 * 60 // 180 minutes
    const slotEnd = new Date(slotStart.getTime() + slotDuration * 60000)

    for (const rdv of rendezVous) {
      const rdvStart = new Date(rdv.date)
      const rdvEnd = new Date(rdvStart.getTime() + rdv.duree * 60000)
      
      // Vérifier si les créneaux se chevauchent
      if ((slotStart < rdvEnd && slotEnd > rdvStart)) {
        return false
      }
    }
    return true
  }

  const getRendezVousForDay = (date: Date) => {
    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    return rendezVous.filter(rdv => {
      const rdvDate = new Date(rdv.date)
      const compareDate = new Date(rdvDate.getFullYear(), rdvDate.getMonth(), rdvDate.getDate())
      return compareDate.getTime() === targetDate.getTime()
    })
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days = []
    
    let firstDayOfWeek = firstDay.getDay()
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1
    
    for (let i = firstDayOfWeek; i > 0; i--) {
      days.push(new Date(year, month, -i + 1))
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }
    
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i))
    }
    
    return days
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
  }

  const isSelected = (date: Date) => {
    if (!selectedDate) return false
    const selected = new Date(selectedDate)
    return date.getDate() === selected.getDate() &&
      date.getMonth() === selected.getMonth() &&
      date.getFullYear() === selected.getFullYear()
  }

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
  const days = getDaysInMonth()

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Chargement du calendrier...</div>
  }

  return (
    <div style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button onClick={prevMonth} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#D4AF37' }}>
          ←
        </button>
        <h3 style={{ margin: 0, fontFamily: "'Playfair Display', serif" }}>
          {currentMonth.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
        </h3>
        <button onClick={nextMonth} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#D4AF37' }}>
          →
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '0.5rem' }}>
        {weekDays.map(day => (
          <div key={day} style={{ fontWeight: 'bold', padding: '0.5rem', color: '#D4AF37' }}>
            {day}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem' }}>
        {days.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
          const isPast = isPastDate(date)
          const hasRdv = getRendezVousForDay(date).length > 0
          
          return (
            <div
              key={index}
              onClick={() => {
                if (isCurrentMonth && !isPast) {
                  const correctedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
                  onSelectSlot(correctedDate, timeSlots[0] || '09:00')
                }
              }}
              style={{
                padding: '0.75rem',
                textAlign: 'center',
                borderRadius: '0.5rem',
                cursor: isCurrentMonth && !isPast ? 'pointer' : 'default',
                background: isSelected(date) ? '#D4AF37' : isToday(date) ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                color: !isCurrentMonth ? '#ccc' : isPast ? '#ddd' : isSelected(date) ? '#1A1A1A' : '#333',
                fontWeight: isSelected(date) ? 'bold' : 'normal',
                position: 'relative',
                transition: 'all 0.2s ease',
                opacity: isPast ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (isCurrentMonth && !isPast && !isSelected(date)) {
                  e.currentTarget.style.background = '#f0f0f0'
                }
              }}
              onMouseLeave={(e) => {
                if (isCurrentMonth && !isPast && !isSelected(date)) {
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              {date.getDate()}
              {hasRdv && (
                <span style={{
                  position: 'absolute',
                  bottom: '2px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '6px',
                  height: '6px',
                  background: '#D4AF37',
                  borderRadius: '50%'
                }}></span>
              )}
            </div>
          )
        })}
      </div>

      {/* Créneaux disponibles - espacés de 3h */}
      {selectedDate && !isPastDate(new Date(selectedDate)) && (
        <div style={{ marginTop: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#D4AF37' }}>
            Créneaux disponibles (2h30 prestation + 30min pause)
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {timeSlots.map(time => {
              const selectedDateObj = new Date(selectedDate)
              const isAvailable = isSlotAvailable(selectedDateObj, time)
              const [hour] = time.split(':')
              const endHour = parseInt(hour) + 3
              return (
                <button
                  key={time}
                  onClick={() => isAvailable && onSelectSlot(selectedDateObj, time)}
                  disabled={!isAvailable}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid',
                    borderColor: isAvailable ? (selectedTime === time ? '#D4AF37' : '#ddd') : '#ffebee',
                    background: selectedTime === time ? '#D4AF37' : 'white',
                    color: selectedTime === time ? '#1A1A1A' : (isAvailable ? '#333' : '#ccc'),
                    cursor: isAvailable ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease',
                    fontWeight: selectedTime === time ? 'bold' : 'normal'
                  }}
                >
                  {time} → {endHour}:00
                </button>
              )
            })}
          </div>
          <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '1rem' }}>
            ⚠️ Durée de la prestation : 2h30<br />
            ⏰ Pause de 30min entre chaque rendez-vous
          </p>
        </div>
      )}

      {selectedDate && isPastDate(new Date(selectedDate)) && (
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#ffebee', borderRadius: '0.5rem', textAlign: 'center' }}>
          ⚠️ Impossible de sélectionner une date passée
        </div>
      )}
    </div>
  )
}