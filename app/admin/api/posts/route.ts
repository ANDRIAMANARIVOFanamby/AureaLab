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

// GET - Récupérer tous les articles (inchangé)
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Créer un article (avec upload Cloudinary)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const excerpt = formData.get('excerpt') as string
    const content = formData.get('content') as string
    const author = formData.get('author') as string
    const published = formData.get('published') === 'true'
    const file = formData.get('image') as File | null

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Titre, slug et contenu requis' }, { status: 400 })
    }

    let imageUrl = ''

    // Upload vers Cloudinary si une image a été fournie
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'aurea-blog' },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        ).end(buffer)
      })
      
      imageUrl = uploadResult.secure_url
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt: excerpt || '',
        content,
        image: imageUrl,
        author: author || 'AUREA Lab',
        published: published || false,
        publishedAt: published ? new Date() : null
      }
    })
    
    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT - Modifier un article (inchangé pour les métadonnées)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, slug, excerpt, content, image, author, published } = body
    
    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt: excerpt || '',
        content,
        image: image || '',
        author: author || 'AUREA Lab',
        published,
        publishedAt: published ? new Date() : null
      }
    })
    
    return NextResponse.json({ success: true, post })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE - Supprimer un article
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (id) {
      // Optionnel : supprimer aussi l'image de Cloudinary
      const post = await prisma.post.findUnique({ where: { id } })
      if (post?.image) {
        const publicId = post.image.split('/').slice(-2).join('/').split('.')[0]
        try {
          await cloudinary.uploader.destroy(publicId)
        } catch (e) {
          console.error('Erreur suppression Cloudinary:', e)
        }
      }
      await prisma.post.delete({ where: { id } })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}