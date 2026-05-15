import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { v2 as cloudinary } from 'cloudinary'

const prisma = new PrismaClient()

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// GET - Récupérer toutes les images
export async function GET() {
  try {
    const gallery = await prisma.gallery.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(gallery)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Ajouter une image sur Cloudinary
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const file = formData.get('image') as File

    if (!title || !category || !file) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
    }

    // Upload vers Cloudinary
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'aurea-gallery',
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    // Sauvegarde en base
    const gallery = await prisma.gallery.create({
      data: {
        title,
        description: description || '',
        image: uploadResult.secure_url,
        category,
        order: await getNextOrder()
      }
    })

    return NextResponse.json({ success: true, gallery })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT - Modifier une image
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, description, category, order } = body

    const gallery = await prisma.gallery.update({
      where: { id },
      data: { title, description, category, order }
    })

    return NextResponse.json({ success: true, gallery })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE - Supprimer une image (de Cloudinary aussi)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = parseInt(searchParams.get('id') || '0')

    const gallery = await prisma.gallery.findUnique({ where: { id } })
    if (gallery) {
      // Extraire le public_id de l'URL Cloudinary
      const publicId = gallery.image.split('/').slice(-2).join('/').split('.')[0]
      
      // Supprimer de Cloudinary
      await cloudinary.uploader.destroy(publicId)
      
      // Supprimer de la base
      await prisma.gallery.delete({ where: { id } })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

async function getNextOrder() {
  const last = await prisma.gallery.findFirst({
    orderBy: { order: 'desc' }
  })
  return last ? last.order + 1 : 1
}