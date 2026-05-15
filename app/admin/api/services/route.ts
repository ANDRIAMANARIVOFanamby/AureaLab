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

// GET - Récupérer tous les services avec leurs catégories
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' },
      include: {
        category: true
      }
    })
    return NextResponse.json(services)
  } catch (error) {
    console.error('Erreur GET:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Ajouter un service
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = formData.get('price') as string
    const categoryId = formData.get('categoryId') as string
    const file = formData.get('image') as File

    // Validation
    if (!name || !price || !categoryId || !file) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
    }

    // Upload vers Cloudinary
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'aurea-services' },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    // Récupérer le dernier ordre
    const lastService = await prisma.service.findFirst({
      orderBy: { order: 'desc' }
    })
    const nextOrder = lastService ? lastService.order + 1 : 1

    // Créer le service
    const service = await prisma.service.create({
      data: {
        name,
        description: description || '',
        price,
        categoryId,
        image: uploadResult.secure_url,
        order: nextOrder,
        isActive: true
      },
      include: {
        category: true
      }
    })

    return NextResponse.json({ success: true, service })
  } catch (error) {
    console.error('Erreur POST:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT - Modifier un service
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, description, price, categoryId, order, isActive } = body

    if (!id || !name || !price || !categoryId) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
    }

    const service = await prisma.service.update({
      where: { id },
      data: {
        name,
        description: description || '',
        price,
        categoryId,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      },
      include: {
        category: true
      }
    })

    return NextResponse.json({ success: true, service })
  } catch (error) {
    console.error('Erreur PUT:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE - Supprimer un service
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 })
    }

    // Récupérer le service pour avoir l'URL de l'image Cloudinary
    const service = await prisma.service.findUnique({
      where: { id }
    })

    if (service) {
      // Supprimer l'image de Cloudinary
      const publicId = service.image.split('/').slice(-2).join('/').split('.')[0]
      try {
        await cloudinary.uploader.destroy(publicId)
      } catch (cloudinaryError) {
        console.error('Erreur suppression Cloudinary:', cloudinaryError)
      }
      
      // Supprimer de la base
      await prisma.service.delete({ where: { id } })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur DELETE:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}