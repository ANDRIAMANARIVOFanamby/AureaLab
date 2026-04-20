import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()

// Configuration email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

// Durée des prestations (en minutes)
const prestationDuree: Record<string, number> = {
  'cil-a-cil': 60,
  'hybride': 75,
  'volume-bresilien': 90,
  'megavolume': 120,
  'non-sure': 60,
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookingId, date, duree } = body

    // Récupérer l'inscription
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    })

    if (!booking) {
      return NextResponse.json({ error: 'Inscription non trouvée' }, { status: 404 })
    }

    // Créer le rendez-vous
    const rendezVous = await prisma.rendezVous.create({
      data: {
        bookingId: booking.id,
        nom: booking.nom,
        email: booking.email,
        telephone: booking.telephone,
        prestation: booking.prestation,
        date: new Date(date),
        duree: duree || prestationDuree[booking.prestation] || 60,
        status: 'confirme',
      },
    })

    // Mettre à jour le statut de l'inscription
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'valide' }
    })

    // Formater la date
    const dateFormatee = new Date(date).toLocaleString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    // Envoyer l'email de confirmation
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Space Grotesk', Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #D4AF37, #C59B27); padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h2 { color: #1A1A1A; margin: 0; }
          .content { padding: 20px; background: #FDFBF7; border: 1px solid #eee; }
          .field { margin-bottom: 15px; padding: 10px; border-bottom: 1px solid #eee; }
          .label { font-weight: bold; color: #D4AF37; display: inline-block; width: 120px; }
          .calendar-link { 
            display: inline-block; 
            background: #D4AF37; 
            color: #1A1A1A; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 8px; 
            margin-top: 20px;
            font-weight: bold;
          }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>✨ Rendez-vous confirmé ✨</h2>
            <p>AUREA Lab</p>
          </div>
          <div class="content">
            <p>Bonjour ${booking.nom},</p>
            <p>Votre rendez-vous a été confirmé pour la prestation suivante :</p>
            
            <div class="field">
              <span class="label">📅 Date :</span>
              <span>${dateFormatee}</span>
            </div>
            <div class="field">
              <span class="label">⏱️ Durée :</span>
              <span>${rendezVous.duree} minutes</span>
            </div>
            <div class="field">
              <span class="label">💎 Prestation :</span>
              <span>${booking.prestation}</span>
            </div>
            
            <p style="margin-top: 20px;">Pour ajouter ce rendez-vous à votre calendrier :</p>
            <a href="${generateCalendarLink(date, booking.nom, booking.prestation, rendezVous.duree)}" class="calendar-link">
              📅 Ajouter au calendrier
            </a>
            
            <p style="margin-top: 20px;">Pour toute modification, contactez-nous au <strong>+261 37 51 584 91</strong></p>
          </div>
          <div class="footer">
            <p>AUREA Lab - Le luxe dans chaque regard</p>
            <p>${new Date().toLocaleString('fr-FR')}</p>
          </div>
        </div>
      </body>
      </html>
    `

    await transporter.sendMail({
      from: `"AUREA Lab" <${process.env.EMAIL_USER}>`,
      to: booking.email,
      subject: `✨ Votre rendez-vous AUREA Lab est confirmé - ${dateFormatee}`,
      html: emailHtml,
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Rendez-vous créé et email envoyé',
      rendezVous 
    })

  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// Générer un lien de calendrier (Google Calendar)
function generateCalendarLink(date: string, nom: string, prestation: string, duree: number) {
  const startDate = new Date(date)
  const endDate = new Date(startDate.getTime() + duree * 60000)
  
  const start = startDate.toISOString().replace(/-|:|\./g, '')
  const end = endDate.toISOString().replace(/-|:|\./g, '')
  
  const title = encodeURIComponent(`AUREA Lab - ${prestation}`)
  const description = encodeURIComponent(`Prestation: ${prestation}\nTéléphone: +261 37 51 584 91`)
  const location = encodeURIComponent('Antananarivo, Madagascar')
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${description}&location=${location}`
}