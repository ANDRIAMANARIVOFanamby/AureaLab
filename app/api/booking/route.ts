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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nom, email, telephone, prestation, disponibilite, message } = body

    // Validation
    if (!nom || !email || !telephone || !prestation) {
      return NextResponse.json(
        { error: 'Champs manquants' },
        { status: 400 }
      )
    }

    // 1. Sauvegarde dans PostgreSQL
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

    // 2. Mapping des prestations
    const prestationLabels: Record<string, string> = {
      'cil-a-cil': 'Cil à cil - 60 000 Ar',
      'hybride': 'Hybride - 70 000 Ar',
      'volume-bresilien': 'Volume Brésilien - 80 000 Ar',
      'megavolume': 'Mégavolume - 100 000 Ar',
      'non-sure': 'Je ne sais pas encore',
    }

    // 3. Envoi d'email
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
              <span>${nom}</span>
            </div>
            <div class="field">
              <span class="label">📧 Email :</span>
              <span>${email}</span>
            </div>
            <div class="field">
              <span class="label">📱 Téléphone :</span>
              <span>${telephone}</span>
            </div>
            <div class="field">
              <span class="label">💎 Prestation :</span>
              <span>${prestationLabels[prestation] || prestation}</span>
            </div>
            ${disponibilite ? `
            <div class="field">
              <span class="label">📅 Disponibilité :</span>
              <span>${disponibilite}</span>
            </div>
            ` : ''}
            ${message ? `
            <div class="field">
              <span class="label">💬 Message :</span>
              <span>${message}</span>
            </div>
            ` : ''}
            <div style="margin-top: 20px; text-align: center;">
              <span class="badge">ID: ${booking.id}</span>
            </div>
          </div>
          <div class="footer">
            <p>AUREA Lab - Le luxe dans chaque regard</p>
            <p style="font-size: 11px;">📅 ${new Date().toLocaleString('fr-FR')}</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Envoi de l'email à l'administrateur
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      await transporter.sendMail({
        from: `"AUREA Lab" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `✨ Nouvelle inscription liste d'attente - ${nom}`,
        html: emailHtml,
      })
      console.log('✅ Email envoyé avec succès')
    } else {
      console.log('⚠️ Email non configuré - aucune notification envoyée')
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Inscription enregistrée avec succès',
      bookingId: booking.id 
    })

  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}