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
    const { nom, email, telephone, sujet, message } = body

    // Validation
    if (!nom || !email || !sujet || !message) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      )
    }

    // 1. Sauvegarde dans PostgreSQL
    const contact = await prisma.contact.create({
      data: {
        nom,
        email,
        telephone: telephone || '',
        sujet,
        message,
      },
    })

    // 2. Envoi d'email de notification
    const sujetLabels: Record<string, string> = {
      'information': 'Demande d\'information',
      'rdv': 'Prise de rendez-vous',
      'liste-attente': 'Inscription liste d\'attente',
      'autre': 'Autre',
    }

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
            <h2>📧 NOUVEAU MESSAGE</h2>
            <p>Formulaire de contact AUREA Lab</p>
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
            ${telephone ? `
            <div class="field">
              <span class="label">📱 Téléphone :</span>
              <span>${telephone}</span>
            </div>
            ` : ''}
            <div class="field">
              <span class="label">📋 Sujet :</span>
              <span>${sujetLabels[sujet] || sujet}</span>
            </div>
            <div class="field">
              <span class="label">💬 Message :</span>
              <span>${message}</span>
            </div>
            <div style="margin-top: 20px; text-align: center;">
              <span class="badge">ID: ${contact.id}</span>
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

    // Envoi de l'email
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      await transporter.sendMail({
        from: `"AUREA Lab" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: `📧 Nouveau message de ${nom} - ${sujetLabels[sujet] || sujet}`,
        html: emailHtml,
      })
      console.log('✅ Email envoyé')
    }

    // 3. Email de confirmation au client (optionnel)
    const confirmationHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Space Grotesk', Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #D4AF37, #C59B27); padding: 20px; text-align: center; }
          .header h2 { color: #1A1A1A; margin: 0; }
          .content { padding: 20px; background: #FDFBF7; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>✨ Merci pour votre message ✨</h2>
          </div>
          <div class="content">
            <p>Bonjour ${nom},</p>
            <p>Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.</p>
            <p>Rappel de votre message :</p>
            <p style="background: #f5f5f5; padding: 15px; border-radius: 8px;">${message}</p>
            <p>Cordialement,<br><strong>AUREA Lab</strong></p>
          </div>
          <div class="footer">
            <p>AUREA Lab - Le luxe dans chaque regard</p>
          </div>
        </div>
      </body>
      </html>
    `

    await transporter.sendMail({
      from: `"AUREA Lab" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `✨ AUREA Lab - Confirmation de votre message`,
      html: confirmationHtml,
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Message envoyé avec succès',
      contactId: contact.id 
    })

  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}