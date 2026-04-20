import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()
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
    const { to, subject, message, originalMessage, contactId } = body

    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    // 1. Envoyer l'email
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
          .reply-box { background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 3px solid #D4AF37; }
          .original-message { background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0; color: #666; font-style: italic; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>✨ AUREA Lab ✨</h2>
            <p>Réponse à votre message</p>
          </div>
          <div class="content">
            <p>Bonjour,</p>
            <div class="reply-box">
              ${message.replace(/\n/g, '<br>')}
            </div>
            <p>Cordialement,<br><strong>L'équipe AUREA Lab</strong></p>
            
            <div class="original-message">
              <strong>📝 Votre message original :</strong><br>
              ${originalMessage.replace(/\n/g, '<br>')}
            </div>
          </div>
          <div class="footer">
            <p>AUREA Lab - Le luxe dans chaque regard</p>
            <p>📍 Antananarivo, Madagascar | 📞 +261 37 51 584 91</p>
          </div>
        </div>
      </body>
      </html>
    `

    await transporter.sendMail({
      from: `"AUREA Lab" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: `📧 ${subject}`,
      html: emailHtml,
    })

    // 2. Marquer le message comme répondu dans la base de données
    if (contactId) {
      await prisma.contact.update({
        where: { id: contactId },
        data: { 
          replied: true,
          repliedAt: new Date(),
          status: 'repondu'
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Email envoyé avec succès' 
    })

  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    )
  }
}