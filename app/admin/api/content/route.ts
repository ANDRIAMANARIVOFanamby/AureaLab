import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')
    
    if (!page) {
      return NextResponse.json({ error: 'Page requise' }, { status: 400 })
    }
    
    const contents = await prisma.content.findMany({
      where: { page }
    })
    
    const data: Record<string, string> = {}
    contents.forEach(c => {
      data[`${c.section}_${c.key}`] = c.value
    })
    
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { page, section, key, value } = body
    
    await prisma.content.upsert({
      where: { page_section_key: { page, section, key } },
      update: { value },
      create: { page, section, key, value }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}