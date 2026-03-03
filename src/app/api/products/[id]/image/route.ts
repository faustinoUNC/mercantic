import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const BUCKET = 'product-images'
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// Service-role client (bypasses RLS) — server only
function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key)
}

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

  const ext = file.type.split('/')[1].replace('jpeg', 'jpg')
  const path = `${id}/main.${ext}`

  const supabase = adminClient()

  // Upload (upsert overwrites previous image)
  const bytes = await file.arrayBuffer()
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, bytes, {
      contentType: file.type,
      upsert: true,
    })

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  // Get public URL
  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path)
  // Add cache-busting timestamp so the browser picks up the new image immediately
  const image_url = `${urlData.publicUrl}?t=${Date.now()}`

  // Persist URL in products table
  const { error: dbError } = await supabase
    .from('products')
    .update({ image_url })
    .eq('id', id)

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })

  return NextResponse.json({ image_url })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = adminClient()

  // Remove all variants for this product from the bucket
  const { data: files } = await supabase.storage.from(BUCKET).list(id)
  if (files && files.length > 0) {
    const paths = files.map(f => `${id}/${f.name}`)
    await supabase.storage.from(BUCKET).remove(paths)
  }

  await supabase.from('products').update({ image_url: null }).eq('id', id)

  return NextResponse.json({ ok: true })
}
