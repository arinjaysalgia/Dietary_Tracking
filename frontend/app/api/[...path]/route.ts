import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8080'

async function handler(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/')
  const { search } = new URL(request.url)
  const targetUrl = `${BACKEND_URL}/api/${path}${search}`

  const headers = new Headers()
  const contentType = request.headers.get('content-type')
  if (contentType) headers.set('content-type', contentType)

  const body =
    request.method !== 'GET' && request.method !== 'HEAD'
      ? await request.arrayBuffer()
      : undefined

  const upstream = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: body ? Buffer.from(body) : undefined,
  })

  const data = await upstream.arrayBuffer()
  return new NextResponse(data, {
    status: upstream.status,
    headers: {
      'content-type': upstream.headers.get('content-type') ?? 'application/json',
    },
  })
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const DELETE = handler
export const PATCH = handler
