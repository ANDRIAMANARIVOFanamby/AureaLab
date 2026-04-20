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

// Mapping des prestations
const prestationLabels: Record<string, string> = {
  'cil-a-cil': 'Cil à cil - 60 000 Ar',
  'hybride': 'Hybride - 70 000 Ar',
  'volume-bresilien': 'Volume Brésilien - 80 000 Ar',
  'megavolume': 'Mégavolume - 100 000 Ar',
  'non-sure': 'Je ne sais pas encore',
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nom, email, telephone, prestation, disponibilite, message } = body

    // Validation
    if (!nom || !email || !telephone || !prestation) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      )
    }

    // 1. Sauvegarder dans PostgreSQL
    const booking = await prisma.booking.create({
      data: {
        nom,
        email,
        telephone,
        prestation,
        disponibilite: disponibilite || '',
        message: message || '',
      },
    })

    // 2. Envoyer un email de notification
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Space Grotesk', Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #D4AF37, #C59B27); padding: 20px; text-align: center; color: #1A1A1A; }
          .content { padding: 20px; background: #FDFBF7; }
          .field { margin-bottom: 15px; padding: 10px; border-bottom: 1px solid #eee; }
          .label { font-weight: bold; color: #D4AF37; width: 120px; display: inline-block; }
          .value { color: #333; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; }
          .badge { background: #D4AF37; color: #1A1A1A; padding: 4px 12px; border-radius: 20px; font-size: 12px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>✨ NOUVELLE INSCRIPTION ✨</h2>
            <p>Liste d'attente AUREA Lab</p>
          </div>
          <div class="content">
            <div class="field">
              <span class="label">👤 Nom :</span>
              <span class="value">${nom}</span>
            </div>
            <div class="field">
              <span class="label">📧 Email :</span>
              <span class="value">${email}</span>
            </div>
            <div class="field">
              <span class="label">📱 Téléphone :</span>
              <span class="value">${telephone}</span>
            </div>
            <div class="field">
              <span class="label">💎 Prestation :</span>
              <span class="value">${prestationLabels[prestation] || prestation}</span>
            </div>
            ${disponibilite ? `
            <div class="field">
              <span class="label">📅 Disponibilité :</span>
              <span class="value">${disponibilite}</span>
            </div>
            ` : ''}
            ${message ? `
            <div class="field">
              <span class="label">💬 Message :</span>
              <span class="value">${message}</span>
            </div>
            ` : ''}
            <div style="margin-top: 20px; text-align: center;">
              <span class="badge">ID: ${booking.id}</span>
            </div>
          </div>
          <div class="footer">
            <p>AUREA Lab - Le luxe dans chaque regard</p>
            <p style="font-size: 11px;">📅 ${new Date(booking.createdAt).toLocaleString('fr-FR')}</p>
          </div>
        </div>
      </body>
      </html>
    `

    await transporter.sendMail({
      from: `"AUREA Lab" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `✨ Nouvelle inscription - ${nom}`,
      html: emailHtml,
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Inscription enregistrée avec succès',
      bookingId: booking.id 
    })

  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'inscription' },
      { status: 500 }
    )
  }
}