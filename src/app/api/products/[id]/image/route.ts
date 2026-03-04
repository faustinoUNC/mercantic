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

/**
 * Persists image_urls (and image_url for legacy schemas) to the DB.
 * Tries combined update first; if it fails (e.g. image_url column missing)
 * falls back to updating each column independently so at least one succeeds.
 */
async function persistUrls(
  supabase: ReturnType<typeof adminClient>,
  id: string,
  image_urls: string[],
) {
  const image_url = image_urls[0] ?? null

  // Attempt 1: update both columns at once (works when both columns exist)
  const { error } = await supabase
    .from('products')
    .update({ image_url, image_urls })
    .eq('id', id)

  if (!error) return

  // Attempt 2: update them independently (handles missing column gracefully)
  await supabase.from('products').update({ image_urls }).eq('id', id)
  await supabase.from('products').update({ image_url }).eq('id', id)
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

  const ext = file.type.split('/')[1].replace('jpeg', 'jpg')
  const filename = `${Date.now()}.${ext}`
  const path = `${id}/${filename}`

  const bytes = await file.arrayBuffer()
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: file.type, upsert: false })

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path)
  const newUrl = `${urlData.publicUrl}?t=${Date.now()}`

  // Determine current list: prefer client-sent list (authoritative), fall back to DB
  const existingUrlsRaw = formData.get('existing_urls') as string | null
  let existing: string[] = []

  if (existingUrlsRaw) {
    try { existing = JSON.parse(existingUrlsRaw) } catch { /* ignore */ }
  } else {
    const { data: product } = await supabase
      .from('products')
      .select('image_url, image_urls')
      .eq('id', id)
      .single()

    if (product) {
      existing = (product.image_urls as string[] | null) ?? []
      // Fall back to image_url if image_urls is empty
      if (existing.length === 0 && product.image_url) {
        existing = [product.image_url as string]
      }
    }
  }

  const image_urls = [...existing, newUrl]
  await persistUrls(supabase, id, image_urls)

  return NextResponse.json({ image_url: image_urls[0], image_urls })
}

// DELETE: Remove one image by index, or all if no index provided
// Body: { index?: number, current_urls?: string[] }
// current_urls is the authoritative list from the client — avoids stale DB reads
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = adminClient()
  let removeIndex: number | undefined
  let clientUrls: string[] | undefined

  try {
    const body = await req.json()
    removeIndex = typeof body.index === 'number' ? body.index : undefined
    if (Array.isArray(body.current_urls)) clientUrls = body.current_urls
  } catch { /* no body — remove all */ }

  // Use client-provided list (authoritative) or fall back to DB
  let existing: string[]
  if (clientUrls && clientUrls.length > 0) {
    existing = clientUrls
  } else {
    const { data: product } = await supabase
      .from('products')
      .select('image_url, image_urls')
      .eq('id', id)
      .single()
    existing = (product?.image_urls as string[] | null) ?? []
    if (existing.length === 0 && (product as any)?.image_url) {
      existing = [(product as any).image_url as string]
    }
  }

  if (removeIndex !== undefined && removeIndex >= 0 && removeIndex < existing.length) {
    // Remove single image
    const urlToRemove = existing[removeIndex]
    const storagePath = urlToRemove.split('/storage/v1/object/public/' + BUCKET + '/')[1]?.split('?')[0]
    if (storagePath) {
      await supabase.storage.from(BUCKET).remove([storagePath])
    }
    const image_urls = existing.filter((_, i) => i !== removeIndex)
    await persistUrls(supabase, id, image_urls)
    return NextResponse.json({ image_url: image_urls[0] ?? null, image_urls })
  }

  // Remove all
  const { data: files } = await supabase.storage.from(BUCKET).list(id)
  if (files && files.length > 0) {
    await supabase.storage.from(BUCKET).remove(files.map(f => `${id}/${f.name}`))
  }
  await persistUrls(supabase, id, [])
  return NextResponse.json({ image_url: null, image_urls: [] })
}
