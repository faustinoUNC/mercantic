import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const BUCKET = 'product-images'
const MAX_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

// POST: Upload a new image (appends to image_urls array)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No se recibió ningún archivo' }, { status: 400 })

  if (!ALLOWED_TYPES.includes(file.type))
    return NextResponse.json({ error: 'Formato no permitido. Usá JPG, PNG o WEBP.' }, { status: 400 })

  if (file.size > MAX_SIZE)
    return NextResponse.json({ error: 'El archivo supera los 5 MB.' }, { status: 400 })

  const supabase = adminClient()

  // Unique filename per upload
  const ext = file.type.split('/')[1].replace('jpeg', 'jpg')
  const filename = `${Date.now()}.${ext}`
  const path = `${id}/${filename}`

  const bytes = await file.arrayBuffer()
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: file.type, upsert: false })

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path)
  const image_url = `${urlData.publicUrl}?t=${Date.now()}`

  // Fetch current image_urls array and append
  const { data: product, error: fetchErr } = await supabase
    .from('products')
    .select('image_url, image_urls')
    .eq('id', id)
    .single()

  let existing: string[] = []
  if (fetchErr || !product) {
    // Column may not exist yet — try fetching only image_url to preserve it
    const { data: legacy } = await supabase.from('products').select('image_url').eq('id', id).single()
    if (legacy?.image_url) existing = [legacy.image_url]
  } else {
    existing = (product.image_urls as string[] | null) ?? []
    if (product.image_url && !existing.includes(product.image_url)) {
      existing.unshift(product.image_url)
    }
  }
  const image_urls = [...existing, image_url]

  const { error: dbError } = await supabase
    .from('products')
    .update({ image_url: image_urls[0], image_urls })
    .eq('id', id)

  if (dbError) {
    // image_urls column not migrated yet — update only image_url preserving nothing extra
    await supabase.from('products').update({ image_url: image_urls[0] }).eq('id', id)
    return NextResponse.json({ image_url: image_urls[0], image_urls })
  }

  return NextResponse.json({ image_url, image_urls })
}

// DELETE: Remove one or all images
// Body: { index?: number } — omit to remove all
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = adminClient()
  let removeIndex: number | undefined

  try {
    const body = await req.json()
    removeIndex = typeof body.index === 'number' ? body.index : undefined
  } catch { /* no body — remove all */ }

  const { data: product } = await supabase
    .from('products')
    .select('image_url, image_urls')
    .eq('id', id)
    .single()

  const existing: string[] = (product?.image_urls as string[] | null) ?? []

  if (removeIndex !== undefined && removeIndex >= 0 && removeIndex < existing.length) {
    // Remove single image
    const urlToRemove = existing[removeIndex]
    // Extract storage path from URL
    const storagePath = urlToRemove.split('/storage/v1/object/public/' + BUCKET + '/')[1]?.split('?')[0]
    if (storagePath) {
      await supabase.storage.from(BUCKET).remove([storagePath])
    }
    const image_urls = existing.filter((_, i) => i !== removeIndex)
    const image_url = image_urls[0] ?? null
    await supabase.from('products').update({ image_url, image_urls }).eq('id', id)
    return NextResponse.json({ image_url, image_urls })
  }

  // Remove all
  const { data: files } = await supabase.storage.from(BUCKET).list(id)
  if (files && files.length > 0) {
    await supabase.storage.from(BUCKET).remove(files.map(f => `${id}/${f.name}`))
  }
  await supabase.from('products').update({ image_url: null, image_urls: [] }).eq('id', id)
  return NextResponse.json({ image_url: null, image_urls: [] })
}
